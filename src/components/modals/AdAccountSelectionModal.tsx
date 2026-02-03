import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, CheckCircle, Loader2, X, Building2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdAccount {
  id: string;
  name: string;
  account_status: number;
  currency: string;
  spend_cap: string;
  source?: 'BUSINESS' | 'USER';
  business_id?: string;
}

interface AdAccountSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  adAccounts: AdAccount[];
  selectedAccountIds: string[];
  onSave: (selectedIds: string[]) => void;
  loading?: boolean;
}

const AdAccountSelectionModal: React.FC<AdAccountSelectionModalProps> = ({
  isOpen,
  onClose,
  adAccounts,
  selectedAccountIds,
  onSave,
  loading = false
}) => {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedAccountIds);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'business' | 'personal'>('business');

  useEffect(() => {
    setLocalSelected(selectedAccountIds);
  }, [selectedAccountIds]);

  const handleToggle = (accountId: string) => {
    setLocalSelected(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSelectAll = () => {
    const currentTabAccounts = activeTab === 'business' ? businessAccounts : personalAccounts;
    const currentTabIds = currentTabAccounts.map(acc => acc.id);
    const otherTabAccounts = activeTab === 'business' ? personalAccounts : businessAccounts;
    const otherTabSelectedIds = localSelected.filter(id => 
      otherTabAccounts.some(acc => acc.id === id)
    );
    setLocalSelected([...otherTabSelectedIds, ...currentTabIds]);
  };

  const handleDeselectAll = () => {
    const currentTabAccounts = activeTab === 'business' ? businessAccounts : personalAccounts;
    const currentTabIds = currentTabAccounts.map(acc => acc.id);
    setLocalSelected(localSelected.filter(id => !currentTabIds.includes(id)));
  };

  const handleSave = () => {
    onSave(localSelected);
    onClose();
  };

  const handleClose = () => {
    setLocalSelected(selectedAccountIds);
    onClose();
  };

  const businessAccounts = adAccounts.filter(acc => acc.source === 'BUSINESS');
  const personalAccounts = adAccounts.filter(acc => acc.source === 'USER');
  
  const currentTabAccounts = activeTab === 'business' ? businessAccounts : personalAccounts;
  const filteredCurrentTabAccounts = currentTabAccounts.filter(acc =>
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const businessSelectedCount = localSelected.filter(id => 
    businessAccounts.some(acc => acc.id === id)
  ).length;
  const personalSelectedCount = localSelected.filter(id => 
    personalAccounts.some(acc => acc.id === id)
  ).length;

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
          className="w-full max-w-4xl h-[90vh] flex flex-col"
        >
          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl flex flex-col h-full">
            {/* Header - Fixed */}
            <CardHeader className="pb-4 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <CreditCard className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Select Ad Accounts
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      Choose which ad accounts you want to see in your dashboard
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

            {/* Content - Scrollable */}
            <CardContent className="p-6 flex-1 overflow-hidden flex flex-col">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'business' | 'personal')} className="flex flex-col h-full">
                {/* Tabs List - Fixed */}
                <TabsList className="grid w-full grid-cols-2 mb-6 flex-shrink-0">
                  <TabsTrigger value="business" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Business Accounts
                    {businessSelectedCount > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {businessSelectedCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="personal" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Accounts
                    {personalSelectedCount > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {personalSelectedCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Search and Actions - Fixed */}
                <div className="mb-6 space-y-4 flex-shrink-0">
                  <input
                    type="text"
                    placeholder={`Search ${activeTab} accounts...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {activeTab === 'business' ? businessSelectedCount : personalSelectedCount} of {currentTabAccounts.length} selected
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        disabled={
                          activeTab === 'business' 
                            ? businessSelectedCount === businessAccounts.length
                            : personalSelectedCount === personalAccounts.length
                        }
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeselectAll}
                        disabled={
                          activeTab === 'business' 
                            ? businessSelectedCount === 0
                            : personalSelectedCount === 0
                        }
                      >
                        Deselect All
                      </Button>
                    </div>
                  </div>
                </div>

                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                      <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Loading ad accounts...
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content - Scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <TabsContent value="business" className="mt-0">
                    {!loading && businessAccounts.length === 0 && (
                      <div className="text-center py-12">
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                          <Building2 className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          No business accounts found
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                          Connect your Facebook Business Manager to see business accounts
                        </div>
                      </div>
                    )}

                    {!loading && filteredCurrentTabAccounts.length === 0 && businessAccounts.length > 0 && (
                      <div className="text-center py-12">
                        <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          No results found
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Try a different search term
                        </div>
                      </div>
                    )}

                    {!loading && filteredCurrentTabAccounts.length > 0 && (
                      <div className="space-y-2 pr-2">
                        {filteredCurrentTabAccounts.map((account, index) => (
                          <motion.div
                            key={account.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <Card
                              className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                                localSelected.includes(account.id)
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                              }`}
                              onClick={() => handleToggle(account.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  <Checkbox
                                    checked={localSelected.includes(account.id)}
                                    onCheckedChange={() => handleToggle(account.id)}
                                    className="h-5 w-5"
                                  />
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-white">
                                      {account.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      {account.id} • {account.currency}
                                      {account.account_status === 1 && (
                                        <span className="ml-2 text-green-600 dark:text-green-400">● Active</span>
                                      )}
                                    </div>
                                  </div>
                                  {localSelected.includes(account.id) && (
                                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="personal" className="mt-0">
                    {!loading && personalAccounts.length === 0 && (
                      <div className="text-center py-12">
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                          <User className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          No personal accounts found
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                          Connect your personal Facebook account to see personal ad accounts
                        </div>
                      </div>
                    )}

                    {!loading && filteredCurrentTabAccounts.length === 0 && personalAccounts.length > 0 && (
                      <div className="text-center py-12">
                        <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          No results found
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Try a different search term
                        </div>
                      </div>
                    )}

                    {!loading && filteredCurrentTabAccounts.length > 0 && (
                      <div className="space-y-2 pr-2">
                        {filteredCurrentTabAccounts.map((account, index) => (
                          <motion.div
                            key={account.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <Card
                              className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                                localSelected.includes(account.id)
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                              }`}
                              onClick={() => handleToggle(account.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  <Checkbox
                                    checked={localSelected.includes(account.id)}
                                    onCheckedChange={() => handleToggle(account.id)}
                                    className="h-5 w-5"
                                  />
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-white">
                                      {account.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      {account.id} • {account.currency}
                                      {account.account_status === 1 && (
                                        <span className="ml-2 text-green-600 dark:text-green-400">● Active</span>
                                      )}
                                    </div>
                                  </div>
                                  {localSelected.includes(account.id) && (
                                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>

            {/* Footer - Fixed */}
            {!loading && (businessAccounts.length > 0 || personalAccounts.length > 0) && (
              <div className="px-6 pb-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    💡 You can change this selection anytime
                  </div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Selected: {localSelected.length} account{localSelected.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={localSelected.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Save Selection ({localSelected.length})
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default AdAccountSelectionModal;
