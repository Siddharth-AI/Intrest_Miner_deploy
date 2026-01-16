// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { createPortal } from "react-dom";
// import {
//   XMarkIcon,
//   ChartBarIcon,
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
// } from "@heroicons/react/24/outline";

// interface InterestBreakdownModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   breakdownData: any;
//   loading: boolean;
// }

// export const InterestBreakdownModal: React.FC<InterestBreakdownModalProps> = ({
//   isOpen,
//   onClose,
//   breakdownData,
//   loading,
// }) => {
//   if (!isOpen) return null;

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
//     if (score === 0) return "text-gray-400 dark:text-gray-500";
//     return "text-red-600 dark:text-red-400";
//   };

//   const getConsistencyBadge = (consistency: string) => {
//     const styles = {
//       HIGH: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//       MEDIUM:
//         "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
//       LOW: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//     };
//     return styles[consistency as keyof typeof styles] || styles.MEDIUM;
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
//           <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-500 to-indigo-600">
//             <div className="flex items-start justify-between">
//               <div className="flex-1 text-white">
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
//                     <ChartBarIcon className="w-6 h-6" />
//                   </div>
//                   <h2 className="text-2xl font-bold">Ad Set Breakdown</h2>
//                 </div>
//                 {breakdownData && (
//                   <p className="text-blue-100 text-sm">
//                     {breakdownData.interestName}
//                   </p>
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
//                   Loading breakdown...
//                 </p>
//               </div>
//             ) : breakdownData ? (
//               <>
//                 {/* Aggregated Stats */}
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                   <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
//                     <div className="text-sm text-blue-600 dark:text-blue-400 mb-1 font-medium">
//                       Total Ad Sets
//                     </div>
//                     <div className="text-3xl font-bold text-blue-900 dark:text-blue-300">
//                       {breakdownData.totalAdsets}
//                     </div>
//                   </div>
//                   <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
//                     <div className="text-sm text-green-600 dark:text-green-400 mb-1 font-medium">
//                       Avg Score
//                     </div>
//                     <div
//                       className={`text-3xl font-bold ${getScoreColor(
//                         breakdownData.aggregatedStats.avgScore
//                       )}`}>
//                       {breakdownData.aggregatedStats.avgScore.toFixed(1)}
//                     </div>
//                   </div>
//                   <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
//                     <div className="text-sm text-purple-600 dark:text-purple-400 mb-1 font-medium">
//                       Max Score
//                     </div>
//                     <div
//                       className={`text-3xl font-bold ${getScoreColor(
//                         breakdownData.aggregatedStats.maxScore
//                       )}`}>
//                       {breakdownData.aggregatedStats.maxScore.toFixed(1)}
//                     </div>
//                   </div>
//                   <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-5 border border-orange-200 dark:border-orange-800">
//                     <div className="text-sm text-orange-600 dark:text-orange-400 mb-1 font-medium">
//                       Consistency
//                     </div>
//                     <div
//                       className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${getConsistencyBadge(
//                         breakdownData.aggregatedStats.consistency
//                       )}`}>
//                       {breakdownData.aggregatedStats.consistency}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Insights */}
//                 {breakdownData.insights &&
//                   breakdownData.insights.length > 0 && (
//                     <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-indigo-200 dark:border-indigo-800">
//                       <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
//                         <span className="text-xl">💡</span>
//                         Key Insights
//                       </h3>
//                       <ul className="space-y-2">
//                         {breakdownData.insights.map(
//                           (insight: string, idx: number) => (
//                             <li
//                               key={idx}
//                               className="text-sm text-indigo-800 dark:text-indigo-300 flex items-start gap-2">
//                               <span className="mt-0.5">•</span>
//                               <span>{insight}</span>
//                             </li>
//                           )
//                         )}
//                       </ul>
//                     </div>
//                   )}

