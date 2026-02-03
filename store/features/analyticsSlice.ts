import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = import.meta.env.VITE_INTEREST_MINER_API_URL;
interface DashboardStats {
  total_leads: number;
  whatsapp_sessions: number;
  conversion_rate: number;
  followups_needed: number;
  period: string;
}

interface TrendData {
  date: string;
  instant_form: number;
  website: number;
  whatsapp: number;
  total: number;
}

interface CampaignData {
  campaign_id: string;
  source: string;
  total_leads: number;
  converted_leads: number;
  conversion_rate: number;
}

interface Insight {
  type: string;
  severity: string;
  title: string;
  message: string;
  action: string;
}

interface FollowupData {
  leads: any[];
  whatsapp_sessions: any[];
  total_followups: number;
}

interface AnalyticsState {
  dashboardStats: DashboardStats | null;
  trends: TrendData[];
  campaigns: CampaignData[];
  insights: { insights: Insight[] } | null;
  followups: FollowupData | null;
  peakHours: any[];
  loading: {
    dashboard: boolean;
    trends: boolean;
    campaigns: boolean;
    insights: boolean;
    followups: boolean;
    peakHours: boolean;
  };
  error: string | null;
  dateRange: 'today' | 'week' | 'month';
}

const initialState: AnalyticsState = {
  dashboardStats: null,
  trends: [],
  campaigns: [],
  insights: null,
  followups: null,
  peakHours: [],
  loading: {
    dashboard: false,
    trends: false,
    campaigns: false,
    insights: false,
    followups: false,
    peakHours: false
  },
  error: null,
  dateRange: 'today'
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'analytics/fetchDashboard',
  async (range: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/analytics/dashboard?range=${range}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchTrends = createAsyncThunk(
  'analytics/fetchTrends',
  async (days: number = 7, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/analytics/trends?days=${days}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch trends');
    }
  }
);

export const fetchCampaigns = createAsyncThunk(
  'analytics/fetchCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/analytics/campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch campaigns');
    }
  }
);

export const fetchInsights = createAsyncThunk(
  'analytics/fetchInsights',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/analytics/insights`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch insights');
    }
  }
);

export const fetchFollowups = createAsyncThunk(
  'analytics/fetchFollowups',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/analytics/followups`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch followups');
    }
  }
);

export const fetchPeakHours = createAsyncThunk(
  'analytics/fetchPeakHours',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/analytics/peak-hours`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch peak hours');
    }
  }
);

// Fetch all analytics data at once
export const fetchAllAnalytics = createAsyncThunk(
  'analytics/fetchAll',
  async (range: string, { dispatch }) => {
    await Promise.all([
      dispatch(fetchDashboardStats(range)),
      dispatch(fetchTrends(7)),
      dispatch(fetchCampaigns()),
      dispatch(fetchInsights()),
      dispatch(fetchFollowups()),
      dispatch(fetchPeakHours())
    ]);
  }
);

// Slice
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<'today' | 'week' | 'month'>) => {
      state.dateRange = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.dashboard = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading.dashboard = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.error = action.payload as string;
      });

    // Trends
    builder
      .addCase(fetchTrends.pending, (state) => {
        state.loading.trends = true;
      })
      .addCase(fetchTrends.fulfilled, (state, action) => {
        state.loading.trends = false;
        state.trends = action.payload;
      })
      .addCase(fetchTrends.rejected, (state, action) => {
        state.loading.trends = false;
        state.error = action.payload as string;
      });

    // Campaigns
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading.campaigns = true;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading.campaigns = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading.campaigns = false;
        state.error = action.payload as string;
      });

    // Insights
    builder
      .addCase(fetchInsights.pending, (state) => {
        state.loading.insights = true;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading.insights = false;
        state.insights = action.payload;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading.insights = false;
        state.error = action.payload as string;
      });

    // Followups
    builder
      .addCase(fetchFollowups.pending, (state) => {
        state.loading.followups = true;
      })
      .addCase(fetchFollowups.fulfilled, (state, action) => {
        state.loading.followups = false;
        state.followups = action.payload;
      })
      .addCase(fetchFollowups.rejected, (state, action) => {
        state.loading.followups = false;
        state.error = action.payload as string;
      });

    // Peak hours
    builder
      .addCase(fetchPeakHours.pending, (state) => {
        state.loading.peakHours = true;
      })
      .addCase(fetchPeakHours.fulfilled, (state, action) => {
        state.loading.peakHours = false;
        state.peakHours = action.payload;
      })
      .addCase(fetchPeakHours.rejected, (state, action) => {
        state.loading.peakHours = false;
        state.error = action.payload as string;
      });
  }
});

export const { setDateRange, clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
