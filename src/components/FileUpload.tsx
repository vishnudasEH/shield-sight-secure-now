
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadedFile {
  id: string;
  filename: string;
  upload_date: string;
  file_size: number;
  total_vulnerabilities: number;
  processed: boolean;
}

export const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentUploads, setRecentUploads] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('nessus-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setUploadProgress(50);

      // Parse CSV and count vulnerabilities
      const text = await file.text();
      const lines = text.split('\n');
      const vulnerabilityCount = Math.max(0, lines.length - 2); // Subtract header and potential empty line

      setUploadProgress(75);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('nessus_uploads')
        .insert({
          filename: file.name,
          file_size: file.size,
          total_vulnerabilities: vulnerabilityCount,
          processed: true
        });

      if (dbError) throw dbError;

      setUploadProgress(100);

      toast({
        title: "Upload Successful",
        description: `${file.name} uploaded successfully with ${vulnerabilityCount} vulnerabilities detected`,
      });

      // Refresh recent uploads
      fetchRecentUploads();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset file input
      event.target.value = '';
    }
  };

  const fetchRecentUploads = async () => {
    const { data, error } = await supabase
      .from('nessus_uploads')
      .select('*')
      .order('upload_date', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching uploads:', error);
      return;
    }

    setRecentUploads(data || []);
  };

  // Fetch recent uploads on component mount
  useState(() => {
    fetchRecentUploads();
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Nessus CSV File
          </CardTitle>
          <CardDescription className="text-slate-400">
            Upload vulnerability scan results from Nessus to analyze and track security issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="csvFile" className="text-slate-300">
              Select CSV File
            </Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="bg-slate-700 border-slate-600 text-white mt-1"
            />
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Uploading...</span>
                <span className="text-slate-400 text-sm">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <div className="text-sm text-slate-400">
            <p>Supported format: Nessus CSV export files</p>
            <p>Expected columns: Plugin ID, CVSS scores, severity, asset details, etc.</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Uploads</CardTitle>
          <CardDescription className="text-slate-400">
            Recently uploaded vulnerability scan files
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentUploads.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-slate-300 font-medium">{upload.filename}</p>
                      <p className="text-xs text-slate-400">
                        {formatFileSize(upload.file_size)} • {upload.total_vulnerabilities} vulnerabilities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={upload.processed ? "default" : "secondary"}
                      className={upload.processed ? "bg-green-500/20 text-green-400" : ""}
                    >
                      {upload.processed ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {upload.processed ? "Processed" : "Processing"}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {new Date(upload.upload_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
