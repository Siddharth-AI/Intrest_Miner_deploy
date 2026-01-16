// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { createPortal } from "react-dom";
// import {
//   XMarkIcon,
//   ArrowTrendingUpIcon,
//   ArrowTrendingDownIcon,
//   MinusIcon,
//   ChartBarIcon,
//   CalendarIcon,
// } from "@heroicons/react/24/outline";
// import { useAppSelector } from "../../../store/hooks";
// import { CampaignSummary } from "./CampaignSummary";
// interface InterestDetailModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   interest: any;
// }

// export const InterestDetailModal: React.FC<InterestDetailModalProps> = ({
//   isOpen,
//   onClose,
//   interest,
// }) => {
//   const { historyData, loading } = useAppSelector(
//     (state) => state.interestAnalysis
//   );

//   if (!isOpen || !interest) return null;

//   // Find this interest's history data
//   const interestHistory = historyData?.interests.find(
//     (h: any) => h.interestId === interest.interestId
//   );

//   const getScoreColor = (score: number) => {
//     if (score >= 75) return "text-green-600 dark:text-green-400";
//     if (score >= 60) return "text-blue-600 dark:text-blue-400";
//     if (score >= 45) return "text-yellow-600 dark:text-yellow-400";
//     return "text-red-600 dark:text-red-400";
//   };

//   const getTrendIcon = (trend: string) => {
//     if (trend === "improving")
//       return <ArrowTrendingUpIcon className="w-5 h-5" />;
//     if (trend === "declining")
//       return <ArrowTrendingDownIcon className="w-5 h-5" />;
//     return <MinusIcon className="w-5 h-5" />;
//   };

//   const getTrendColor = (trend: string) => {
//     if (trend === "improving")
//       return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
//     if (trend === "declining")
//       return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
//     return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
//   };

//   return createPortal(
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//         <motion.div
//           initial={{ scale: 0.95, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.95, opacity: 0 }}
//           onClick={(e) => e.stopPropagation()}
//           className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//           {/* Header */}
//           <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-indigo-500 to-purple-600">
//             <div className="flex items-start justify-between">
//               <div className="flex-1 text-white">
//                 <h2 className="text-2xl font-bold mb-3">
//                   {interest.interestName}
//                 </h2>
//                 {interestHistory && (
//                   <div className="flex items-center gap-4">
//                     <div
//                       className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getTrendColor(
//                         interestHistory.trend
//                       )}`}>
//                       {getTrendIcon(interestHistory.trend)}
//                       <span className="text-sm font-medium capitalize">
//                         {interestHistory.trend}
//                       </span>
//                       <span className="text-lg font-bold">
//                         {interestHistory.changePercent}
//                       </span>
//                     </div>
//                     <div className="text-sm text-purple-100">
//                       📊 Tracked for{" "}
//                       {interestHistory.daysTracked ||
//                         interestHistory.history?.length ||
//                         0}{" "}
//                       days
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <button
//                 onClick={onClose}
//                 className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
//                 <XMarkIcon className="w-6 h-6 text-white" />
//               </button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-6">
//             {loading ? (
//               <div className="text-center py-12">
//                 <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
//                 <p className="text-gray-600 dark:text-gray-400">
//                   Loading history...
//                 </p>
//               </div>
//             ) : interestHistory &&
//               interestHistory.history &&
//               interestHistory.history.length > 0 ? (
//               <>
//                 {/* Campaign Info Card */}
//                 {historyData && (
//                   <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
//                     <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//                       <div>
//                         <div className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium">
//                           Campaign
//                         </div>
//                         <div className="text-sm font-semibold text-blue-900 dark:text-blue-300 truncate">
//                           {historyData.campaignName}
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium">
//                           Objective
//                         </div>
//                         <div className="text-sm font-semibold text-blue-900 dark:text-blue-300">
//                           {historyData.objective}
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium">
//                           Days Available
//                         </div>
//                         <div className="text-sm font-semibold text-blue-900 dark:text-blue-300">
//                           {historyData.daysAvailable} /{" "}
//                           {historyData.daysRequested}
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium">
//                           Total Interests
//                         </div>
//                         <div className="text-sm font-semibold text-blue-900 dark:text-blue-300">
//                           {historyData.interests.length}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Current Stats */}
//                 <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
//                   <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
//                     <div
//                       className={`text-3xl font-bold mb-1 ${getScoreColor(
//                         interestHistory.history[0]?.score
//                       )}`}>
//                       {interestHistory.history[0]?.score.toFixed(1)}
//                     </div>
//                     <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
//                       Current Score
//                     </div>
//                   </div>
//                   <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
//                     <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
//                       {interestHistory.history[0]?.metrics.ctr?.toFixed(2) ||
//                         "0.00"}
//                       %
//                     </div>
//                     <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
//                       CTR
//                     </div>
//                   </div>
//                   <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
//                     <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
//                       {interestHistory.history[0]?.metrics.frequency?.toFixed(
//                         2
//                       ) || "0.00"}
//                     </div>
//                     <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
//                       Frequency
//                     </div>
//                   </div>
//                   <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
//                     <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
//                       {interestHistory.history[0]?.metrics.leads || 0}
//                     </div>
//                     <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
//                       Leads
//                     </div>
//                   </div>
//                   <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
//                     <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
//                       ₹
//                       {interestHistory.history[0]?.metrics.costPerLead?.toFixed(
//                         0
//                       ) || 0}
//                     </div>
//                     <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
//                       Cost/Lead
//                     </div>
//                   </div>
//                 </div>

