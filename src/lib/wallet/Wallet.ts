import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

/**
 * 钱包类 - 管理用户的公钥和私钥
 */
export class Wallet {
  public publicKey: string;
  public privateKey: string;
  private keyPair: EC.KeyPair;

  constructor(privateKey?: string) {
    if (privateKey) {
      // 从私钥恢复钱包
      this.keyPair = ec.keyFromPrivate(privateKey, 'hex');
    } else {
      // 生成新钱包
      this.keyPair = ec.genKeyPair();
    }

    this.publicKey = this.keyPair.getPublic('hex');
    this.privateKey = this.keyPair.getPrivate('hex');
  }

  /**
   * 获取钱包地址（公钥）
   */
  getAddress(): string {
    return this.publicKey;
  }

  /**
   * 获取密钥对（用于签名）
   */
  getKeyPair(): EC.KeyPair {
    return this.keyPair;
  }

  /**
   * 导出钱包信息
   */
  export() {
    return {
      address: this.publicKey,
      publicKey: this.publicKey,
      privateKey: this.privateKey,
    };
  }

  /**
   * 生成多个钱包
   */
  static generateWallets(count: number): Wallet[] {
    const wallets: Wallet[] = [];
    for (let i = 0; i < count; i++) {
      wallets.push(new Wallet());
    }
    return wallets;
  }
}

