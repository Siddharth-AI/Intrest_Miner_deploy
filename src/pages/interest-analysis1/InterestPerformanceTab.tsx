// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import {
//   MagnifyingGlassIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   ChartBarIcon,
//   ClockIcon,
// } from "@heroicons/react/24/outline";
// import { useAppDispatch } from "../../../store/hooks";
// import { getInterestBreakdown } from "../../../store/features/interestAnalysisSlice";

// interface InterestPerformanceTabProps {
//   trackedCampaigns: any[];
//   selectedCampaignForView: string | null;
//   onSelectCampaign: (campaignId: string) => void;
//   analysisResult: any;
//   onViewHistory: (interest: any) => void;
//   loading: boolean;
//   breakdownData: any;
//   onCloseBreakdown: () => void;
// }

// export const InterestPerformanceTab: React.FC<InterestPerformanceTabProps> = ({
//   trackedCampaigns,
//   selectedCampaignForView,
//   onSelectCampaign,
//   analysisResult,
//   onViewHistory,
//   loading,
// }) => {
//   const dispatch = useAppDispatch();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filterClassification, setFilterClassification] =
//     useState<string>("ALL");
//   const itemsPerPage = 12;

//   // Filter interests
//   const filteredInterests = useMemo(() => {
//     if (!analysisResult) return [];
//     let filtered = analysisResult.interests.filter((interest: any) =>
//       interest.interestName.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     if (filterClassification !== "ALL") {
//       filtered = filtered.filter(
//         (i: any) => i.classification === filterClassification
//       );
//     }
//     return filtered;
//   }, [analysisResult, searchTerm, filterClassification]);

//   const paginatedInterests = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredInterests.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredInterests, currentPage]);

//   const totalPages = Math.ceil(filteredInterests.length / itemsPerPage);

//   // 🔥 Handler for viewing breakdown - ALWAYS SHOW
//   const handleViewBreakdown = (interest: any) => {
//     if (selectedCampaignForView) {
//       dispatch(
//         getInterestBreakdown({
//           campaignId: selectedCampaignForView,
//           interestId: interest.interestId,
//         })
//       );
//     }
//   };

//   const getClassificationBadge = (classification: string) => {
//     const styles = {
//       EXCELLENT:
//         "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
//       GOOD: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
//       AVERAGE:
//         "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
//       POOR: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
//       NO_DATA:
//         "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
//     };
//     return styles[classification as keyof typeof styles] || styles.AVERAGE;
//   };

//   const getScoreColor = (score: number) => {
//     if (score >= 75) return "text-green-600 dark:text-green-400";
//     if (score >= 60) return "text-blue-600 dark:text-blue-400";
//     if (score >= 45) return "text-yellow-600 dark:text-yellow-400";
//     return "text-red-600 dark:text-red-400";
//   };

//   // If no campaign selected, show campaign list
//   if (!selectedCampaignForView) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {trackedCampaigns.map((campaign) => (
//           <motion.div
//             key={campaign.campaign_id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             onClick={() => onSelectCampaign(campaign.campaign_id)}
//             className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-lg transition-all cursor-pointer p-6">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
//               {campaign.campaign_name}
//             </h3>

//             <div className="flex items-center gap-2 mb-4">
//               <span
//                 className={`px-3 py-1 rounded-full text-xs font-medium ${
//                   campaign.status === "ACTIVE"
//                     ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
//                     : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
//                 }`}>
//                 {campaign.status}
//               </span>
//               <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
//                 {campaign.objective}
//               </span>
//             </div>

//             <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
//               <div className="flex items-center gap-2">
//                 <ClockIcon className="w-4 h-4" />
//                 <span>
//                   Last synced:{" "}
//                   {new Date(campaign.last_synced_at).toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all">
//               View Analysis
//             </button>
//           </motion.div>
//         ))}
//       </div>
//     );
//   }

//   // If campaign selected, show analysis
//   return (
//     <div className="space-y-6">
//       {/* Header with Back Button */}
//       <div className="flex items-center justify-between">
//         <button
//           onClick={() => onSelectCampaign(null as any)}
//           className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
//           <ChevronLeftIcon className="w-5 h-5" />
//           Back to Campaigns
//         </button>

