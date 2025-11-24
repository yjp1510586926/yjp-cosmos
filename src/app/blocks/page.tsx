'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import BlockCard from '@/components/BlockCard';
import { useBlockchainStore } from '@/store/blockchainStore';
import { Block } from '@/lib/blockchain/Block';

export default function BlocksPage() {
  const blockchain = useBlockchainStore((state) => state.blockchain);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlocks();
  }, [blockchain]);

  const fetchBlocks = () => {
    setLoading(true);
    // 反转数组，最新的区块在前面
    setBlocks([...blockchain.chain].reverse());
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              区块浏览器
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              共 {blocks.length} 个区块
            </p>
          </div>
          <button
            onClick={fetchBlocks}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            🔄 刷新
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {blocks.map((block) => (
            <BlockCard key={block.index} block={block} />
          ))}
        </div>
      </main>
    </div>
  );
}