//                 {/* Ad Set Performance */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                     <ChartBarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                     Performance by Ad Set
//                   </h3>
//                   <div className="space-y-4">
//                     {breakdownData.adsetPerformance.map(
//                       (adset: any, idx: number) => (
//                         <motion.div
//                           key={adset.adsetId}
//                           initial={{ opacity: 0, x: -20 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: idx * 0.05 }}
//                           className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
//                           {/* Ad Set Header */}
//                           <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
//                             <div className="flex items-start justify-between mb-3">
//                               <div className="flex-1">
//                                 <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
//                                   {adset.adsetName}
//                                 </h4>
//                                 <span
//                                   className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${getClassificationBadge(
//                                     adset.classification
//                                   )}`}>
//                                   {adset.classification}
//                                 </span>
//                               </div>
//                               <div className="text-right">
//                                 <div
//                                   className={`text-3xl font-bold ${getScoreColor(
//                                     adset.performanceScore
//                                   )}`}>
//                                   {adset.performanceScore.toFixed(1)}
//                                 </div>
//                                 <div className="text-xs text-gray-500 dark:text-gray-400">
//                                   Performance Score
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Metrics Grid */}
//                           <div className="p-5">
//                             <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4">
//                               <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
//                                 <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                                   Historical
//                                 </div>
//                                 <div className="text-lg font-bold text-gray-900 dark:text-white">
//                                   {adset.historicalScore.toFixed(1)}
//                                 </div>
//                               </div>
//                               <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
//                                 <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                                   Correlation
//                                 </div>
//                                 <div className="text-lg font-bold text-gray-900 dark:text-white">
//                                   {adset.correlationScore.toFixed(1)}
//                                 </div>
//                               </div>
//                               <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
//                                 <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                                   Audience Size
//                                 </div>
//                                 <div className="text-lg font-bold text-gray-900 dark:text-white">
//                                   {adset.audienceSizeScore.toFixed(1)}
//                                 </div>
//                               </div>
//                               <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
//                                 <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                                   Category
//                                 </div>
//                                 <div className="text-lg font-bold text-gray-900 dark:text-white">
//                                   {adset.categoryScore.toFixed(1)}
//                                 </div>
//                               </div>
//                               <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
//                                 <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                                   Confidence
//                                 </div>
//                                 <div className="text-lg font-bold text-gray-900 dark:text-white">
//                                   {adset.predictionConfidence.toFixed(0)}%
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Recommendations */}
//                             {adset.recommendations &&
//                               adset.recommendations.length > 0 && (
//                                 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
//                                   <div className="flex items-start gap-2">
//                                     <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
//                                     <div className="flex-1">
//                                       <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
//                                         Recommendations
//                                       </h5>
//                                       <ul className="space-y-1">
//                                         {adset.recommendations.map(
//                                           (rec: string, recIdx: number) => (
//                                             <li
//                                               key={recIdx}
//                                               className="text-xs text-blue-800 dark:text-blue-300 flex gap-2">
//                                               <span>•</span>
//                                               <span>{rec}</span>
//                                             </li>
//                                           )
//                                         )}
//                                       </ul>
//                                     </div>
//                                   </div>
//                                 </div>
//                               )}
//                           </div>
//                         </motion.div>
//                       )
//                     )}
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-12">
//                 <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//                 <p className="text-gray-600 dark:text-gray-400">
//                   No breakdown data available
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
//             <button
//               onClick={onClose}
//               className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg">
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
import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  XMarkIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface InterestBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdownData: any;
  loading: boolean;
}

