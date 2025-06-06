
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { calculateRiskScore } from "@/utils/scanUtils";

interface ResultUploadProps {
  scanName: string;
  selectedScanType: string;
  onUploadComplete: () => void;
}

export const ResultUpload = ({ scanName, selectedScanType, onUploadComplete }: ResultUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleResultUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json') && !file.name.endsWith('.jsonl')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a .json or .jsonl file containing nuclei scan results",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const content = await file.text();
      let results;

      // Handle both JSON and JSONL formats
      if (file.name.endsWith('.jsonl')) {
        // Parse JSONL (each line is a JSON object)
        results = content.split('\n')
          .filter(line => line.trim())
          .map(line => {
            try {
              return JSON.parse(line);
            } catch (e: any) {
              throw new Error(`Invalid JSONL format: ${e.message}`);
            }
          });
      } else {
        // Parse regular JSON
        try {
          results = JSON.parse(content);
        } catch (e: any) {
          throw new Error(`Invalid JSON format: ${e.message}`);
        }
      }

      // Ensure results is an array
      if (!Array.isArray(results)) {
        results = [results];
      }

      // Store the scan results
      const scanId = `scan_${Date.now()}`;
      const { data: scanData, error: scanError } = await supabase
        .from('nuclei_scan_results')
        .insert({
          scan_name: scanName || `Uploaded scan ${new Date().toLocaleString()}`,
          scan_type: selectedScanType,
          results: results
        })
        .select();

      if (scanError) throw scanError;

      // Get the actual scan ID with proper type checking and explicit casting
      const actualScanId = scanData?.[0]?.id ? String(scanData[0].id) : scanId;

      // Process each vulnerability from the results
      const vulnerabilities = results.map((result: any) => ({
        scan_id: actualScanId,
        vuln_id: result.id || result['template-id'] || 'unknown',
        template_name: result.info?.name || result.name || 'Unknown',
        vuln_hash: result.hash || `${result.host}_${result['template-id']}_${Date.now()}`,
        matcher_name: result['matcher-name'] || result.matcher,
        matcher_status: result['matcher-status'] !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        severity: result.info?.severity || result.severity || 'info',
        host: result.host || 'unknown',
        matched_at: result['matched-at'] || result.timestamp || new Date().toISOString(),
        template_id: result['template-id'] || result.template || result.id || 'unknown',
        description: result.info?.description || result.description || '',
        vuln_status: 'open'
      }));

      // Insert vulnerabilities
      const { error: vulnError } = await supabase
        .from('nuclei_vulnerabilities')
        .insert(vulnerabilities);

      if (vulnError) throw vulnError;

      // Update asset records based on discovered hosts
      const uniqueHosts = [...new Set(vulnerabilities.map(v => v.host))];
      
      for (const host of uniqueHosts) {
        // Check if host already exists
        const { data: existingAsset, error: assetCheckError } = await supabase
          .from('nessus_assets')
          .select('id')
          .eq('fqdn', host)
          .maybeSingle();
          
        if (assetCheckError) {
          console.error('Error checking for existing asset:', assetCheckError);
          continue;
        }
        
        if (!existingAsset) {
          // Create new asset with proper property names
          await supabase
            .from('nessus_assets')
            .insert({
              fqdn: host,
              upload_session_id: actualScanId,
              ip_address: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host) ? host : null,
              vulnerability_count: vulnerabilities.filter(v => v.host === host).length,
              risk_score: calculateRiskScore(vulnerabilities.filter(v => v.host === host))
            });
        } else {
          // Update vulnerability count for existing asset
          const hostVulnerabilities = vulnerabilities.filter(v => v.host === host);
          
          try {
            const { data: incrementResult, error: incrementError } = await supabase.rpc('increment_vulnerability_count', { 
              asset_id: existingAsset.id,
              increment_by: hostVulnerabilities.length 
            });
            
            if (incrementError) throw incrementError;
            
            const newCount = typeof incrementResult === 'number' ? incrementResult : 0;
            
            await supabase
              .from('nessus_assets')
              .update({
                vulnerability_count: newCount,
                risk_score: calculateRiskScore(hostVulnerabilities),
                updated_at: new Date().toISOString()
              })
              .eq('id', existingAsset.id);
          } catch (error) {
            console.error('Error updating asset vulnerability count:', error);
          }
        }
      }

      toast({
        title: "Results Uploaded Successfully",
        description: `Processed ${vulnerabilities.length} vulnerabilities from ${file.name}`,
      });

      // Create notification for admin users about new vulnerabilities
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .eq('status', 'approved');

      if (admins && admins.length > 0) {
        const notifications = admins.map(admin => ({
          user_id: admin.id,
          title: 'New Vulnerabilities Detected',
          message: `${vulnerabilities.length} new vulnerabilities uploaded from scan: ${scanName || file.name}`,
          is_read: false,
          related_item_type: 'nuclei_scan',
          related_item_id: actualScanId
        }));

        await supabase.from('user_notifications').insert(notifications);
      }

      // Clear the form and trigger callback
      event.target.value = "";
      onUploadComplete();

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to process the results file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="pt-4 border-t border-slate-700">
      <div className="space-y-4">
        <Label className="text-slate-300 text-lg font-medium">Upload Scan Results</Label>
        <p className="text-slate-400 text-sm">
          Upload nuclei scan results in JSON or JSONL format to import vulnerabilities into the system.
        </p>
        
        <div className="flex items-center gap-4">
          <Label htmlFor="resultFile" className="cursor-pointer">
            <Button variant="outline" className="border-slate-600" disabled={isUploading} asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Results"}
              </span>
            </Button>
          </Label>
          <Input
            id="resultFile"
            type="file"
            accept=".json,.jsonl"
            onChange={handleResultUpload}
            className="hidden"
            disabled={isUploading}
          />
          <span className="text-slate-400 text-sm">(.json or .jsonl files)</span>
        </div>
      </div>
    </div>
  );
};