//                 {/* Performance Trend Chart */}
//                 <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                     <ChartBarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                     Performance Score Trend
//                   </h3>
//                   <div className="flex items-end gap-2 h-64">
//                     {interestHistory.history
//                       .slice()
//                       .reverse()
//                       .map((day: any, i: number) => {
//                         const maxScore = Math.max(
//                           ...interestHistory.history.map(
//                             (h: any) => h.score || 0
//                           )
//                         );
//                         const height =
//                           maxScore > 0 ? (day.score / maxScore) * 100 : 0;
//                         return (
//                           <div
//                             key={i}
//                             className="flex-1 flex flex-col items-center gap-2">
//                             <div
//                               className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all relative group cursor-pointer"
//                               style={{ height: `${Math.max(height, 5)}%` }}>
//                               <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap z-10 shadow-lg">
//                                 <div className="font-bold text-sm mb-1">
//                                   Score: {day.score.toFixed(1)}
//                                 </div>
//                                 <div>Leads: {day.metrics.leads || 0}</div>
//                                 <div>
//                                   CTR: {day.metrics.ctr?.toFixed(2) || 0}%
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
//                               {new Date(day.date).toLocaleDateString("en-US", {
//                                 month: "short",
//                                 day: "numeric",
//                               })}
//                             </div>
//                           </div>
//                         );
//                       })}
//                   </div>
//                 </div>

//                 {/* Metrics Trend Charts */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* CTR Trend */}
//                   <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//                     <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
//                       CTR Trend
//                     </h3>
//                     <div className="flex items-end gap-1.5 h-40">
//                       {interestHistory.history
//                         .slice()
//                         .reverse()
//                         .map((day: any, i: number) => {
//                           const maxCTR = Math.max(
//                             ...interestHistory.history.map(
//                               (h: any) => h.metrics.ctr || 0
//                             )
//                           );
//                           const height =
//                             maxCTR > 0
//                               ? ((day.metrics.ctr || 0) / maxCTR) * 100
//                               : 0;
//                           return (
//                             <div
//                               key={i}
//                               className="flex-1 flex flex-col items-center gap-1 group">
//                               <div
//                                 className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t hover:from-green-600 hover:to-green-500 transition-all relative"
//                                 style={{ height: `${Math.max(height, 5)}%` }}>
//                                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
//                                   {day.metrics.ctr?.toFixed(2) || 0}%
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>