export const InterestBreakdownModal: React.FC<InterestBreakdownModalProps> = ({
  isOpen,
  onClose,
  breakdownData,
  loading,
}) => {
  const [activeAdsetTab, setActiveAdsetTab] = useState(0);

  if (!isOpen) return null;

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
    if (score === 0) return "text-gray-400 dark:text-gray-500";
    return "text-red-600 dark:text-red-400";
  };

  const getConsistencyBadge = (consistency: string) => {
    const styles = {
      HIGH: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      MEDIUM:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      LOW: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[consistency as keyof typeof styles] || styles.MEDIUM;
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
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="flex items-start justify-between">
              <div className="flex-1 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                    <Squares2X2Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Ad Set Breakdown</h2>
                </div>
                {breakdownData && (
                  <div className="space-y-1">
                    <p className="text-blue-100 text-base font-medium">
                      {breakdownData.interestName}
                    </p>
                    <p className="text-blue-200 text-sm">
                      📊 Used in {breakdownData.totalAdsets} Ad Sets
                    </p>
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
                  Loading breakdown...
                </p>
              </div>
            ) : breakdownData ? (
              <>
                {/* Aggregated Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-1 font-medium">
                      Total Ad Sets
                    </div>
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-300">
                      {breakdownData.totalAdsets}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
                    <div className="text-sm text-green-600 dark:text-green-400 mb-1 font-medium">
                      Avg Score
                    </div>
                    <div
                      className={`text-3xl font-bold ${getScoreColor(
                        breakdownData.aggregatedStats.avgScore
                      )}`}>
                      {breakdownData.aggregatedStats.avgScore.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
                    <div className="text-sm text-purple-600 dark:text-purple-400 mb-1 font-medium">
                      Max Score
                    </div>
                    <div
                      className={`text-3xl font-bold ${getScoreColor(
                        breakdownData.aggregatedStats.maxScore
                      )}`}>
                      {breakdownData.aggregatedStats.maxScore.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-5 border border-orange-200 dark:border-orange-800">
                    <div className="text-sm text-orange-600 dark:text-orange-400 mb-1 font-medium">
                      Consistency
                    </div>
                    <div
                      className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${getConsistencyBadge(
                        breakdownData.aggregatedStats.consistency
                      )}`}>
                      {breakdownData.aggregatedStats.consistency}
                    </div>
                  </div>
                </div>

                {/* Insights */}
                {breakdownData.insights &&
                  breakdownData.insights.length > 0 && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-indigo-200 dark:border-indigo-800">
                      <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        Key Insights
                      </h3>
                      <ul className="space-y-2">
                        {breakdownData.insights.map(
                          (insight: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-sm text-indigo-800 dark:text-indigo-300 flex items-start gap-2">
                              <span className="mt-0.5">
                                {insight.split(" ")[0]}
                              </span>
                              <span>
                                {insight.substring(insight.indexOf(" ") + 1)}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {/* 🔥 Ad Set Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                      {breakdownData.adsetPerformance.map(
                        (adset: any, idx: number) => (
                          <button
                            key={adset.adsetId}
                            onClick={() => setActiveAdsetTab(idx)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                              activeAdsetTab === idx
                                ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            }`}>
                            <div className="flex items-center gap-2">
                              <span>Ad Set {idx + 1}</span>
                              {adset.classification === "NO_DATA" && (
                                <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                                  No Data
                                </span>
                              )}
                            </div>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {breakdownData.adsetPerformance[activeAdsetTab] && (
                      <motion.div
                        key={activeAdsetTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="p-6">
                        {(() => {
                          const adset =
                            breakdownData.adsetPerformance[activeAdsetTab];
                          const hasData = adset.classification !== "NO_DATA";

                          return (
                            <div className="space-y-5">
                              {/* Adset Header */}
                              <div className="flex items-start justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {adset.adsetName}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${getClassificationBadge(
                                        adset.classification
                                      )}`}>
                                      {adset.classification.replace("_", " ")}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      Ad Set ID: {adset.adsetId}
                                    </span>
                                  </div>
                                </div>
                                {hasData && (
                                  <div className="text-right">
                                    <div
                                      className={`text-4xl font-bold ${getScoreColor(
                                        adset.performanceScore
                                      )}`}>
                                      {adset.performanceScore.toFixed(1)}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      Performance Score
                                    </div>
                                  </div>
                                )}
                              </div>

                              {hasData ? (
                                <>
                                  {/* Metrics Grid */}
                                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium">
                                        Historical Score
                                      </div>
                                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                                        {adset.historicalScore.toFixed(1)}
                                      </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                                      <div className="text-xs text-green-600 dark:text-green-400 mb-1 font-medium">
                                        Correlation
                                      </div>
                                      <div className="text-2xl font-bold text-green-900 dark:text-green-300">
                                        {adset.correlationScore.toFixed(1)}
                                      </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                                      <div className="text-xs text-purple-600 dark:text-purple-400 mb-1 font-medium">
                                        Audience Size
                                      </div>
                                      <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                                        {adset.audienceSizeScore.toFixed(1)}
                                      </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                                      <div className="text-xs text-orange-600 dark:text-orange-400 mb-1 font-medium">
                                        Category
                                      </div>
                                      <div className="text-2xl font-bold text-orange-900 dark:text-orange-300">
                                        {adset.categoryScore.toFixed(1)}
                                      </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
                                      <div className="text-xs text-pink-600 dark:text-pink-400 mb-1 font-medium">
                                        Confidence
                                      </div>
                                      <div className="text-2xl font-bold text-pink-900 dark:text-pink-300">
                                        {adset.predictionConfidence.toFixed(0)}%
                                      </div>
                                    </div>
                                  </div>

                                  {/* Recommendations */}
                                  {adset.recommendations &&
                                    adset.recommendations.length > 0 && (
                                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-start gap-3">
                                          <CheckCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                          <div className="flex-1">
                                            <h5 className="text-base font-semibold text-blue-900 dark:text-blue-300 mb-3">
                                              💡 AI Recommendations
                                            </h5>
                                            <ul className="space-y-2">
                                              {adset.recommendations.map(
                                                (
                                                  rec: string,
                                                  recIdx: number
                                                ) => (
                                                  <li
                                                    key={recIdx}
                                                    className="text-sm text-blue-800 dark:text-blue-300 flex gap-2">
                                                    <span className="font-bold">
                                                      •
                                                    </span>
                                                    <span>{rec}</span>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                </>
                              ) : (
                                // No Data State
                                <div className="text-center py-12">
                                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                                    <ExclamationTriangleIcon className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No Performance Data Available
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                    This interest is used in this ad set but
                                    doesn't have enough metrics yet. Wait for
                                    more data to be collected.
                                  </p>
                                  {adset.recommendations &&
                                    adset.recommendations.length > 0 && (
                                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 italic">
                                        {adset.recommendations[0]}
                                      </p>
                                    )}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No breakdown data available
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
