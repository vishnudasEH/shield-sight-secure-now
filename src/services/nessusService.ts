
import { supabase } from "@/integrations/supabase/client";

export interface NessusVulnerability {
  pluginId: string;
  pluginName: string;
  severity: string;
  host: string;
  port: string;
  protocol: string;
  description: string;
  solution: string;
  synopsis: string;
  cvssScore: string;
  cve: string[];
}

export interface NessusAsset {
  hostName: string;
  ipAddress?: string;
  operatingSystem?: string;
  macAddress?: string;
  netbiosName?: string;
  fqdn?: string;
  vulnerabilityCount: number;
}

export const nessusService = {
  async createUploadSession(filename: string, totalVulns: number, totalAssets: number) {
    const { data, error } = await supabase
      .from('nessus_upload_sessions')
      .insert({
        filename,
        total_vulnerabilities: totalVulns,
        total_assets: totalAssets,
        upload_date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveVulnerabilities(sessionId: string, vulnerabilities: NessusVulnerability[]) {
    const vulnData = vulnerabilities.map(vuln => ({
      upload_session_id: sessionId,
      plugin_id: vuln.pluginId,
      plugin_name: vuln.pluginName,
      severity: vuln.severity,
      host: vuln.host,
      port: vuln.port,
      protocol: vuln.protocol,
      description: vuln.description,
      solution: vuln.solution,
      synopsis: vuln.synopsis,
      cvss_score: vuln.cvssScore,
      cve: vuln.cve
    }));

    const { error } = await supabase
      .from('nessus_vulnerabilities')
      .insert(vulnData);

    if (error) throw error;
  },

  async saveAssets(sessionId: string, assets: NessusAsset[]) {
    const assetData = assets.map(asset => ({
      upload_session_id: sessionId,
      host_name: asset.hostName,
      ip_address: asset.ipAddress,
      operating_system: asset.operatingSystem,
      mac_address: asset.macAddress,
      netbios_name: asset.netbiosName,
      fqdn: asset.fqdn,
      vulnerability_count: asset.vulnerabilityCount
    }));

    const { error } = await supabase
      .from('nessus_assets')
      .insert(assetData);

    if (error) throw error;
  },

  async getUploadSessions() {
    const { data, error } = await supabase
      .from('nessus_upload_sessions')
      .select('*')
      .order('upload_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getVulnerabilitiesBySession(sessionId: string) {
    const { data, error } = await supabase
      .from('nessus_vulnerabilities')
      .select('*')
      .eq('upload_session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
