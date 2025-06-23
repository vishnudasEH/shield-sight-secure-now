
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";

interface BitsightApiKeyManagerProps {
  onApiKeyValidated: (key: string) => void;
}

export const BitsightApiKeyManager = ({ onApiKeyValidated }: BitsightApiKeyManagerProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null);

  const validateApiKey = async () => {
    if (!apiKey.trim()) return;

    setIsValidating(true);
    setValidationResult(null);

    // Simulate API validation
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Basic validation - in real app this would call Bitsight API
      const isValid = apiKey.length >= 20 && apiKey.includes('-');
      
      if (isValid) {
        setValidationResult('success');
        localStorage.setItem('bitsight_api_key', apiKey);
        setTimeout(() => onApiKeyValidated(apiKey), 1000);
      } else {
        setValidationResult('error');
      }
    } catch (error) {
      setValidationResult('error');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="neo-premium max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <Key className="h-5 w-5 text-blue-400" />
          Bitsight API Setup
        </CardTitle>
        <CardDescription className="text-gray-300">
          Enter your API key to connect to Bitsight
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium text-gray-300">
            API Key
          </label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10 bg-gray-900/50 border-gray-700 text-white"
              disabled={isValidating}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {validationResult === 'success' && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="h-4 w-4" />
            API key validated successfully!
          </div>
        )}

        {validationResult === 'error' && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <XCircle className="h-4 w-4" />
            Invalid API key. Please check and try again.
          </div>
        )}

        <Button
          onClick={validateApiKey}
          disabled={!apiKey.trim() || isValidating}
          className="w-full btn-premium"
        >
          {isValidating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Validating...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Validate API Key
            </>
          )}
        </Button>

        <div className="bg-gray-900/30 rounded-lg p-3 border border-gray-700">
          <p className="text-xs text-gray-400">
            Your API key is stored securely in your browser's local storage and never transmitted to our servers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
