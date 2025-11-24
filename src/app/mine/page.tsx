'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { useBlockchainStore } from '@/store/blockchainStore';
import { Transaction } from '@/lib/blockchain/Transaction';
import { truncateAddress, getMessageClasses, Message, storage } from '@/lib/utils';
import { STORAGE_KEYS, BLOCKCHAIN_CONFIG } from '@/lib/constants';

export default function MinePage() {
  const mine = useBlockchainStore((state) => state.mine);
  const getPendingTransactions = useBlockchainStore((state) => state.getPendingTransactions);
  
  const [minerAddress, setMinerAddress] = useState('');
  const [pendingTx, setPendingTx] = useState<Transaction[]>([]);
  const [mining, setMining] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    const savedWallet = storage.get<{ address: string } | null>(STORAGE_KEYS.WALLET, null);
    if (savedWallet) {
      setMinerAddress(savedWallet.address);
    }
    fetchPendingTransactions();
  }, []);

  const fetchPendingTransactions = () => {
    try {
      const transactions = getPendingTransactions();
      setPendingTx(transactions);
    } catch (error) {
      console.error('获取待处理交易失败:', error);
    }
  };

  const startMining = async () => {
    if (!minerAddress) {
      setMessage({ type: 'error', text: '请输入矿工地址' });
      return;
    }

    try {
      setMining(true);
      setMessage({ type: 'info', text: '⛏️  正在挖矿中...' });
      
      const block = await mine(minerAddress);
      
      setMessage({ 
        type: 'success', 
        text: `🎉 挖矿成功！区块 #${block.index} 已添加到链上` 
      });
      
      fetchPendingTransactions();
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || '挖矿失败' 
      });
    } finally {
      setMining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
          ⛏️  挖矿中心
        </h1>

        {message && (
          <div className={getMessageClasses(message.type)}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              开始挖矿
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 block mb-2 font-semibold">
                  矿工地址 (接收奖励的地址)
                </label>
                <input
                  type="text"
                  value={minerAddress}
                  onChange={(e) => setMinerAddress(e.target.value)}
                  placeholder="输入你的钱包地址"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  可以从钱包页面复制地址
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  💰 挖矿奖励
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  每成功挖出一个区块，将获得 <strong>{BLOCKCHAIN_CONFIG.MINING_REWARD} 代币</strong> 奖励
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  ⚡ 挖矿说明
                </h3>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                  <li>• 挖矿会打包所有待处理的交易</li>
                  <li>• 需要进行大量计算来找到合适的哈希值</li>
                  <li>• 挖矿成功后交易才会被确认</li>
                  <li>• 奖励将在下次挖矿时到账</li>
                  <li>• ⚠️ 挖矿时页面可能会卡顿几秒</li>
                </ul>
              </div>

              <button
                onClick={startMining}
                disabled={mining || !minerAddress}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mining ? '⛏️  挖矿中...' : '⛏️  开始挖矿'}
              </button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                待处理交易
              </h2>
              <button
                onClick={fetchPendingTransactions}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                🔄 刷新
              </button>
            </div>

            {pendingTx.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-5xl mb-4">📭</div>
                <p>暂无待处理的交易</p>
                <p className="text-sm mt-2">即使没有交易也可以挖矿获得奖励</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pendingTx.map((tx, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        交易 #{idx + 1}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {tx.amount} 代币
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-600 dark:text-gray-400 w-16">发送:</span>
                        <code className="text-gray-800 dark:text-gray-200 font-mono text-xs">
                          {truncateAddress(tx.fromAddress)}
                        </code>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 dark:text-gray-400 w-16">接收:</span>
                        <code className="text-gray-800 dark:text-gray-200 font-mono text-xs">
                          {truncateAddress(tx.toAddress)}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pendingTx.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  共 <strong>{pendingTx.length}</strong> 笔交易等待打包
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
