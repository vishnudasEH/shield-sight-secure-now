
import { supabase } from "@/integrations/supabase/client";

export interface VulnerabilityAgingRecord {
  id: string;
  hostname: string;
  vulnerability_id: string;
  plugin_id: string;
  plugin_name: string;
  severity: string;
  first_detected_date: string;
  last_seen_date: string;
  age_days: number;
  sla_target_days: number;
  is_sla_breach: boolean;
  created_at: string;
  updated_at: string;
}

export interface SLABreachTrend {
  id: string;
  scan_date: string;
  upload_session_id: string;
  filename: string;
  total_hosts: number;
  total_breaches: number;
  critical_breaches: number;
  high_breaches: number;
  medium_breaches: number;
  low_breaches: number;
  created_at: string;
}

export const slaService = {
  async getVulnerabilityAging(filters?: {
    hostname?: string;
    severity?: string;
    slaBreachOnly?: boolean;
  }) {
    let query = supabase
      .from('vulnerability_aging')
      .select('*')
      .order('age_days', { ascending: false });

    if (filters?.hostname) {
      query = query.ilike('hostname', `%${filters.hostname}%`);
    }

    if (filters?.severity) {
      query = query.eq('severity', filters.severity);
    }

    if (filters?.slaBreachOnly) {
      query = query.eq('is_sla_breach', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as VulnerabilityAgingRecord[];
  },

  async getSLABreachTrends(daysBack: number = 30) {
    const { data, error } = await supabase
      .from('sla_breach_trends')
      .select('*')
      .gte('scan_date', new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('scan_date', { ascending: true });

    if (error) throw error;
    return data as SLABreachTrend[];
  },

  async getSLASummary() {
    const { data, error } = await supabase
      .from('vulnerability_aging')
      .select('severity, is_sla_breach, age_days');

    if (error) throw error;

    const summary = {
      totalVulnerabilities: data.length,
      totalBreaches: data.filter(v => v.is_sla_breach).length,
      breachesBySeverity: {
        Critical: data.filter(v => v.severity === 'Critical' && v.is_sla_breach).length,
        High: data.filter(v => v.severity === 'High' && v.is_sla_breach).length,
        Medium: data.filter(v => v.severity === 'Medium' && v.is_sla_breach).length,
        Low: data.filter(v => v.severity === 'Low' && v.is_sla_breach).length,
      },
      averageAge: {
        Critical: this.calculateAverageAge(data.filter(v => v.severity === 'Critical')),
        High: this.calculateAverageAge(data.filter(v => v.severity === 'High')),
        Medium: this.calculateAverageAge(data.filter(v => v.severity === 'Medium')),
        Low: this.calculateAverageAge(data.filter(v => v.severity === 'Low')),
      }
    };

    return summary;
  },

  calculateAverageAge(vulnerabilities: any[]) {
    if (vulnerabilities.length === 0) return 0;
    const totalAge = vulnerabilities.reduce((sum, v) => sum + v.age_days, 0);
    return Math.round(totalAge / vulnerabilities.length);
  },

  async updateSLABreachTrends(uploadSessionId: string, scanDate: string, filename: string) {
    // Get current breach counts
    const { data: agingData, error: agingError } = await supabase
      .from('vulnerability_aging')
      .select('severity, is_sla_breach, hostname');

    if (agingError) throw agingError;

    const totalHosts = new Set(agingData.map(v => v.hostname)).size;
    const totalBreaches = agingData.filter(v => v.is_sla_breach).length;
    const criticalBreaches = agingData.filter(v => v.severity === 'Critical' && v.is_sla_breach).length;
    const highBreaches = agingData.filter(v => v.severity === 'High' && v.is_sla_breach).length;
    const mediumBreaches = agingData.filter(v => v.severity === 'Medium' && v.is_sla_breach).length;
    const lowBreaches = agingData.filter(v => v.severity === 'Low' && v.is_sla_breach).length;

    const { error } = await supabase
      .from('sla_breach_trends')
      .upsert({
        scan_date: scanDate,
        upload_session_id: uploadSessionId,
        filename,
        total_hosts: totalHosts,
        total_breaches: totalBreaches,
        critical_breaches: criticalBreaches,
        high_breaches: highBreaches,
        medium_breaches: mediumBreaches,
        low_breaches: lowBreaches
      }, {
        onConflict: 'scan_date,upload_session_id'
      });

    if (error) throw error;
  }
};
