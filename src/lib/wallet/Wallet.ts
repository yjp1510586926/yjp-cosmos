/**
 * 钱包类 - 管理用户的密钥对
 * 
 * 钱包的核心功能：
 * - 生成公钥和私钥对
 * - 使用私钥签名交易
 * - 提供公钥作为地址
 * 
 * 加密算法：使用椭圆曲线加密（ECC），与比特币相同
 */

import { ec as EC } from 'elliptic';

// 使用secp256k1椭圆曲线（与比特币、以太坊相同）
const ec = new EC('secp256k1');

export class Wallet {
  public publicKey: string;     // 公钥（也用作地址）
  public privateKey: string;    // 私钥（用于签名，需要保密）
  private keyPair: EC.KeyPair;  // 密钥对对象

  /**
   * 构造函数 - 创建或导入钱包
   * 
   * @param privateKey 可选的私钥，如果提供则导入现有钱包，否则生成新钱包
   */
  constructor(privateKey?: string) {
    if (privateKey) {
      // 导入现有钱包：从私钥生成密钥对
      this.keyPair = ec.keyFromPrivate(privateKey, 'hex');
    } else {
      // 生成新钱包：随机生成密钥对
      this.keyPair = ec.genKeyPair();
    }

    // 提取公钥和私钥（十六进制格式）
    this.publicKey = this.keyPair.getPublic('hex');
    this.privateKey = this.keyPair.getPrivate('hex');
  }

  /**
   * 获取钱包地址
   * 
   * 在这个实现中，公钥就是地址
   * （实际的区块链可能会对公钥进行哈希处理）
   * 
   * @returns 钱包地址（公钥）
   */
  getAddress(): string {
    return this.publicKey;
  }

  /**
   * 获取密钥对
   * 
   * 用于签名交易
   * 
   * @returns 密钥对对象
   */
  getKeyPair(): EC.KeyPair {
    return this.keyPair;
  }

  /**
   * 导出钱包信息
   * 
   * @returns 包含地址、公钥、私钥的对象
   */
  export() {
    return {
      address: this.publicKey,
      publicKey: this.publicKey,
      privateKey: this.privateKey,
    };
  }

  /**
   * 批量生成钱包
   * 
   * @param count 要生成的钱包数量
   * @returns 钱包数组
   */
  static generateWallets(count: number): Wallet[] {
    const wallets: Wallet[] = [];
    for (let i = 0; i < count; i++) {
      wallets.push(new Wallet());
    }
    return wallets;
  }
}
