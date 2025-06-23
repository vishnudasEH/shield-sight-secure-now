
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Bell, Slack, MessageSquare, Webhook, CheckCircle, XCircle } from "lucide-react";

export const BitsightNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [platform, setPlatform] = useState("slack");
  const [notifications, setNotifications] = useState({
    assignment: true,
    deadline: true,
    breach: true,
    resolution: false
  });
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'success' | 'error' | null>(null);

  const platforms = [
    { value: "slack", label: "Slack", icon: Slack },
    { value: "teams", label: "Microsoft Teams", icon: MessageSquare },
    { value: "webhook", label: "Custom Webhook", icon: Webhook }
  ];

  const notificationTypes = [
    { key: "assignment", label: "Vulnerability Assigned", description: "When a vulnerability is assigned to a team member" },
    { key: "deadline", label: "SLA Deadline Approaching", description: "When SLA deadline is within 3 days" },
    { key: "breach", label: "SLA Breached", description: "When SLA deadline has passed" },
    { key: "resolution", label: "Vulnerability Resolved", description: "When a vulnerability is marked as closed" }
  ];

  const testWebhook = async () => {
    if (!webhookUrl) return;
    
    setIsTestingWebhook(true);
    setWebhookStatus(null);

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          text: "🛡️ Bitsight notification test - webhook integration successful!",
          timestamp: new Date().toISOString(),
          type: "test"
        })
      });
      
      setWebhookStatus('success');
    } catch (error) {
      setWebhookStatus('error');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const saveNotificationSettings = () => {
    const settings = {
      platform,
      webhookUrl,
      notifications,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('bitsight_notifications', JSON.stringify(settings));
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-400" />
            Notification Settings
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Configure Slack, Teams, or webhook notifications for vulnerability events
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Platform Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Notification Platform</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {platforms.map(p => (
                  <SelectItem key={p.value} value={p.value}>
                    <div className="flex items-center gap-2">
                      <p.icon className="h-4 w-4" />
                      {p.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Webhook URL */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">
              {platform === 'slack' ? 'Slack Webhook URL' : 
               platform === 'teams' ? 'Teams Webhook URL' : 'Webhook URL'}
            </label>
            <div className="flex gap-2">
              <Input
                placeholder={
                  platform === 'slack' ? 'https://hooks.slack.com/services/...' :
                  platform === 'teams' ? 'https://company.webhook.office.com/...' :
                  'https://your-webhook-url.com/...'
                }
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button
                onClick={testWebhook}
                disabled={!webhookUrl || isTestingWebhook}
                variant="outline"
                className="border-slate-600 whitespace-nowrap"
              >
                {isTestingWebhook ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Test'
                )}
              </Button>
            </div>
            
            {webhookStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle className="h-4 w-4" />
                Webhook test successful!
              </div>
            )}
            
            {webhookStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <XCircle className="h-4 w-4" />
                Webhook test failed. Please check the URL.
              </div>
            )}
          </div>

          {/* Notification Types */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Notification Types</label>
            <div className="space-y-3">
              {notificationTypes.map(type => (
                <div key={type.key} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                  <Checkbox
                    id={type.key}
                    checked={notifications[type.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, [type.key]: checked }))
                    }
                  />
                  <div className="flex-1">
                    <label htmlFor={type.key} className="text-sm font-medium text-white cursor-pointer">
                      {type.label}
                    </label>
                    <p className="text-xs text-slate-400 mt-1">{type.description}</p>
                  </div>
                  {notifications[type.key as keyof typeof notifications] && (
                    <Badge className="bg-green-500/20 text-green-400 text-xs">Active</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Setup Instructions */}
          {platform !== 'webhook' && (
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <h4 className="text-sm font-medium text-white mb-2">
                {platform === 'slack' ? 'Slack Setup' : 'Teams Setup'}
              </h4>
              <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
                {platform === 'slack' ? (
                  <>
                    <li>Go to your Slack workspace settings</li>
                    <li>Navigate to Apps → Incoming Webhooks</li>
                    <li>Create a new webhook for your desired channel</li>
                    <li>Copy the webhook URL and paste it above</li>
                  </>
                ) : (
                  <>
                    <li>Open Microsoft Teams and go to your channel</li>
                    <li>Click the "..." menu → Connectors</li>
                    <li>Find "Incoming Webhook" and configure it</li>
                    <li>Copy the webhook URL and paste it above</li>
                  </>
                )}
              </ol>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={saveNotificationSettings}
              disabled={!webhookUrl}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Save Settings
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
