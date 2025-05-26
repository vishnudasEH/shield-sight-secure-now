
import { useState, useEffect } from "react";
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
      setUploadProgress(25);

      // Parse CSV and count vulnerabilities first
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const vulnerabilityCount = Math.max(0, lines.length - 1); // Subtract header

      setUploadProgress(50);

      // Parse CSV data and insert into nessus_csv table
      const headers = lines[0].split('\t').map(h => h.trim());
      const dataRows = lines.slice(1);

      const vulnerabilities = dataRows.map(row => {
        const values = row.split('\t');
        return {
          plugin_id: values[0] || null,
          external_id: values[1] || null,
          cvss_v2_base_score: values[2] ? parseFloat(values[2]) : null,
          severity: values[3] || null,
          asset: values[4] || null,
          protocol: values[5] || null,
          port: values[6] ? parseInt(values[6]) : null,
          name: values[7] || null,
          synopsis: values[8] || null,
          description: values[9] || null,
          solution: values[10] || null,
          see_also: values[11] || null,
          plugin_output: values[12] || null,
          cvss_v4_base_score: values[13] ? parseFloat(values[13]) : null,
          cvss_v4_base_threat_score: values[14] ? parseFloat(values[14]) : null,
          cvss_v3_base_score: values[15] ? parseFloat(values[15]) : null,
          metasploit: values[16] === 'TRUE',
          core_impact: values[17] === 'TRUE',
          canvas: values[18] === 'TRUE'
        };
      });

      setUploadProgress(75);

      // Insert vulnerabilities into database
      const { error: vulnError } = await supabase
        .from('nessus_csv')
        .insert(vulnerabilities);

      if (vulnError) {
        console.error('Error inserting vulnerabilities:', vulnError);
        throw vulnError;
      }

      // Save metadata to uploads table
      const { error: uploadError } = await supabase
        .from('nessus_uploads')
        .insert({
          filename: file.name,
          file_size: file.size,
          total_vulnerabilities: vulnerabilityCount,
          processed: true
        });

      if (uploadError) {
        console.error('Error saving upload metadata:', uploadError);
        throw uploadError;
      }

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
        description: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
    try {
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
    } catch (error) {
      console.error('Error in fetchRecentUploads:', error);
    }
  };

  // Fetch recent uploads on component mount
  useEffect(() => {
    fetchRecentUploads();
  }, []);

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
            <p>Expected columns: Plugin ID, CVE, CVSS scores, severity, asset details, etc.</p>
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