//                   {/* Leads Trend */}
//                   <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//                     <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
//                       Leads Trend
//                     </h3>
//                     <div className="flex items-end gap-1.5 h-40">
//                       {interestHistory.history
//                         .slice()
//                         .reverse()
//                         .map((day: any, i: number) => {
//                           const maxLeads = Math.max(
//                             ...interestHistory.history.map(
//                               (h: any) => h.metrics.leads || 0
//                             )
//                           );
//                           const height =
//                             maxLeads > 0
//                               ? ((day.metrics.leads || 0) / maxLeads) * 100
//                               : 0;
//                           return (
//                             <div
//                               key={i}
//                               className="flex-1 flex flex-col items-center gap-1 group">
//                               <div
//                                 className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t hover:from-purple-600 hover:to-purple-500 transition-all relative"
//                                 style={{ height: `${Math.max(height, 5)}%` }}>
//                                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
//                                   {day.metrics.leads || 0}
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>
//                 </div>

//                 {/* 🔥 Campaign Summary Component - ADD HERE */}
//                 {historyData?.campaignSummary &&
//                   historyData.campaignSummary.length > 0 && (
//                     <CampaignSummary
//                       campaignSummary={historyData.campaignSummary}
//                     />
//                   )}

//                 {/* Daily Breakdown Table */}
//                 <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
//                   <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
//                       <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                       Daily Performance Breakdown
//                     </h3>
//                   </div>
//                   <div className="max-h-96 overflow-y-auto">
//                     {interestHistory.history.map((day: any, idx: number) => (
//                       <div
//                         key={idx}
//                         className="p-5 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
//                         <div className="flex items-center justify-between mb-4">
//                           <div>
//                             <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
//                               <span>
//                                 {new Date(day.date).toLocaleDateString(
//                                   "en-US",
//                                   {
//                                     weekday: "long",
//                                     year: "numeric",
//                                     month: "long",
//                                     day: "numeric",
//                                   }
//                                 )}
//                               </span>
//                               {idx === 0 && (
//                                 <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
//                                   Latest
//                                 </span>
//                               )}
//                             </div>
//                             <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                               Day {interestHistory.history.length - idx} of
//                               tracking
//                             </div>
//                           </div>
//                           <div
//                             className={`text-3xl font-bold ${getScoreColor(
//                               day.score
//                             )}`}>
//                             {day.score.toFixed(1)}
//                           </div>
//                         </div>
//                         <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
//                           <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
//                             <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                               CTR
//                             </div>
//                             <div className="text-base font-semibold text-gray-900 dark:text-white">
//                               {day.metrics.ctr?.toFixed(2) || "0.00"}%
//                             </div>
//                           </div>
//                           <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
//                             <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                               Frequency
//                             </div>
//                             <div className="text-base font-semibold text-gray-900 dark:text-white">
//                               {day.metrics.frequency?.toFixed(2) || "0.00"}
//                             </div>
//                           </div>
//                           <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
//                             <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                               Leads
//                             </div>
//                             <div className="text-base font-semibold text-gray-900 dark:text-white">
//                               {day.metrics.leads || 0}
//                             </div>
//                           </div>
//                           <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
//                             <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                               Cost/Lead
//                             </div>
//                             <div className="text-base font-semibold text-gray-900 dark:text-white">
//                               ₹{day.metrics.costPerLead?.toFixed(0) || 0}
//                             </div>
//                           </div>
//                           <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
//                             <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                               Spend
//                             </div>
//                             <div className="text-base font-semibold text-gray-900 dark:text-white">
//                               ₹{((day.metrics.spend || 0) / 1000).toFixed(1)}k
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Recommendations */}
//                 {interest.recommendations &&
//                   interest.recommendations.length > 0 && (
//                     <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
//                       <h3 className="text-base font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
//                         <span className="text-xl">💡</span>
//                         AI Recommendations
//                       </h3>
//                       <ul className="space-y-2">
//                         {interest.recommendations.map(
//                           (rec: string, idx: number) => (
//                             <li
//                               key={idx}
//                               className="text-sm text-blue-800 dark:text-blue-300 flex gap-2">
//                               <span className="font-bold">•</span>
//                               <span>{rec}</span>
//                             </li>
//                           )
//                         )}
//                       </ul>
//                     </div>
//                   )}
//               </>
//             ) : (
//               <div className="text-center py-20">
//                 <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//                   No Historical Data Available
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   This interest doesn't have enough tracking history yet.
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
//             <button
//               onClick={onClose}
//               className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg">
//               Close
//             </button>
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>,
//     document.body
//   );
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  XMarkIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  ChartBarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector } from "../../../store/hooks";
import { CampaignSummary } from "./CampaignSummary";

