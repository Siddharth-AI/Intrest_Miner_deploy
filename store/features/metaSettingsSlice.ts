import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = import.meta.env.VITE_INTEREST_MINER_API_URL;
interface MetaSettings {
  meta_pixel_id: string | null;
  meta_capi_token: string | null;
  whatsapp_phone: string | null;
  webhook_url: string | null;
  webhook_verify_token: string | null;
  is_meta_active: boolean;
  configured: boolean;
}

interface MetaSettingsState {
  settings: MetaSettings | null;
  loading: boolean;
  saving: boolean;
  testing: boolean;
  regenerating: boolean;
  error: string | null;
  testResult: {
    success: boolean;
    message: string;
  } | null;
}

const initialState: MetaSettingsState = {
  settings: null,
  loading: false,
  saving: false,
  testing: false,
  regenerating: false,
  error: null,
  testResult: null
};

// Async thunks
export const fetchMetaSettings = createAsyncThunk(
  'metaSettings/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/user-meta/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch settings');
    }
  }
);

export const updateMetaSettings = createAsyncThunk(
  'metaSettings/update',
  async (
    data: { meta_pixel_id: string; meta_capi_token: string; whatsapp_phone: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/user-meta/settings`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update settings');
    }
  }
);

export const testMetaConnection = createAsyncThunk(
  'metaSettings/test',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/user-meta/settings/test-connection`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Connection test failed');
    }
  }
);

export const regenerateWebhook = createAsyncThunk(
  'metaSettings/regenerate',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/user-meta/settings/regenerate-webhook`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to regenerate webhook');
    }
  }
);

// Slice
const metaSettingsSlice = createSlice({
  name: 'metaSettings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTestResult: (state) => {
      state.testResult = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch settings
    builder
      .addCase(fetchMetaSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetaSettings.fulfilled, (state, action: PayloadAction<MetaSettings>) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchMetaSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update settings
    builder
      .addCase(updateMetaSettings.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateMetaSettings.fulfilled, (state, action: PayloadAction<MetaSettings>) => {
        state.saving = false;
        state.settings = action.payload;
      })
      .addCase(updateMetaSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Test connection
    builder
      .addCase(testMetaConnection.pending, (state) => {
        state.testing = true;
        state.error = null;
        state.testResult = null;
      })
      .addCase(testMetaConnection.fulfilled, (state, action) => {
        state.testing = false;
        state.testResult = action.payload;
      })
      .addCase(testMetaConnection.rejected, (state, action) => {
        state.testing = false;
        state.error = action.payload as string;
      });

    // Regenerate webhook
    builder
      .addCase(regenerateWebhook.pending, (state) => {
        state.regenerating = true;
        state.error = null;
      })
      .addCase(regenerateWebhook.fulfilled, (state, action) => {
        state.regenerating = false;
        if (state.settings) {
          state.settings.webhook_url = action.payload.webhook_url;
          state.settings.webhook_verify_token = action.payload.webhook_verify_token;
        }
      })
      .addCase(regenerateWebhook.rejected, (state, action) => {
        state.regenerating = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, clearTestResult } = metaSettingsSlice.actions;
export default metaSettingsSlice.reducer;
