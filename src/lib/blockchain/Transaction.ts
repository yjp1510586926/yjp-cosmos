/**
 * 交易类 - 处理代币转账
 * 
 * 交易是区块链中价值转移的基本单位，包含：
 * - 发送方地址（公钥）
 * - 接收方地址（公钥）
 * - 转账金额
 * - 数字签名（用私钥签名，确保交易真实性）
 */

import { SHA256 } from 'crypto-js';
import { ec as EC } from 'elliptic';

// 使用椭圆曲线加密算法（与比特币相同）
const ec = new EC('secp256k1');

export class Transaction {
  public timestamp: number;  // 交易创建时间
  public hash: string;       // 交易哈希值

  /**
   * 构造函数 - 创建新交易
   * @param fromAddress 发送方地址（null表示系统奖励）
   * @param toAddress 接收方地址
   * @param amount 转账金额
   * @param signature 数字签名（可选，创建后需要签名）
   */
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
   * 计算交易哈希值
   * 
   * 使用SHA256算法，基于交易的核心数据计算哈希
   * 用于唯一标识这笔交易
   * 
   * @returns 交易哈希值字符串
   */
  calculateHash(): string {
    return SHA256(
      this.fromAddress + this.toAddress + this.amount + this.timestamp
    ).toString();
  }

  /**
   * 签名交易
   * 
   * 使用发送方的私钥对交易进行签名
   * 这是确保交易真实性的关键步骤
   * 
   * 签名过程：
   * 1. 计算交易哈希
   * 2. 使用私钥对哈希进行签名
   * 3. 将签名转换为DER格式并保存
   * 
   * @param signingKey 签名密钥对（包含私钥）
   * @throws 如果尝试为其他钱包签署交易，抛出错误
   */
  signTransaction(signingKey: EC.KeyPair): void {
    // 验证：只能使用自己的私钥签名自己的交易
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('你不能为其他钱包签署交易！');
    }

    // 对交易哈希进行签名
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');
    this.signature = sig.toDER('hex');
  }

  /**
   * 验证交易的有效性
   * 
   * 验证步骤：
   * 1. 如果是系统奖励交易（fromAddress为null），直接返回有效
   * 2. 检查交易是否有签名
   * 3. 使用发送方的公钥验证签名
   * 
   * @returns 如果交易有效返回true，否则返回false
   * @throws 如果交易没有签名，抛出错误
   */
  isValid(): boolean {
    // 系统奖励交易（挖矿奖励）无需签名
    if (this.fromAddress === null) return true;

    // 检查是否有签名
    if (!this.signature || this.signature.length === 0) {
      throw new Error('此交易没有签名');
    }

    // 使用公钥验证签名
    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }

  /**
   * 转换为JSON对象
   * 用于序列化和数据传输
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
