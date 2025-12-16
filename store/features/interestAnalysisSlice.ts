// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// // ========== TYPES ==========
// export interface AvailableCampaign {
//   id: string;
//   name: string;
//   status: string;
//   objective: string;
//   daily_budget?: string;
//   start_time: string;
//   stop_time?: string;
//   is_tracking: boolean;
//   in_database: boolean;
// }

// export interface TrackedCampaign {
//   campaign_id: string;
//   campaign_name: string;
//   status: string;
//   objective: string;
//   daily_budget: string | null;
//   is_tracking_enabled: number;
//   tracking_enabled_at: string;
//   last_synced_at: string;
// }

// export interface TrackingStats {
//   total_campaigns: number;
//   tracking_count: string;
//   not_tracking_count: string;
//   last_sync_time: string;
// }

// export interface InterestAnalysis {
//   interestId: string;
//   interestName: string;
//   adsetId: string;
//   adsetName: string;
//   performanceScore: number;
//   historicalScore: number;
//   correlationScore: number;
//   audienceSizeScore: number;
//   categoryScore: number;
//   predictionConfidence: number;
//   classification: string;
//   crossAdsetAppearances: number;
//   avgPerformanceAcrossAdsets: number;
//   recommendations: string[];
// }

// export interface InterestAnalysisResult {
//   campaignId: string;
//   campaignName: string;
//   latestAnalysisDate: string;
//   interests: InterestAnalysis[];
//   summary: {
//     excellent: number;
//     good: number;
//     average: number;
//     poor: number;
//     noData: number;
//     totalInterests: number;
//   };
// }

// export interface InterestHistory {
//   interestId: string;
//   interestName: string;
//   history: Array<{
//     date: string;
//     score: number;
//     metrics: {
//       ctr: number;
//       frequency: number;
//       spend: number;
//       leads: number;
//       costPerLead: number;
//     };
//   }>;
//   trend: string;
//   changePercent: string;
//   daysTracked: number;
// }

// export interface InterestHistoryData {
//   campaignId: string;
//   campaignName: string;
//   objective: string;
//   daysRequested: number;
//   daysAvailable: number;
//   interests: InterestHistory[];
//   campaignSummary: Array<{
//     date: string;
//     totalInterests: number;
//     avgScore: string;
//     distribution: {
//       excellent: string;
//       good: string;
//       average: string;
//       poor: string;
//     };
//   }>;
// }

// export interface AdsetBreakdown {
//   adsetId: string;
//   adsetName: string;
//   performanceScore: number;
//   classification: string;
//   historicalScore: number;
//   correlationScore: number;
//   audienceSizeScore: number;
//   categoryScore: number;
//   predictionConfidence: number;
//   recommendations: string[];
// }

// export interface InterestBreakdownData {
//   interestId: string;
//   interestName: string;
//   campaignId: string;
//   totalAdsets: number;
//   aggregatedStats: {
//     avgScore: number;
//     maxScore: number;
//     minScore: number;
//     consistency: string;
//   };
//   adsetPerformance: AdsetBreakdown[];
//   insights: string[];
// }

// interface InterestAnalysisState {
//   // Campaign Management
//   availableCampaigns: AvailableCampaign[];
//   trackedCampaigns: TrackedCampaign[];
//   trackingStats: TrackingStats | null;
//   selectedAdAccount: string;
//   selectedCampaignIds: string[]; // For multi-select (max 3)
//   selectedTrackedCampaignIds: string[];

//   // Analysis Data
//   analysisResult: InterestAnalysisResult | null;
//   historyData: InterestHistoryData | null;
//   breakdownData: InterestBreakdownData | null;

//   // Loading States
//   loading: boolean;
//   tracking: boolean;
//   analyzing: boolean;
//   stopping: boolean;

//   // Error
//   error: string | null;

//   // Current View
//   activeTab: "interest" | "campaign-fatigue" | "creative-fatigue" | "forecast";
//   selectedCampaignForView: string | null;
// }

// const initialState: InterestAnalysisState = {
//   availableCampaigns: [],
//   trackedCampaigns: [],
//   trackingStats: null,
//   selectedAdAccount: "",
//   selectedCampaignIds: [],
//   selectedTrackedCampaignIds: [], // 🔥 ADD THIS NEW LINE
//   analysisResult: null,
//   historyData: null,
//   breakdownData: null,
//   loading: false,
//   tracking: false,
//   analyzing: false,
//   stopping: false,
//   error: null,
//   activeTab: "interest",
//   selectedCampaignForView: null,
// };

