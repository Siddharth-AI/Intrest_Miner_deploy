/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/features/interestAttributionSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_INTEREST_MINER_API_URL}`;

// ===== Types =====
export interface Interest {
  interest_id: string;
  interest_name: string;
  detected_industry: string;
  adsets_count: number;
  total_spend: number;
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  avg_ctr: number;
  avg_cpc: number;
  avg_cpm: number;
  avg_cpa: number | null;
  avg_frequency: number;
  performance_score: number;
  ctr_vs_account_avg: number;
  cpc_vs_account_avg: number;
  attribution_confidence: number;
  attribution_confidence_label: string;
  tier: "Best" | "Good" | "Fair" | "Poor";
  interest_strength_score: number;
  data_quality: {
    label: string;
    confidence: number;
    color: string;
    description: string;
  };
  industry_benchmark: {
    benchmark_ctr: number;
    benchmark_cpc: number;
    benchmark_cpm: number;
    ctr_vs_benchmark: number;
    cpc_vs_benchmark: number;
  };
  historical_trend: {
    recent_period: {
      date: string;
      impressions: number;
      clicks: number;
      spend: number;
      conversions: number;
      ctr: number;
      cpc: number;
      cpa: number | null;
      performance_score: number;
      tier: string;
    };
    previous_period: {
      date: string;
      impressions: number;
      clicks: number;
      spend: number;
      conversions: number;
      ctr: number;
      cpc: number;
      cpa: number | null;
      performance_score: number;
      tier: string;
    };
    trends: {
      ctr_change: number;
      cpa_change: number;
      conversions_change: number;
      spend_change: number;
      score_change: number;
    };
    trend_direction: "improving" | "declining" | "stable";
    comparison_period: string;
    days_compared: number;
  };
  trend_alert?: {
    type: string;
    icon: string;
    message: string;
    details: string;
  };
  recommendation: string;
}

export interface InsufficientDataInterest {
  interest_id: string;
  interest_name: string;
  status: string;
  reason: string;
  total_adsets: number;
  total_impressions: number;
  total_clicks: number;
  total_spend: number;
  total_conversions: number;
  estimated_days_to_minimum: number;
  recommendation: string;
  next_steps: string[];
}

export interface AnalysisScope {
  user_uuid: string;
  ad_account_id: string;
  campaign_id: string;
  campaign_name: string;
  filtered: boolean;
  warning: string | null;
}

export interface AccountAverage {
  ctr: number;
  cpc: number;
  cpm: number;
  cpa: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface IndustryBreakdown {
  [key: string]: {
    industry_name: string;
    interests_count: number;
    avg_score: number;
  };
}

export interface InterestPerformanceData {
  success: boolean;
  analysis_scope: AnalysisScope;
  interests: Interest[];
  insufficient_data: InsufficientDataInterest[];
  account_average: AccountAverage;
  total_interests: number;
  best_interests: Interest[];
  good_interests: Interest[];
  fair_interests: Interest[];
  poor_interests: Interest[];
  industry_breakdown: IndustryBreakdown;
  summary: {
    total_interests: number;
    scored_interests: number;
    insufficient_data: number;
    data_quality_distribution: {
      high: number;
      medium: number;
      low: number;
    };
  };
}

interface InterestAttributionState {
  data: InterestPerformanceData | null;
  loading: boolean;
  error: string | null;
  selectedTier: "all" | "Best" | "Good" | "Fair" | "Poor";
  selectedIndustry: string | null;
  searchTerm: string;
  sortBy: "performance_score" | "total_spend" | "total_conversions" | "avg_ctr" | "avg_cpc";
  sortOrder: "asc" | "desc";
}

const initialState: InterestAttributionState = {
  data: null,
  loading: false,
  error: null,
  selectedTier: "all",
  selectedIndustry: null,
  searchTerm: "",
  sortBy: "performance_score",
  sortOrder: "desc",
};

// ===== Async Thunks =====

export const fetchInterestPerformance = createAsyncThunk(
  "interestAttribution/fetchPerformance",
  async ({
    adAccountId,
    campaignId
  }: {
    adAccountId: string;
    campaignId?: string;
  }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authorization token found");

      let url = `${API_BASE_URL}/api/interest-attribution/calculate?ad_account_id=${adAccountId}`;
      if (campaignId) {
        url += `&campaign_id=${campaignId}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch interest performance"
      );
    }
  }
);

// ===== Slice =====

const interestAttributionSlice = createSlice({
  name: "interestAttribution",
  initialState,
  reducers: {
    setSelectedTier: (state, action: PayloadAction<"all" | "Best" | "Good" | "Fair" | "Poor">) => {
      state.selectedTier = action.payload;
    },
    setSelectedIndustry: (state, action: PayloadAction<string | null>) => {
      state.selectedIndustry = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action: PayloadAction<"performance_score" | "total_spend" | "total_conversions" | "avg_ctr" | "avg_cpc">) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Interest Performance
      .addCase(fetchInterestPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterestPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchInterestPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.data = null;
      });
  },
});

export const {
  setSelectedTier,
  setSelectedIndustry,
  setSearchTerm,
  setSortBy,
  setSortOrder,
  clearError,
} = interestAttributionSlice.actions;

export default interestAttributionSlice.reducer;
