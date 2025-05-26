
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Database, Bell, Shield, Globe, Key } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const SettingsPanel = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription className="text-slate-400">
            Configure system preferences and security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-700">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="scanning">Scanning</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-slate-300 font-medium">Organization Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orgName" className="text-slate-300">Organization Name</Label>
                    <Input 
                      id="orgName" 
                      defaultValue="Acme Corporation"
                      className="bg-slate-700 border-slate-600 text-white mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone" className="text-slate-300">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">EST</SelectItem>
                        <SelectItem value="pst">PST</SelectItem>
                        <SelectItem value="cet">CET</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-4">
                <h3 className="text-slate-300 font-medium">Display Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Dark Mode</Label>
                      <p className="text-slate-400 text-sm">Use dark theme for the interface</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">High Contrast</Label>
                      <p className="text-slate-400 text-sm">Increase contrast for better visibility</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scanning" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-slate-300 font-medium">Default Scan Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Default Scan Profile</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="quick">Quick Scan</SelectItem>
                        <SelectItem value="standard">Standard Scan</SelectItem>
                        <SelectItem value="deep">Deep Scan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300">Scan Frequency</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-4">
                <h3 className="text-slate-300 font-medium">Scan Behavior</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Auto-assign Vulnerabilities</Label>
                      <p className="text-slate-400 text-sm">Automatically assign found vulnerabilities to team members</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Aggressive Testing</Label>
                      <p className="text-slate-400 text-sm">Enable more thorough but potentially disruptive tests</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Continuous Monitoring</Label>
                      <p className="text-slate-400 text-sm">Monitor assets continuously for new vulnerabilities</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-slate-300 font-medium">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Critical Vulnerabilities</Label>
                      <p className="text-slate-400 text-sm">Immediate notification for critical severity issues</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Scan Completion</Label>
                      <p className="text-slate-400 text-sm">Notify when scans are completed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Weekly Summary</Label>
                      <p className="text-slate-400 text-sm">Weekly vulnerability management summary</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-4">
                <h3 className="text-slate-300 font-medium">Slack Integration</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="slackWebhook" className="text-slate-300">Webhook URL</Label>
                    <Input 
                      id="slackWebhook" 
                      placeholder="https://hooks.slack.com/services/..."
                      className="bg-slate-700 border-slate-600 text-white mt-1" 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Enable Slack Notifications</Label>
                      <p className="text-slate-400 text-sm">Send notifications to Slack channels</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-slate-300 font-medium">Third-party Integrations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Jira", description: "Issue tracking integration", connected: true },
                    { name: "ServiceNow", description: "ITSM integration", connected: false },
                    { name: "Splunk", description: "SIEM integration", connected: true },
                    { name: "PagerDuty", description: "Incident management", connected: false },
                  ].map((integration) => (
                    <div key={integration.name} className="p-4 rounded-lg border border-slate-600 bg-slate-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-slate-300 font-medium">{integration.name}</h4>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={integration.connected ? "border-green-500 text-green-400" : "border-slate-600"}
                        >
                          {integration.connected ? "Connected" : "Connect"}
                        </Button>
                      </div>
                      <p className="text-slate-400 text-sm">{integration.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-slate-300 font-medium">Authentication Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Two-Factor Authentication</Label>
                      <p className="text-slate-400 text-sm">Require 2FA for all user accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">SSO Integration</Label>
                      <p className="text-slate-400 text-sm">Enable Single Sign-On authentication</p>
                    </div>
                    <Switch />
                  </div>
                  <div>
                    <Label htmlFor="sessionTimeout" className="text-slate-300">Session Timeout (minutes)</Label>
                    <Input 
                      id="sessionTimeout" 
                      type="number"
                      defaultValue="60"
                      className="bg-slate-700 border-slate-600 text-white mt-1 w-32" 
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-4">
                <h3 className="text-slate-300 font-medium">API Security</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">API Rate Limiting</Label>
                    <Select defaultValue="1000">
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1 w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="100">100 requests/hour</SelectItem>
                        <SelectItem value="1000">1000 requests/hour</SelectItem>
                        <SelectItem value="5000">5000 requests/hour</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">API Key Rotation</Label>
                      <p className="text-slate-400 text-sm">Automatically rotate API keys every 30 days</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-6 border-t border-slate-700">
            <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            <Button variant="outline" className="border-slate-600">Reset to Defaults</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
