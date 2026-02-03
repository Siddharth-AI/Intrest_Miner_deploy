import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, RefreshCw, MessageSquare } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchWhatsAppSessions,
  fetchSessionDetails,
  qualifyWhatsAppLead,
  clearError,
  clearSelectedSession
} from '../../../store/features/conversionSlice';
import { toast } from 'sonner';

const WhatsAppSessions = () => {
  const dispatch = useAppDispatch();
  const {
    whatsappSessions,
    selectedSession,
    sessionMessages,
    loading,
    error
  } = useAppSelector((state) => state.conversion);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [qualifyDialogOpen, setQualifyDialogOpen] = useState(false);
  const [qualifyForm, setQualifyForm] = useState({ email: '', name: '' });

  useEffect(() => {
    dispatch(fetchWhatsAppSessions({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchWhatsAppSessions({}));
    toast.success('Sessions refreshed');
  };

  const handleViewChat = async (sessionUuid: string) => {
    await dispatch(fetchSessionDetails(sessionUuid));
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    dispatch(clearSelectedSession());
  };

  const handleQualifyClick = () => {
    setQualifyDialogOpen(true);
  };

  const handleQualifySubmit = async () => {
    if (!selectedSession || !qualifyForm.email) {
      toast.error('Email is required');
      return;
    }

    const result = await dispatch(
      qualifyWhatsAppLead({
        sessionUuid: selectedSession.uuid,
        email: qualifyForm.email,
        name: qualifyForm.name
      })
    );

    if (qualifyWhatsAppLead.fulfilled.match(result)) {
      toast.success('Lead qualified successfully!');
      setQualifyDialogOpen(false);
      setQualifyForm({ email: '', name: '' });
      dispatch(fetchWhatsAppSessions({}));
    }
  };

  const getSourceBadgeColor = (source: string) => {
    return source === 'whatsapp_ad' ? 'bg-purple-500 text-white' : 'bg-gray-500 text-white';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-500 text-white';
      case 'contacted':
        return 'bg-blue-500 text-white';
      case 'lead':
        return 'bg-green-500 text-white';
      case 'qualified':
        return 'bg-purple-500 text-white';
      case 'converted':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">WhatsApp Sessions</h1>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading.sessions}>
          <RefreshCw className={`w-4 h-4 ${loading.sessions ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chat Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading.sessions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading sessions...</span>
            </div>
          ) : whatsappSessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No WhatsApp sessions found</p>
              <p className="text-sm text-gray-400">
                Configure your webhook in AiSensy to start receiving messages
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Contact</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">Source</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Messages</th>
                    <th className="text-left p-2">Last Message</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {whatsappSessions.map((session) => (
                    <tr key={session.uuid} className="border-b hover:bg-gray-50">
                      <td className="p-2">{session.contact_name || 'Unknown'}</td>
                      <td className="p-2 font-mono text-sm">{session.phone}</td>
                      <td className="p-2">
                        <Badge className={getSourceBadgeColor(session.source)}>
                          {session.source === 'whatsapp_ad' ? 'Ad' : 'Organic'}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge className={getStatusBadgeColor(session.status)}>
                          {session.status}
                        </Badge>
                      </td>
                      <td className="p-2">{session.message_count}</td>
                      <td className="p-2 text-sm">
                        {new Date(session.last_message_time).toLocaleString()}
                      </td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewChat(session.uuid)}
                        >
                          View Chat
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Chat with {selectedSession?.contact_name || selectedSession?.phone}
            </DialogTitle>
          </DialogHeader>

          {loading.sessionDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading messages...</span>
            </div>
          ) : selectedSession && (
            <div>
              <div className="mb-4 p-4 bg-gray-100 rounded">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>Phone:</strong> {selectedSession.phone}
                  </div>
                  <div>
                    <strong>Source:</strong>{' '}
                    <Badge className={getSourceBadgeColor(selectedSession.source)}>
                      {selectedSession.source}
                    </Badge>
                  </div>
                  <div>
                    <strong>Status:</strong>{' '}
                    <Badge className={getStatusBadgeColor(selectedSession.status)}>
                      {selectedSession.status}
                    </Badge>
                  </div>
                  <div>
                    <strong>Messages:</strong> {selectedSession.message_count}
                  </div>
                  {selectedSession.campaign_id && (
                    <div className="col-span-2">
                      <strong>Campaign:</strong>{' '}
                      <span className="font-mono text-xs">{selectedSession.campaign_id}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                {sessionMessages.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No messages</div>
                ) : (
                  sessionMessages.map((msg: any) => (
                    <div
                      key={msg.uuid}
                      className={`p-3 rounded ${
                        msg.sender === 'user'
                          ? 'bg-blue-100 ml-8'
                          : 'bg-gray-100 mr-8'
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        {msg.sender === 'user' ? 'Customer' : 'Agent'} •{' '}
                        {new Date(msg.timestamp).toLocaleString()}
                      </div>
                      <div>{msg.message_text}</div>
                    </div>
                  ))
                )}
              </div>

              {selectedSession.source === 'whatsapp_ad' &&
                selectedSession.status !== 'qualified' &&
                selectedSession.status !== 'converted' && (
                  <Button
                    onClick={handleQualifyClick}
                    className="w-full"
                    disabled={loading.submitting}
                  >
                    {loading.submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Qualifying...
                      </>
                    ) : (
                      'Qualify Lead'
                    )}
                  </Button>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Qualify Lead Dialog */}
      <Dialog open={qualifyDialogOpen} onOpenChange={setQualifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Qualify Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
                value={qualifyForm.email}
                onChange={(e) => setQualifyForm({ ...qualifyForm, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={qualifyForm.name}
                onChange={(e) => setQualifyForm({ ...qualifyForm, name: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleQualifySubmit} disabled={loading.submitting} className="flex-1">
                {loading.submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Qualifying...
                  </>
                ) : (
                  'Qualify'
                )}
              </Button>
              <Button variant="outline" onClick={() => setQualifyDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhatsAppSessions;
