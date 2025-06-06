
import { supabase } from "@/integrations/supabase/client";

export interface NucleiVulnerability {
  id: string;
  scan_id: string;
  vuln_id: string;
  vuln_status: string;
  template_name: string;
  vuln_hash: string;
  matcher_name: string | null;
  matcher_status: boolean | null;
  created_at: string;
  updated_at: string;
  severity: string;
  host: string;
  matched_at: string;
  template_id: string;
  description: string | null;
  assigned_to: string | null;
  assigned_by: string | null;
  assigned_at: string | null;
  last_status_change: string | null;
  is_sla_breach?: boolean;
  days_since_creation?: number;
  sla_days_remaining?: number;
}

export interface SLAStatusCounts {
  breached: number;
  dueSoon: number;
  withinSLA: number;
}

export interface SeverityDistribution {
  severity: string;
  count: number;
}

export interface AgingDistribution {
  ageRange: string;
  count: number;
}

export interface AssigneeDistribution {
  assignee: string;
  count: number;
}

export interface SLASummary {
  statusCounts: SLAStatusCounts;
  severityDistribution: SeverityDistribution[];
  agingDistribution: AgingDistribution[];
  assigneeDistribution: AssigneeDistribution[];
}

export const nucleiService = {
  async getAllVulnerabilities(filters?: {
    severity?: string;
    status?: string;
    host?: string;
    assignee?: string;
    search?: string;
  }): Promise<NucleiVulnerability[]> {
    let query = supabase
      .from('nuclei_vulnerabilities')
      .select(`
        *,
        assigned_user:assigned_to(id, first_name, last_name),
        assigned_by_user:assigned_by(id, first_name, last_name)
      `)
      .order('created_at', { ascending: false });

    if (filters?.severity && filters.severity !== 'all') {
      query = query.eq('severity', filters.severity);
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('vuln_status', filters.status);
    }

    if (filters?.host) {
      query = query.ilike('host', `%${filters.host}%`);
    }

    if (filters?.assignee) {
      if (filters.assignee === 'unassigned') {
        query = query.is('assigned_to', null);
      } else {
        query = query.eq('assigned_to', filters.assignee);
      }
    }

    if (filters?.search) {
      query = query.or(`template_name.ilike.%${filters.search}%,host.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate SLA and aging metrics
    return data?.map(vuln => {
      const creationDate = new Date(vuln.created_at);
      const today = new Date();
      const daysSinceCreation = Math.floor((today.getTime() - creationDate.getTime()) / (1000 * 3600 * 24));
      
      // Get SLA target days based on severity
      const slaDays = this.getSLADays(vuln.severity);
      
      // Calculate SLA breach status
      const isSLABreach = daysSinceCreation > slaDays;
      const slaDaysRemaining = slaDays - daysSinceCreation;
      
      return {
        ...vuln,
        days_since_creation: daysSinceCreation,
        is_sla_breach: isSLABreach,
        sla_days_remaining: slaDaysRemaining
      };
    }) || [];
  },

  getSLADays(severity: string): number {
    switch (severity.toLowerCase()) {
      case 'critical': return 3;
      case 'high': return 7;
      case 'medium': return 14;
      case 'low': return 30;
      case 'info': return 90;
      default: return 30;
    }
  },

  async assignVulnerability(
    vulnerabilityId: string,
    assignedTo: string,
    assignedBy: string
  ): Promise<void> {
    const { error } = await supabase
      .from('nuclei_vulnerabilities')
      .update({
        assigned_to: assignedTo,
        assigned_by: assignedBy,
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', vulnerabilityId);

    if (error) throw error;

    // Create notification
    await supabase.from('user_notifications' as any).insert({
      user_id: assignedTo,
      title: 'New Vulnerability Assigned',
      message: 'You have been assigned a new vulnerability to investigate',
      is_read: false,
      related_item_type: 'vulnerability',
      related_item_id: vulnerabilityId
    });
  },

  async updateStatus(
    vulnerabilityId: string,
    newStatus: string,
    userId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('nuclei_vulnerabilities')
      .update({
        vuln_status: newStatus,
        last_status_change: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', vulnerabilityId);

    if (error) throw error;

    // Get the vulnerability details for notification
    const { data: vuln } = await supabase
      .from('nuclei_vulnerabilities')
      .select('assigned_to, template_name')
      .eq('id', vulnerabilityId)
      .single();

    // If vulnerability is assigned to someone, notify them about the status change
    if (vuln && vuln.assigned_to && vuln.assigned_to !== userId) {
      await supabase.from('user_notifications' as any).insert({
        user_id: vuln.assigned_to,
        title: 'Vulnerability Status Updated',
        message: `Status for "${vuln.template_name}" changed to ${newStatus}`,
        is_read: false,
        related_item_type: 'vulnerability',
        related_item_id: vulnerabilityId
      });
    }
  },

  async getSLASummary(): Promise<SLASummary> {
    const vulnerabilities = await this.getAllVulnerabilities();
    
    // Calculate SLA status counts
    const statusCounts = {
      breached: vulnerabilities.filter(v => v.is_sla_breach).length,
      dueSoon: vulnerabilities.filter(v => !v.is_sla_breach && v.sla_days_remaining! <= 3).length,
      withinSLA: vulnerabilities.filter(v => !v.is_sla_breach && v.sla_days_remaining! > 3).length
    };

    // Calculate severity distribution
    const severityMap = new Map<string, number>();
    vulnerabilities.forEach(v => {
      const severity = v.severity || 'unknown';
      severityMap.set(severity, (severityMap.get(severity) || 0) + 1);
    });
    const severityDistribution = Array.from(severityMap.entries()).map(([severity, count]) => ({
      severity,
      count
    }));

    // Calculate aging distribution
    const ageRanges = [
      { label: '0-7 days', min: 0, max: 7 },
      { label: '8-14 days', min: 8, max: 14 },
      { label: '15-30 days', min: 15, max: 30 },
      { label: '31-60 days', min: 31, max: 60 },
      { label: '60+ days', min: 61, max: Infinity }
    ];

    const agingDistribution = ageRanges.map(range => ({
      ageRange: range.label,
      count: vulnerabilities.filter(v => 
        v.days_since_creation! >= range.min && v.days_since_creation! <= range.max
      ).length
    }));

    // Calculate assignee distribution
    const assigneeMap = new Map<string, number>();
    vulnerabilities.forEach(v => {
      const assignee = v.assigned_to ? 
        (v.assigned_user ? 
          `${(v.assigned_user as any).first_name || ''} ${(v.assigned_user as any).last_name || ''}`.trim() : 
          v.assigned_to) : 
        'Unassigned';
      
      assigneeMap.set(assignee, (assigneeMap.get(assignee) || 0) + 1);
    });
    
    const assigneeDistribution = Array.from(assigneeMap.entries()).map(([assignee, count]) => ({
      assignee,
      count
    }));

    return {
      statusCounts,
      severityDistribution,
      agingDistribution,
      assigneeDistribution
    };
  },

  async exportToCSV(): Promise<string> {
    const vulnerabilities = await this.getAllVulnerabilities();
    
    const headers = [
      'ID', 'Template Name', 'Severity', 'Host', 'Status', 
      'Age (Days)', 'SLA Status', 'Created At', 'Assigned To'
    ];
    
    const rows = vulnerabilities.map(v => [
      v.vuln_id,
      v.template_name,
      v.severity,
      v.host,
      v.vuln_status,
      v.days_since_creation,
      v.is_sla_breach ? 'Breached' : `${v.sla_days_remaining} days remaining`,
      new Date(v.created_at).toLocaleDateString(),
      v.assigned_user ? 
        `${(v.assigned_user as any).first_name || ''} ${(v.assigned_user as any).last_name || ''}`.trim() : 
        'Unassigned'
    ]);
    
    // Convert to CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') ? 
          `"${cell}"` : 
          cell
      ).join(','))
    ].join('\n');
    
    return csvContent;
  }
};
