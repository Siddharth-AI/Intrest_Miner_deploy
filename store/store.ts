import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import registrationReducer from "./features/registrationSlice";
import loginReducer from "./features/loginSlice";
import forgotPasswordReducer from "./features/forgotPasswordSlice";
import facebookReducer from "./features/facebookSlice";
import openaiReducer from "./features/openaiSlice";
import profileReducer from "./features/profileSlice";
import pricingModalReducer from './features/pricingModalSlice';
import subscriptionPlansReducer from './features/subscriptionPlansSlice';
import facebookSearchHistoryReducer from "./features/facebookSearchHistorySlice";
import aiSearchHistoryReducer from "./features/openAiSearchHistorySlice";
import billingHistoryReducer from './features/billingHistorySlice';
import razorpayReducer from './features/razorpaySlice';
import facebookAdsReducer from './features/facebookAdsSlice';
import onboardingReducer from './features/onboardingSlice';
import interestAnalysisReducer from './features/interestAnalysisSlice';
import metaSettingsReducer from './features/metaSettingsSlice';
import analyticsReducer from './features/analyticsSlice';
import conversionReducer from './features/conversionSlice';


// 🔥 NEW: Separate persist config for facebookAds with selective fields
const facebookAdsPersistConfig = {
  key: 'facebookAds',
  storage,
  // 🔥 CRITICAL: Persist cache data + selected account/campaign for better UX
  whitelist: [
    'insightsCache', 
    'insightsLastUpdated',
    'selectedAccount',  // ✅ Persist selected account
    'selectedCampaign'  // ✅ Persist selected campaign
  ],
  blacklist: [
    'loading',
    'loadingTotals',
    'loadingCampaigns',
    'initialLoading',
    'error',
    'showModal',
    'showCustomDatePicker',
    'selectedCampaignForModal',
    'campaignInsights',
    'campaignInsightstotal'
  ]
};

// 🔥 Wrap facebookAdsReducer with persist
const persistedFacebookAdsReducer = persistReducer(facebookAdsPersistConfig, facebookAdsReducer);

// Root persist config (for other slices)
const rootPersistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['openAi', 'aiSearchHistory'], // Keep existing persisted slices
  blacklist: ['facebookAds'] // 🔥 Exclude facebookAds (handled separately)
};

const rootReducer = combineReducers({
  login: loginReducer,
  registration: registrationReducer,
  forgotPassword: forgotPasswordReducer,
  profile: profileReducer,
  facebook: facebookReducer,
  openAi: openaiReducer,
  pricingModal: pricingModalReducer,
  subscriptionPlans: subscriptionPlansReducer,
  facebookSearchHistory: facebookSearchHistoryReducer,
  aiSearchHistory: aiSearchHistoryReducer,
  billingHistory: billingHistoryReducer,
  razorpay: razorpayReducer,
  facebookAds: persistedFacebookAdsReducer, // 🔥 Use persisted version
  onboarding: onboardingReducer,
  interestAnalysis: interestAnalysisReducer,
  metaSettings: metaSettingsReducer, // 🔥 NEW: Meta Settings
  analytics: analyticsReducer, // 🔥 NEW: Analytics
  conversion: conversionReducer, // 🔥 NEW: Conversion Tracking
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
