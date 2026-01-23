/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  PlayIcon,
  StopIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon,
  TrashIcon, // 🔥 ADD THIS LINE
} from "@heroicons/react/24/outline";

import { CheckIcon } from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchAvailableCampaigns,
  trackSelectedCampaigns,
  fetchTrackedCampaigns,
  fetchTrackingStats,
  stopTrackingCampaign,
  setSelectedAdAccount,
  toggleCampaignSelection,
  clearCampaignSelection,
  setActiveTab,
  setSelectedCampaignForView,
  getInterestAnalysisResult,
  getInterestAnalysisHistory,
  clearAnalysisData,
  clearBreakdown,
  stopTrackingBulk,
  toggleTrackedCampaignSelection, // 🔥 ADD THIS LINE
  clearTrackedCampaignSelection, // 🔥 ADD THIS LINE
} from "../../../store/features/interestAnalysisSlice";
import {
  fetchAdAccounts,
  checkFacebookStatus,
  fetchUserBusinesses, // NEW
  clearBusinessError, // NEW
} from "../../../store/features/facebookAdsSlice";
import { InterestPerformanceTab } from "./InterestPerformanceTab";
import { InterestDetailModal } from "./InterestDetailModal";
import { InterestBreakdownModal } from "./InterestBreakdownModal";
import { openPricingModal } from "../../../store/features/pricingModalSlice";
import Portal from "@/components/ui/Portal";
import { useToast } from "@/hooks/use-toast"; // NEW

