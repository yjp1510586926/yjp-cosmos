/**
 * 区块浏览器页面
 * 功能：查看所有区块的详细信息
 */

'use client';

import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import BlockCard from '@/components/BlockCard';
import Button from '@/components/Button';
import { useBlockchainStore } from '@/store/blockchainStore';
import { Block } from '@/lib/blockchain/Block';

export default function BlocksPage() {
  const blockchain = useBlockchainStore((state) => state.blockchain);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  // 监听区块链变化，自动更新区块列表
  useEffect(() => {
    fetchBlocks();
  }, [blockchain]);

  /**
   * 获取区块列表
   * 按照最新的在前的顺序显示
   */
  const fetchBlocks = () => {
    setLoading(true);
    setBlocks([...blockchain.chain].reverse());
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
    <PageLayout
      title="区块浏览器"
      subtitle={`共 ${blocks.length} 个区块`}
      action={
        <Button onClick={fetchBlocks}>
          刷新
        </Button>
      }
    >
      {/* 区块列表 */}
      <div className="grid grid-cols-1 gap-6">
        {blocks.map((block) => (
          <BlockCard key={block.index} block={block} />
        ))}
      </div>
    </PageLayout>
  );
}
