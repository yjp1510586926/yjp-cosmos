/**
 * 挖矿页面
 * 功能：挖掘新区块，处理待处理的交易，获取挖矿奖励
 */

'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Message from '@/components/Message';
import InfoBox from '@/components/InfoBox';
import { useBlockchainStore } from '@/store/blockchainStore';
import { Transaction } from '@/lib/blockchain/Transaction';
import { truncateAddress, storage } from '@/lib/utils';
import { STORAGE_KEYS, BLOCKCHAIN_CONFIG } from '@/lib/constants';

export default function MinePage() {
  // 从Store获取挖矿和交易相关方法
  const mine = useBlockchainStore((state) => state.mine);
  const getPendingTransactions = useBlockchainStore((state) => state.getPendingTransactions);
  
  // 组件状态
  const [minerAddress, setMinerAddress] = useState('');
  const [pendingTx, setPendingTx] = useState<Transaction[]>([]);
  const [mining, setMining] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // 初始化：加载保存的钱包地址和待处理交易
  useEffect(() => {
    const savedWallet = storage.get<{ address: string } | null>(STORAGE_KEYS.WALLET, null);
    if (savedWallet) {
      setMinerAddress(savedWallet.address);
    }
    fetchPendingTransactions();
  }, []);

  /**
   * 获取待处理的交易列表
   */
  const fetchPendingTransactions = () => {
    try {
      const transactions = getPendingTransactions();
      setPendingTx(transactions);
    } catch (error) {
      console.error('获取待处理交易失败:', error);
    }
  };

  /**
   * 开始挖矿
   * 执行工作量证明算法，将待处理交易打包成新区块
   */
  const startMining = async () => {
    if (!minerAddress) {
      setMessage({ type: 'error', text: '请输入矿工地址' });
      return;
    }

    try {
      setMining(true);
      setMessage({ type: 'info', text: '正在挖矿中...' });
      
      const block = await mine(minerAddress);
      
      setMessage({ 
        type: 'success', 
        text: `挖矿成功！区块 #${block.index} 已添加到链上` 
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
    <PageLayout title="挖矿中心">
      {/* 消息提示 */}
      {message && (
        <Message type={message.type}>
          {message.text}
        </Message>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：挖矿操作区 */}
        <Card>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            开始挖矿
          </h2>
          
          <div className="space-y-4">
            {/* 矿工地址输入 */}
            <Input
              label="矿工地址 (接收奖励的地址)"
              type="text"
              value={minerAddress}
              onChange={(e) => setMinerAddress(e.target.value)}
              placeholder="输入你的钱包地址"
              helperText="可以从钱包页面复制地址"
              className="font-mono text-sm"
            />

            {/* 挖矿奖励说明 */}
            <InfoBox type="success" title="挖矿奖励">
              每成功挖出一个区块，将获得 <strong>{BLOCKCHAIN_CONFIG.MINING_REWARD} 代币</strong> 奖励
            </InfoBox>

            {/* 挖矿说明 */}
            <InfoBox type="warning" title="挖矿说明">
              <ul className="space-y-1">
                <li>• 挖矿会打包所有待处理的交易</li>
                <li>• 需要进行大量计算来找到合适的哈希值</li>
                <li>• 挖矿成功后交易才会被确认</li>
                <li>• 奖励将在下次挖矿时到账</li>
                <li>• 挖矿时页面可能会卡顿几秒</li>
              </ul>
            </InfoBox>

            {/* 挖矿按钮 */}
            <Button
              variant="success"
              onClick={startMining}
              disabled={mining || !minerAddress}
              className="w-full py-4 text-lg"
            >
              {mining ? '挖矿中...' : '开始挖矿'}
            </Button>
          </div>
        </Card>

        {/* 右侧：待处理交易列表 */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              待处理交易
            </h2>
            <Button
              variant="secondary"
              onClick={fetchPendingTransactions}
              className="px-3 py-1 text-sm"
            >
              刷新
            </Button>
          </div>

          {/* 交易列表或空状态 */}
          {pendingTx.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg mb-2">暂无待处理的交易</p>
              <p className="text-sm">即使没有交易也可以挖矿获得奖励</p>
            </div>
          ) : (
            <>
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
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
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

              {/* 交易统计 */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  共 <strong>{pendingTx.length}</strong> 笔交易等待打包
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
