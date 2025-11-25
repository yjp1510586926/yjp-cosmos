/**
 * 首页
 * 功能：展示区块链统计数据、最近的区块
 */

import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import StatCard from '@/components/StatCard';
import BlockCard from '@/components/BlockCard';
import Button from '@/components/Button';
import { useBlockchainStore } from '@/store/blockchainStore';
import { Block } from '@/lib/blockchain/Block';
import { REFRESH_INTERVALS } from '@/lib/constants';

export default function Home() {
  const blockchain = useBlockchainStore((state) => state.blockchain);
  const getStats = useBlockchainStore((state) => state.getStats);
  
  const [stats, setStats] = useState(getStats());
  const [recentBlocks, setRecentBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  // 定期刷新数据
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVALS.BLOCKCHAIN_STATS);
    return () => clearInterval(interval);
  }, [blockchain]);

  /**
   * 获取统计数据和最近的区块
   */
  const fetchData = () => {
    setStats(getStats());
    // 获取最近的3个区块，按最新的在前排序
    const blocks = [...blockchain.chain].slice(-3).reverse();
    setRecentBlocks(blocks);
    setLoading(false);
  };

  // 加载状态
  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-2xl text-gray-600 dark:text-gray-400">
            加载中...
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent dark:from-white dark:to-gray-300">
          YJP 区块链浏览器
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          实时查看区块、交易和网络状态
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          纯前端实现 · Zustand状态管理 · 无需后端服务器
        </p>
      </div>

      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="区块高度"
            value={stats.blockCount}
            color="blue"
          />
          <StatCard
            title="挖矿难度"
            value={stats.difficulty}
            color="purple"
          />
          <StatCard
            title="待处理交易"
            value={stats.pendingTransactions}
            color="orange"
          />
          <StatCard
            title="挖矿奖励"
            value={`${stats.miningReward} 代币`}
            color="green"
          />
        </div>
      )}

      {/* 区块链验证状态 */}
      {stats && (
        <div className="mb-12">
          <div className={`p-4 rounded-lg ${
            stats.isValid 
              ? 'bg-gray-100 border border-gray-300 dark:bg-black dark:border-gray-800' 
              : 'bg-red-100 border border-red-300 dark:bg-gray-900 dark:border-red-900'
          }`}>
            <span className={`text-lg font-semibold ${
              stats.isValid 
                ? 'text-gray-800 dark:text-gray-200' 
                : 'text-red-800 dark:text-red-400'
            }`}>
              {stats.isValid ? '区块链完整性验证通过' : '区块链可能已被篡改！'}
            </span>
          </div>
        </div>
      )}

      {/* 最近的区块 */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            最近区块
          </h2>
          <Button onClick={fetchData}>
            刷新
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {recentBlocks.map((block) => (
            <BlockCard key={block.index} block={block} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
