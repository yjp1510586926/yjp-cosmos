import { Block } from './Block';
import { Transaction } from './Transaction';

/**
 * 区块链类 - 管理整个区块链
 */
export class Blockchain {
  public chain: Block[];
  public difficulty: number;
  public pendingTransactions: Transaction[];
  public miningReward: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 50;
  }

  /**
   * 创建创世区块
   */
  createGenesisBlock(): Block {
    const genesisBlock = new Block(0, Date.now(), [], '0');
    genesisBlock.hash = genesisBlock.calculateHash();
    return genesisBlock;
  }

  /**
   * 获取最新区块
   */
  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  /**
   * 挖掘待处理交易（挖矿）
   */
  minePendingTransactions(miningRewardAddress: string): Block {
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      this.chain.length,
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingTransactions = [];

    return block;
  }

  /**
   * 添加交易到待处理池
   */
  addTransaction(transaction: Transaction): void {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('交易必须包含发送和接收地址');
    }

    if (!transaction.isValid()) {
      throw new Error('不能添加无效交易到链上');
    }

    if (transaction.amount <= 0) {
      throw new Error('交易金额必须大于0');
    }

    const senderBalance = this.getBalanceOfAddress(transaction.fromAddress);
    if (senderBalance < transaction.amount) {
      throw new Error('余额不足');
    }

    this.pendingTransactions.push(transaction);
  }

  /**
   * 获取地址余额
   */
  getBalanceOfAddress(address: string): number {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  /**
   * 获取地址的所有交易
   */
  getAllTransactionsForAddress(address: string): Transaction[] {
    const transactions: Transaction[] = [];

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address || trans.toAddress === address) {
          transactions.push(trans);
        }
      }
    }

    return transactions;
  }

  /**
   * 验证区块链完整性
   */
  isChainValid(): boolean {
    const realGenesis = JSON.stringify(this.createGenesisBlock());
    const currentGenesis = JSON.stringify(this.chain[0]);

    if (realGenesis !== currentGenesis) {
      return false;
    }

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  /**
   * 获取区块链统计信息
   */
  getStats() {
    return {
      blockCount: this.chain.length,
      difficulty: this.difficulty,
      pendingTransactions: this.pendingTransactions.length,
      miningReward: this.miningReward,
      isValid: this.isChainValid(),
    };
  }
}