interface InterestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  interest: any;
}

export const InterestDetailModal: React.FC<InterestDetailModalProps> = ({
  isOpen,
  onClose,
  interest,
}) => {
  const { historyData, loading } = useAppSelector(
    (state) => state.interestAnalysis
  );

  if (!isOpen || !interest) return null;

  // Find this interest's history data
  const interestHistory = historyData?.interests.find(
    (h: any) => h.interestId === interest.interestId
  );

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-blue-600 dark:text-blue-400";
    if (score >= 45) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "improving")
      return <ArrowTrendingUpIcon className="w-5 h-5" />;
    if (trend === "declining")
      return <ArrowTrendingDownIcon className="w-5 h-5" />;
    return <MinusIcon className="w-5 h-5" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === "improving")
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    if (trend === "declining")
      return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
    return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="flex items-start justify-between">
              <div className="flex-1 text-white">
                <h2 className="text-2xl font-bold mb-3">
                  {interest.interestName}
                </h2>
                {interestHistory && (
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getTrendColor(
                        interestHistory.trend
                      )}`}>
                      {getTrendIcon(interestHistory.trend)}
                      <span className="text-sm font-medium capitalize">
                        {interestHistory.trend}
                      </span>
                      <span className="text-lg font-bold">
                        {interestHistory.changePercent}
                      </span>
                    </div>
                    <div className="text-sm text-purple-100">
                      📊 Tracked for{" "}
                      {interestHistory.daysTracked ||
                        interestHistory.history?.length ||
                        0}{" "}
                      days
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading history...
                </p>
              </div>
            ) : interestHistory &&
              interestHistory.history &&
              interestHistory.history.length > 0 ? (
              <>
                {/* Campaign Info Card */}
                {historyData && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium">
                          Campaign
                        </div>
                        <div className="text-sm font-semibold text-blue-900 dark:text-blue-300 truncate">
                          {historyData.campaignName}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium">
                          Objective
                        </div>
                        <div className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                          {historyData.objective}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium">
                          Days Available
                        </div>
                        <div className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                          {historyData.daysAvailable} /{" "}
                          {historyData.daysRequested}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium">
                          Total Interests
                        </div>
                        <div className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                          {historyData.interests.length}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Stats - Latest Day */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <div
                      className={`text-3xl font-bold mb-1 ${getScoreColor(
                        interestHistory.history[0]?.score || 0
                      )}`}>
                      {(interestHistory.history[0]?.score || 0).toFixed(1)}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Current Score
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {interestHistory.history[0]?.metrics.ctr?.toFixed(2) ||
                        "0.00"}
                      %
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      CTR
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {interestHistory.history[0]?.metrics.frequency?.toFixed(
                        2
                      ) || "0.00"}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      Frequency
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {interestHistory.history[0]?.metrics.leads || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      Leads
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      ₹
                      {interestHistory.history[0]?.metrics.costPerLead?.toFixed(
                        0
                      ) || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      Cost/Lead
                    </div>
                  </div>
                </div>

                {/* Performance Trend Chart - 🔥 FIXED */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Performance Score Trend
                  </h3>
                  <div className="relative h-64">
                    <div className="flex items-end justify-between gap-2 h-full">
                      {interestHistory.history
                        .slice()
                        .reverse()
                        .map((day: any, i: number) => {
                          const maxScore = Math.max(
                            ...interestHistory.history.map(
                              (h: any) => h.score || 0
                            ),
                            1
                          );
                          const minScore = Math.min(
                            ...interestHistory.history.map(
                              (h: any) => h.score || 0
                            )
                          );
                          const range = maxScore - minScore || 1;
                          // 🔥 Better height calculation with minimum visibility
                          const height =
                            ((day.score - minScore) / range) * 85 + 10; // 10-95% range

                          return (
                            <div
                              key={i}
                              className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                              <div
                                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all relative group cursor-pointer min-h-[20px]"
                                style={{ height: `${height}%` }}>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap z-10 shadow-lg pointer-events-none">
                                  <div className="font-bold text-sm mb-1">
                                    Score: {(day.score || 0).toFixed(1)}
                                  </div>
                                  <div>Leads: {day.metrics?.leads || 0}</div>
                                  <div>
                                    CTR: {day.metrics?.ctr?.toFixed(2) || 0}%
                                  </div>
                                  <div>
                                    Spend: ₹
                                    {((day.metrics?.spend || 0) / 1000).toFixed(
                                      1
                                    )}
                                    k
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">
                                {new Date(day.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Metrics Trend Charts - 🔥 FIXED */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CTR Trend */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                      CTR Trend (%)
                    </h3>
                    <div className="relative h-40">
                      <div className="flex items-end justify-between gap-1.5 h-full">
                        {interestHistory.history
                          .slice()
                          .reverse()
                          .map((day: any, i: number) => {
                            const maxCTR = Math.max(
                              ...interestHistory.history.map(
                                (h: any) => h.metrics?.ctr || 0
                              ),
                              0.1
                            );
                            const minCTR = Math.min(
                              ...interestHistory.history.map(
                                (h: any) => h.metrics?.ctr || 0
                              )
                            );
                            const range = maxCTR - minCTR || 0.1;
                            const ctrValue = day.metrics?.ctr || 0;
                            const height =
                              ((ctrValue - minCTR) / range) * 85 + 10;

                            return (
                              <div
                                key={i}
                                className="flex-1 flex flex-col items-center h-full justify-end group">
                                <div
                                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t hover:from-green-600 hover:to-green-500 transition-all relative min-h-[10px]"
                                  style={{ height: `${height}%` }}>
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                                    {ctrValue.toFixed(2)}%
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  {/* Leads Trend */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                      Leads Trend
                    </h3>
                    <div className="relative h-40">
                      <div className="flex items-end justify-between gap-1.5 h-full">
                        {interestHistory.history
                          .slice()
                          .reverse()
                          .map((day: any, i: number) => {
                            const maxLeads = Math.max(
                              ...interestHistory.history.map(
                                (h: any) => h.metrics?.leads || 0
                              ),
                              1
                            );
                            const minLeads = Math.min(
                              ...interestHistory.history.map(
                                (h: any) => h.metrics?.leads || 0
                              )
                            );
                            const range = maxLeads - minLeads || 1;
                            const leadsValue = day.metrics?.leads || 0;
                            const height =
                              ((leadsValue - minLeads) / range) * 85 + 10;

                            return (
                              <div
                                key={i}
                                className="flex-1 flex flex-col items-center h-full justify-end group">
                                <div
                                  className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t hover:from-purple-600 hover:to-purple-500 transition-all relative min-h-[10px]"
                                  style={{ height: `${height}%` }}>
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                                    {leadsValue}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign Summary */}
                {historyData?.campaignSummary &&
                  historyData.campaignSummary.length > 0 && (
                    <CampaignSummary
                      campaignSummary={historyData.campaignSummary}
                    />
                  )}

                {/* Daily Breakdown Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Daily Performance Breakdown
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {interestHistory.history.map((day: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-5 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <span>
                                {new Date(day.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                              {idx === 0 && (
                                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                  Latest
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Day {interestHistory.history.length - idx} of
                              tracking
                            </div>
                          </div>
                          <div
                            className={`text-3xl font-bold ${getScoreColor(
                              day.score || 0
                            )}`}>
                            {(day.score || 0).toFixed(1)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              CTR
                            </div>
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {day.metrics?.ctr?.toFixed(2) || "0.00"}%
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Frequency
                            </div>
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {day.metrics?.frequency?.toFixed(2) || "0.00"}
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Leads
                            </div>
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {day.metrics?.leads || 0}
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Cost/Lead
                            </div>
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              ₹{day.metrics?.costPerLead?.toFixed(0) || 0}
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Spend
                            </div>
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              ₹{((day.metrics?.spend || 0) / 1000).toFixed(1)}k
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                {interest.recommendations &&
                  interest.recommendations.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                      <h3 className="text-base font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        AI Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {interest.recommendations.map(
                          (rec: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-sm text-blue-800 dark:text-blue-300 flex gap-2">
                              <span className="font-bold">•</span>
                              <span>{rec}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </>
            ) : (
              <div className="text-center py-20">
                <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Historical Data Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This interest doesn't have enough tracking history yet.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
