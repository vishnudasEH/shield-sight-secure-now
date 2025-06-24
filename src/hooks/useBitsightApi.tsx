
import { useState, useEffect } from 'react';

interface Vulnerability {
  id: string;
  assetName: string;
  assetIp: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  firstDetected: string;
  assignedTo?: string;
  status: 'Open' | 'In Progress' | 'Closed';
  tags: string[];
  cve?: string;
}

interface CompanyRating {
  id: string;
  name: string;
  ratings: {
    'Compromised Systems': number;
    'Diligence': number;
    'User Behavior': number;
    'File Sharing': number;
  };
  isParent?: boolean;
  subsidiaries?: CompanyRating[];
}

export const useBitsightApi = () => {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [companies, setCompanies] = useState<CompanyRating[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isRealData, setIsRealData] = useState(false);

  const checkApiKey = () => {
    const stored = localStorage.getItem('bitsight_api_key');
    return !!stored;
  };

  const loadMockData = async () => {
    console.log('Loading mock data...');
    const mockCompanies = generateRealCompanies();
    const mockVulns = generateRealVulnerabilities();
    
    setCompanies(mockCompanies);
    setVulnerabilities(mockVulns);
    
    if (mockCompanies.length > 0 && !selectedCompany) {
      setSelectedCompany(mockCompanies[0].id);
    }
    
    setIsRealData(false);
  };

  const generateRealCompanies = (): CompanyRating[] => {
    return [
      {
        id: 'company-main',
        name: 'Main Company Corp',
        ratings: {
          'Compromised Systems': 780,
          'Diligence': 720,
          'User Behavior': 690,
          'File Sharing': 750
        },
        isParent: true,
        subsidiaries: [
          {
            id: 'sub-tech',
            name: 'Tech Division',
            ratings: {
              'Compromised Systems': 765,
              'Diligence': 710,
              'User Behavior': 685,
              'File Sharing': 740
            }
          },
          {
            id: 'sub-finance',
            name: 'Finance Division', 
            ratings: {
              'Compromised Systems': 795,
              'Diligence': 730,
              'User Behavior': 695,
              'File Sharing': 760
            }
          },
          {
            id: 'sub-operations',
            name: 'Operations Division',
            ratings: {
              'Compromised Systems': 772,
              'Diligence': 725,
              'User Behavior': 688,
              'File Sharing': 745
            }
          }
        ]
      }
    ];
  };

  const generateRealVulnerabilities = (): Vulnerability[] => {
    const realVulns: Vulnerability[] = [];
    const severities: ('Critical' | 'High' | 'Medium' | 'Low')[] = ['Critical', 'High', 'Medium', 'Low'];
    const statuses: ('Open' | 'In Progress' | 'Closed')[] = ['Open', 'In Progress', 'Closed'];
    
    const realAssets = [
      'prod-web-01.company.com',
      'db-primary-02.company.com', 
      'api-gateway-03.company.com',
      'lb-main-04.company.com',
      'cache-redis-05.company.com',
      'file-storage-06.company.com'
    ];
    
    const realIps = [
      '203.0.113.10', '203.0.113.11', '203.0.113.12',
      '198.51.100.5', '198.51.100.6', '198.51.100.7'
    ];
    
    const realVulnTitles = [
      'Exposed Admin Interface on Port 8080',
      'Outdated SSL/TLS Configuration',
      'Missing Security Headers (HSTS, CSP)',
      'Weak Cipher Suites Detected',
      'Information Disclosure via Error Messages',
      'Unencrypted Database Connection',
      'Default Credentials on Management Interface',
      'Cross-Site Scripting (XSS) in Contact Form',
      'SQL Injection in Search Parameter',
      'Missing Rate Limiting on API Endpoints'
    ];

    for (let i = 0; i < 35; i++) {
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const assetIndex = Math.floor(Math.random() * realAssets.length);
      
      realVulns.push({
        id: `real-vuln-${i + 1}`,
        assetName: realAssets[assetIndex],
        assetIp: realIps[assetIndex],
        title: realVulnTitles[Math.floor(Math.random() * realVulnTitles.length)],
        severity,
        firstDetected: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: Math.random() > 0.4 ? ['Alice Johnson', 'Bob Smith', 'Carol Davis'][Math.floor(Math.random() * 3)] : undefined,
        status,
        tags: ['mock-data', severity.toLowerCase(), status.toLowerCase().replace(' ', '-')],
        cve: Math.random() > 0.5 ? `CVE-2024-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}` : undefined
      });
    }

    return realVulns;
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('bitsight_api_key');
      if (apiKey) {
        console.log('API key found, loading mock data for demonstration...');
        await loadMockData();
        setLastSync(new Date().toISOString());
        console.log('Mock data loaded:', vulnerabilities.length, 'vulnerabilities');
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVulnerabilityStatus = (vulnId: string, newStatus: 'Open' | 'In Progress' | 'Closed') => {
    setVulnerabilities(prev => 
      prev.map(vuln => 
        vuln.id === vulnId ? { ...vuln, status: newStatus } : vuln
      )
    );
    console.log(`Vulnerability ${vulnId} status updated to: ${newStatus}`);
  };

  const assignVulnerability = (vulnId: string, assignee: string) => {
    setVulnerabilities(prev =>
      prev.map(vuln =>
        vuln.id === vulnId ? { ...vuln, assignedTo: assignee } : vuln
      )
    );
    console.log(`Vulnerability ${vulnId} assigned to: ${assignee}`);
  };

  const bulkAssignVulnerabilities = (vulnIds: string[], assignee: string) => {
    setVulnerabilities(prev =>
      prev.map(vuln =>
        vulnIds.includes(vuln.id) ? { ...vuln, assignedTo: assignee } : vuln
      )
    );
    console.log(`${vulnIds.length} vulnerabilities assigned to: ${assignee}`);
  };

  useEffect(() => {
    const apiKeyExists = checkApiKey();
    setHasApiKey(apiKeyExists);
    
    if (apiKeyExists) {
      refreshData();
    }
  }, []);

  // Auto-refresh every 10 minutes when API key is available
  useEffect(() => {
    if (!hasApiKey) return;
    
    const interval = setInterval(() => {
      refreshData();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [hasApiKey]);

  const getCurrentCompany = () => {
    if (!selectedCompany) return companies[0];
    
    for (const company of companies) {
      if (company.id === selectedCompany) return company;
      if (company.subsidiaries) {
        const subsidiary = company.subsidiaries.find(sub => sub.id === selectedCompany);
        if (subsidiary) return subsidiary;
      }
    }
    return companies[0];
  };

  const getFilteredVulnerabilities = () => {
    if (!selectedCompany) return vulnerabilities;
    // In real implementation, filter by company
    return vulnerabilities;
  };

  return {
    vulnerabilities: getFilteredVulnerabilities(),
    companies,
    selectedCompany,
    currentCompany: getCurrentCompany(),
    loading,
    lastSync,
    hasApiKey,
    isRealData,
    refreshData,
    updateVulnerabilityStatus,
    assignVulnerability,
    bulkAssignVulnerabilities,
    setSelectedCompany
  };
};
