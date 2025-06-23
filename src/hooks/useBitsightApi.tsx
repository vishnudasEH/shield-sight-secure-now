
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

export const useBitsightApi = () => {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Mock data generator
  const generateMockVulnerabilities = (): Vulnerability[] => {
    const mockData: Vulnerability[] = [];
    const severities: ('Critical' | 'High' | 'Medium' | 'Low')[] = ['Critical', 'High', 'Medium', 'Low'];
    const statuses: ('Open' | 'In Progress' | 'Closed')[] = ['Open', 'In Progress', 'Closed'];
    const assets = [
      'web-server-01', 'db-server-02', 'api-gateway-03', 'load-balancer-04', 
      'worker-node-05', 'cache-server-06', 'file-server-07', 'proxy-server-08'
    ];
    const ips = [
      '192.168.1.10', '192.168.1.11', '192.168.1.12', '192.168.1.13',
      '10.0.0.5', '10.0.0.6', '10.0.0.7', '10.0.0.8'
    ];
    const teamMembers = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'];
    const vulnerabilityTitles = [
      'SQL Injection in Login Form',
      'Cross-Site Scripting (XSS) Vulnerability',
      'Outdated OpenSSL Version',
      'Weak Password Policy',
      'Unencrypted Data Transmission',
      'Missing Security Headers',
      'Directory Traversal Vulnerability',
      'Insecure Direct Object Reference',
      'Buffer Overflow in Authentication',
      'XML External Entity (XXE) Injection'
    ];

    for (let i = 0; i < 50; i++) {
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const assetIndex = Math.floor(Math.random() * assets.length);
      
      mockData.push({
        id: `vuln-${i + 1}`,
        assetName: assets[assetIndex],
        assetIp: ips[assetIndex],
        title: vulnerabilityTitles[Math.floor(Math.random() * vulnerabilityTitles.length)],
        severity,
        firstDetected: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: Math.random() > 0.3 ? teamMembers[Math.floor(Math.random() * teamMembers.length)] : undefined,
        status,
        tags: ['automated', severity.toLowerCase(), Math.random() > 0.5 ? 'urgent' : 'routine'].filter(Boolean),
        cve: Math.random() > 0.6 ? `CVE-2024-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}` : undefined
      });
    }

    return mockData;
  };

  const checkApiKey = () => {
    // In a real implementation, this would check for the API key in secure storage
    // For now, we'll simulate having an API key after a short delay
    const stored = localStorage.getItem('bitsight_api_key');
    return !!stored;
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would fetch from Bitsight API
      const mockVulns = generateMockVulnerabilities();
      setVulnerabilities(mockVulns);
      setLastSync(new Date().toISOString());
      
      console.log('Bitsight data refreshed:', mockVulns.length, 'vulnerabilities');
    } catch (error) {
      console.error('Failed to refresh Bitsight data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const apiKeyExists = checkApiKey();
    setHasApiKey(apiKeyExists);
    
    if (apiKeyExists) {
      // Simulate initial API key setup
      localStorage.setItem('bitsight_api_key', 'mock-api-key-12345');
      refreshData();
    }
  }, []);

  // Auto-refresh every 5 minutes when API key is available
  useEffect(() => {
    if (!hasApiKey) return;
    
    const interval = setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [hasApiKey]);

  return {
    vulnerabilities,
    loading,
    lastSync,
    hasApiKey,
    refreshData
  };
};
