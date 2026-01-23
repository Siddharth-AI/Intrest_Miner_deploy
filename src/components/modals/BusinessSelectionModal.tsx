import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectBusiness, clearBusinessError } from '../../../store/features/facebookAdsSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, CheckCircle, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BusinessSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BusinessSelectionModal: React.FC<BusinessSelectionModalProps> = ({
  isOpen,
  onClose
}) => {
  const dispatch = useAppDispatch();
  const { businessState } = useAppSelector(state => state.facebookAds);

  const handleBusinessSelect = async (businessId: string) => {
    try {
      console.log(`🔄 User selecting business: ${businessId}`);
      const result = await dispatch(selectBusiness(businessId)).unwrap();
      console.log("✅ Business selected successfully:", result);
      onClose();
    } catch (error) {
      console.error('❌ Failed to select business:', error);
    }
  };

  const handleClose = () => {
    dispatch(clearBusinessError());
    onClose();
  };

  // Debug: Log businesses state
  console.log("🔍 BusinessSelectionModal - Businesses:", businessState.businesses.map(b => ({
    id: b.business_id,
    name: b.business_name,
    is_selected: b.is_selected
  })));
  console.log("🔍 BusinessSelectionModal - Selected Business:", businessState.selectedBusiness);

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[85vh] overflow-hidden"
        >
          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
            <CardHeader className="pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Select Your Business
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      Choose which Facebook Business to manage ad accounts for
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-10 w-10 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {businessState.loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Loading businesses...
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Fetching your Facebook Business accounts
                    </div>
                  </div>
                </div>
              )}

              {businessState.error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mb-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-800/30 rounded-lg">
                      <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-red-900 dark:text-red-300">
                        ❌ Error loading businesses
                      </div>
                      <div className="text-xs text-red-700 dark:text-red-400 mt-1">
                        {businessState.error}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {!businessState.loading && businessState.businesses.length === 0 && (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Building2 className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No businesses found
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Make sure your Facebook account has business management permissions and try refreshing the page.
                  </div>
                </div>
              )}

              {!businessState.loading && businessState.businesses.length > 0 && (
                <div className="space-y-4">
                  {/* Business List - No Tabs, Selected business shown first */}
                  <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                    {[...businessState.businesses]
                      .sort((a, b) => {
                        // Sort selected business first
                        if (a.is_selected && !b.is_selected) return -1;
                        if (!a.is_selected && b.is_selected) return 1;
                        return 0;
                      })
                      .map((business, index) => (
                      <motion.div
                        key={business.business_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                            business.is_selected
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md ring-2 ring-green-200 dark:ring-green-800'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                          onClick={() => handleBusinessSelect(business.business_id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl transition-colors ${
                                  business.is_selected
                                    ? 'bg-green-100 dark:bg-green-900/30'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }`}>
                                  <Building2 className={`h-6 w-6 ${
                                    business.is_selected
                                      ? 'text-green-600 dark:text-green-400'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`} />
                                </div>
                                <div>
                                  <div className="font-semibold text-lg text-gray-900 dark:text-white">
                                    {business.business_name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Business ID: {business.business_id}
                                  </div>
                                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    Created: {new Date(business.created_at).toLocaleDateString()}
                                  </div>
                                  {/* NEW: Show if this business has same name as others */}
                                  {businessState.businesses.filter(b => b.business_name === business.business_name).length > 1 && (
                                    <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                                      ⚠️ Multiple businesses with same name - Check ID
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                {business.is_selected && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-3 py-1">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Currently Selected
                                  </Badge>
                                )}
                                <div className="text-right">
                                  <div className="text-xs text-gray-400 dark:text-gray-500">
                                    Status
                                  </div>
                                  <div className={`text-sm font-medium ${
                                    business.is_active 
                                      ? 'text-green-600 dark:text-green-400' 
                                      : 'text-gray-500 dark:text-gray-400'
                                  }`}>
                                    {business.is_active ? 'Active' : 'Inactive'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer info */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-500 dark:text-gray-400">
                        💡 You can switch businesses anytime from the sidebar
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Total: {businessState.businesses.length} business{businessState.businesses.length !== 1 ? 'es' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // Use Portal to render modal at document root
  return createPortal(modalContent, document.body);
};

export default BusinessSelectionModal;