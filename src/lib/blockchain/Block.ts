/**
 * 区块类 - 区块链的基本构成单元
 * 
 * 区块是区块链的基本数据结构，包含：
 * - 区块索引（在链中的位置）
 * - 时间戳
 * - 交易列表
 * - 前一个区块的哈希值
 * - 当前区块的哈希值
 * - Nonce（工作量证明的随机数）
 */

import { SHA256 } from 'crypto-js';
import { Transaction } from './Transaction';

export class Block {
  public nonce: number;  // 工作量证明的随机数
  public hash: string;   // 当前区块的哈希值

  /**
   * 构造函数 - 创建新区块
   * @param index 区块索引（区块在链中的位置）
   * @param timestamp 区块创建的时间戳
   * @param transactions 区块中包含的交易列表
   * @param previousHash 前一个区块的哈希值（用于链接区块）
   */
  constructor(
    public index: number,
    public timestamp: number,
    public transactions: Transaction[],
    public previousHash: string = ''
  ) {
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  /**
   * 计算区块哈希值
   * 
   * 使用SHA256算法，基于以下数据计算哈希：
   * - 区块索引
   * - 前序哈希
   * - 时间戳
   * - 交易数据
   * - Nonce值
   * 
   * @returns 计算出的哈希值字符串
   */
  calculateHash(): string {
    return SHA256(
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.nonce
    ).toString();
  }

  /**
   * 挖矿 - 工作量证明（Proof of Work）
   * 
   * 通过不断增加nonce值，计算新的哈希，直到找到满足难度要求的哈希
   * 难度要求：哈希值必须以指定数量的0开头
   * 
   * 例如：difficulty = 4 时，哈希值必须以 "0000" 开头
   * 这使得挖矿需要大量的计算，从而保证区块链的安全性
   * 
   * @param difficulty 挖矿难度（哈希值开头需要的0的数量）
   */
  mineBlock(difficulty: number): void {
    // 创建目标字符串（例如：difficulty=4 => "0000"）
    const target = Array(difficulty + 1).join('0');

    // 持续尝试不同的nonce值，直到找到符合条件的哈希
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }

  /**
   * 验证区块中的所有交易
   * 
   * 检查区块中的每笔交易是否都是有效的
   * 主要验证交易的签名是否正确
   * 
   * @returns 如果所有交易都有效返回true，否则返回false
   */
  hasValidTransactions(): boolean {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }

  /**
   * 转换为JSON对象
   * 用于序列化和数据传输
   */
  toJSON() {
    return {
      index: this.index,
      timestamp: this.timestamp,
      transactions: this.transactions.map(tx => tx.toJSON()),
      previousHash: this.previousHash,
      hash: this.hash,
      nonce: this.nonce
    };
  }
}
