import { SHA256 } from 'crypto-js';
import { Transaction } from './Transaction';

/**
 * 区块类 - 区块链的基本单位
 */
export class Block {
  public nonce: number;
  public hash: string;

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
   * 计算区块哈希
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
   * 挖矿 - 工作量证明
   * @param difficulty 难度系数（前导0的数量）
   */
  mineBlock(difficulty: number): void {
    const target = Array(difficulty + 1).join('0');
    
    console.log(`⛏️  开始挖矿区块 #${this.index}...`);
    const startTime = Date.now();

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✅ 区块挖掘成功！`);
    console.log(`   哈希: ${this.hash}`);
    console.log(`   Nonce: ${this.nonce}`);
    console.log(`   耗时: ${duration}秒\n`);
  }

  /**
   * 验证区块中的所有交易
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

