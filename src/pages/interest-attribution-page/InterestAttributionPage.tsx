/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  SparklesIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  FireIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrophyIcon,
  BanknotesIcon,
  CursorArrowRaysIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchInterestPerformance,
  setSelectedTier,
  setSelectedIndustry,
  setSearchTerm,
  setSortBy,
  setSortOrder,
  clearError,
  Interest,
} from "../../../store/features/interestAttributionSlice";
import {
  fetchAdAccounts,
  fetchCampaigns,
  setSelectedAccount,
  setSelectedCampaign,
} from "../../../store/features/facebookAdsSlice";
import { useToast } from "../../hooks/use-toast";
// import FloatingHelpButton from "../../common/FloatingHelpButton";
import { CustomDropdown } from "../../components/common/CustomDropdown";

const InterestAttributionPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Redux State
  const {
    data,
    loading,
    error,
    selectedTier,
    selectedIndustry,
    searchTerm,
    sortBy,
    sortOrder,
  } = useAppSelector((state) => state.interestAttribution);
  const { adAccounts, campaigns, selectedAccount, selectedCampaign } =
    useAppSelector((state) => state.facebookAds);

  // 🔥 ADD THIS NEW HELPER HERE
  const hasNoInterests = useMemo(() => {
    // Check if data exists but has no interests
    return data && (!data.interests || data.interests.length === 0);
  }, [data]);

  // Local State
  const [expandedInterest, setExpandedInterest] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "campaign">("all"); // 🔥 ADD THIS

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Fetch ad accounts on mount
  useEffect(() => {
    dispatch(fetchAdAccounts());
  }, [dispatch]);

  // Fetch campaigns when ad account changes
  useEffect(() => {
    if (selectedAccount) {
      dispatch(fetchCampaigns(selectedAccount));
    }
  }, [selectedAccount, dispatch]);

  // Auto-select first ad account if none selected
  useEffect(() => {
    if (adAccounts.length > 0 && !selectedAccount) {
      dispatch(setSelectedAccount(adAccounts[0].id));
      toast({
        title: "Account Auto-Selected",
        description: `Automatically selected ${adAccounts[0].name}`,
      });
    }
  }, [adAccounts, selectedAccount, dispatch, toast]);

  // Fetch interest data when account/campaign changes
  const handleFetchData = useCallback(
    (accountId?: string, campaignId?: string) => {
      const accountToUse = accountId || selectedAccount;
      const campaignToUse =
        campaignId !== undefined ? campaignId : selectedCampaign;

      if (!accountToUse) {
        toast({
          title: "No Ad Account Selected",
          description: "Please select an ad account first.",
          variant: "destructive",
        });
        return;
      }

      dispatch(
        fetchInterestPerformance({
          adAccountId: accountToUse,
          campaignId:
            campaignToUse && campaignToUse !== "all"
              ? campaignToUse
              : undefined,
        })
      );
    },
    [selectedAccount, selectedCampaign, dispatch, toast]
  );

  // Auto-fetch on load
  useEffect(() => {
    if (selectedAccount) {
      handleFetchData();
    }
  }, [selectedAccount, selectedCampaign]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  // Handle account change
  const handleAccountChange = useCallback(
    (accountId: string) => {
      dispatch(setSelectedAccount(accountId));
      dispatch(setSelectedCampaign(null));
      toast({
        title: "Account Changed",
        description: "Fetching campaigns...",
      });
    },
    [dispatch, toast]
  );

  // Handle campaign change
  const handleCampaignChange = useCallback(
    (campaignId: string) => {
      dispatch(setSelectedCampaign(campaignId === "all" ? null : campaignId));
    },
    [dispatch]
  );

  // Filtered and sorted interests
  const filteredInterests = useMemo(() => {
    // 🔥 UPDATED: Add check for data.interests
    if (!data || !data.interests) return [];

    let interests = [...data.interests];

    // Filter by tier
    if (selectedTier !== "all") {
      interests = interests.filter((i) => i.tier === selectedTier);
    }

    // Filter by industry
    if (selectedIndustry) {
      interests = interests.filter(
        (i) => i.detected_industry === selectedIndustry
      );
    }

    // Filter by search term
    if (searchTerm) {
      interests = interests.filter((i) =>
        i.interest_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    interests.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    return interests;
  }, [data, selectedTier, selectedIndustry, searchTerm, sortBy, sortOrder]);

  // Tier styles
  const getTierStyles = (tier: string) => {
    switch (tier) {
      case "Best":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
          text: "text-green-700 dark:text-green-400",
          icon: FireIcon,
        };
      case "Good":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-700 dark:text-blue-400",
          icon: ShieldCheckIcon,
        };
      case "Fair":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-800",
          text: "text-yellow-700 dark:text-yellow-400",
          icon: ExclamationTriangleIcon,
        };
      case "Poor":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-700 dark:text-red-400",
          icon: XMarkIcon,
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-900/20",
          border: "border-gray-200 dark:border-gray-800",
          text: "text-gray-700 dark:text-gray-400",
          icon: ChartBarIcon,
        };
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format number
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* <FloatingHelpButton /> */}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <TrophyIcon className="w-10 h-10 text-purple-600" />
              Interest Attribution
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Discover which interests drive the best performance for your
              campaigns
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFetchData()}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <ArrowPathIcon
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Analyzing..." : "Refresh Data"}
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Interests */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Total Interests
                </p>
                <p className="text-3xl font-bold mt-2">
                  {data.summary.scored_interests}
                </p>
                <p className="text-purple-200 text-xs mt-1">
                  {data.summary.insufficient_data > 0 &&
                    `+${data.summary.insufficient_data} low data`}
                </p>
              </div>
              <ChartBarIcon className="w-12 h-12 text-purple-200" />
            </div>
          </motion.div>

          {/* Best Performers */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Best Performers
                </p>
                <p className="text-3xl font-bold mt-2">
                  {data.best_interests.length}
                </p>
                <p className="text-green-200 text-xs mt-1">
                  {(
                    (data.best_interests.length /
                      data.summary.scored_interests) *
                    100
                  ).toFixed(0)}
                  % of total
                </p>
              </div>
              <FireIcon className="w-12 h-12 text-green-200" />
            </div>
          </motion.div>

          {/* Total Spend */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Spend</p>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(data.account_average.spend)}
                </p>
                <p className="text-blue-200 text-xs mt-1">
                  Avg:{" "}
                  {formatCurrency(
                    data.account_average.spend / data.summary.scored_interests
                  )}
                </p>
              </div>
              <BanknotesIcon className="w-12 h-12 text-blue-200" />
            </div>
          </motion.div>

          {/* Conversions */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">
                  Total Conversions
                </p>
                <p className="text-3xl font-bold mt-2">
                  {data.account_average.conversions}
                </p>
                <p className="text-pink-200 text-xs mt-1">
                  Avg CTR: {data.account_average.ctr.toFixed(2)}%
                </p>
              </div>
              <SparklesIcon className="w-12 h-12 text-pink-200" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
        {/* 🔥 NEW: Tab Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <button
              onClick={() => {
                setActiveTab("all");
                dispatch(setSelectedCampaign(null));
              }}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}>
              <div className="flex items-center justify-center gap-2">
                <ChartBarIcon className="w-5 h-5" />
                <span>All Interests</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("campaign")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "campaign"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}>
              <div className="flex items-center justify-center gap-2">
                <FunnelIcon className="w-5 h-5" />
                <span>By Campaign</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "all" ? (
            <motion.div
              key="all-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}>
              {/* All Interests Tab */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CustomDropdown
                    label="Ad Account"
                    options={adAccounts.map((acc) => ({
                      id: acc.id,
                      name: acc.name,
                    }))}
                    value={selectedAccount}
                    onChange={handleAccountChange}
                    placeholder="Select an ad account"
                    isDarkMode={isDarkMode}
                    colorScheme="purple"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Interests
                  </label>
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                      placeholder="Search by interest name..."
                      className="w-full h-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="campaign-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}>
              {/* By Campaign Tab */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <CustomDropdown
                    label="Ad Account"
                    options={adAccounts.map((acc) => ({
                      id: acc.id,
                      name: acc.name,
                    }))}
                    value={selectedAccount}
                    onChange={handleAccountChange}
                    placeholder="Select an ad account"
                    isDarkMode={isDarkMode}
                    colorScheme="purple"
                  />
                </div>

                <div>
                  <CustomDropdown
                    label="Campaign"
                    options={campaigns.map((c) => ({
                      id: c.id,
                      name: c.name,
                    }))}
                    value={selectedCampaign || ""}
                    onChange={handleCampaignChange}
                    placeholder="Choose a campaign"
                    isDarkMode={isDarkMode}
                    colorScheme="blue"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Interests
                  </label>
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                      placeholder="Search by interest name..."
                      className="w-full h-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Filters Toggle */}
        <div className="mt-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors">
            <FunnelIcon className="w-5 h-5" />
            Advanced Filters
            {showFilters ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
                {/* Tier Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Performance Tier
                  </label>
                  <select
                    value={selectedTier}
                    onChange={(e) =>
                      dispatch(setSelectedTier(e.target.value as any))
                    }
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                    <option value="all">All Tiers</option>
                    <option value="Best">🔥 Best</option>
                    <option value="Good">✅ Good</option>
                    <option value="Fair">⚠️ Fair</option>
                    <option value="Poor">❌ Poor</option>
                  </select>
                </div>

                {/* Industry Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Industry
                  </label>
                  <select
                    value={selectedIndustry || ""}
                    onChange={(e) =>
                      dispatch(setSelectedIndustry(e.target.value || null))
                    }
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                    <option value="">All Industries</option>
                    {data &&
                      Object.keys(data.industry_breakdown).map((industry) => (
                        <option key={industry} value={industry}>
                          {data.industry_breakdown[industry].industry_name} (
                          {data.industry_breakdown[industry].interests_count})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        dispatch(setSortBy(e.target.value as any))
                      }
                      className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                      <option value="performance_score">
                        Performance Score
                      </option>
                      <option value="total_spend">Total Spend</option>
                      <option value="total_conversions">Conversions</option>
                      <option value="avg_ctr">CTR</option>
                      <option value="avg_cpc">CPC</option>
                    </select>
                    <button
                      onClick={() =>
                        dispatch(
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        )
                      }
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <SparklesIcon className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">
            Analyzing interest performance...
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            This may take a few moments
          </p>
        </motion.div>
      )}

      {/* Interests List */}
      {!loading && filteredInterests.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4">
          {filteredInterests.map((interest, index) => {
            const tierStyles = getTierStyles(interest.tier);
            const TierIcon = tierStyles.icon;
            const isExpanded = expandedInterest === interest.interest_id;

            return (
              <motion.div
                key={interest.interest_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 ${tierStyles.border}`}>
                {/* Main Card */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-all"
                  onClick={() =>
                    setExpandedInterest(
                      isExpanded ? null : interest.interest_id
                    )
                  }>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Interest Name and Tier */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${tierStyles.bg}`}>
                          <TierIcon className={`w-6 h-6 ${tierStyles.text}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {interest.interest_name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${tierStyles.bg} ${tierStyles.text}`}>
                              {interest.tier}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {data?.industry_breakdown[
                                interest.detected_industry
                              ]?.industry_name || interest.detected_industry}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                              {interest.adsets_count} adsets
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                        {/* Performance Score */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
                            Score
                          </p>
                          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                            {interest.performance_score}
                          </p>
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                            / 100
                          </p>
                        </div>

                        {/* Spend */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
                          <div className="flex items-center gap-1 mb-1">
                            <BanknotesIcon className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                              Spend
                            </p>
                          </div>
                          <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                            {formatCurrency(interest.total_spend)}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            CPC: {formatCurrency(interest.avg_cpc)}
                          </p>
                        </div>

                        {/* Conversions */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
                          <div className="flex items-center gap-1 mb-1">
                            <SparklesIcon className="w-3 h-3 text-green-600 dark:text-green-400" />
                            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Conversions
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                            {interest.total_conversions}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            {interest.avg_cpa
                              ? `CPA: ${formatCurrency(interest.avg_cpa)}`
                              : "No CPA"}
                          </p>
                        </div>

                        {/* CTR */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl">
                          <div className="flex items-center gap-1 mb-1">
                            <CursorArrowRaysIcon className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                              CTR
                            </p>
                          </div>
                          <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
                            {interest.avg_ctr.toFixed(2)}%
                          </p>
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                            {interest.ctr_vs_account_avg > 0 ? "+" : ""}
                            {interest.ctr_vs_account_avg.toFixed(1)}% vs avg
                          </p>
                        </div>

                        {/* Impressions */}
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-4 rounded-xl">
                          <div className="flex items-center gap-1 mb-1">
                            <UsersIcon className="w-3 h-3 text-pink-600 dark:text-pink-400" />
                            <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">
                              Reach
                            </p>
                          </div>
                          <p className="text-xl font-bold text-pink-700 dark:text-pink-300">
                            {formatNumber(interest.total_impressions)}
                          </p>
                          <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">
                            {formatNumber(interest.total_clicks)} clicks
                          </p>
                        </div>
                      </div>

                      {/* Trend Alert */}
                      {interest.trend_alert && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${
                            interest.trend_alert.type === "warning"
                              ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                              : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                          }`}>
                          <span className="text-2xl">
                            {interest.trend_alert.icon}
                          </span>
                          <div className="flex-1">
                            <p
                              className={`text-sm font-semibold ${
                                interest.trend_alert.type === "warning"
                                  ? "text-yellow-700 dark:text-yellow-400"
                                  : "text-green-700 dark:text-green-400"
                              }`}>
                              {interest.trend_alert.message}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {interest.trend_alert.details}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Expand Button */}
                    <motion.button
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="ml-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <ChevronDownIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Historical Trends */}
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ArrowTrendingUpIcon className="w-5 h-5 text-purple-600" />
                            7-Day Performance Trend
                          </h4>
                          <div className="space-y-3">
                            {/* CTR Change */}
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                CTR Change
                              </span>
                              <div className="flex items-center gap-2">
                                {interest.historical_trend.trends.ctr_change >
                                0 ? (
                                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                                ) : interest.historical_trend.trends
                                    .ctr_change < 0 ? (
                                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                                ) : (
                                  <MinusIcon className="w-4 h-4 text-gray-500" />
                                )}
                                <span
                                  className={`font-semibold ${
                                    interest.historical_trend.trends
                                      .ctr_change > 0
                                      ? "text-green-600"
                                      : interest.historical_trend.trends
                                          .ctr_change < 0
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  }`}>
                                  {interest.historical_trend.trends.ctr_change >
                                  0
                                    ? "+"
                                    : ""}
                                  {interest.historical_trend.trends.ctr_change.toFixed(
                                    2
                                  )}
                                  %
                                </span>
                              </div>
                            </div>

                            {/* CPA Change */}
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                CPA Change
                              </span>
                              <div className="flex items-center gap-2">
                                {interest.historical_trend.trends.cpa_change <
                                0 ? (
                                  <ArrowTrendingDownIcon className="w-4 h-4 text-green-500" />
                                ) : interest.historical_trend.trends
                                    .cpa_change > 0 ? (
                                  <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />
                                ) : (
                                  <MinusIcon className="w-4 h-4 text-gray-500" />
                                )}
                                <span
                                  className={`font-semibold ${
                                    interest.historical_trend.trends
                                      .cpa_change < 0
                                      ? "text-green-600"
                                      : interest.historical_trend.trends
                                          .cpa_change > 0
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  }`}>
                                  {interest.historical_trend.trends.cpa_change >
                                  0
                                    ? "+"
                                    : ""}
                                  {interest.historical_trend.trends.cpa_change.toFixed(
                                    2
                                  )}
                                  %
                                </span>
                              </div>
                            </div>

                            {/* Conversions Change */}
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                Conversions Change
                              </span>
                              <div className="flex items-center gap-2">
                                {interest.historical_trend.trends
                                  .conversions_change > 0 ? (
                                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                                ) : interest.historical_trend.trends
                                    .conversions_change < 0 ? (
                                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                                ) : (
                                  <MinusIcon className="w-4 h-4 text-gray-500" />
                                )}
                                <span
                                  className={`font-semibold ${
                                    interest.historical_trend.trends
                                      .conversions_change > 0
                                      ? "text-green-600"
                                      : interest.historical_trend.trends
                                          .conversions_change < 0
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  }`}>
                                  {interest.historical_trend.trends
                                    .conversions_change > 0
                                    ? "+"
                                    : ""}
                                  {interest.historical_trend.trends.conversions_change.toFixed(
                                    2
                                  )}
                                  %
                                </span>
                              </div>
                            </div>

                            {/* Spend Change */}
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                Spend Change
                              </span>
                              <div className="flex items-center gap-2">
                                {interest.historical_trend.trends.spend_change >
                                0 ? (
                                  <ArrowTrendingUpIcon className="w-4 h-4 text-blue-500" />
                                ) : interest.historical_trend.trends
                                    .spend_change < 0 ? (
                                  <ArrowTrendingDownIcon className="w-4 h-4 text-blue-500" />
                                ) : (
                                  <MinusIcon className="w-4 h-4 text-gray-500" />
                                )}
                                <span className="font-semibold text-blue-600">
                                  {interest.historical_trend.trends
                                    .spend_change > 0
                                    ? "+"
                                    : ""}
                                  {interest.historical_trend.trends.spend_change.toFixed(
                                    2
                                  )}
                                  %
                                </span>
                              </div>
                            </div>

                            {/* Trend Direction Badge */}
                            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Overall Trend
                              </p>
                              <p className="font-semibold text-purple-700 dark:text-purple-300 capitalize">
                                {interest.historical_trend.trend_direction ===
                                "improving"
                                  ? "📈 Improving"
                                  : interest.historical_trend
                                      .trend_direction === "declining"
                                  ? "📉 Declining"
                                  : "➡️ Stable"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Industry Benchmarks */}
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 text-blue-600" />
                            Industry Benchmark Comparison
                          </h4>
                          <div className="space-y-4">
                            {/* CTR vs Benchmark */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                  CTR vs Benchmark
                                </span>
                                <span
                                  className={`font-semibold text-sm ${
                                    interest.industry_benchmark
                                      .ctr_vs_benchmark > 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}>
                                  {interest.industry_benchmark
                                    .ctr_vs_benchmark > 0
                                    ? "+"
                                    : ""}
                                  {interest.industry_benchmark.ctr_vs_benchmark.toFixed(
                                    2
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-3 rounded-full transition-all duration-500 ${
                                    interest.industry_benchmark
                                      .ctr_vs_benchmark > 0
                                      ? "bg-gradient-to-r from-green-400 to-green-600"
                                      : "bg-gradient-to-r from-red-400 to-red-600"
                                  }`}
                                  style={{
                                    width: `${Math.min(
                                      Math.abs(
                                        interest.industry_benchmark
                                          .ctr_vs_benchmark
                                      ),
                                      100
                                    )}%`,
                                  }}></div>
                              </div>
                              <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>
                                  Benchmark:{" "}
                                  {interest.industry_benchmark.benchmark_ctr.toFixed(
                                    2
                                  )}
                                  %
                                </span>
                                <span>
                                  Your: {interest.avg_ctr.toFixed(2)}%
                                </span>
                              </div>
                            </div>

                            {/* CPC vs Benchmark */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                  CPC vs Benchmark
                                </span>
                                <span
                                  className={`font-semibold text-sm ${
                                    interest.industry_benchmark
                                      .cpc_vs_benchmark < 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}>
                                  {interest.industry_benchmark
                                    .cpc_vs_benchmark > 0
                                    ? "+"
                                    : ""}
                                  {interest.industry_benchmark.cpc_vs_benchmark.toFixed(
                                    2
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-3 rounded-full transition-all duration-500 ${
                                    interest.industry_benchmark
                                      .cpc_vs_benchmark < 0
                                      ? "bg-gradient-to-r from-green-400 to-green-600"
                                      : "bg-gradient-to-r from-red-400 to-red-600"
                                  }`}
                                  style={{
                                    width: `${Math.min(
                                      Math.abs(
                                        interest.industry_benchmark
                                          .cpc_vs_benchmark
                                      ),
                                      100
                                    )}%`,
                                  }}></div>
                              </div>
                              <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>
                                  Benchmark:{" "}
                                  {formatCurrency(
                                    interest.industry_benchmark.benchmark_cpc
                                  )}
                                </span>
                                <span>
                                  Your: {formatCurrency(interest.avg_cpc)}
                                </span>
                              </div>
                            </div>

                            {/* CPM Info */}
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                  CPM
                                </span>
                                <span className="font-semibold text-blue-700 dark:text-blue-300">
                                  {formatCurrency(interest.avg_cpm)}
                                </span>
                              </div>
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                Benchmark:{" "}
                                {formatCurrency(
                                  interest.industry_benchmark.benchmark_cpm
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-purple-600" />
                            Additional Metrics
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                Adsets Count
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white text-lg">
                                {interest.adsets_count}
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                Impressions
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white text-lg">
                                {formatNumber(interest.total_impressions)}
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                Clicks
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white text-lg">
                                {formatNumber(interest.total_clicks)}
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                CPM
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white text-lg">
                                {formatCurrency(interest.avg_cpm)}
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                Frequency
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white text-lg">
                                {interest.avg_frequency.toFixed(2)}
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                CPA
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white text-lg">
                                {interest.avg_cpa
                                  ? formatCurrency(interest.avg_cpa)
                                  : "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Interest Strength Score */}
                          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                                Interest Strength
                              </span>
                              <span className="font-bold text-purple-700 dark:text-purple-300">
                                {interest.interest_strength_score}/160
                              </span>
                            </div>
                            <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${interest.interest_strength_score}%`,
                                }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Data Quality */}
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                            Data Quality & Confidence
                          </h4>
                          <div className="space-y-4">
                            {/* Quality Label */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                  backgroundColor: interest.data_quality.color,
                                }}></div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {interest.data_quality.label}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {interest.data_quality.description}
                                </p>
                              </div>
                            </div>

                            {/* Confidence Level */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                  Data Confidence
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {(
                                    interest.data_quality.confidence * 100
                                  ).toFixed(0)}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${
                                      interest.data_quality.confidence * 100
                                    }%`,
                                  }}></div>
                              </div>
                            </div>

                            {/* Attribution Confidence */}
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                                Attribution Confidence
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                  {interest.attribution_confidence_label}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  (
                                  {(
                                    interest.attribution_confidence * 100
                                  ).toFixed(0)}
                                  %)
                                </span>
                              </div>
                            </div>

                            {/* Recommendation */}
                            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                                💡 Recommendation
                              </p>
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                {interest.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* No Ad Account Selected State */}
      {!loading && !data && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <ChartBarIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No data available
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Select an ad account and click "Refresh Data" to analyze interest
            performance.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFetchData()}
            disabled={!selectedAccount}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            Analyze Interests
          </motion.button>
        </motion.div>
      )}

      {/* No Interests Found in Ad Account/Campaign (404 Case) */}
      {!loading && hasNoInterests && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-12 h-12 text-yellow-600 dark:text-yellow-500" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            No Interests Found
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-2 max-w-md mx-auto">
            {selectedCampaign && selectedCampaign !== "all" ? (
              <>
                The campaign{" "}
                <span className="font-semibold">
                  {campaigns.find((c) => c.id === selectedCampaign)?.name ||
                    selectedCampaign}
                </span>{" "}
                doesn't have any interest targeting.
              </>
            ) : (
              <>
                The ad account{" "}
                <span className="font-semibold">
                  {adAccounts.find((a) => a.id === selectedAccount)?.name ||
                    selectedAccount}
                </span>{" "}
                doesn't have any campaigns with interest targeting.
              </>
            )}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
            Interest targeting helps Facebook show your ads to people interested
            in specific topics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {selectedCampaign && selectedCampaign !== "all" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Reset to all campaigns
                  handleFetchData(selectedAccount, "all");
                }}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
                View All Campaigns
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Trigger data sync/refresh
                handleFetchData(selectedAccount, selectedCampaign || "all");
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <ArrowPathIcon className="w-5 h-5" />
              Refresh Data
            </motion.button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-lg mx-auto">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
              💡 Tip: How to add interest targeting
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 text-left">
              1. Go to Facebook Ads Manager
              <br />
              2. Edit your ad set
              <br />
              3. In the "Audience" section, add interests under "Detailed
              Targeting"
              <br />
              4. Save and sync your data here
            </p>
          </div>
        </motion.div>
      )}

      {/* Filtered Results Empty (but data exists) */}
      {!loading &&
        data &&
        !hasNoInterests &&
        filteredInterests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <FunnelIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No interests match your filters
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your filters to see more results.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                dispatch(setSelectedTier("all"));
                dispatch(setSelectedIndustry(null));
                dispatch(setSearchTerm(""));
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all">
              Clear All Filters
            </motion.button>
          </motion.div>
        )}
    </div>
  );
};

export default InterestAttributionPage;
