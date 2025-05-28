
import { supabase } from "@/integrations/supabase/client";

export interface ReportData {
  vulnerabilities: any[];
  assets: any[];
  severityCounts: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
  totalVulnerabilities: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'technical' | 'compliance' | 'asset-matrix';
  sections: string[];
}

export const reportTemplates: ReportTemplate[] = [
  {
    id: 'executive',
    name: 'Executive Summary Report',
    description: 'High-level overview with key metrics and trends',
    type: 'executive',
    sections: ['summary', 'metrics', 'trends', 'recommendations']
  },
  {
    id: 'technical',
    name: 'Technical Report',
    description: 'Detailed vulnerability findings with technical details',
    type: 'technical',
    sections: ['vulnerabilities', 'assets', 'technical-details', 'remediation']
  },
  {
    id: 'compliance',
    name: 'Compliance Report',
    description: 'Regulatory compliance assessment',
    type: 'compliance',
    sections: ['compliance-status', 'frameworks', 'gaps', 'action-items']
  },
  {
    id: 'asset-matrix',
    name: 'Asset Risk Matrix',
    description: 'Asset-based vulnerability mapping',
    type: 'asset-matrix',
    sections: ['asset-inventory', 'risk-matrix', 'prioritization']
  }
];

export const reportService = {
  async fetchReportData(): Promise<ReportData> {
    try {
      // Fetch vulnerabilities
      const { data: vulnerabilities, error: vulnError } = await supabase
        .from('nessus_vulnerabilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (vulnError) throw vulnError;

      // Fetch assets
      const { data: assets, error: assetsError } = await supabase
        .from('nessus_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (assetsError) throw assetsError;

      // Calculate severity counts
      const severityCounts = {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0,
      };

      vulnerabilities?.forEach(vuln => {
        if (severityCounts.hasOwnProperty(vuln.severity)) {
          severityCounts[vuln.severity as keyof typeof severityCounts]++;
        }
      });

      return {
        vulnerabilities: vulnerabilities || [],
        assets: assets || [],
        severityCounts,
        totalVulnerabilities: vulnerabilities?.length || 0
      };
    } catch (error) {
      console.error('Error fetching report data:', error);
      throw error;
    }
  },

  generateCSVReport(data: ReportData, reportType: string, customName?: string): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportName = customName || `${reportType}_report_${timestamp}`;
    
    let csvContent = '';
    
    switch (reportType) {
      case 'executive':
        csvContent = this.generateExecutiveCSV(data);
        break;
      case 'technical':
        csvContent = this.generateTechnicalCSV(data);
        break;
      case 'compliance':
        csvContent = this.generateComplianceCSV(data);
        break;
      case 'asset-matrix':
        csvContent = this.generateAssetMatrixCSV(data);
        break;
      default:
        csvContent = this.generateDefaultCSV(data);
    }

    return csvContent;
  },

  generateExecutiveCSV(data: ReportData): string {
    let csv = 'Security Assessment Executive Summary\n\n';
    csv += 'Report Generated:,' + new Date().toLocaleDateString() + '\n';
    csv += 'Total Vulnerabilities:,' + data.totalVulnerabilities + '\n\n';
    
    csv += 'Severity Distribution\n';
    csv += 'Severity,Count,Percentage\n';
    Object.entries(data.severityCounts).forEach(([severity, count]) => {
      const percentage = data.totalVulnerabilities > 0 ? 
        ((count / data.totalVulnerabilities) * 100).toFixed(1) : '0';
      csv += `${severity},${count},${percentage}%\n`;
    });
    
    csv += '\nTop Critical Vulnerabilities\n';
    csv += 'Plugin Name,Host,CVSS Score,Description\n';
    data.vulnerabilities
      .filter(v => v.severity === 'Critical')
      .slice(0, 10)
      .forEach(vuln => {
        csv += `"${vuln.plugin_name || ''}","${vuln.host || ''}","${vuln.cvss_score || ''}","${(vuln.description || '').replace(/"/g, '""')}"\n`;
      });

    return csv;
  },

  generateTechnicalCSV(data: ReportData): string {
    let csv = 'Technical Vulnerability Report\n\n';
    csv += 'Plugin ID,Plugin Name,Severity,Host,Port,Protocol,CVSS Score,CVE,Description,Solution,Synopsis\n';
    
    data.vulnerabilities.forEach(vuln => {
      const cve = Array.isArray(vuln.cve) ? vuln.cve.join(';') : (vuln.cve || '');
      csv += `"${vuln.plugin_id || ''}","${vuln.plugin_name || ''}","${vuln.severity || ''}","${vuln.host || ''}","${vuln.port || ''}","${vuln.protocol || ''}","${vuln.cvss_score || ''}","${cve}","${(vuln.description || '').replace(/"/g, '""')}","${(vuln.solution || '').replace(/"/g, '""')}","${(vuln.synopsis || '').replace(/"/g, '""')}"\n`;
    });

    return csv;
  },

  generateComplianceCSV(data: ReportData): string {
    let csv = 'Compliance Assessment Report\n\n';
    csv += 'Framework,Control,Status,Vulnerabilities Affecting,Risk Level\n';
    
    // NIST Framework assessment
    const nistControls = [
      { control: 'Identify', status: 'Compliant', vulns: 0, risk: 'Low' },
      { control: 'Protect', status: 'Partial', vulns: data.severityCounts.High, risk: 'Medium' },
      { control: 'Detect', status: 'Compliant', vulns: 0, risk: 'Low' },
      { control: 'Respond', status: 'Non-Compliant', vulns: data.severityCounts.Critical, risk: 'High' },
      { control: 'Recover', status: 'Partial', vulns: data.severityCounts.Medium, risk: 'Medium' }
    ];
    
    nistControls.forEach(control => {
      csv += `NIST Framework,${control.control},${control.status},${control.vulns},${control.risk}\n`;
    });

    return csv;
  },

  generateAssetMatrixCSV(data: ReportData): string {
    let csv = 'Asset Risk Matrix Report\n\n';
    csv += 'Asset Name,IP Address,Operating System,Vulnerability Count,Risk Score,Critical Vulns,High Vulns\n';
    
    data.assets.forEach(asset => {
      const assetVulns = data.vulnerabilities.filter(v => v.host === asset.ip_address || v.host === asset.host_name);
      const criticalCount = assetVulns.filter(v => v.severity === 'Critical').length;
      const highCount = assetVulns.filter(v => v.severity === 'High').length;
      const riskScore = asset.risk_score || (criticalCount * 10 + highCount * 5);
      
      csv += `"${asset.host_name || ''}","${asset.ip_address || ''}","${asset.operating_system || ''}",${asset.vulnerability_count || 0},${riskScore},${criticalCount},${highCount}\n`;
    });

    return csv;
  },

  generateDefaultCSV(data: ReportData): string {
    return this.generateTechnicalCSV(data);
  },

  downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
