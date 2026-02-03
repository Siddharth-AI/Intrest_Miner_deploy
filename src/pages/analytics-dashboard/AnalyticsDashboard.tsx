import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MessageSquare, 
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchAllAnalytics,
  setDateRange,
  clearError
} from '../../../store/features/analyticsSlice';
import { toast } from 'sonner';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AnalyticsDashboard = () => {
  const dispatch = useAppDispatch();
  const {
    dashboardStats,
    trends,
    campaigns,
    insights,
    followups,
    loading,
    error,
    dateRange
  } = useAppSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAllAnalytics(dateRange));
  }, [dispatch, dateRange]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAllAnalytics(dateRange));
    toast.success('Analytics refreshed');
  };

  const handleDateRangeChange = (range: 'today' | 'week' | 'month') => {
    dispatch(setDateRange(range));
  };

  const getInsightIcon = (severity: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getInsightBgColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Prepare chart data
  const sourceData = (trends || []).reduce((acc: any[], trend) => {
    const existing = acc.find(item => item.name === 'instant_form');
    if (!existing) {
      acc.push(
        { name: 'Instant Form', value: (trends || []).reduce((sum, t) => sum + (t.instant_form || 0), 0) },
        { name: 'Website', value: (trends || []).reduce((sum, t) => sum + (t.website || 0), 0) },
        { name: 'WhatsApp', value: (trends || []).reduce((sum, t) => sum + (t.whatsapp || 0), 0) }
      );
    }
    return acc;
  }, []).filter(item => item.value > 0);

  if (loading.dashboard && !dashboardStats) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <Tabs value={dateRange} onValueChange={(value) => handleDateRangeChange(value as any)}>
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading.dashboard}>
            <RefreshCw className={`w-4 h-4 ${loading.dashboard ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.total_leads || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              {dateRange === 'today' ? 'Today' : dateRange === 'week' ? 'This week' : 'This month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp Sessions</CardTitle>
            <MessageSquare className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.whatsapp_sessions || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Active conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.conversion_rate || 0}%</div>
            <p className="text-xs text-gray-500 mt-1">Qualified leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Need Follow-up</CardTitle>
            <Clock className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.followups_needed || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Pending actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      {insights && insights.insights && insights.insights.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Insights & Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.insights.map((insight, index) => (
              <Alert key={index} className={getInsightBgColor(insight.severity)}>
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.severity)}
                  <div className="flex-1">
                    <div className="font-semibold">{insight.title}</div>
                    <AlertDescription className="mt-1">{insight.message}</AlertDescription>
                    {insight.action && (
                      <p className="text-sm mt-2 font-medium">💡 {insight.action}</p>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Lead Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.trends ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (trends || []).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Total" strokeWidth={2} />
                  <Line type="monotone" dataKey="website" stroke="#10b981" name="Website" />
                  <Line type="monotone" dataKey="whatsapp" stroke="#f59e0b" name="WhatsApp" />
                  <Line type="monotone" dataKey="instant_form" stroke="#ef4444" name="Instant Form" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No trend data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Leads by Source</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.trends ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (sourceData || []).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No source data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      {campaigns && campaigns.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Top Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.campaigns ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Campaign ID</th>
                      <th className="text-left p-2">Source</th>
                      <th className="text-right p-2">Total Leads</th>
                      <th className="text-right p-2">Converted</th>
                      <th className="text-right p-2">Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-sm">{campaign.campaign_id}</td>
                        <td className="p-2">
                          <Badge variant="outline">{campaign.source}</Badge>
                        </td>
                        <td className="text-right p-2">{campaign.total_leads}</td>
                        <td className="text-right p-2">{campaign.converted_leads}</td>
                        <td className="text-right p-2 font-semibold">{campaign.conversion_rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Follow-ups Needed */}
      {followups && followups.total_followups > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Leads Needing Follow-up ({followups.total_followups})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.followups ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <Tabs defaultValue="whatsapp">
                <TabsList>
                  <TabsTrigger value="whatsapp">
                    WhatsApp ({followups.whatsapp_sessions?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="regular">
                    Regular ({followups.leads?.length || 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="whatsapp">
                  <div className="space-y-2">
                    {followups.whatsapp_sessions && followups.whatsapp_sessions.length > 0 ? (
                      followups.whatsapp_sessions.map((session: any) => (
                        <div key={session.uuid} className="p-3 border rounded flex justify-between items-center hover:bg-gray-50">
                          <div>
                            <div className="font-semibold">{session.contact_name || session.phone}</div>
                            <div className="text-sm text-gray-500">
                              Last message: {session.hours_since_message}h ago • {session.message_count} messages
                            </div>
                          </div>
                          <Badge>{session.status}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">No WhatsApp follow-ups needed</div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="regular">
                  <div className="space-y-2">
                    {followups.leads && followups.leads.length > 0 ? (
                      followups.leads.map((lead: any) => (
                        <div key={lead.uuid} className="p-3 border rounded flex justify-between items-center hover:bg-gray-50">
                          <div>
                            <div className="font-semibold">{lead.name || lead.email || lead.phone}</div>
                            <div className="text-sm text-gray-500">
                              {lead.hours_since_activity}h ago • {lead.source}
                            </div>
                          </div>
                          <Badge variant="outline">{lead.status}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">No regular follow-ups needed</div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading.dashboard && dashboardStats?.total_leads === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No leads yet</h3>
              <p className="text-gray-500 mb-4">
                Start tracking leads by configuring your Meta settings and sending test leads.
              </p>
              <Button onClick={() => window.location.href = '/meta-settings'}>
                Configure Meta Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