//         {analysisResult && (
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Analyzed on{" "}
//             {new Date(analysisResult.latestAnalysisDate).toLocaleDateString()}
//           </p>
//         )}
//       </div>

//       {/* Campaign Info Card */}
//       {analysisResult && (
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
//           <h2 className="text-2xl font-bold mb-4">
//             {analysisResult.campaignName}
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
//             {[
//               {
//                 label: "Excellent",
//                 value: analysisResult.summary.excellent,
//                 color: "bg-green-500",
//               },
//               {
//                 label: "Good",
//                 value: analysisResult.summary.good,
//                 color: "bg-blue-500",
//               },
//               {
//                 label: "Average",
//                 value: analysisResult.summary.average,
//                 color: "bg-yellow-500",
//               },
//               {
//                 label: "Poor",
//                 value: analysisResult.summary.poor,
//                 color: "bg-red-500",
//               },
//               {
//                 label: "Total",
//                 value: analysisResult.summary.totalInterests,
//                 color: "bg-white/20",
//               },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 className={`${item.color} rounded-lg p-3 text-center`}>
//                 <div className="text-3xl font-bold">{item.value}</div>
//                 <div className="text-xs opacity-90">{item.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Search & Filters */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-1">
//           <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search interests..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>

//         <select
//           value={filterClassification}
//           onChange={(e) => {
//             setFilterClassification(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500">
//           <option value="ALL">All Classifications</option>
//           <option value="EXCELLENT">Excellent</option>
//           <option value="GOOD">Good</option>
//           <option value="AVERAGE">Average</option>
//           <option value="POOR">Poor</option>
//           <option value="NO_DATA">No Data</option>
//         </select>
//       </div>

//       {/* Interests Grid */}
//       {loading ? (
//         <div className="text-center py-20">
//           <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
//           <p className="text-gray-600 dark:text-gray-400">
//             Loading analysis...
//           </p>
//         </div>
//       ) : paginatedInterests.length > 0 ? (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {paginatedInterests.map((interest: any, index: number) => (
//               <motion.div
//                 key={interest.interestId + interest.adsetId}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-lg transition-all group">
//                 {/* Header */}
//                 <div className="p-5 border-b border-gray-100 dark:border-gray-700">
//                   <div className="flex items-start justify-between mb-3">
//                     <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                       {interest.interestName}
//                     </h3>
//                   </div>
//                   <span
//                     className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium border ${getClassificationBadge(
//                       interest.classification
//                     )}`}>
//                     {interest.classification}
//                   </span>
//                 </div>

//                 {/* Body */}
//                 <div className="p-5 space-y-4">
//                   {/* Score */}
//                   <div className="text-center">
//                     <div
//                       className={`text-4xl font-bold ${getScoreColor(
//                         interest.performanceScore
//                       )}`}>
//                       {interest.performanceScore.toFixed(1)}
//                     </div>
//                     <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                       Performance Score
//                     </div>
//                   </div>

//                   {/* Metrics */}
//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
//                       <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                         Confidence
//                       </div>
//                       <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                         {interest.predictionConfidence.toFixed(0)}%
//                       </div>
//                     </div>
//                     <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
//                       <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                         Ad Sets
//                       </div>
//                       <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                         {interest.crossAdsetAppearances}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Sub-scores */}
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-xs">
//                       <span className="text-gray-600 dark:text-gray-400">
//                         Historical
//                       </span>
//                       <span className="font-semibold text-gray-900 dark:text-white">
//                         {interest.historicalScore.toFixed(1)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-gray-600 dark:text-gray-400">
//                         Correlation
//                       </span>
//                       <span className="font-semibold text-gray-900 dark:text-white">
//                         {interest.correlationScore.toFixed(1)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-gray-600 dark:text-gray-400">
//                         Audience Size
//                       </span>
//                       <span className="font-semibold text-gray-900 dark:text-white">
//                         {interest.audienceSizeScore.toFixed(1)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Ad Set Name */}
//                   <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                     {interest.adsetName}
//                   </div>

//                   {/* Recommendations */}
//                   {interest.recommendations &&
//                     interest.recommendations.length > 0 && (
//                       <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
//                         <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
//                           💡 {interest.recommendations[0]}
//                         </p>
//                       </div>
//                     )}