export const InterestAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast(); // NEW

  // Redux state
  const {
    availableCampaigns,
    trackedCampaigns,
    trackingStats,
    selectedAdAccount,
    selectedCampaignIds,
    selectedTrackedCampaignIds,
    analysisResult,
    breakdownData,
    loading,
    tracking,
    analyzing,
    stopping,
    error,
    activeTab,
    selectedCampaignForView,
  } = useAppSelector((state) => state.interestAnalysis);

  const { adAccounts, facebookAuth, businessState } = useAppSelector( // NEW: Added businessState
    (state) => state.facebookAds
  );

  const { data: userProfile } = useAppSelector((state) => state.profile);

  // Local state
  const [showStopModal, setShowStopModal] = useState(false);
  const [campaignToStop, setCampaignToStop] = useState<string | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<any>(null);
  const [campaignViewTab, setCampaignViewTab] = useState<
    "untracked" | "tracked"
  >("untracked");
  const [mainTab, setMainTab] = useState<"available" | "tracked">("available");

  // Check Facebook connection and fetch data
  useEffect(() => {
    dispatch(checkFacebookStatus());
  }, [dispatch]);

  // Define Facebook connection status
  const hasFacebookConnection = facebookAuth.isConnected && facebookAuth.status?.facebook_token_valid;

  // NEW: Fetch businesses when Facebook connection is established
  useEffect(() => {
    if (hasFacebookConnection) {
      dispatch(fetchUserBusinesses());
    }
  }, [dispatch, hasFacebookConnection]);

  // NEW: Show business modal if no business selected
  useEffect(() => {
    if (businessState.businesses.length > 0 && !businessState.selectedBusiness && !businessState.loading) {
      console.log("🔄 InterestAnalysis: No business selected, showing business modal");
      // Business modal will be handled by sidebar now
    }
  }, [businessState.businesses, businessState.selectedBusiness, businessState.loading]);

  // NEW: Handle business errors
  useEffect(() => {
    if (businessState.error) {
      toast({
        title: "Business Error",
        description: businessState.error,
        variant: "destructive",
      });
    }
  }, [businessState.error, toast]);

  // Auto-select first ad account
  useEffect(() => {
    if (adAccounts.length > 0 && !selectedAdAccount) {
      dispatch(setSelectedAdAccount(adAccounts[0].id));
    }
  }, [adAccounts, selectedAdAccount, dispatch]);

  // Fetch ad accounts when business is selected
  useEffect(() => {
    if (hasFacebookConnection && businessState.selectedBusiness && adAccounts.length === 0) {
      console.log("🔄 InterestAnalysis: Fetching ad accounts...");
      console.log("📊 Selected Business:", businessState.selectedBusiness.business_name);
      dispatch(fetchAdAccounts());
    }
  }, [dispatch, hasFacebookConnection, businessState.selectedBusiness, adAccounts.length]);

  // Fetch campaigns when ad account changes
  useEffect(() => {
    if (selectedAdAccount) {
      dispatch(fetchAvailableCampaigns(selectedAdAccount));
      dispatch(fetchTrackedCampaigns());
      dispatch(fetchTrackingStats());
    }
  }, [selectedAdAccount, dispatch]);

  // Fetch analysis result when campaign selected
  useEffect(() => {
    if (selectedCampaignForView) {
      dispatch(getInterestAnalysisResult(selectedCampaignForView));
    }
  }, [selectedCampaignForView, dispatch]);

  // Handlers
  const handleAdAccountChange = (accountId: string) => {
    dispatch(setSelectedAdAccount(accountId));
    dispatch(clearCampaignSelection());
    dispatch(clearAnalysisData());
  };

  const handleCampaignSelect = (campaignId: string) => {
    dispatch(toggleCampaignSelection(campaignId));
  };

  // const handleTrackCampaigns = async () => {
  //   if (selectedCampaignIds.length === 0 || !selectedAdAccount) return;
  //   await dispatch(
  //     trackSelectedCampaigns({
  //       campaignIds: selectedCampaignIds,
  //       adAccountId: selectedAdAccount,
  //     })
  //   );
  //   // Refresh data after tracking
  //   dispatch(fetchAvailableCampaigns(selectedAdAccount));
  //   dispatch(fetchTrackedCampaigns());
  //   dispatch(fetchTrackingStats());
  // };

  const handleTrackCampaigns = async () => {
    if (selectedCampaignIds.length === 0 || !selectedAdAccount) return;

    await dispatch(
      trackSelectedCampaigns({
        campaignIds: selectedCampaignIds,
        adAccountId: selectedAdAccount,
      })
    );

    // Refresh data after tracking
    dispatch(fetchAvailableCampaigns(selectedAdAccount));
    dispatch(fetchTrackedCampaigns());
    dispatch(fetchTrackingStats());

    // Clear selection after tracking
    dispatch(clearCampaignSelection());
  };

  const handleStopTracking = (campaignId: string) => {
    console.log("button click", campaignId);
    setCampaignToStop(campaignId);
    console.log("set campi", campaignToStop);
    setShowStopModal(true);
  };

  const confirmStopTracking = async () => {
    if (campaignToStop) {
      await dispatch(stopTrackingCampaign(campaignToStop));
      setShowStopModal(false);
      setCampaignToStop(null);
      dispatch(fetchAvailableCampaigns(selectedAdAccount));
      dispatch(fetchTrackingStats());
    }
  };

  // 🔥 ADD THIS NEW FUNCTION BELOW
  const handleStopBulkTracking = async () => {
    if (selectedTrackedCampaignIds.length > 0) {
      await dispatch(stopTrackingBulk(selectedTrackedCampaignIds));
      dispatch(fetchAvailableCampaigns(selectedAdAccount));
      dispatch(fetchTrackedCampaigns());
      dispatch(fetchTrackingStats());
    }
  };

  const handleViewInterestHistory = (interest: any) => {
    setSelectedInterest(interest);
    if (selectedCampaignForView) {
      dispatch(getInterestAnalysisHistory(selectedCampaignForView));
    }
  };

  const handleCloseBreakdown = () => {
    dispatch(clearBreakdown());
  };

  // Check if user has subscription and Facebook connected
  const hasSubscription = userProfile?.subscription_status === "active";
  const hasFacebookConnected = facebookAuth.isConnected;

  // Show subscription/connection required screens
  if (!hasSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
            <SparklesIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Unlock AI-Powered Analysis
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            Get deep insights into your Facebook Ads campaigns with our premium
            AI analysis features.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            {[
              "🎯 Interest Performance Analysis",
              "📉 Campaign Fatigue Detection",
              "🎨 Creative Fatigue Tracking",
              "📊 AI-Powered Sales Forecasting",
              "📈 Historical Trend Analysis",
              "💡 Smart Recommendations",
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => dispatch(openPricingModal())}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg">
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  if (!hasFacebookConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
            <InformationCircleIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Facebook Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Connect your Facebook Ads account to unlock AI-powered campaign
            analysis and insights.
          </p>

          <button
            onClick={() => navigate("/meta-campaign")}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg">
            Connect Facebook
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      {/* Header */}
      <div className="z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                AI Analysis
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Track campaigns and get AI-powered insights
              </p>
            </div>

            {/* Ad Account Selector */}
            {adAccounts.length > 0 && (
              <select
                value={selectedAdAccount}
                onChange={(e) => handleAdAccountChange(e.target.value)}
                className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all">
                {adAccounts.map((account: any) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* NEW: Business Display */}
          {businessState.selectedBusiness && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-green-900 dark:text-green-300">
                      🏢 Your Business: {businessState.selectedBusiness.business_name}
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-400 mt-1">
                      Business ID: {businessState.selectedBusiness.business_id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Loading State */}
          {businessState.loading && (
            <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-500 border-t-transparent"></div>
                <div className="text-sm font-medium text-yellow-900 dark:text-yellow-300">
                  ⏳ Loading businesses...
                </div>
              </div>
            </div>
          )}

          {/* Business Error State */}
          {!businessState.loading && !businessState.selectedBusiness && businessState.businesses.length === 0 && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-800/30 rounded-lg">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-red-900 dark:text-red-300">
                    ❌ No businesses found
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-400 mt-1">
                    Please ensure your Facebook account has business management permissions.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          {trackingStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="text-2xl font-bold">
                  {trackingStats.total_campaigns}
                </div>
                <div className="text-sm text-blue-100">Total Campaigns</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="text-2xl font-bold">
                  {trackingStats.tracking_count}
                </div>
                <div className="text-sm text-green-100">Tracking</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
                <div className="text-2xl font-bold">
                  {trackingStats.not_tracking_count}
                </div>
                <div className="text-sm text-yellow-100">Not Tracking</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="text-2xl font-bold">
                  {selectedCampaignIds.length}/3
                </div>
                <div className="text-sm text-purple-100">Selected</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Tabs - Available Campaigns vs Tracked Campaigns */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setMainTab("available")}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                mainTab === "available"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}>
              Available Campaigns
              {availableCampaigns.filter((c) => !c.is_tracking).length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                  {availableCampaigns.filter((c) => !c.is_tracking).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setMainTab("tracked")}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                mainTab === "tracked"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}>
              Tracked Campaigns analysis
              {trackedCampaigns.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
                  {trackedCampaigns.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Available Campaigns Tab Content */}
        {mainTab === "available" && (
          <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-3">
              {selectedCampaignIds.length > 0 && (
                <>
                  <button
                    onClick={() => dispatch(clearCampaignSelection())}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm font-medium">
                    Clear Selection
                  </button>
                  <button
                    onClick={handleTrackCampaigns}
                    disabled={tracking || analyzing}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all">
                    {tracking || analyzing ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        {tracking ? "Tracking..." : "Analyzing..."}
                      </>
                    ) : (
                      <>
                        <PlayIcon className="w-5 h-5" />
                        Track Selected ({selectedCampaignIds.length})
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 🔥 Campaign Tabs */}
          <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setCampaignViewTab("untracked")}
              className={`px-4 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
                campaignViewTab === "untracked"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}>
              Untracked (
              {availableCampaigns.filter((c) => !c.is_tracking).length})
            </button>
            <button
              onClick={() => setCampaignViewTab("tracked")}
              className={`px-4 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
                campaignViewTab === "tracked"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}>
              Tracked ({availableCampaigns.filter((c) => c.is_tracking).length})
            </button>
          </div>

          {/* Campaign List/Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Loading campaigns...
              </p>
            </div>
          ) : availableCampaigns.filter((c) =>
              campaignViewTab === "untracked" ? !c.is_tracking : c.is_tracking
            ).length > 0 ? (
            <>
              {/* 🔥 UNTRACKED CAMPAIGNS - List View with Checkboxes */}
              {campaignViewTab === "untracked" && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    <div className="col-span-1 flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedCampaignIds.length ===
                            availableCampaigns.filter((c) => !c.is_tracking)
                              .length &&
                          availableCampaigns.filter((c) => !c.is_tracking)
                            .length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            availableCampaigns
                              .filter((c) => !c.is_tracking)
                              .slice(0, 3)
                              .forEach((c) => {
                                if (!selectedCampaignIds.includes(c.id)) {
                                  handleCampaignSelect(c.id);
                                }
                              });
                          } else {
                            dispatch(clearCampaignSelection());
                          }
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-5">Campaign Name</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Budget</div>
                    <div className="col-span-2">Action</div>
                  </div>

                  {/* Scrollable Campaign List */}
                  <div className="max-h-[500px] overflow-y-auto">
                    {availableCampaigns
                      .filter((c) => !c.is_tracking)
                      .map((campaign) => {
                        const isSelected = selectedCampaignIds.includes(
                          campaign.id
                        );
                        const canSelect =
                          isSelected || selectedCampaignIds.length < 3;

                        return (
                          <motion.div
                            key={campaign.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all ${
                              isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
                            }`}>
                            {/* Checkbox */}
                            <div className="col-span-1 flex items-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={!canSelect && !isSelected}
                                onChange={() =>
                                  handleCampaignSelect(campaign.id)
                                }
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                            </div>

                            {/* Campaign Name */}
                            <div className="col-span-5 flex flex-col justify-center">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                                {campaign.name}
                              </h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {campaign.objective}
                              </span>
                            </div>

                            {/* Status */}
                            <div className="col-span-2 flex items-center">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  campaign.status === "ACTIVE"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                }`}>
                                {campaign.status}
                              </span>
                            </div>

                            {/* Budget */}
                            <div className="col-span-2 flex items-center">
                              {campaign.daily_budget ? (
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  ₹
                                  {(
                                    parseFloat(campaign.daily_budget) / 100
                                  ).toFixed(2)}
                                </p>
                              ) : (
                                <p className="text-sm text-gray-400">-</p>
                              )}
                            </div>

                            {/* Action Button */}
                            <div className="col-span-2 flex items-center">
                              <button
                                onClick={() => {
                                  if (!isSelected) {
                                    handleCampaignSelect(campaign.id);
                                  }
                                  setTimeout(() => handleTrackCampaigns(), 100);
                                }}
                                disabled={tracking || analyzing}
                                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-all flex items-center gap-1 disabled:opacity-50">
                                {tracking || analyzing ? (
                                  <>
                                    <ArrowPathIcon className="w-3 h-3 animate-spin" />
                                    Tracking...
                                  </>
                                ) : (
                                  <>
                                    <PlayIcon className="w-3 h-3" />
                                    Track
                                  </>
                                )}
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* 🔥 TRACKED CAMPAIGNS - Keep Existing Card View */}
              {campaignViewTab === "tracked" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableCampaigns
                    .filter((c) => c.is_tracking)
                    .map((campaign) => (
                      <motion.div
                        key={campaign.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative bg-white dark:bg-gray-800 rounded-xl border-2 border-green-500 dark:border-green-600 p-4 transition-all">
                        {/* Tracking Badge */}
                        <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                          <CheckCircleIcon className="w-3 h-3" />
                          Tracking
                        </div>

                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 pr-20">
                          {campaign.name}
                        </h3>

                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              campaign.status === "ACTIVE"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}>
                            {campaign.status}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {campaign.objective}
                          </span>
                        </div>

                        {campaign.daily_budget && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            Budget: ₹
                            {(parseFloat(campaign.daily_budget) / 100).toFixed(
                              2
                            )}
                            /day
                          </p>
                        )}

                        {/* Stop Tracking Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStopTracking(campaign.id);
                          }}
                          className="w-full mt-2 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1">
                          <StopIcon className="w-4 h-4" />
                          Stop Tracking
                        </button>
                      </motion.div>
                    ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                {campaignViewTab === "untracked"
                  ? "No untracked campaigns available"
                  : "No tracked campaigns available"}
              </p>
            </div>
          )}
          </div>
        )}

        {/* Tracked Campaigns Tab Content */}
        {mainTab === "tracked" && trackedCampaigns.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Campaigns Analysis
              </h2>

              {/* 🔥 ADD THIS ENTIRE BLOCK */}
              {selectedTrackedCampaignIds.length > 0 && (
                <div className="flex gap-3">
                  <button
                    onClick={() => dispatch(clearTrackedCampaignSelection())}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm font-medium">
                    Clear ({selectedTrackedCampaignIds.length})
                  </button>
                  <button
                    onClick={handleStopBulkTracking}
                    disabled={stopping}
                    className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all">
                    {stopping ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        Stopping...
                      </>
                    ) : (
                      <>
                        <TrashIcon className="w-5 h-5" />
                        Stop Selected ({selectedTrackedCampaignIds.length})
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              {[
                { id: "interest", label: "Interest Performance", icon: "🎯" },
                {
                  id: "campaign-fatigue",
                  label: "Campaign Fatigue",
                  icon: "📉",
                },
                {
                  id: "creative-fatigue",
                  label: "Creative Fatigue",
                  icon: "🎨",
                },
                { id: "forecast", label: "Sales Forecast", icon: "📊" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => dispatch(setActiveTab(tab.id as any))}
                  className={`px-4 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}>
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "interest" && (
                <InterestPerformanceTab
                  trackedCampaigns={trackedCampaigns}
                  selectedCampaignForView={selectedCampaignForView}
                  onSelectCampaign={(campaignId) =>
                    dispatch(setSelectedCampaignForView(campaignId))
                  }
                  analysisResult={analysisResult}
                  onViewHistory={handleViewInterestHistory}
                  onStopTracking={handleStopTracking} // 🔥 ADD THIS LINE
                  loading={loading}
                  breakdownData={breakdownData}
                  onCloseBreakdown={handleCloseBreakdown}
                />
              )}

              {activeTab === "campaign-fatigue" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">
                    Campaign Fatigue Analysis - Coming Soon
                  </p>
                </motion.div>
              )}

              {activeTab === "creative-fatigue" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">
                    Creative Fatigue Analysis - Coming Soon
                  </p>
                </motion.div>
              )}

              {activeTab === "forecast" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">
                    Sales Forecast - Coming Soon
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Stop Tracking Confirmation Modal */}
      <AnimatePresence>
        {showStopModal && (
        <Portal>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStopModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                Stop Tracking Campaign?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                This will stop collecting data for this campaign. Historical
                data will be preserved.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowStopModal(false)}
                  className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-all">
                  Cancel
                </button>
                <button
                  onClick={confirmStopTracking}
                  disabled={stopping}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all disabled:opacity-50">
                  {stopping ? "Stopping..." : "Stop Tracking"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </Portal>
        )}
      </AnimatePresence>

      {/* Interest History Modal */}
      <InterestDetailModal
        isOpen={!!selectedInterest}
        onClose={() => setSelectedInterest(null)}
        interest={selectedInterest}
      />

      {/* Interest Breakdown Modal */}
      <InterestBreakdownModal
        isOpen={!!breakdownData}
        onClose={handleCloseBreakdown}
        breakdownData={breakdownData}
        loading={loading}
      />
    </div>
  );
};
