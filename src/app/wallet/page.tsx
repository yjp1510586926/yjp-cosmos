'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { useBlockchainStore } from '@/store/blockchainStore';
import { Transaction } from '@/lib/blockchain/Transaction';
import { Wallet } from '@/lib/wallet/Wallet';

interface WalletInfo {
  id: string;
  address: string;
  publicKey: string;
  privateKey: string;
  name: string;
}

export default function WalletPage() {
  const createWallet = useBlockchainStore((state) => state.createWallet);
  const getBalance = useBlockchainStore((state) => state.getBalance);
  const addTransaction = useBlockchainStore((state) => state.addTransaction);
  
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [activeWalletId, setActiveWalletId] = useState<string | null>(null);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // 尝试从localStorage加载钱包列表
    const savedWallets = localStorage.getItem('wallets');
    if (savedWallets) {
      const walletsData = JSON.parse(savedWallets);
      setWallets(walletsData);
      if (walletsData.length > 0) {
        setActiveWalletId(walletsData[0].id);
      }
    }
  }, []);

  const activeWallet = wallets.find(w => w.id === activeWalletId);

  const getWalletBalance = (address: string) => {
    try {
      return getBalance(address);
    } catch (error) {
      console.error('获取余额失败:', error);
      return 0;
    }
  };

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
      localStorage.setItem('wallets', JSON.stringify(updatedWallets));
      setMessage({ type: 'success', text: `${walletWithId.name} 创建成功！` });
    } catch (error) {
      setMessage({ type: 'error', text: '创建钱包失败' });
    } finally {
      setLoading(false);
    }
  };

  const sendTransaction = () => {
    if (!activeWallet) return;
    if (!toAddress || !amount) {
      setMessage({ type: 'error', text: '请填写完整信息' });
      return;
    }

    try {
      setLoading(true);
      
      // 创建交易
      const tx = new Transaction(activeWallet.address, toAddress, parseFloat(amount));
      
      // 使用私钥签名
      const walletInstance = new Wallet(activeWallet.privateKey);
      tx.signTransaction(walletInstance.getKeyPair());
      
      // 添加到区块链
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: '已复制到剪贴板' });
  };

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 10)}...${addr.substring(addr.length - 10)}`;
  };

  const quickFillAddress = (address: string) => {
    setToAddress(address);
    setMessage({ type: 'success', text: '已填入接收地址' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
            钱包管理
          </h1>
          <button
            onClick={createNewWallet}
            disabled={loading || wallets.length >= 5}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50"
          >
            {loading ? '创建中...' : '➕ 新建钱包'}
          </button>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-300 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300'
              : 'bg-red-100 border border-red-300 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {wallets.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-6">👛</div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                还没有钱包
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                创建至少两个钱包来测试转账功能
              </p>
              <button
                onClick={createNewWallet}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg disabled:opacity-50"
              >
                {loading ? '创建中...' : '🎉 创建第一个钱包'}
              </button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* 钱包列表 */}
            <Card>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                我的钱包 ({wallets.length}/5)
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
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          {wallet.name}
                        </span>
                        {isActive && (
                          <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-full">
                            当前
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-mono">
                        {truncateAddress(wallet.address)}
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {balance} 代币
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* 当前钱包详情和转账 */}
            {activeWallet && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 钱包详情 */}
                <Card>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    {activeWallet.name} - 详细信息
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                        地址 (公钥)
                      </label>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded font-mono text-xs break-all flex items-start justify-between gap-2">
                        <span className="flex-1">{activeWallet.address}</span>
                        <button
                          onClick={() => copyToClipboard(activeWallet.address)}
                          className="text-blue-600 hover:text-blue-700 flex-shrink-0"
                        >
                          📋
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                        私钥 ⚠️ 请妥善保管
                      </label>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded font-mono text-xs break-all border border-red-300 dark:border-red-700 flex items-start justify-between gap-2">
                        <span className="flex-1">{activeWallet.privateKey}</span>
                        <button
                          onClick={() => copyToClipboard(activeWallet.privateKey)}
                          className="text-red-600 hover:text-red-700 flex-shrink-0"
                        >
                          📋
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg text-gray-700 dark:text-gray-300">
                          当前余额:
                        </span>
                        <span className="text-3xl font-bold text-green-600">
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
                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 block mb-2 font-semibold">
                        接收地址
                      </label>
                      <input
                        type="text"
                        value={toAddress}
                        onChange={(e) => setToAddress(e.target.value)}
                        placeholder="输入接收方的公钥地址"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                      />
                      
                      {/* 快速选择其他钱包 */}
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

                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 block mb-2 font-semibold">
                        数量
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="输入代币数量"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                      />
                    </div>

                    <button
                      onClick={sendTransaction}
                      disabled={loading || !toAddress || !amount}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '处理中...' : '💸 发送交易'}
                    </button>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        ℹ️ 交易需要通过挖矿才能被确认到区块链上
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
