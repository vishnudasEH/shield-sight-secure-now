import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Plus, Trash2, Settings } from "lucide-react";

interface AssignmentRule {
  id: string;
  name: string;
  type: 'keyword' | 'severity' | 'ipRange' | 'assetTag';
  condition: string;
  assignTo: string;
  enabled: boolean;
}

export const BitsightAutoAssignment = () => {
  const [rules, setRules] = useState<AssignmentRule[]>([
    {
      id: "1",
      name: "Apache Vulnerabilities",
      type: "keyword",
      condition: "Apache",
      assignTo: "arun.patel@company.com",
      enabled: true
    },
    {
      id: "2",
      name: "Critical Issues",
      type: "severity",
      condition: "Critical",
      assignTo: "incident.lead@company.com",
      enabled: true
    },
    {
      id: "3",
      name: "Production Network",
      type: "ipRange",
      condition: "192.168.1.0/24",
      assignTo: "network.admin@company.com",
      enabled: false
    }
  ]);

  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    type: "keyword" as const,
    condition: "",
    assignTo: ""
  });

  const teamMembers = [
    "arun.patel@company.com",
    "incident.lead@company.com",
    "network.admin@company.com",
    "security.team@company.com",
    "devops.team@company.com"
  ];

  const handleAddRule = () => {
    if (!newRule.name || !newRule.condition || !newRule.assignTo) return;

    const rule: AssignmentRule = {
      id: Date.now().toString(),
      ...newRule,
      enabled: true
    };

    setRules(prev => [...prev, rule]);
    setNewRule({ name: "", type: "keyword", condition: "", assignTo: "" });
    setShowAddRule(false);
  };

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
  };

  const getRuleTypeLabel = (type: string) => {
    switch (type) {
      case 'keyword': return 'Keyword Match';
      case 'severity': return 'Severity Level';
      case 'ipRange': return 'IP Range';
      case 'assetTag': return 'Asset Tag';
      default: return type;
    }
  };

  return (
    <Card className="neo-premium">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-purple-400" />
              Auto Assignment Rules
            </CardTitle>
            <CardDescription className="text-gray-400">
              Automatically assign vulnerabilities based on configurable rules
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowAddRule(!showAddRule)}
            className="btn-premium"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Rule Form */}
        {showAddRule && (
          <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-700 space-y-4">
            <h4 className="text-sm font-medium text-white">Create New Assignment Rule</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Rule Name</label>
                <Input
                  placeholder="e.g., Apache Vulnerabilities"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Rule Type</label>
                <Select value={newRule.type} onValueChange={(value: any) => setNewRule(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keyword">Keyword Match</SelectItem>
                    <SelectItem value="severity">Severity Level</SelectItem>
                    <SelectItem value="ipRange">IP Range</SelectItem>
                    <SelectItem value="assetTag">Asset Tag</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Condition</label>
                <Input
                  placeholder={
                    newRule.type === 'keyword' ? 'e.g., Apache, OpenSSL' :
                    newRule.type === 'severity' ? 'e.g., Critical, High' :
                    newRule.type === 'ipRange' ? 'e.g., 192.168.1.0/24' :
                    'e.g., Production, Database'
                  }
                  value={newRule.condition}
                  onChange={(e) => setNewRule(prev => ({ ...prev, condition: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Assign To</label>
                <Select value={newRule.assignTo} onValueChange={(value) => setNewRule(prev => ({ ...prev, assignTo: value }))}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map(member => (
                      <SelectItem key={member} value={member}>{member}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddRule} className="btn-premium" size="sm">
                Create Rule
              </Button>
              <Button 
                onClick={() => setShowAddRule(false)} 
                variant="outline" 
                size="sm"
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Existing Rules */}
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="p-4 bg-gray-900/20 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-sm font-medium text-white">{rule.name}</h4>
                  <Badge 
                    className={rule.enabled ? 
                      "bg-green-500/20 text-green-400" : 
                      "bg-gray-500/20 text-gray-400"
                    }
                  >
                    {rule.enabled ? 'Active' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRule(rule.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRule(rule.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="ml-2 text-gray-300">{getRuleTypeLabel(rule.type)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Condition:</span>
                  <span className="ml-2 text-gray-300">{rule.condition}</span>
                </div>
                <div>
                  <span className="text-gray-400">Assign To:</span>
                  <span className="ml-2 text-gray-300">{rule.assignTo}</span>
                </div>
              </div>
            </div>
          ))}
          
          {rules.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No assignment rules configured</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