// const getAccessToken = () => localStorage.getItem("token");
// const BASE_URL = import.meta.env.VITE_INTEREST_MINER_API_URL;

// // ========== ASYNC THUNKS ==========

// // 1. Fetch Available Campaigns
// export const fetchAvailableCampaigns = createAsyncThunk(
//   "interestAnalysis/fetchAvailableCampaigns",
//   async (adAccountId: string, { rejectWithValue }) => {
//     const token = getAccessToken();
//     if (!token) return rejectWithValue("No access token found");
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/tracking/campaigns/available/${adAccountId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//       const data = await res.json();
//       return data.data;
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to fetch available campaigns");
//     }
//   }
// );

// // 2. Track Selected Campaigns
// export const trackSelectedCampaigns = createAsyncThunk(
//   "interestAnalysis/trackSelectedCampaigns",
//   async (
//     params: { campaignIds: string[]; adAccountId: string },
//     { rejectWithValue, dispatch }
//   ) => {
//     const token = getAccessToken();
//     if (!token) return rejectWithValue("No access token found");
//     try {
//       const res = await fetch(`${BASE_URL}/api/tracking/campaigns/track-selected`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(params),
//       });
//       if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//       const data = await res.json();

//       // 🔥 Trigger immediate analysis after tracking
//       dispatch(triggerImmediateAnalysis(params.campaignIds));

//       return data.data;
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to track campaigns");
//     }
//   }
// );

// // 3. Fetch Tracked Campaigns
// export const fetchTrackedCampaigns = createAsyncThunk(
//   "interestAnalysis/fetchTrackedCampaigns",
//   async (_, { rejectWithValue }) => {
//     const token = getAccessToken();
//     if (!token) return rejectWithValue("No access token found");
//     try {
//       const res = await fetch(`${BASE_URL}/api/tracking/campaigns/tracked`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//       const data = await res.json();
//       return data.data;
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to fetch tracked campaigns");
//     }
//   }
// );

// // 4. Fetch Tracking Stats
// export const fetchTrackingStats = createAsyncThunk(
//   "interestAnalysis/fetchTrackingStats",
//   async (_, { rejectWithValue }) => {
//     const token = getAccessToken();
//     if (!token) return rejectWithValue("No access token found");
//     try {
//       const res = await fetch(`${BASE_URL}/api/tracking/stats`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//       const data = await res.json();
//       return data.data;
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to fetch tracking stats");
//     }
//   }
// );

// // 5. Stop Tracking Single Campaign
// export const stopTrackingCampaign = createAsyncThunk(
//   "interestAnalysis/stopTrackingCampaign",
//   async (campaignId: string, { rejectWithValue, dispatch }) => {
//     const token = getAccessToken();
//     if (!token) return rejectWithValue("No access token found");
//     try {
//       const res = await fetch(`${BASE_URL}/api/tracking/campaigns/stop`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ campaignId }),
//       });
//       if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//       const data = await res.json();

//       // Refresh tracked campaigns
//       dispatch(fetchTrackedCampaigns());

//       return { campaignId, message: data.message };
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to stop tracking");
//     }
//   }
// );

// // 6. Stop Tracking Multiple Campaigns
// export const stopTrackingBulk = createAsyncThunk(
//   "interestAnalysis/stopTrackingBulk",
//   async (campaignIds: string[], { rejectWithValue, dispatch }) => {
//     const token = getAccessToken();
//     if (!token) return rejectWithValue("No access token found");
//     try {
//       const res = await fetch(`${BASE_URL}/api/tracking/campaigns/stop-bulk`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ campaignIds }),
//       });
//       if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//       const data = await res.json();

//       // Refresh tracked campaigns
//       dispatch(fetchTrackedCampaigns());

//       return { campaignIds, message: data.message };
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to stop tracking campaigns");
//     }
//   }
// );

// // 7. Trigger Immediate Analysis
// export const triggerImmediateAnalysis = createAsyncThunk(
//   "interestAnalysis/triggerImmediateAnalysis",
//   async (campaignIds: string[], { rejectWithValue }) => {
//     const token = getAccessToken();
//     if (!token) return rejectWithValue("No access token found");
//     try {
//       const results = await Promise.all(
//         campaignIds.map(async (campaignId) => {
//           const res = await fetch(`${BASE_URL}/api/analysis/immediate`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ campaignId }),
//           });
//           if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//           return res.json();
//         })
//       );
//       return results.map(r => r.data);
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to trigger analysis");
//     }
//   }
// );

// // 8. Get Interest Analysis Result
// export const getInterestAnalysisResult = createAsyncThunk(
//   "interestAnalysis/getResult",
//   async (campaignId: string, { rejectWithValue }) => {
//     const token = getAccessToken();
//     if (!token) return rejectWithValue("No access token found");
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/analysis/interest/campaign/${campaignId}/result`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//       const data = await res.json();
//       return data.data;
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to get analysis result");
//     }
//   }
// );

// // 9. Get Interest Analysis History
// export const getInterestAnalysisHistory = createAsyncThunk(
//   "interestAnalysis/getHistory",
//   async (campaignId: string, { rejectWithValue }) => {
//     const token = getAccessToken();
//     if (!token) return rejectWithValue("No access token found");
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/analysis/interest/campaign/${campaignId}/history`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//       const data = await res.json();
//       return data.data;
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to get analysis history");
//     }
//   }
// );

// // 10. Get Interest Breakdown
// export const getInterestBreakdown = createAsyncThunk(
//   "interestAnalysis/getBreakdown",
//   async (
//     params: { campaignId: string; interestId: string },
//     { rejectWithValue }
//   ) => {
//     const token = getAccessToken();
//     if (!token) return rejectWithValue("No access token found");
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/analysis/interest/${params.interestId}/campaign/${params.campaignId}/breakdown`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//       const data = await res.json();
//       return data.data;
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to get interest breakdown");
//     }
//   }
// );

// // ========== SLICE ==========
// const interestAnalysisSlice = createSlice({
//   name: "interestAnalysis",
//   initialState,
//   reducers: {
//     setSelectedAdAccount: (state, action: PayloadAction<string>) => {
//       state.selectedAdAccount = action.payload;
//       state.selectedCampaignIds = [];
//     },
//     toggleCampaignSelection: (state, action: PayloadAction<string>) => {
//       const campaignId = action.payload;
//       const index = state.selectedCampaignIds.indexOf(campaignId);
//       if (index > -1) {
//         state.selectedCampaignIds.splice(index, 1);
//       } else {
//         if (state.selectedCampaignIds.length < 3) {
//           state.selectedCampaignIds.push(campaignId);
//         }
//       }
//     },
//     clearCampaignSelection: (state) => {
//       state.selectedCampaignIds = [];
//     },
//     setActiveTab: (
//       state,
//       action: PayloadAction<
//         "interest" | "campaign-fatigue" | "creative-fatigue" | "forecast"
//       >
//     ) => {
//       state.activeTab = action.payload;
//     },
//     setSelectedCampaignForView: (state, action: PayloadAction<string | null>) => {
//       state.selectedCampaignForView = action.payload;
//     },
//     clearAnalysisData: (state) => {
//       state.analysisResult = null;
//       state.historyData = null;
//       state.breakdownData = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearBreakdown: (state) => {
//       state.breakdownData = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Available Campaigns
//       .addCase(fetchAvailableCampaigns.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAvailableCampaigns.fulfilled, (state, action) => {
//         state.loading = false;
//         state.availableCampaigns = action.payload.campaigns || [];
//       })
//       .addCase(fetchAvailableCampaigns.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Track Selected Campaigns
//       .addCase(trackSelectedCampaigns.pending, (state) => {
//         state.tracking = true;
//         state.error = null;
//       })
//       .addCase(trackSelectedCampaigns.fulfilled, (state) => {
//         state.tracking = false;
//         state.selectedCampaignIds = [];
//       })
//       .addCase(trackSelectedCampaigns.rejected, (state, action) => {
//         state.tracking = false;
//         state.error = action.payload as string;
//       })

//       // Fetch Tracked Campaigns
//       .addCase(fetchTrackedCampaigns.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchTrackedCampaigns.fulfilled, (state, action) => {
//         state.loading = false;
//         state.trackedCampaigns = action.payload.campaigns || [];
//       })
//       .addCase(fetchTrackedCampaigns.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Fetch Tracking Stats
//       .addCase(fetchTrackingStats.fulfilled, (state, action) => {
//         state.trackingStats = action.payload;
//       })

//       // Stop Tracking
//       .addCase(stopTrackingCampaign.pending, (state) => {
//         state.stopping = true;
//       })
//       .addCase(stopTrackingCampaign.fulfilled, (state) => {
//         state.stopping = false;
//       })
//       .addCase(stopTrackingCampaign.rejected, (state, action) => {
//         state.stopping = false;
//         state.error = action.payload as string;
//       })

//       // Stop Tracking Bulk
//       .addCase(stopTrackingBulk.pending, (state) => {
//         state.stopping = true;
//       })
//       .addCase(stopTrackingBulk.fulfilled, (state) => {
//         state.stopping = false;
//       })
//       .addCase(stopTrackingBulk.rejected, (state, action) => {
//         state.stopping = false;
//         state.error = action.payload as string;
//       })

//       // Trigger Immediate Analysis
//       .addCase(triggerImmediateAnalysis.pending, (state) => {
//         state.analyzing = true;
//       })
//       .addCase(triggerImmediateAnalysis.fulfilled, (state) => {
//         state.analyzing = false;
//       })
//       .addCase(triggerImmediateAnalysis.rejected, (state, action) => {
//         state.analyzing = false;
//         state.error = action.payload as string;
//       })

//       // Get Analysis Result
//       .addCase(getInterestAnalysisResult.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getInterestAnalysisResult.fulfilled, (state, action) => {
//         state.loading = false;
//         state.analysisResult = action.payload;
//       })
//       .addCase(getInterestAnalysisResult.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Get Analysis History
//       .addCase(getInterestAnalysisHistory.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getInterestAnalysisHistory.fulfilled, (state, action) => {
//         state.loading = false;
//         state.historyData = action.payload;
//       })
//       .addCase(getInterestAnalysisHistory.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Get Interest Breakdown
//       .addCase(getInterestBreakdown.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getInterestBreakdown.fulfilled, (state, action) => {
//         state.loading = false;
//         state.breakdownData = action.payload;
//       })
//       .addCase(getInterestBreakdown.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const {
//   setSelectedAdAccount,
//   toggleCampaignSelection,
//   clearCampaignSelection,
//   setActiveTab,
//   setSelectedCampaignForView,
//   clearAnalysisData,
//   clearError,
//   clearBreakdown,
// } = interestAnalysisSlice.actions;

// export default interestAnalysisSlice.reducer;


/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// ========== TYPES ==========
export interface AvailableCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  daily_budget?: string;
  start_time: string;
  stop_time?: string;
  is_tracking: boolean;
  in_database: boolean;
}

export interface TrackedCampaign {
  campaign_id: string;
  campaign_name: string;
  status: string;
  objective: string;
  daily_budget: string | null;
  is_tracking_enabled: number;
  tracking_enabled_at: string;
  last_synced_at: string;
}

export interface TrackingStats {
  total_campaigns: number;
  tracking_count: string;
  not_tracking_count: string;
  last_sync_time: string;
}

export interface InterestAnalysis {
  interestId: string;
  interestName: string;
  adsetId: string;
  adsetName: string;
  performanceScore: number;
  historicalScore: number;
  correlationScore: number;
  audienceSizeScore: number;
  categoryScore: number;
  predictionConfidence: number;
  classification: string;
  crossAdsetAppearances: number;
  avgPerformanceAcrossAdsets: number;
  recommendations: string[];
}

export interface InterestAnalysisResult {
  campaignId: string;
  campaignName: string;
  latestAnalysisDate: string;
  interests: InterestAnalysis[];
  summary: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
    noData: number;
    totalInterests: number;
  };
}

export interface InterestHistory {
  interestId: string;
  interestName: string;
  history: Array<{
    date: string;
    score: number;
    metrics: {
      ctr: number;
      frequency: number;
      spend: number;
      leads: number;
      costPerLead: number;
    };
  }>;
  trend: string;
  changePercent: string;
  daysTracked: number;
}

export interface InterestHistoryData {
  campaignId: string;
  campaignName: string;
  objective: string;
  daysRequested: number;
  daysAvailable: number;
  interests: InterestHistory[];
  campaignSummary: Array<{
    date: string;
    totalInterests: number;
    avgScore: string;
    distribution: {
      excellent: string;
      good: string;
      average: string;
      poor: string;
    };
  }>;
}

export interface AdsetBreakdown {
  adsetId: string;
  adsetName: string;
  performanceScore: number;
  classification: string;
  historicalScore: number;
  correlationScore: number;
  audienceSizeScore: number;
  categoryScore: number;
  predictionConfidence: number;
  recommendations: string[];
}

export interface InterestBreakdownData {
  interestId: string;
  interestName: string;
  campaignId: string;
  totalAdsets: number;
  aggregatedStats: {
    avgScore: number;
    maxScore: number;
    minScore: number;
    consistency: string;
  };
  adsetPerformance: AdsetBreakdown[];
  insights: string[];
}

interface InterestAnalysisState {
  // Campaign Management
  availableCampaigns: AvailableCampaign[];
  trackedCampaigns: TrackedCampaign[];
  trackingStats: TrackingStats | null;
  selectedAdAccount: string;
  selectedCampaignIds: string[]; // For multi-select (max 3)
  selectedTrackedCampaignIds: string[];

  // Analysis Data
  analysisResult: InterestAnalysisResult | null;
  historyData: InterestHistoryData | null;
  breakdownData: InterestBreakdownData | null;

  // Loading States
  loading: boolean;
  tracking: boolean;
  analyzing: boolean;
  stopping: boolean;

  // Error
  error: string | null;

  // Current View
  activeTab: "interest" | "campaign-fatigue" | "creative-fatigue" | "forecast";
  selectedCampaignForView: string | null;
}

const initialState: InterestAnalysisState = {
  availableCampaigns: [],
  trackedCampaigns: [],
  trackingStats: null,
  selectedAdAccount: "",
  selectedCampaignIds: [],
  selectedTrackedCampaignIds: [], // 🔥 ADD THIS NEW LINE
  analysisResult: null,
  historyData: null,
  breakdownData: null,
  loading: false,
  tracking: false,
  analyzing: false,
  stopping: false,
  error: null,
  activeTab: "interest",
  selectedCampaignForView: null,
};

const getAccessToken = () => localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_INTEREST_MINER_API_URL;

// ========== ASYNC THUNKS ==========

// 1. Fetch Available Campaigns
export const fetchAvailableCampaigns = createAsyncThunk(
  "interestAnalysis/fetchAvailableCampaigns",
  async (adAccountId: string, { rejectWithValue }) => {
    const token = getAccessToken();
    if (!token) return rejectWithValue("No access token found");
    try {
      const res = await fetch(
        `${BASE_URL}/api/tracking/campaigns/available/${adAccountId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch available campaigns");
    }
  }
);

