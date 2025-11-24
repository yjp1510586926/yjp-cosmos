/**
 * 区块链类 - 管理整个区块链系统
 * 
 * 这是核心类，负责：
 * - 维护区块链（区块数组）
 * - 管理待处理交易池
 * - 处理挖矿（工作量证明）
 * - 验证区块链完整性
 * - 计算账户余额
 */

import { Block } from './Block';
import { Transaction } from './Transaction';

export class Blockchain {
  public chain: Block[];                          // 区块链（区块数组）
  public difficulty: number;                      // 挖矿难度
  public pendingTransactions: Transaction[];      // 待处理交易池
  public miningReward: number;                    // 挖矿奖励

  /**
   * 构造函数 - 初始化区块链
   * 创建创世区块并设置初始参数
   */
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 50;
  }

  /**
   * 创建创世区块
   * 
   * 创世区块是区块链的第一个区块，它：
   * - 索引为0
   * - 没有前序区块（previousHash为'0'）
   * - 不包含交易
   * 
   * @returns 创世区块
   */
  createGenesisBlock(): Block {
    const genesisBlock = new Block(0, Date.now(), [], '0');
    genesisBlock.hash = genesisBlock.calculateHash();
    return genesisBlock;
  }

  /**
   * 获取区块链中的最新区块
   * @returns 最新的区块
   */
  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  /**
   * 挖矿 - 挖掘待处理的交易
   * 
   * 挖矿过程：
   * 1. 创建一笔挖矿奖励交易，奖励给矿工
   * 2. 将所有待处理交易（包括奖励）打包成新区块
   * 3. 执行工作量证明（寻找符合难度的哈希）
   * 4. 将新区块添加到区块链
   * 5. 清空待处理交易池
   * 
   * @param miningRewardAddress 矿工地址（接收奖励的地址）
   * @returns 新挖出的区块
   */
  minePendingTransactions(miningRewardAddress: string): Block {
    // 创建挖矿奖励交易（fromAddress为null表示系统奖励）
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    // 创建新区块
    const block = new Block(
      this.chain.length,
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    // 执行工作量证明（这是最耗时的步骤）
    block.mineBlock(this.difficulty);
    
    // 将新区块添加到链上
    this.chain.push(block);
    
    // 清空待处理交易池
    this.pendingTransactions = [];

    return block;
  }

  /**
   * 添加交易到待处理交易池
   * 
   * 验证步骤：
   * 1. 检查交易是否包含发送和接收地址
   * 2. 验证交易签名
   * 3. 检查交易金额是否大于0
   * 4. 验证发送方余额是否足够
   * 
   * @param transaction 要添加的交易
   * @throws 如果交易无效，抛出相应错误
   */
  addTransaction(transaction: Transaction): void {
    // 验证地址
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('交易必须包含发送和接收地址');
    }

    // 验证签名
    if (!transaction.isValid()) {
      throw new Error('不能添加无效交易到链上');
    }

    // 验证金额
    if (transaction.amount <= 0) {
      throw new Error('交易金额必须大于0');
    }

    // 验证余额
    const senderBalance = this.getBalanceOfAddress(transaction.fromAddress);
    if (senderBalance < transaction.amount) {
      throw new Error('余额不足');
    }

    // 添加到待处理交易池
    this.pendingTransactions.push(transaction);
  }

  /**
   * 获取指定地址的余额
   * 
   * 遍历整个区块链，计算该地址的所有收入和支出
   * 余额 = 所有收入 - 所有支出
   * 
   * @param address 要查询的地址
   * @returns 该地址的余额
   */
  getBalanceOfAddress(address: string): number {
    let balance = 0;

    // 遍历所有区块
    for (const block of this.chain) {
      // 遍历区块中的所有交易
      for (const trans of block.transactions) {
        // 如果是发送方，减少余额
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        // 如果是接收方，增加余额
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  /**
   * 获取地址的所有交易记录
   * 
   * @param address 要查询的地址
   * @returns 该地址相关的所有交易
   */
  getAllTransactionsForAddress(address: string): Transaction[] {
    const transactions: Transaction[] = [];

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        // 如果该地址是发送方或接收方，记录该交易
        if (trans.fromAddress === address || trans.toAddress === address) {
          transactions.push(trans);
        }
      }
    }

    return transactions;
  }

  /**
   * 验证区块链完整性
   * 
   * 验证步骤：
   * 1. 验证创世区块是否被篡改
   * 2. 遍历所有区块，验证：
   *    - 每个区块的哈希是否正确
   *    - 每个区块的前序哈希是否正确
   *    - 每个区块中的交易是否都有效
   * 
   * @returns 如果区块链有效返回true，否则返回false
   */
  isChainValid(): boolean {
    // 验证创世区块
    const realGenesis = JSON.stringify(this.createGenesisBlock());
    const currentGenesis = JSON.stringify(this.chain[0]);

    if (realGenesis !== currentGenesis) {
      return false;
    }

    // 验证每个区块
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // 验证区块中的交易
      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      // 验证区块哈希
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // 验证区块链接（前序哈希）
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  /**
   * 获取区块链统计信息
   * 
   * @returns 包含各种统计数据的对象
   */
  getStats() {
    return {
      blockCount: this.chain.length,                      // 区块总数
      difficulty: this.difficulty,                        // 挖矿难度
      pendingTransactions: this.pendingTransactions.length, // 待处理交易数
      miningReward: this.miningReward,                    // 挖矿奖励
      isValid: this.isChainValid(),                       // 区块链是否有效
    };
  }
}
