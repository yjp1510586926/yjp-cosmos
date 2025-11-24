/**
 * 区块链状态管理Store
 * 
 * 使用Zustand进行状态管理，提供：
 * - 全局的区块链实例
 * - 挖矿、交易等操作方法
 * - 钱包创建和余额查询
 * - 统计数据获取
 */

import { create } from "zustand";
import { Blockchain } from "@/lib/blockchain/Blockchain";
import { Transaction } from "@/lib/blockchain/Transaction";
import { Block } from "@/lib/blockchain/Block";
import { Wallet } from "@/lib/wallet/Wallet";

/**
 * Store状态接口定义
 */
interface BlockchainState {
  blockchain: Blockchain;     // 区块链实例
  loading: boolean;           // 加载状态
  error: string | null;       // 错误信息
  updateTrigger: number;      // 更新触发器（用于强制组件重新渲染）
  
  // 方法
  mine: (minerAddress: string) => Promise<Block>;                    // 挖矿
  addTransaction: (tx: Transaction) => void;                         // 添加交易
  createWallet: () => { address: string; publicKey: string; privateKey: string }; // 创建钱包
  getBalance: (address: string) => number;                           // 获取余额
  getTransactions: (address: string) => Transaction[];               // 获取交易记录
  getStats: () => {                                                  // 获取统计信息
    blockCount: number;
    difficulty: number;
    pendingTransactions: number;
    miningReward: number;
    isValid: boolean;
  };
  getPendingTransactions: () => Transaction[];                       // 获取待处理交易
  validateChain: () => boolean;                                      // 验证区块链
  reset: () => void;                                                 // 重置区块链
}

/**
 * 初始化区块链
 * 
 * 创建一个包含初始数据的区块链：
 * - 创建3个测试钱包
 * - 执行一些测试交易
 * - 挖掘几个区块
 * 
 * @returns 初始化后的区块链实例
 */
const initializeBlockchain = (): Blockchain => {
  const blockchain = new Blockchain();
  
  // 创建测试钱包
  const wallet1 = new Wallet();
  const wallet2 = new Wallet();
  const wallet3 = new Wallet();

  // 第一次挖矿：创建创世区块后的第一个区块，给wallet1奖励
  blockchain.minePendingTransactions(wallet1.getAddress());

  // 创建并添加第一笔交易：wallet1 -> wallet2 转账30代币
  const tx1 = new Transaction(wallet1.getAddress(), wallet2.getAddress(), 30);
  tx1.signTransaction(wallet1.getKeyPair());
  blockchain.addTransaction(tx1);
  
  // 第二次挖矿：打包tx1，给wallet2奖励
  blockchain.minePendingTransactions(wallet2.getAddress());

  // 创建并添加第二笔交易：wallet2 -> wallet3 转账20代币
  const tx2 = new Transaction(wallet2.getAddress(), wallet3.getAddress(), 20);
  tx2.signTransaction(wallet2.getKeyPair());
  blockchain.addTransaction(tx2);
  
  // 第三次挖矿：打包tx2，给wallet3奖励
  blockchain.minePendingTransactions(wallet3.getAddress());

  return blockchain;
};

/**
 * 创建并导出Zustand Store
 */
export const useBlockchainStore = create<BlockchainState>()((set, get) => ({
  // 初始状态
  blockchain: initializeBlockchain(),
  loading: false,
  error: null,
  updateTrigger: 0,

  /**
   * 挖矿方法
   * 
   * @param minerAddress 矿工地址（接收挖矿奖励）
   * @returns 新挖出的区块
   */
  mine: async (minerAddress: string) => {
    set({ loading: true, error: null });
    try {
      const state = get();
      const block = state.blockchain.minePendingTransactions(minerAddress);
      
      // 更新状态，触发重新渲染
      set({
        blockchain: state.blockchain,
        loading: false,
        updateTrigger: state.updateTrigger + 1,
      });
      
      return block;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * 添加交易到待处理交易池
   * 
   * @param tx 交易对象
   */
  addTransaction: (tx: Transaction) => {
    try {
      const state = get();
      state.blockchain.addTransaction(tx);
      
      // 更新状态
      set({
        blockchain: state.blockchain,
        error: null,
        updateTrigger: state.updateTrigger + 1,
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  /**
   * 创建新钱包
   * 
   * @returns 钱包信息（地址、公钥、私钥）
   */
  createWallet: () => {
    const wallet = new Wallet();
    return wallet.export();
  },

  /**
   * 获取地址余额
   * 
   * @param address 要查询的地址
   * @returns 余额
   */
  getBalance: (address: string) => {
    const { blockchain } = get();
    return blockchain.getBalanceOfAddress(address);
  },

  /**
   * 获取地址的所有交易记录
   * 
   * @param address 要查询的地址
   * @returns 交易列表
   */
  getTransactions: (address: string) => {
    const { blockchain } = get();
    return blockchain.getAllTransactionsForAddress(address);
  },

  /**
   * 获取区块链统计信息
   * 
   * @returns 统计数据对象
   */
  getStats: () => {
    const { blockchain } = get();
    return blockchain.getStats();
  },

  /**
   * 获取待处理交易列表
   * 
   * @returns 待处理交易数组
   */
  getPendingTransactions: () => {
    const { blockchain } = get();
    return blockchain.pendingTransactions;
  },

  /**
   * 验证区块链完整性
   * 
   * @returns 如果区块链有效返回true
   */
  validateChain: () => {
    const { blockchain } = get();
    return blockchain.isChainValid();
  },

  /**
   * 重置区块链
   * 
   * 重新初始化一个新的区块链
   */
  reset: () => {
    set({ blockchain: initializeBlockchain(), error: null });
  },
}));
