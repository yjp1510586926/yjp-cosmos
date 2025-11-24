'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import BlockCard from '@/components/BlockCard';
import { useBlockchainStore } from '@/store/blockchainStore';
import { Block } from '@/lib/blockchain/Block';

export default function Home() {
  const blockchain = useBlockchainStore((state) => state.blockchain);
  const getStats = useBlockchainStore((state) => state.getStats);
  
  const [stats, setStats] = useState(getStats());
  const [recentBlocks, setRecentBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 每10秒刷新
    return () => clearInterval(interval);
  }, [blockchain]);

  const fetchData = () => {
    setStats(getStats());
    // 获取最近3个区块
    const blocks = [...blockchain.chain].slice(-3).reverse();
    setRecentBlocks(blocks);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-2xl text-gray-600 dark:text-gray-400">
              加载中...
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            YJP 区块链浏览器
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            实时查看区块、交易和网络状态
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            ✅ 纯前端实现 · Zustand状态管理 · 无需后端服务器
          </p>
        </div>

        {/* 统计卡片 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              title="区块高度"
              value={stats.blockCount}
              icon="📦"
              color="blue"
            />
            <StatCard
              title="挖矿难度"
              value={stats.difficulty}
              icon="⛏️"
              color="purple"
            />
            <StatCard
              title="待处理交易"
              value={stats.pendingTransactions}
              icon="⏳"
              color="orange"
            />
            <StatCard
              title="挖矿奖励"
              value={`${stats.miningReward} 代币`}
              icon="💰"
              color="green"
            />
          </div>
        )}

        {/* 链状态 */}
        {stats && (
          <div className="mb-12">
            <div className={`p-4 rounded-lg ${
              stats.isValid 
                ? 'bg-green-100 border border-green-300 dark:bg-green-900/20 dark:border-green-700' 
                : 'bg-red-100 border border-red-300 dark:bg-red-900/20 dark:border-red-700'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {stats.isValid ? '✅' : '⚠️'}
                </span>
                <span className={`text-lg font-semibold ${
                  stats.isValid 
                    ? 'text-green-800 dark:text-green-300' 
                    : 'text-red-800 dark:text-red-300'
                }`}>
                  {stats.isValid ? '区块链完整性验证通过' : '区块链可能已被篡改！'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 最近区块 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              最近区块
            </h2>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 刷新
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {recentBlocks.map((block) => (
              <BlockCard key={block.index} block={block} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
