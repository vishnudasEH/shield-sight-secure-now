import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, CheckCircle, XCircle, Eye, EyeOff, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BitsightApiKeyManagerProps {
  onApiKeyValidated: (key: string) => void;
}

export const BitsightApiKeyManager = ({ onApiKeyValidated }: BitsightApiKeyManagerProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [validationResult, setValidationResult] = useState<'success' | 'error' | 'network_error' | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const validateApiKey = async () => {
    if (!apiKey.trim()) return;

    setIsValidating(true);
    setValidationResult(null);
    setErrorMessage("");

    try {
      console.log('Validating API key via backend proxy...');
      
      // Call our backend proxy endpoint instead of Bitsight API directly
      const { data, error } = await supabase.functions.invoke('validate-bitsight-key', {
        body: { apiKey: apiKey.trim() }
      });

      if (error) {
        console.error('Supabase function error:', error);
        setValidationResult('network_error');
        setErrorMessage('Failed to connect to validation service. Please try again.');
        return;
      }

      console.log('Backend validation response:', data);

      if (data.success) {
        setValidationResult('success');
        localStorage.setItem('bitsight_api_key', apiKey);
        console.log('API key validated successfully via backend!');
        setTimeout(() => onApiKeyValidated(apiKey), 1000);
      } else {
        setValidationResult('error');
        setErrorMessage(data.error || 'Unknown validation error occurred.');
        console.log('API key validation failed:', data.error);
      }
    } catch (error) {
      console.error('Unexpected error during API validation:', error);
      setValidationResult('network_error');
      setErrorMessage('Unexpected error occurred. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const getValidationIcon = () => {
    switch (validationResult) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'network_error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getValidationColor = () => {
    switch (validationResult) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'network_error':
        return 'text-yellow-400';
      default:
        return '';
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
              placeholder="Enter your Bitsight API token..."
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

        {validationResult && (
          <div className={`flex items-center gap-2 text-sm ${getValidationColor()}`}>
            {getValidationIcon()}
            {validationResult === 'success' && 'API key validated successfully!'}
            {(validationResult === 'error' || validationResult === 'network_error') && errorMessage}
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
              Validating with Bitsight API...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Validate API Key
            </>
          )}
        </Button>

        <div className="bg-gray-900/30 rounded-lg p-3 border border-gray-700 space-y-2">
          <p className="text-xs text-gray-400">
            Your API key is validated securely through our backend service and stored locally in your browser.
          </p>
          <p className="text-xs text-blue-400">
            Need an API key? Visit your{' '}
            <a 
              href="https://service.bitsighttech.com/app/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-blue-300"
            >
              Bitsight API settings
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
