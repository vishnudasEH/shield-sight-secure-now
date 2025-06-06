export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      asset_inventory: {
        Row: {
          asset_type: string | null
          business_unit: string | null
          created_at: string | null
          environment: string | null
          hostname: string | null
          id: string
          ip_address: string | null
          last_scan_date: string | null
          location: string | null
          name: string
          operating_system: string | null
          owner_email: string | null
          risk_score: number | null
          updated_at: string | null
        }
        Insert: {
          asset_type?: string | null
          business_unit?: string | null
          created_at?: string | null
          environment?: string | null
          hostname?: string | null
          id?: string
          ip_address?: string | null
          last_scan_date?: string | null
          location?: string | null
          name: string
          operating_system?: string | null
          owner_email?: string | null
          risk_score?: number | null
          updated_at?: string | null
        }
        Update: {
          asset_type?: string | null
          business_unit?: string | null
          created_at?: string | null
          environment?: string | null
          hostname?: string | null
          id?: string
          ip_address?: string | null
          last_scan_date?: string | null
          location?: string | null
          name?: string
          operating_system?: string | null
          owner_email?: string | null
          risk_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      assets: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          id: string
          ip_address: string | null
          object_id: string
          object_type: string
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          object_id: string
          object_type: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          object_id?: string
          object_type?: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      nessus_1: {
        Row: {
          canvas: string | null
          core: boolean | null
          created_at: string | null
          cve: string[] | null
          cvss_v2_base_score: number | null
          cvss_v3_base_score: number | null
          cvss_v4_base_score: number | null
          cvss_v4_base_threat_score: number | null
          description: string | null
          host: string | null
          id: string
          impact: string | null
          metasploit: boolean | null
          name: string | null
          plugin: string | null
          plugin_output: string | null
          port: number | null
          protocol: string | null
          risk: string | null
          solution: string | null
          synopsis: string | null
          updated_at: string | null
        }
        Insert: {
          canvas?: string | null
          core?: boolean | null
          created_at?: string | null
          cve?: string[] | null
          cvss_v2_base_score?: number | null
          cvss_v3_base_score?: number | null
          cvss_v4_base_score?: number | null
          cvss_v4_base_threat_score?: number | null
          description?: string | null
          host?: string | null
          id?: string
          impact?: string | null
          metasploit?: boolean | null
          name?: string | null
          plugin?: string | null
          plugin_output?: string | null
          port?: number | null
          protocol?: string | null
          risk?: string | null
          solution?: string | null
          synopsis?: string | null
          updated_at?: string | null
        }
        Update: {
          canvas?: string | null
          core?: boolean | null
          created_at?: string | null
          cve?: string[] | null
          cvss_v2_base_score?: number | null
          cvss_v3_base_score?: number | null
          cvss_v4_base_score?: number | null
          cvss_v4_base_threat_score?: number | null
          description?: string | null
          host?: string | null
          id?: string
          impact?: string | null
          metasploit?: boolean | null
          name?: string | null
          plugin?: string | null
          plugin_output?: string | null
          port?: number | null
          protocol?: string | null
          risk?: string | null
          solution?: string | null
          synopsis?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nessus_24may: {
        Row: {
          canvas: string | null
          Canvas: string | null
          "core impact": string | null
          created_at: string | null
          cve: string[] | null
          "cvss v2.0 base score": string | null
          cvss_v3_base_score: number | null
          cvss_v4_base_score: number | null
          cvss_v4_base_threat_score: number | null
          description: string | null
          host: string | null
          id: string
          metasploit: boolean | null
          name: string | null
          plugin: string | null
          plugin_output: string | null
          port: number | null
          protocol: string | null
          risk: string | null
          "see also": string | null
          solution: string | null
          synopsis: string | null
          updated_at: string | null
        }
        Insert: {
          canvas?: string | null
          Canvas?: string | null
          "core impact"?: string | null
          created_at?: string | null
          cve?: string[] | null
          "cvss v2.0 base score"?: string | null
          cvss_v3_base_score?: number | null
          cvss_v4_base_score?: number | null
          cvss_v4_base_threat_score?: number | null
          description?: string | null
          host?: string | null
          id?: string
          metasploit?: boolean | null
          name?: string | null
          plugin?: string | null
          plugin_output?: string | null
          port?: number | null
          protocol?: string | null
          risk?: string | null
          "see also"?: string | null
          solution?: string | null
          synopsis?: string | null
          updated_at?: string | null
        }
        Update: {
          canvas?: string | null
          Canvas?: string | null
          "core impact"?: string | null
          created_at?: string | null
          cve?: string[] | null
          "cvss v2.0 base score"?: string | null
          cvss_v3_base_score?: number | null
          cvss_v4_base_score?: number | null
          cvss_v4_base_threat_score?: number | null
          description?: string | null
          host?: string | null
          id?: string
          metasploit?: boolean | null
          name?: string | null
          plugin?: string | null
          plugin_output?: string | null
          port?: number | null
          protocol?: string | null
          risk?: string | null
          "see also"?: string | null
          solution?: string | null
          synopsis?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nessus_assets: {
        Row: {
          created_at: string
          fqdn: string | null
          host_name: string
          id: string
          ip_address: string | null
          mac_address: string | null
          netbios_name: string | null
          operating_system: string | null
          risk_score: number | null
          updated_at: string
          upload_session_id: string
          vulnerability_count: number | null
        }
        Insert: {
          created_at?: string
          fqdn?: string | null
          host_name: string
          id?: string
          ip_address?: string | null
          mac_address?: string | null
          netbios_name?: string | null
          operating_system?: string | null
          risk_score?: number | null
          updated_at?: string
          upload_session_id: string
          vulnerability_count?: number | null
        }
        Update: {
          created_at?: string
          fqdn?: string | null
          host_name?: string
          id?: string
          ip_address?: string | null
          mac_address?: string | null
          netbios_name?: string | null
          operating_system?: string | null
          risk_score?: number | null
          updated_at?: string
          upload_session_id?: string
          vulnerability_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_nessus_assets_session"
            columns: ["upload_session_id"]
            isOneToOne: false
            referencedRelation: "nessus_upload_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      nessus_csv: {
        Row: {
          asset: string | null
          canvas: boolean | null
          core_impact: boolean | null
          created_at: string | null
          cvss_v2_base_score: number | null
          cvss_v3_base_score: number | null
          cvss_v4_base_score: number | null
          cvss_v4_base_threat_score: number | null
          description: string | null
          external_id: string | null
          id: string
          metasploit: boolean | null
          name: string | null
          plugin_id: string | null
          plugin_output: string | null
          port: number | null
          protocol: string | null
          see_also: string | null
          severity: string | null
          solution: string | null
          synopsis: string | null
          updated_at: string | null
        }
        Insert: {
          asset?: string | null
          canvas?: boolean | null
          core_impact?: boolean | null
          created_at?: string | null
          cvss_v2_base_score?: number | null
          cvss_v3_base_score?: number | null
          cvss_v4_base_score?: number | null
          cvss_v4_base_threat_score?: number | null
          description?: string | null
          external_id?: string | null
          id?: string
          metasploit?: boolean | null
          name?: string | null
          plugin_id?: string | null
          plugin_output?: string | null
          port?: number | null
          protocol?: string | null
          see_also?: string | null
          severity?: string | null
          solution?: string | null
          synopsis?: string | null
          updated_at?: string | null
        }
        Update: {
          asset?: string | null
          canvas?: boolean | null
          core_impact?: boolean | null
          created_at?: string | null
          cvss_v2_base_score?: number | null
          cvss_v3_base_score?: number | null
          cvss_v4_base_score?: number | null
          cvss_v4_base_threat_score?: number | null
          description?: string | null
          external_id?: string | null
          id?: string
          metasploit?: boolean | null
          name?: string | null
          plugin_id?: string | null
          plugin_output?: string | null
          port?: number | null
          protocol?: string | null
          see_also?: string | null
          severity?: string | null
          solution?: string | null
          synopsis?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nessus_duplicate: {
        Row: {
          Canvas: string | null
          Core_Impact: string | null
          created_at: string | null
          CVE: string[] | null
          "CVSS v2.0 Base Score": number | null
          "CVSS_v3.0_Base_Score": number | null
          "CVSS_v4.0_Base_Score": number | null
          "CVSS_v4.0_Base+Threat_Score": number | null
          Description: string | null
          Host: string | null
          id: string
          Metasploit: boolean | null
          Name: string | null
          Plugin_ID: string | null
          Plugin_Output: string | null
          Port: number | null
          Protocol: string | null
          Risk: string | null
          Solution: string | null
          Synopsis: string | null
          updated_at: string | null
        }
        Insert: {
          Canvas?: string | null
          Core_Impact?: string | null
          created_at?: string | null
          CVE?: string[] | null
          "CVSS v2.0 Base Score"?: number | null
          "CVSS_v3.0_Base_Score"?: number | null
          "CVSS_v4.0_Base_Score"?: number | null
          "CVSS_v4.0_Base+Threat_Score"?: number | null
          Description?: string | null
          Host?: string | null
          id?: string
          Metasploit?: boolean | null
          Name?: string | null
          Plugin_ID?: string | null
          Plugin_Output?: string | null
          Port?: number | null
          Protocol?: string | null
          Risk?: string | null
          Solution?: string | null
          Synopsis?: string | null
          updated_at?: string | null
        }
        Update: {
          Canvas?: string | null
          Core_Impact?: string | null
          created_at?: string | null
          CVE?: string[] | null
          "CVSS v2.0 Base Score"?: number | null
          "CVSS_v3.0_Base_Score"?: number | null
          "CVSS_v4.0_Base_Score"?: number | null
          "CVSS_v4.0_Base+Threat_Score"?: number | null
          Description?: string | null
          Host?: string | null
          id?: string
          Metasploit?: boolean | null
          Name?: string | null
          Plugin_ID?: string | null
          Plugin_Output?: string | null
          Port?: number | null
          Protocol?: string | null
          Risk?: string | null
          Solution?: string | null
          Synopsis?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nessus_scan_results: {
        Row: {
          created_at: string | null
          id: string
          scan_data: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          scan_data: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          scan_data?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      nessus_upload_sessions: {
        Row: {
          created_at: string
          filename: string
          id: string
          scan_end_time: string | null
          scan_start_time: string | null
          total_assets: number | null
          total_vulnerabilities: number | null
          upload_date: string
        }
        Insert: {
          created_at?: string
          filename: string
          id?: string
          scan_end_time?: string | null
          scan_start_time?: string | null
          total_assets?: number | null
          total_vulnerabilities?: number | null
          upload_date?: string
        }
        Update: {
          created_at?: string
          filename?: string
          id?: string
          scan_end_time?: string | null
          scan_start_time?: string | null
          total_assets?: number | null
          total_vulnerabilities?: number | null
          upload_date?: string
        }
        Relationships: []
      }
      nessus_uploads: {
        Row: {
          created_at: string
          file_size: number | null
          filename: string
          id: string
          processed: boolean | null
          total_vulnerabilities: number | null
          updated_at: string
          upload_date: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          filename: string
          id?: string
          processed?: boolean | null
          total_vulnerabilities?: number | null
          updated_at?: string
          upload_date?: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          filename?: string
          id?: string
          processed?: boolean | null
          total_vulnerabilities?: number | null
          updated_at?: string
          upload_date?: string
        }
        Relationships: []
      }
      nessus_vulnerabilities: {
        Row: {
          created_at: string
          cve: string[] | null
          cvss_score: string | null
          description: string | null
          host: string
          id: string
          plugin_id: string
          plugin_name: string
          port: string | null
          protocol: string | null
          severity: string
          solution: string | null
          synopsis: string | null
          updated_at: string
          upload_session_id: string
        }
        Insert: {
          created_at?: string
          cve?: string[] | null
          cvss_score?: string | null
          description?: string | null
          host: string
          id?: string
          plugin_id: string
          plugin_name: string
          port?: string | null
          protocol?: string | null
          severity: string
          solution?: string | null
          synopsis?: string | null
          updated_at?: string
          upload_session_id: string
        }
        Update: {
          created_at?: string
          cve?: string[] | null
          cvss_score?: string | null
          description?: string | null
          host?: string
          id?: string
          plugin_id?: string
          plugin_name?: string
          port?: string | null
          protocol?: string | null
          severity?: string
          solution?: string | null
          synopsis?: string | null
          updated_at?: string
          upload_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_nessus_vulnerabilities_session"
            columns: ["upload_session_id"]
            isOneToOne: false
            referencedRelation: "nessus_upload_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      nuclei_scan_results: {
        Row: {
          created_at: string | null
          id: string
          results: Json
          scan_name: string
          scan_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          results: Json
          scan_name: string
          scan_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          results?: Json
          scan_name?: string
          scan_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      nuclei_vulnerabilities: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          assigned_to: string | null
          created_at: string
          description: string | null
          host: string
          id: string
          last_status_change: string | null
          matched_at: string
          matcher_name: string | null
          matcher_status: boolean | null
          scan_id: string
          severity: string
          template_id: string
          template_name: string
          updated_at: string
          vuln_hash: string
          vuln_id: string
          vuln_status: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          created_at: string
          description?: string | null
          host: string
          id?: string
          last_status_change?: string | null
          matched_at: string
          matcher_name?: string | null
          matcher_status?: boolean | null
          scan_id: string
          severity: string
          template_id: string
          template_name: string
          updated_at: string
          vuln_hash: string
          vuln_id: string
          vuln_status?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          host?: string
          id?: string
          last_status_change?: string | null
          matched_at?: string
          matcher_name?: string | null
          matcher_status?: boolean | null
          scan_id?: string
          severity?: string
          template_id?: string
          template_name?: string
          updated_at?: string
          vuln_hash?: string
          vuln_id?: string
          vuln_status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles_duplicate: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      remediation_tickets: {
        Row: {
          asset_id: string | null
          assigned_team: string | null
          change_management_id: string | null
          created_at: string | null
          downtime_required: boolean | null
          due_date: string | null
          id: string
          notes: string | null
          patch_id: string | null
          root_cause: string | null
          status: string | null
          updated_at: string | null
          vulnerability_id: string | null
          workaround_available: boolean | null
        }
        Insert: {
          asset_id?: string | null
          assigned_team?: string | null
          change_management_id?: string | null
          created_at?: string | null
          downtime_required?: boolean | null
          due_date?: string | null
          id?: string
          notes?: string | null
          patch_id?: string | null
          root_cause?: string | null
          status?: string | null
          updated_at?: string | null
          vulnerability_id?: string | null
          workaround_available?: boolean | null
        }
        Update: {
          asset_id?: string | null
          assigned_team?: string | null
          change_management_id?: string | null
          created_at?: string | null
          downtime_required?: boolean | null
          due_date?: string | null
          id?: string
          notes?: string | null
          patch_id?: string | null
          root_cause?: string | null
          status?: string | null
          updated_at?: string | null
          vulnerability_id?: string | null
          workaround_available?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "remediation_tickets_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "asset_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remediation_tickets_vulnerability_id_fkey"
            columns: ["vulnerability_id"]
            isOneToOne: false
            referencedRelation: "vulnerability_repository"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_management: {
        Row: {
          created_at: string | null
          credentials_used: boolean | null
          id: string
          log_file: string | null
          report_url: string | null
          scan_profile: string | null
          scan_target: string | null
          scanner_type: string | null
          schedule_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credentials_used?: boolean | null
          id?: string
          log_file?: string | null
          report_url?: string | null
          scan_profile?: string | null
          scan_target?: string | null
          scanner_type?: string | null
          schedule_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credentials_used?: boolean | null
          id?: string
          log_file?: string | null
          report_url?: string | null
          scan_profile?: string | null
          scan_target?: string | null
          scanner_type?: string | null
          schedule_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      signup_requests: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          password_hash: string
          processed_at: string | null
          processed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          password_hash: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          password_hash?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signup_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sla_breach_trends: {
        Row: {
          created_at: string
          critical_breaches: number
          filename: string | null
          high_breaches: number
          id: string
          low_breaches: number
          medium_breaches: number
          scan_date: string
          total_breaches: number
          total_hosts: number
          upload_session_id: string | null
        }
        Insert: {
          created_at?: string
          critical_breaches?: number
          filename?: string | null
          high_breaches?: number
          id?: string
          low_breaches?: number
          medium_breaches?: number
          scan_date: string
          total_breaches?: number
          total_hosts?: number
          upload_session_id?: string | null
        }
        Update: {
          created_at?: string
          critical_breaches?: number
          filename?: string | null
          high_breaches?: number
          id?: string
          low_breaches?: number
          medium_breaches?: number
          scan_date?: string
          total_breaches?: number
          total_hosts?: number
          upload_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sla_breach_trends_upload_session_id_fkey"
            columns: ["upload_session_id"]
            isOneToOne: false
            referencedRelation: "nessus_upload_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_item_id: string | null
          related_item_type: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_item_id?: string | null
          related_item_type?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_item_id?: string | null
          related_item_type?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      vulnerabilities: {
        Row: {
          asset: string | null
          canvas: boolean | null
          core: boolean | null
          created_at: string | null
          cve: string[] | null
          cvss_v2_base_score: number | null
          cvss_v3_base_score: number | null
          cvss_v4_base_score: number | null
          cvss_v4_base_threat_score: number | null
          description: string | null
          discovered_at: string | null
          external_id: string
          id: string
          impact: string | null
          metasploit: boolean | null
          name: string | null
          plugin_id: string | null
          plugin_output: string | null
          port: number | null
          protocol: string | null
          risk: string | null
          severity: string | null
          solution: string | null
          status: string | null
          synopsis: string | null
          updated_at: string | null
        }
        Insert: {
          asset?: string | null
          canvas?: boolean | null
          core?: boolean | null
          created_at?: string | null
          cve?: string[] | null
          cvss_v2_base_score?: number | null
          cvss_v3_base_score?: number | null
          cvss_v4_base_score?: number | null
          cvss_v4_base_threat_score?: number | null
          description?: string | null
          discovered_at?: string | null
          external_id: string
          id?: string
          impact?: string | null
          metasploit?: boolean | null
          name?: string | null
          plugin_id?: string | null
          plugin_output?: string | null
          port?: number | null
          protocol?: string | null
          risk?: string | null
          severity?: string | null
          solution?: string | null
          status?: string | null
          synopsis?: string | null
          updated_at?: string | null
        }
        Update: {
          asset?: string | null
          canvas?: boolean | null
          core?: boolean | null
          created_at?: string | null
          cve?: string[] | null
          cvss_v2_base_score?: number | null
          cvss_v3_base_score?: number | null
          cvss_v4_base_score?: number | null
          cvss_v4_base_threat_score?: number | null
          description?: string | null
          discovered_at?: string | null
          external_id?: string
          id?: string
          impact?: string | null
          metasploit?: boolean | null
          name?: string | null
          plugin_id?: string | null
          plugin_output?: string | null
          port?: number | null
          protocol?: string | null
          risk?: string | null
          severity?: string | null
          solution?: string | null
          status?: string | null
          synopsis?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vulnerability_aging: {
        Row: {
          age_days: number | null
          created_at: string
          first_detected_date: string
          hostname: string
          id: string
          is_sla_breach: boolean | null
          last_seen_date: string
          plugin_id: string
          plugin_name: string
          severity: string
          sla_target_days: number
          updated_at: string
          vulnerability_id: string
        }
        Insert: {
          age_days?: number | null
          created_at?: string
          first_detected_date: string
          hostname: string
          id?: string
          is_sla_breach?: boolean | null
          last_seen_date: string
          plugin_id: string
          plugin_name: string
          severity: string
          sla_target_days: number
          updated_at?: string
          vulnerability_id: string
        }
        Update: {
          age_days?: number | null
          created_at?: string
          first_detected_date?: string
          hostname?: string
          id?: string
          is_sla_breach?: boolean | null
          last_seen_date?: string
          plugin_id?: string
          plugin_name?: string
          severity?: string
          sla_target_days?: number
          updated_at?: string
          vulnerability_id?: string
        }
        Relationships: []
      }
      vulnerability_audit_logs: {
        Row: {
          action: string
          id: string
          new_value: Json | null
          old_value: Json | null
          timestamp: string | null
          user_id: string | null
          vulnerability_id: string | null
        }
        Insert: {
          action: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          timestamp?: string | null
          user_id?: string | null
          vulnerability_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          timestamp?: string | null
          user_id?: string | null
          vulnerability_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vulnerability_audit_logs_vulnerability_id_fkey"
            columns: ["vulnerability_id"]
            isOneToOne: false
            referencedRelation: "nuclei_vulnerabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      vulnerability_comments: {
        Row: {
          comment_text: string
          created_at: string | null
          created_by: string
          id: string
          vulnerability_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string | null
          created_by: string
          id?: string
          vulnerability_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string | null
          created_by?: string
          id?: string
          vulnerability_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vulnerability_comments_vulnerability_id_fkey"
            columns: ["vulnerability_id"]
            isOneToOne: false
            referencedRelation: "nuclei_vulnerabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      vulnerability_repository: {
        Row: {
          assigned_to: string | null
          comments: string | null
          created_at: string | null
          cve_id: string | null
          cvss_score: number | null
          cvss_vector: string | null
          description: string | null
          discovery_date: string | null
          evidence: string[] | null
          exploit_available: boolean | null
          id: string
          internal_id: string | null
          known_exploited: boolean | null
          patch_available: boolean | null
          remediation: string | null
          remediation_eta: string | null
          sla_breach: boolean | null
          source: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          comments?: string | null
          created_at?: string | null
          cve_id?: string | null
          cvss_score?: number | null
          cvss_vector?: string | null
          description?: string | null
          discovery_date?: string | null
          evidence?: string[] | null
          exploit_available?: boolean | null
          id?: string
          internal_id?: string | null
          known_exploited?: boolean | null
          patch_available?: boolean | null
          remediation?: string | null
          remediation_eta?: string | null
          sla_breach?: boolean | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          comments?: string | null
          created_at?: string | null
          cve_id?: string | null
          cvss_score?: number | null
          cvss_vector?: string | null
          description?: string | null
          discovery_date?: string | null
          evidence?: string[] | null
          exploit_available?: boolean | null
          id?: string
          internal_id?: string | null
          known_exploited?: boolean | null
          patch_available?: boolean | null
          remediation?: string | null
          remediation_eta?: string | null
          sla_breach?: boolean | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_nuclei_sla_days: {
        Args: { severity: string }
        Returns: number
      }
      calculate_sla_days: {
        Args: { severity: string }
        Returns: number
      }
      create_user_account: {
        Args: {
          user_email: string
          user_password: string
          user_first_name: string
          user_last_name: string
          user_role?: string
        }
        Returns: Json
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_sla_target_days: {
        Args: { severity_level: string }
        Returns: number
      }
      get_vulnerability_counts_by_assignee: {
        Args: Record<PropertyKey, never>
        Returns: {
          assignee: string
          count: number
        }[]
      }
      increment_vulnerability_count: {
        Args: { asset_id: string; increment_by: number }
        Returns: number
      }
      is_nuclei_sla_breached: {
        Args: { created_timestamp: string; severity: string }
        Returns: boolean
      }
      is_sla_breached: {
        Args: { created_timestamp: string; severity: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
