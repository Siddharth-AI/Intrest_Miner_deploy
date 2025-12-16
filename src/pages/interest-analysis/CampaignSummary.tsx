/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { motion } from "framer-motion";
import { ChartBarIcon } from "@heroicons/react/24/outline";

interface CampaignSummaryProps {
  campaignSummary: any[];
}

export const CampaignSummary: React.FC<CampaignSummaryProps> = ({
  campaignSummary,
}) => {
  if (!campaignSummary || campaignSummary.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Campaign Daily Summary
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Overall performance across all interests
        </p>
      </div>
      <div className="p-5 space-y-4">
        {campaignSummary.map((summary: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {new Date(summary.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {summary.totalInterests} interests analyzed
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {parseFloat(summary.avgScore).toFixed(1)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Avg Score
                </div>
              </div>
            </div>

            {/* Distribution */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="text-lg font-bold text-green-700 dark:text-green-400">
                  {summary.distribution.excellent}
                </div>
                <div className="text-xs text-green-600 dark:text-green-500">
                  Excellent
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
                  {summary.distribution.good}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-500">
                  Good
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                  {summary.distribution.average}
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-500">
                  Average
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                <div className="text-lg font-bold text-red-700 dark:text-red-400">
                  {summary.distribution.poor}
                </div>
                <div className="text-xs text-red-600 dark:text-red-500">
                  Poor
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
