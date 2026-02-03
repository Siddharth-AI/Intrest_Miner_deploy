import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, RefreshCw, TestTube, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchMetaSettings,
  updateMetaSettings,
  testMetaConnection,
  regenerateWebhook,
  clearError,
  clearTestResult
} from '../../../store/features/metaSettingsSlice';

const MetaSettings = () => {
  const dispatch = useAppDispatch();
  const { settings, loading, saving, testing, regenerating, error, testResult } = useAppSelector(
    (state) => state.metaSettings
  );

  const [copied, setCopied] = useState<'url' | 'token' | null>(null);
  
  // Separate form states for independent updates
  const [pixelData, setPixelData] = useState({
    meta_pixel_id: '',
    meta_capi_token: ''
  });

  const [whatsappData, setWhatsappData] = useState({
    whatsapp_phone: ''
  });

  useEffect(() => {
    dispatch(fetchMetaSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setPixelData({
        meta_pixel_id: settings.meta_pixel_id || '',
        meta_capi_token: settings.meta_capi_token || ''
      });
      setWhatsappData({
        whatsapp_phone: settings.whatsapp_phone || ''
      });
    }
  }, [settings]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (testResult) {
      if (testResult.success) {
        toast.success(testResult.message);
      } else {
        toast.error(testResult.message);
      }
      dispatch(clearTestResult());
    }
  }, [testResult, dispatch]);

  const handleSavePixel = async () => {
    if (!pixelData.meta_pixel_id || !pixelData.meta_capi_token) {
      toast.error('Both Meta Pixel ID and CAPI Token are required');
      return;
    }

    const result = await dispatch(updateMetaSettings({
      ...pixelData,
      whatsapp_phone: settings?.whatsapp_phone || undefined
    }));
    if (updateMetaSettings.fulfilled.match(result)) {
      toast.success('Meta Pixel settings saved successfully!');
    }
  };

  const handleSaveWhatsApp = async () => {
    // Only send whatsapp_phone, keep existing pixel settings
    const result = await dispatch(updateMetaSettings({
      meta_pixel_id: settings?.meta_pixel_id || undefined,
      meta_capi_token: settings?.meta_capi_token || undefined,
      whatsapp_phone: whatsappData.whatsapp_phone || undefined
    }));
    if (updateMetaSettings.fulfilled.match(result)) {
      toast.success('WhatsApp settings saved successfully!');
    }
  };

  const handleTestConnection = () => {
    if (!settings?.meta_pixel_id || !settings?.meta_capi_token) {
      toast.error('Please save your settings first');
      return;
    }
    dispatch(testMetaConnection());
  };

  const handleRegenerateWebhook = async () => {
    if (!confirm('Are you sure? This will invalidate your current webhook URL.')) {
      return;
    }

    const result = await dispatch(regenerateWebhook());
    if (regenerateWebhook.fulfilled.match(result)) {
      toast.success('Webhook URL regenerated successfully!');
    }
  };

  const copyToClipboard = (text: string, type: 'url' | 'token') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Meta Integration Settings</h1>

      <Alert className="mb-6">
        <AlertDescription>
          Configure Meta Pixel for conversion tracking and/or WhatsApp for lead management. 
          You can set them up independently - use only what you need!
        </AlertDescription>
      </Alert>

      {/* Meta Pixel Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Meta Conversion API (Optional)</CardTitle>
          <CardDescription>
            Track conversions from Instant Forms and Website leads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pixel_id">Meta Pixel ID</Label>
            <Input
              id="pixel_id"
              placeholder="123456789012345"
              value={pixelData.meta_pixel_id}
              onChange={(e) => setPixelData({ ...pixelData, meta_pixel_id: e.target.value })}
              disabled={saving}
            />
            <p className="text-sm text-gray-500 mt-1">
              Find this in Meta Events Manager → Settings → Pixel
            </p>
          </div>

          <div>
            <Label htmlFor="capi_token">Conversion API Token</Label>
            <Input
              id="capi_token"
              type="password"
              placeholder="EAAxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={pixelData.meta_capi_token}
              onChange={(e) => setPixelData({ ...pixelData, meta_capi_token: e.target.value })}
              disabled={saving}
            />
            <p className="text-sm text-gray-500 mt-1">
              Generate in Meta Events Manager → Settings → Conversions API → Generate Access Token
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSavePixel} disabled={saving || testing}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Pixel Settings'
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestConnection} 
              disabled={testing || saving || !settings?.configured}
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
          </div>

          {settings?.configured && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ✅ Meta Pixel configured successfully! Events will be sent to your pixel.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* WhatsApp Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>WhatsApp Integration</CardTitle>
          <CardDescription>
            Connect your WhatsApp Business for lead tracking via AiSensy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="whatsapp_phone">WhatsApp Business Phone (Optional)</Label>
            <Input
              id="whatsapp_phone"
              placeholder="+919876543210"
              value={whatsappData.whatsapp_phone}
              onChange={(e) => setWhatsappData({ ...whatsappData, whatsapp_phone: e.target.value })}
              disabled={saving}
            />
            <p className="text-sm text-gray-500 mt-1">
              Your WhatsApp Business phone number for reference
            </p>
          </div>

          <Button onClick={handleSaveWhatsApp} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save WhatsApp Settings'
            )}
          </Button>

          {/* Webhook URL - Always show */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-3">Your Webhook Credentials</h3>
            
            <div className="mb-4">
              <Label>Webhook URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={settings?.webhook_url || 'Loading...'}
                  readOnly
                  className="font-mono text-sm bg-gray-50"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => settings?.webhook_url && copyToClipboard(settings.webhook_url, 'url')}
                  disabled={!settings?.webhook_url}
                >
                  {copied === 'url' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Use this URL in AiSensy → Settings → Webhooks
              </p>
            </div>

            <div className="mb-4">
              <Label>Verify Token</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={settings?.webhook_verify_token || 'Loading...'}
                  readOnly
                  type="password"
                  className="font-mono text-sm bg-gray-50"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => settings?.webhook_verify_token && copyToClipboard(settings.webhook_verify_token, 'token')}
                  disabled={!settings?.webhook_verify_token}
                >
                  {copied === 'token' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Use this token for webhook verification in AiSensy
              </p>
            </div>

            <Button 
              variant="outline" 
              onClick={handleRegenerateWebhook}
              disabled={regenerating}
            >
              {regenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate Webhook Credentials
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              ⚠️ Regenerating will invalidate your current webhook URL and token
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">For Meta Pixel (Optional):</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
              <li>Get your Pixel ID from Meta Events Manager</li>
              <li>Generate a Conversion API Token</li>
              <li>Enter both in the Meta Conversion API section</li>
              <li>Click "Save Pixel Settings"</li>
              <li>Test the connection to verify</li>
            </ol>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">For WhatsApp Integration:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
              <li>Copy your Webhook URL and Verify Token from above</li>
              <li>Go to AiSensy → Settings → Webhooks</li>
              <li>Click "Add Webhook"</li>
              <li>Paste the Webhook URL</li>
              <li>Paste the Verify Token</li>
              <li>Subscribe to "Message Received" events</li>
              <li>Save and verify the webhook</li>
              <li>Done! WhatsApp leads will be tracked automatically</li>
            </ol>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              💡 <strong>Flexible Setup:</strong> You can use Meta Pixel only, WhatsApp only, or both together. 
              Each feature works independently!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetaSettings;
