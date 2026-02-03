import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_INTEREST_MINER_API_URL;

interface Lead {
  uuid: string;
  user_uuid: string;
  source: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
  status: string;
  form_data: any;
  last_activity_at: string;
  created_at: string;
}

interface LeadStats {
  total: number;
  by_source: Record<string, number>;
  by_status: Record<string, number>;
}

interface WhatsAppSession {
  uuid: string;
  phone: string;
  contact_name: string | null;
  source: string;
  status: string;
  message_count: number;
  first_message_time: string;
  last_message_time: string;
  campaign_id: string | null;
}

interface ConversionState {
  leads: Lead[];
  whatsappSessions: WhatsAppSession[];
  stats: LeadStats | null;
  selectedLead: Lead | null;
  selectedSession: WhatsAppSession | null;
  sessionMessages: any[];
  loading: {
    leads: boolean;
    sessions: boolean;
    stats: boolean;
    sessionDetails: boolean;
    submitting: boolean;
  };
  error: string | null;
  filters: {
    source: string;
    status: string;
    limit: number;
  };
}

const initialState: ConversionState = {
  leads: [],
  whatsappSessions: [],
  stats: null,
  selectedLead: null,
  selectedSession: null,
  sessionMessages: [],
  loading: {
    leads: false,
    sessions: false,
    stats: false,
    sessionDetails: false,
    submitting: false
  },
  error: null,
  filters: {
    source: '',
    status: '',
    limit: 50
  }
};

// Async thunks
export const fetchLeads = createAsyncThunk(
  'conversion/fetchLeads',
  async (filters: { source?: string; status?: string; limit?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.source) params.append('source', filters.source);
      if (filters.status) params.append('status', filters.status);
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await axios.get(
        `${API_URL}/api/conversion/leads?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data.leads;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch leads');
    }
  }
);

export const fetchLeadStats = createAsyncThunk(
  'conversion/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/conversion/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch stats');
    }
  }
);

export const updateLeadStatus = createAsyncThunk(
  'conversion/updateLeadStatus',
  async ({ leadUuid, status }: { leadUuid: string; status: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/conversion/leads/${leadUuid}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update lead status');
    }
  }
);

export const submitInstantFormLead = createAsyncThunk(
  'conversion/submitInstantForm',
  async (data: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/conversion/instant-form`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit lead');
    }
  }
);

export const submitWebsiteLead = createAsyncThunk(
  'conversion/submitWebsite',
  async (data: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/conversion/website-lead`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit lead');
    }
  }
);

export const fetchWhatsAppSessions = createAsyncThunk(
  'conversion/fetchSessions',
  async (filters: { source?: string; status?: string; limit?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.source) params.append('source', filters.source);
      if (filters.status) params.append('status', filters.status);
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await axios.get(
        `${API_URL}/api/conversion/whatsapp/sessions?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data.sessions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch sessions');
    }
  }
);

export const fetchSessionDetails = createAsyncThunk(
  'conversion/fetchSessionDetails',
  async (sessionUuid: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/conversion/whatsapp/sessions/${sessionUuid}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch session details');
    }
  }
);

export const qualifyWhatsAppLead = createAsyncThunk(
  'conversion/qualifyLead',
  async (
    { sessionUuid, email, name }: { sessionUuid: string; email?: string; name?: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/conversion/whatsapp/sessions/${sessionUuid}/qualify`,
        { email, name },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to qualify lead');
    }
  }
);

// 🔥 NEW: Manual Meta event actions
export const sendLeadToMeta = createAsyncThunk(
  'conversion/sendLeadToMeta',
  async (leadUuid: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/conversion/leads/${leadUuid}/send-to-meta`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to send lead to Meta');
    }
  }
);

export const qualifyInstantFormLead = createAsyncThunk(
  'conversion/qualifyInstantFormLead',
  async (leadUuid: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/conversion/leads/${leadUuid}/qualify`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to qualify lead');
    }
  }
);

export const convertLead = createAsyncThunk(
  'conversion/convertLead',
  async ({ leadUuid, amount }: { leadUuid: string; amount?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/conversion/leads/${leadUuid}/convert`,
        { amount },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to convert lead');
    }
  }
);

