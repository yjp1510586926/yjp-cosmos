import { SHA256 } from 'crypto-js';
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

/**
 * 交易类 - 处理代币转账
 */
export class Transaction {
  public timestamp: number;
  public hash: string;

  constructor(
    public fromAddress: string | null,
    public toAddress: string,
    public amount: number,
    public signature?: string
  ) {
    this.timestamp = Date.now();
    this.hash = this.calculateHash();
  }

  /**
   * 计算交易哈希
   */
  calculateHash(): string {
    return SHA256(
      this.fromAddress + this.toAddress + this.amount + this.timestamp
    ).toString();
  }

  /**
   * 签名交易
   */
  signTransaction(signingKey: EC.KeyPair): void {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('你不能为其他钱包签署交易！');
    }

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');
    this.signature = sig.toDER('hex');
  }

  /**
   * 验证交易签名
   */
  isValid(): boolean {
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error('此交易没有签名');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }

  /**
   * 转换为JSON对象
   */
  toJSON() {
    return {
      fromAddress: this.fromAddress,
      toAddress: this.toAddress,
      amount: this.amount,
      timestamp: this.timestamp,
      hash: this.hash,
      signature: this.signature,
    };
  }
}
