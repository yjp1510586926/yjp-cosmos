/**
 * 钱包管理页面
 * 功能：创建钱包、查看余额、发送交易
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
import { Wallet } from '@/lib/wallet/Wallet';
import { truncateAddress, copyToClipboard, storage } from '@/lib/utils';
import { STORAGE_KEYS, BLOCKCHAIN_CONFIG } from '@/lib/constants';

interface WalletInfo {
  id: string;
  address: string;
  publicKey: string;
  privateKey: string;
  name: string;
}

export default function WalletPage() {
  // 从Store获取钱包和交易相关方法
  const createWallet = useBlockchainStore((state) => state.createWallet);
  const getBalance = useBlockchainStore((state) => state.getBalance);
  const addTransaction = useBlockchainStore((state) => state.addTransaction);
  
  // 组件状态
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [activeWalletId, setActiveWalletId] = useState<string | null>(null);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // 初始化：加载保存的钱包
  useEffect(() => {
    const savedWallets = storage.get<WalletInfo[]>(STORAGE_KEYS.WALLETS, []);
    setWallets(savedWallets);
    if (savedWallets.length > 0) {
      setActiveWalletId(savedWallets[0].id);
    }
  }, []);

  // 获取当前活动的钱包
  const activeWallet = wallets.find(w => w.id === activeWalletId);

  /**
   * 获取指定地址的余额
   */
  const getWalletBalance = (address: string) => {
    try {
      return getBalance(address);
    } catch (error) {
      console.error('获取余额失败:', error);
      return 0;
    }
  };

  /**
   * 创建新钱包
   */
  const createNewWallet = () => {
    try {
      setLoading(true);
      const newWallet = createWallet();
      const walletWithId: WalletInfo = {
        id: Date.now().toString(),
        ...newWallet,
        name: `钱包 ${wallets.length + 1}`,
      };
      
      const updatedWallets = [...wallets, walletWithId];
      setWallets(updatedWallets);
      setActiveWalletId(walletWithId.id);
      storage.set(STORAGE_KEYS.WALLETS, updatedWallets);
      setMessage({ type: 'success', text: `${walletWithId.name} 创建成功！` });
    } catch (error) {
      setMessage({ type: 'error', text: '创建钱包失败' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * 发送交易
   * 创建并签名交易，然后添加到待处理交易池
   */
  const sendTransaction = () => {
    if (!activeWallet) return;
    if (!toAddress || !amount) {
      setMessage({ type: 'error', text: '请填写完整信息' });
      return;
    }

    try {
      setLoading(true);
      const tx = new Transaction(activeWallet.address, toAddress, parseFloat(amount));
      const walletInstance = new Wallet(activeWallet.privateKey);
      tx.signTransaction(walletInstance.getKeyPair());
      addTransaction(tx);
      
      setMessage({ type: 'success', text: '交易已提交！需要挖矿才能确认' });
      setToAddress('');
      setAmount('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '交易失败' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * 复制文本到剪贴板
   */
  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setMessage({ type: 'success', text: '已复制到剪贴板' });
    } else {
      setMessage({ type: 'error', text: '复制失败' });
    }
  };

  /**
   * 快速填充接收地址
   */
  const quickFillAddress = (address: string) => {
    setToAddress(address);
    setMessage({ type: 'success', text: '已填入接收地址' });
  };

  return (
    <PageLayout
      title="钱包管理"
      action={
        <Button
          variant="gradient"
          onClick={createNewWallet}
          disabled={loading || wallets.length >= BLOCKCHAIN_CONFIG.MAX_WALLETS}
        >
          {loading ? '创建中...' : '新建钱包'}
        </Button>
      }
    >
      {/* 消息提示 */}
      {message && (
        <Message type={message.type}>
          {message.text}
        </Message>
      )}

      {/* 空状态：没有钱包 */}
      {wallets.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              还没有钱包
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              创建至少两个钱包来测试转账功能
            </p>
            <Button
              variant="gradient"
              onClick={createNewWallet}
              disabled={loading}
              className="px-8 py-4 text-lg"
            >
              {loading ? '创建中...' : '创建第一个钱包'}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* 钱包列表 */}
          <Card>
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              我的钱包 ({wallets.length}/{BLOCKCHAIN_CONFIG.MAX_WALLETS})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wallets.map((wallet) => {
                const balance = getWalletBalance(wallet.address);
                const isActive = wallet.id === activeWalletId;
                return (
                  <div
                    key={wallet.id}
                    onClick={() => setActiveWalletId(wallet.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isActive
                        ? 'border-gray-900 bg-gray-100 dark:border-gray-600 dark:bg-black'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {wallet.name}
                      </span>
                      {isActive && (
                        <span className="text-xs px-2 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full">
                          当前
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-mono">
                      {truncateAddress(wallet.address)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {balance} 代币
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 钱包详情和发送交易 */}
          {activeWallet && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 钱包详细信息 */}
              <Card>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                  {activeWallet.name} - 详细信息
                </h2>
                
                <div className="space-y-4">
                  {/* 公钥/地址 */}
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                      地址 (公钥)
                    </label>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded font-mono text-xs break-all flex items-start justify-between gap-2">
                      <span className="flex-1">{activeWallet.address}</span>
                      <button
                        onClick={() => handleCopy(activeWallet.address)}
                        className="text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white flex-shrink-0 text-sm"
                        title="复制地址"
                      >
                        复制
                      </button>
                    </div>
                  </div>

                  {/* 私钥 */}
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                      私钥（请妥善保管）
                    </label>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded font-mono text-xs break-all border border-red-300 dark:border-red-700 flex items-start justify-between gap-2">
                      <span className="flex-1">{activeWallet.privateKey}</span>
                      <button
                        onClick={() => handleCopy(activeWallet.privateKey)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0 text-sm"
                        title="复制私钥"
                      >
                        复制
                      </button>
                    </div>
                  </div>

                  {/* 余额显示 */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg text-gray-700 dark:text-gray-300">
                        当前余额:
                      </span>
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {getWalletBalance(activeWallet.address)} 代币
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 发送交易 */}
              <Card>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                  发送代币
                </h2>
                
                <div className="space-y-4">
                  {/* 接收地址输入 */}
                  <div>
                    <Input
                      label="接收地址"
                      type="text"
                      value={toAddress}
                      onChange={(e) => setToAddress(e.target.value)}
                      placeholder="输入接收方的公钥地址"
                    />
                    
                    {/* 快速选择接收钱包 */}
                    {wallets.filter(w => w.id !== activeWalletId).length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          快速选择接收钱包:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {wallets
                            .filter(w => w.id !== activeWalletId)
                            .map(w => (
                              <button
                                key={w.id}
                                onClick={() => quickFillAddress(w.address)}
                                className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              >
                                {w.name}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 金额输入 */}
                  <Input
                    label="数量"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="输入代币数量"
                    min="0"
                    step="0.01"
                  />

                  {/* 发送按钮 */}
                  <Button
                    variant="gradient"
                    onClick={sendTransaction}
                    disabled={loading || !toAddress || !amount}
                    className="w-full py-4 text-lg"
                  >
                    {loading ? '处理中...' : '发送交易'}
                  </Button>

                  {/* 交易说明 */}
                  <InfoBox type="warning">
                    交易需要通过挖矿才能被确认到区块链上
                  </InfoBox>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