//                   {/* 🔥 Action Buttons - ALWAYS SHOW BOTH */}
//                   <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
//                     <button
//                       onClick={() => onViewHistory(interest)}
//                       className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1">
//                       📈 History
//                     </button>
//                     <button
//                       onClick={() => handleViewBreakdown(interest)}
//                       className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1">
//                       📊 Breakdown
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//               <div className="text-sm text-gray-600 dark:text-gray-400">
//                 Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
//                 {Math.min(currentPage * itemsPerPage, filteredInterests.length)}{" "}
//                 of {filteredInterests.length}
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
//                   <ChevronLeftIcon className="w-5 h-5" />
//                 </button>
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   let pageNum;
//                   if (totalPages <= 5) {
//                     pageNum = i + 1;
//                   } else if (currentPage <= 3) {
//                     pageNum = i + 1;
//                   } else if (currentPage >= totalPages - 2) {
//                     pageNum = totalPages - 4 + i;
//                   } else {
//                     pageNum = currentPage - 2 + i;
//                   }
//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => setCurrentPage(pageNum)}
//                       className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                         currentPage === pageNum
//                           ? "bg-blue-500 text-white shadow-md"
//                           : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
//                       }`}>
//                       {pageNum}
//                     </button>
//                   );
//                 })}
//                 <button
//                   onClick={() =>
//                     setCurrentPage(Math.min(totalPages, currentPage + 1))
//                   }
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
//                   <ChevronRightIcon className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
//           <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//           <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//             No Interests Found
//           </h3>
//           <p className="text-gray-600 dark:text-gray-400">
//             Try adjusting your filters
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChartBarIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  getInterestBreakdown,
  toggleTrackedCampaignSelection,
} from "../../../store/features/interestAnalysisSlice";

interface InterestPerformanceTabProps {
  trackedCampaigns: any[];
  selectedCampaignForView: string | null;
  onSelectCampaign: (campaignId: string) => void;
  analysisResult: any;
  onViewHistory: (interest: any) => void;
  onStopTracking: (campaignId: string) => void; // 🔥 ADD THIS LINE
  loading: boolean;
  breakdownData: any;
  onCloseBreakdown: () => void;
}