// 2. Track Selected Campaigns
export const trackSelectedCampaigns = createAsyncThunk(
  "interestAnalysis/trackSelectedCampaigns",
  async (
    params: { campaignIds: string[]; adAccountId: string },
    { rejectWithValue, dispatch }
  ) => {
    const token = getAccessToken();
    if (!token) return rejectWithValue("No access token found");
    try {
      const res = await fetch(`${BASE_URL}/api/tracking/campaigns/track-selected`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      // 🔥 Trigger immediate analysis after tracking
      dispatch(triggerImmediateAnalysis(params.campaignIds));

      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to track campaigns");
    }
  }
);

// 3. Fetch Tracked Campaigns
export const fetchTrackedCampaigns = createAsyncThunk(
  "interestAnalysis/fetchTrackedCampaigns",
  async (_, { rejectWithValue }) => {
    const token = getAccessToken();
    if (!token) return rejectWithValue("No access token found");
    try {
      const res = await fetch(`${BASE_URL}/api/tracking/campaigns/tracked`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch tracked campaigns");
    }
  }
);

// 4. Fetch Tracking Stats
export const fetchTrackingStats = createAsyncThunk(
  "interestAnalysis/fetchTrackingStats",
  async (_, { rejectWithValue }) => {
    const token = getAccessToken();
    if (!token) return rejectWithValue("No access token found");
    try {
      const res = await fetch(`${BASE_URL}/api/tracking/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch tracking stats");
    }
  }
);

// 5. Stop Tracking Single Campaign
export const stopTrackingCampaign = createAsyncThunk(
  "interestAnalysis/stopTrackingCampaign",
  async (campaignId: string, { rejectWithValue, dispatch }) => {
    const token = getAccessToken();
    if (!token) return rejectWithValue("No access token found");
    try {
      const res = await fetch(`${BASE_URL}/api/tracking/campaigns/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaignId }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      // Refresh tracked campaigns
      dispatch(fetchTrackedCampaigns());

      return { campaignId, message: data.message };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to stop tracking");
    }
  }
);

// 6. Stop Tracking Multiple Campaigns
export const stopTrackingBulk = createAsyncThunk(
  "interestAnalysis/stopTrackingBulk",
  async (campaignIds: string[], { rejectWithValue, dispatch }) => {
    const token = getAccessToken();
    if (!token) return rejectWithValue("No access token found");
    try {
      const res = await fetch(`${BASE_URL}/api/tracking/campaigns/stop-bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaignIds }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      // Refresh tracked campaigns
      dispatch(fetchTrackedCampaigns());

      return { campaignIds, message: data.message };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to stop tracking campaigns");
    }
  }
);

// 7. Trigger Immediate Analysis
export const triggerImmediateAnalysis = createAsyncThunk(
  "interestAnalysis/triggerImmediateAnalysis",
  async (campaignIds: string[], { rejectWithValue }) => {
    const token = getAccessToken();
    if (!token) return rejectWithValue("No access token found");
    try {
      const results = await Promise.all(
        campaignIds.map(async (campaignId) => {
          const res = await fetch(`${BASE_URL}/api/analysis/immediate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ campaignId }),
          });
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          return res.json();
        })
      );
      return results.map(r => r.data);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to trigger analysis");
    }
  }
);

