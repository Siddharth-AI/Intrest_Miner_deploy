import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader2, RefreshCw, Send, CheckCircle, DollarSign, Ban } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchLeads,
  fetchLeadStats,
  setFilters,
  clearError,
  sendLeadToMeta,
  qualifyInstantFormLead,
  convertLead,
  markLeadAsSpam
} from '../../../store/features/conversionSlice';
import { toast } from 'sonner';

const ConversionDashboard = () => {
  const dispatch = useAppDispatch();
  const { leads, stats, loading, error, filters } = useAppSelector(
    (state) => state.conversion
  );

  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [selectedLeadForConvert, setSelectedLeadForConvert] = useState<string | null>(null);
  const [convertAmount, setConvertAmount] = useState<string>('');

  useEffect(() => {
    dispatch(fetchLeads(filters));
    dispatch(fetchLeadStats());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleTabChange = (source: string) => {
    const newFilters = { ...filters, source: source === 'all' ? '' : source };
    dispatch(setFilters(newFilters));
    dispatch(fetchLeads(newFilters));
  };

  const handleRefresh = () => {
    dispatch(fetchLeads(filters));
    dispatch(fetchLeadStats());
    toast.success('Leads refreshed');
  };

  const handleSendToMeta = async (leadUuid: string) => {
    const result = await dispatch(sendLeadToMeta(leadUuid));
    if (sendLeadToMeta.fulfilled.match(result)) {
      toast.success('Lead sent to Meta successfully!');
      dispatch(fetchLeads(filters));
    }
  };

  const handleQualify = async (leadUuid: string) => {
    const result = await dispatch(qualifyInstantFormLead(leadUuid));
    if (qualifyInstantFormLead.fulfilled.match(result)) {
      toast.success('Lead qualified! CompleteRegistration event sent to Meta.');
      dispatch(fetchLeads(filters));
    }
  };

  const handleConvertClick = (leadUuid: string) => {
    setSelectedLeadForConvert(leadUuid);
    setConvertAmount('');
    setConvertDialogOpen(true);
  };

  const handleConvertConfirm = async () => {
    if (!selectedLeadForConvert) return;

    const amount = convertAmount ? parseFloat(convertAmount) : undefined;
    const result = await dispatch(convertLead({ 
      leadUuid: selectedLeadForConvert, 
      amount 
    }));
    
    if (convertLead.fulfilled.match(result)) {
      toast.success('Lead converted! Purchase event sent to Meta.');
      dispatch(fetchLeads(filters));
      setConvertDialogOpen(false);
      setSelectedLeadForConvert(null);
      setConvertAmount('');
    }
  };

  const handleMarkAsSpam = async (leadUuid: string) => {
    if (!confirm('Are you sure you want to mark this lead as spam?')) return;

    const result = await dispatch(markLeadAsSpam(leadUuid));
    if (markLeadAsSpam.fulfilled.match(result)) {
      toast.success('Lead marked as spam');
      dispatch(fetchLeads(filters));
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'instant_form':
        return 'bg-blue-500 text-white';
      case 'website':
        return 'bg-green-500 text-white';
      case 'whatsapp_ad':
        return 'bg-purple-500 text-white';
      case 'whatsapp_organic':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-500 text-white';
      case 'sent_to_meta':
        return 'bg-blue-500 text-white';
      case 'contacted':
        return 'bg-indigo-500 text-white';
      case 'qualified':
        return 'bg-purple-500 text-white';
      case 'converted':
        return 'bg-green-500 text-white';
      case 'spam':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'New';
      case 'sent_to_meta':
        return 'Sent to Meta';
      case 'contacted':
        return 'Contacted';
      case 'qualified':
        return 'Qualified';
      case 'converted':
        return 'Converted';
      case 'spam':
        return 'Spam';
      default:
        return status;
    }
  };

  const renderActionButtons = (lead: any) => {
    const isSubmitting = loading.submitting;

    switch (lead.status) {
      case 'new':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleSendToMeta(lead.uuid)}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1" />
                  Send to Meta
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleMarkAsSpam(lead.uuid)}
              disabled={isSubmitting}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Ban className="w-4 h-4 mr-1" />
              Spam
            </Button>
          </div>
        );

      case 'sent_to_meta':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleQualify(lead.uuid)}
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Qualify
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleMarkAsSpam(lead.uuid)}
              disabled={isSubmitting}
            >
              <Ban className="w-4 h-4 mr-1" />
              Spam
            </Button>
          </div>
        );

      case 'contacted':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleQualify(lead.uuid)}
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Qualify
                </>
              )}
            </Button>
          </div>
        );

      case 'qualified':
        return (
          <Button
            size="sm"
            onClick={() => handleConvertClick(lead.uuid)}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-1" />
                Convert
              </>
            )}
          </Button>
        );

      case 'converted':
        return (
          <Badge className="bg-green-600 text-white">
            ✅ Converted
          </Badge>
        );

      case 'spam':
        return (
          <Badge className="bg-red-600 text-white">
            🚫 Spam
          </Badge>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Conversion Dashboard</h1>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading.leads}>
          <RefreshCw className={`w-4 h-4 ${loading.leads ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <p className="text-3xl font-bold">{stats?.total || 0}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Instant Form</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <p className="text-3xl font-bold">{stats?.by_source?.instant_form || 0}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Website</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <p className="text-3xl font-bold">{stats?.by_source?.website || 0}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <p className="text-3xl font-bold">
                {(stats?.by_source?.whatsapp_ad || 0) + (stats?.by_source?.whatsapp_organic || 0)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={filters.source || 'all'} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="instant_form">Instant Form</TabsTrigger>
              <TabsTrigger value="website">Website</TabsTrigger>
              <TabsTrigger value="whatsapp_ad">WhatsApp Ad</TabsTrigger>
              <TabsTrigger value="whatsapp_organic">WhatsApp Organic</TabsTrigger>
            </TabsList>

            <TabsContent value={filters.source || 'all'}>
              {loading.leads ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="ml-2">Loading leads...</span>
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No leads found</p>
                  <Button onClick={() => window.location.href = '/meta-settings'}>
                    Configure Meta Settings
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Contact</th>
                        <th className="text-left p-2">Source</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Campaign</th>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.uuid} className="border-b hover:bg-gray-50">
                          <td className="p-2">{lead.name || 'N/A'}</td>
                          <td className="p-2">
                            <div className="text-sm">
                              {lead.email && <div>📧 {lead.email}</div>}
                              {lead.phone && <div>📱 {lead.phone}</div>}
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge className={getSourceBadgeColor(lead.source)}>
                              {lead.source.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Badge className={getStatusBadgeColor(lead.status)}>
                              {getStatusLabel(lead.status)}
                            </Badge>
                          </td>
                          <td className="p-2 font-mono text-xs">
                            {lead.campaign_id || 'N/A'}
                          </td>
                          <td className="p-2 text-sm">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-2">
                            {renderActionButtons(lead)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Convert Dialog */}
      <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert Lead</DialogTitle>
            <DialogDescription>
              Mark this lead as converted and send Purchase event to Meta.
              Optionally enter the purchase amount.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">
              Purchase Amount (Optional)
            </label>
            <Input
              type="number"
              placeholder="Enter amount (e.g., 5000)"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
              disabled={loading.submitting}
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty if you don't want to track amount
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConvertDialogOpen(false)}
              disabled={loading.submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConvertConfirm}
              disabled={loading.submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading.submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Confirm Conversion
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConversionDashboard;