export const markLeadAsSpam = createAsyncThunk(
  'conversion/markAsSpam',
  async (leadUuid: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/conversion/leads/${leadUuid}/spam`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark lead as spam');
    }
  }
);

// Slice
const conversionSlice = createSlice({
  name: 'conversion',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    },
    clearSelectedSession: (state) => {
      state.selectedSession = null;
      state.sessionMessages = [];
    }
  },
  extraReducers: (builder) => {
    // Fetch leads
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading.leads = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading.leads = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading.leads = false;
        state.error = action.payload as string;
      });

    // Fetch stats
    builder
      .addCase(fetchLeadStats.pending, (state) => {
        state.loading.stats = true;
      })
      .addCase(fetchLeadStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchLeadStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload as string;
      });

    // Update lead status
    builder
      .addCase(updateLeadStatus.pending, (state) => {
        state.loading.submitting = true;
      })
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        state.loading.submitting = false;
        // Update lead in list
        const index = state.leads.findIndex(l => l.uuid === action.payload.uuid);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      .addCase(updateLeadStatus.rejected, (state, action) => {
        state.loading.submitting = false;
        state.error = action.payload as string;
      });

    // Submit instant form
    builder
      .addCase(submitInstantFormLead.pending, (state) => {
        state.loading.submitting = true;
      })
      .addCase(submitInstantFormLead.fulfilled, (state) => {
        state.loading.submitting = false;
      })
      .addCase(submitInstantFormLead.rejected, (state, action) => {
        state.loading.submitting = false;
        state.error = action.payload as string;
      });

    // Submit website lead
    builder
      .addCase(submitWebsiteLead.pending, (state) => {
        state.loading.submitting = true;
      })
      .addCase(submitWebsiteLead.fulfilled, (state) => {
        state.loading.submitting = false;
      })
      .addCase(submitWebsiteLead.rejected, (state, action) => {
        state.loading.submitting = false;
        state.error = action.payload as string;
      });

    // Fetch WhatsApp sessions
    builder
      .addCase(fetchWhatsAppSessions.pending, (state) => {
        state.loading.sessions = true;
      })
      .addCase(fetchWhatsAppSessions.fulfilled, (state, action) => {
        state.loading.sessions = false;
        state.whatsappSessions = action.payload;
      })
      .addCase(fetchWhatsAppSessions.rejected, (state, action) => {
        state.loading.sessions = false;
        state.error = action.payload as string;
      });

    // Fetch session details
    builder
      .addCase(fetchSessionDetails.pending, (state) => {
        state.loading.sessionDetails = true;
      })
      .addCase(fetchSessionDetails.fulfilled, (state, action) => {
        state.loading.sessionDetails = false;
        state.selectedSession = action.payload.session;
        state.sessionMessages = action.payload.messages;
      })
      .addCase(fetchSessionDetails.rejected, (state, action) => {
        state.loading.sessionDetails = false;
        state.error = action.payload as string;
      });

    // Qualify lead
    builder
      .addCase(qualifyWhatsAppLead.pending, (state) => {
        state.loading.submitting = true;
      })
      .addCase(qualifyWhatsAppLead.fulfilled, (state, action) => {
        state.loading.submitting = false;
        // Update session in list
        const index = state.whatsappSessions.findIndex(s => s.uuid === action.payload.session.uuid);
        if (index !== -1) {
          state.whatsappSessions[index] = action.payload.session;
        }
        if (state.selectedSession) {
          state.selectedSession = action.payload.session;
        }
      })
      .addCase(qualifyWhatsAppLead.rejected, (state, action) => {
        state.loading.submitting = false;
        state.error = action.payload as string;
      });

    // 🔥 NEW: Send lead to Meta
    builder
      .addCase(sendLeadToMeta.pending, (state) => {
        state.loading.submitting = true;
      })
      .addCase(sendLeadToMeta.fulfilled, (state, action) => {
        state.loading.submitting = false;
        const index = state.leads.findIndex(l => l.uuid === action.payload.leadId);
        if (index !== -1) {
          state.leads[index].status = action.payload.status;
        }
      })
      .addCase(sendLeadToMeta.rejected, (state, action) => {
        state.loading.submitting = false;
        state.error = action.payload as string;
      });

    // 🔥 NEW: Qualify instant form/website lead
    builder
      .addCase(qualifyInstantFormLead.pending, (state) => {
        state.loading.submitting = true;
      })
      .addCase(qualifyInstantFormLead.fulfilled, (state, action) => {
        state.loading.submitting = false;
        const index = state.leads.findIndex(l => l.uuid === action.payload.leadId);
        if (index !== -1) {
          state.leads[index].status = action.payload.status;
        }
      })
      .addCase(qualifyInstantFormLead.rejected, (state, action) => {
        state.loading.submitting = false;
        state.error = action.payload as string;
      });

    // 🔥 NEW: Convert lead
    builder
      .addCase(convertLead.pending, (state) => {
        state.loading.submitting = true;
      })
      .addCase(convertLead.fulfilled, (state, action) => {
        state.loading.submitting = false;
        const index = state.leads.findIndex(l => l.uuid === action.payload.leadId);
        if (index !== -1) {
          state.leads[index].status = action.payload.status;
        }
      })
      .addCase(convertLead.rejected, (state, action) => {
        state.loading.submitting = false;
        state.error = action.payload as string;
      });

    // 🔥 NEW: Mark as spam
    builder
      .addCase(markLeadAsSpam.pending, (state) => {
        state.loading.submitting = true;
      })
      .addCase(markLeadAsSpam.fulfilled, (state, action) => {
        state.loading.submitting = false;
        const index = state.leads.findIndex(l => l.uuid === action.payload.leadId);
        if (index !== -1) {
          state.leads[index].status = action.payload.status;
        }
      })
      .addCase(markLeadAsSpam.rejected, (state, action) => {
        state.loading.submitting = false;
        state.error = action.payload as string;
      });
  }
});

export const { setFilters, clearError, clearSelectedLead, clearSelectedSession } = conversionSlice.actions;
export default conversionSlice.reducer;