// 8. Get Interest Analysis Result
export const getInterestAnalysisResult = createAsyncThunk(
  "interestAnalysis/getResult",
  async (campaignId: string, { rejectWithValue }) => {
    const token = getAccessToken();
    if (!token) return rejectWithValue("No access token found");
    try {
      const res = await fetch(
        `${BASE_URL}/api/analysis/interest/campaign/${campaignId}/result`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to get analysis result");
    }
  }
);

// 9. Get Interest Analysis History
export const getInterestAnalysisHistory = createAsyncThunk(
  "interestAnalysis/getHistory",
  async (campaignId: string, { rejectWithValue }) => {
    const token = getAccessToken();
    if (!token) return rejectWithValue("No access token found");
    try {
      const res = await fetch(
        `${BASE_URL}/api/analysis/interest/campaign/${campaignId}/history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to get analysis history");
    }
  }
);

// 10. Get Interest Breakdown
export const getInterestBreakdown = createAsyncThunk(
  "interestAnalysis/getBreakdown",
  async (
    params: { campaignId: string; interestId: string },
    { rejectWithValue }
  ) => {
    const token = getAccessToken();
    if (!token) return rejectWithValue("No access token found");
    try {
      const res = await fetch(
        `${BASE_URL}/api/analysis/interest/${params.interestId}/campaign/${params.campaignId}/breakdown`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to get interest breakdown");
    }
  }
);

// ========== SLICE ==========
const interestAnalysisSlice = createSlice({
  name: "interestAnalysis",
  initialState,
  reducers: {
    setSelectedAdAccount: (state, action: PayloadAction<string>) => {
      state.selectedAdAccount = action.payload;
      state.selectedCampaignIds = [];
    },
    toggleCampaignSelection: (state, action: PayloadAction<string>) => {
      const campaignId = action.payload;
      const index = state.selectedCampaignIds.indexOf(campaignId);
      if (index > -1) {
        state.selectedCampaignIds.splice(index, 1);
      } else {
        if (state.selectedCampaignIds.length < 3) {
          state.selectedCampaignIds.push(campaignId);
        }
      }
    },
    clearCampaignSelection: (state) => {
      state.selectedCampaignIds = [];
    },
    // 🔥 ADD THESE TWO NEW REDUCERS BELOW
    toggleTrackedCampaignSelection: (state, action: PayloadAction<string>) => {
      const campaignId = action.payload;
      if (state.selectedTrackedCampaignIds.includes(campaignId)) {
        state.selectedTrackedCampaignIds = state.selectedTrackedCampaignIds.filter(
          (id) => id !== campaignId
        );
      } else {
        state.selectedTrackedCampaignIds.push(campaignId);
      }
    },
    clearTrackedCampaignSelection: (state) => {
      state.selectedTrackedCampaignIds = [];
    },
    setActiveTab: (
      state,
      action: PayloadAction<
        "interest" | "campaign-fatigue" | "creative-fatigue" | "forecast"
      >
    ) => {
      state.activeTab = action.payload;
    },
    setSelectedCampaignForView: (state, action: PayloadAction<string | null>) => {
      state.selectedCampaignForView = action.payload;
    },
    clearAnalysisData: (state) => {
      state.analysisResult = null;
      state.historyData = null;
      state.breakdownData = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearBreakdown: (state) => {
      state.breakdownData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Available Campaigns
      .addCase(fetchAvailableCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.availableCampaigns = action.payload.campaigns || [];
      })
      .addCase(fetchAvailableCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Track Selected Campaigns
      .addCase(trackSelectedCampaigns.pending, (state) => {
        state.tracking = true;
        state.error = null;
      })
      .addCase(trackSelectedCampaigns.fulfilled, (state) => {
        state.tracking = false;
        state.selectedCampaignIds = [];
      })
      .addCase(trackSelectedCampaigns.rejected, (state, action) => {
        state.tracking = false;
        state.error = action.payload as string;
      })

      // Fetch Tracked Campaigns
      .addCase(fetchTrackedCampaigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrackedCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.trackedCampaigns = action.payload.campaigns || [];
      })
      .addCase(fetchTrackedCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Tracking Stats
      .addCase(fetchTrackingStats.fulfilled, (state, action) => {
        state.trackingStats = action.payload;
      })

      // Stop Tracking
      .addCase(stopTrackingCampaign.pending, (state) => {
        state.stopping = true;
      })
      .addCase(stopTrackingCampaign.fulfilled, (state) => {
        state.stopping = false;
      })
      .addCase(stopTrackingCampaign.rejected, (state, action) => {
        state.stopping = false;
        state.error = action.payload as string;
      })

      // Stop Tracking Bulk
      .addCase(stopTrackingBulk.pending, (state) => {
        state.stopping = true;
        state.error = null;
      })
      .addCase(stopTrackingBulk.fulfilled, (state) => {
        state.stopping = false;
        state.selectedTrackedCampaignIds = [];
      })
      .addCase(stopTrackingBulk.rejected, (state, action) => {
        state.stopping = false;
        state.error = action.error.message || "Failed to stop tracking campaigns";
      })

      // Trigger Immediate Analysis
      .addCase(triggerImmediateAnalysis.pending, (state) => {
        state.analyzing = true;
      })
      .addCase(triggerImmediateAnalysis.fulfilled, (state) => {
        state.analyzing = false;
      })
      .addCase(triggerImmediateAnalysis.rejected, (state, action) => {
        state.analyzing = false;
        state.error = action.payload as string;
      })

      // Get Analysis Result
      .addCase(getInterestAnalysisResult.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInterestAnalysisResult.fulfilled, (state, action) => {
        state.loading = false;
        state.analysisResult = action.payload;
      })
      .addCase(getInterestAnalysisResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Analysis History
      .addCase(getInterestAnalysisHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInterestAnalysisHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.historyData = action.payload;
      })
      .addCase(getInterestAnalysisHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Interest Breakdown
      .addCase(getInterestBreakdown.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInterestBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        state.breakdownData = action.payload;
      })
      .addCase(getInterestBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedAdAccount,
  toggleCampaignSelection,
  clearCampaignSelection,
  setActiveTab,
  setSelectedCampaignForView,
  clearAnalysisData,
  clearError,
  clearBreakdown,
  toggleTrackedCampaignSelection, // 🔥 ADD THIS LINE
  clearTrackedCampaignSelection, // 🔥 ADD THIS LINE
} = interestAnalysisSlice.actions;

export default interestAnalysisSlice.reducer;