export const InterestPerformanceTab: React.FC<InterestPerformanceTabProps> = ({
  trackedCampaigns,
  selectedCampaignForView,
  onSelectCampaign,
  analysisResult,
  onViewHistory,
  onStopTracking,
  loading,
}) => {
  const dispatch = useAppDispatch();
  const { selectedTrackedCampaignIds } = useAppSelector(
    (state) => state.interestAnalysis
  ); // 🔥 ADD THIS LINE
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterClassification, setFilterClassification] =
    useState<string>("ALL");
  const itemsPerPage = 12;

  // Filter interests
  const filteredInterests = useMemo(() => {
    if (!analysisResult) return [];
    let filtered = analysisResult.interests.filter((interest: any) =>
      interest.interestName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterClassification !== "ALL") {
      filtered = filtered.filter(
        (i: any) => i.classification === filterClassification
      );
    }
    return filtered;
  }, [analysisResult, searchTerm, filterClassification]);

  const paginatedInterests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInterests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInterests, currentPage]);

  const totalPages = Math.ceil(filteredInterests.length / itemsPerPage);

  // 🔥 Handler for viewing breakdown - ALWAYS SHOW
  const handleViewBreakdown = (interest: any) => {
    if (selectedCampaignForView) {
      dispatch(
        getInterestBreakdown({
          campaignId: selectedCampaignForView,
          interestId: interest.interestId,
        })
      );
    }
  };

  const getClassificationBadge = (classification: string) => {
    const styles = {
      EXCELLENT:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      GOOD: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      AVERAGE:
        "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
      POOR: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
      NO_DATA:
        "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
    };
    return styles[classification as keyof typeof styles] || styles.AVERAGE;
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-blue-600 dark:text-blue-400";
    if (score >= 45) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  // If no campaign selected, show campaign list
  if (!selectedCampaignForView) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trackedCampaigns.map((campaign) => {
          const isSelected = selectedTrackedCampaignIds.includes(
            campaign.campaign_id
          );

          return (
            <motion.div
              key={campaign.campaign_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative bg-white dark:bg-gray-800 rounded-xl border-2 ${
                isSelected
                  ? "border-red-500 dark:border-red-600 shadow-lg"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
              } shadow-sm hover:shadow-lg transition-all p-6`}>
              {/* Checkbox for multi-select */}
              <div className="absolute top-3 left-3 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(
                      toggleTrackedCampaignSelection(campaign.campaign_id)
                    );
                  }}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-red-500 border-red-500"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-red-500"
                  }`}>
                  {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                </button>
              </div>

              {/* Stop tracking icon */}
              <div className="absolute top-3 right-3 z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStopTracking(campaign.campaign_id);
                  }}
                  className="w-7 h-7 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                  title="Stop Tracking">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Clickable content */}
              <div
                onClick={() => onSelectCampaign(campaign.campaign_id)}
                className="cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 pr-20 mt-4">
                  {campaign.campaign_name}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === "ACTIVE"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                    {campaign.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {campaign.objective}
                  </span>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>
                      Last synced:{" "}
                      {new Date(campaign.last_synced_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all">
                  View Analysis
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // If campaign selected, show analysis
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onSelectCampaign(null as any)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Campaigns
        </button>

        {analysisResult && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Analyzed on{" "}
            {new Date(analysisResult.latestAnalysisDate).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Campaign Info Card */}
      {analysisResult && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            {analysisResult.campaignName}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              {
                label: "Excellent",
                value: analysisResult.summary.excellent,
                color: "bg-green-500",
              },
              {
                label: "Good",
                value: analysisResult.summary.good,
                color: "bg-blue-500",
              },
              {
                label: "Average",
                value: analysisResult.summary.average,
                color: "bg-yellow-500",
              },
              {
                label: "Poor",
                value: analysisResult.summary.poor,
                color: "bg-red-500",
              },
              {
                label: "Total",
                value: analysisResult.summary.totalInterests,
                color: "bg-white/20",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`${item.color} rounded-lg p-3 text-center`}>
                <div className="text-3xl font-bold">{item.value}</div>
                <div className="text-xs opacity-90">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search interests..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filterClassification}
          onChange={(e) => {
            setFilterClassification(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500">
          <option value="ALL">All Classifications</option>
          <option value="EXCELLENT">Excellent</option>
          <option value="GOOD">Good</option>
          <option value="AVERAGE">Average</option>
          <option value="POOR">Poor</option>
          <option value="NO_DATA">No Data</option>
        </select>
      </div>

      {/* Interests Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading analysis...
          </p>
        </div>
      ) : paginatedInterests.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedInterests.map((interest: any, index: number) => (
              <motion.div
                key={interest.interestId + interest.adsetId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-lg transition-all group">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {interest.interestName}
                    </h3>
                  </div>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium border ${getClassificationBadge(
                      interest.classification
                    )}`}>
                    {interest.classification}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  {/* Score */}
                  <div className="text-center">
                    <div
                      className={`text-4xl font-bold ${getScoreColor(
                        interest.performanceScore
                      )}`}>
                      {interest.performanceScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Performance Score
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Confidence
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {interest.predictionConfidence.toFixed(0)}%
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Ad Sets
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {interest.crossAdsetAppearances}
                      </div>
                    </div>
                  </div>

                  {/* Sub-scores */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
                        Historical
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {interest.historicalScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
                        Correlation
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {interest.correlationScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
                        Audience Size
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {interest.audienceSizeScore.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Ad Set Name */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {interest.adsetName}
                  </div>

                  {/* Recommendations */}
                  {interest.recommendations &&
                    interest.recommendations.length > 0 && (
                      <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          💡 {interest.recommendations[0]}
                        </p>
                      </div>
                    )}

                  {/* 🔥 Action Buttons - ALWAYS SHOW BOTH */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => onViewHistory(interest)}
                      className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1">
                      📈 History
                    </button>
                    <button
                      onClick={() => handleViewBreakdown(interest)}
                      className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1">
                      📊 Breakdown
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, filteredInterests.length)}{" "}
                of {filteredInterests.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}>
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Interests Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
};
