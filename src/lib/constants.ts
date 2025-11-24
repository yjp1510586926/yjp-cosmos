/**
 * 项目全局常量配置
 */

// 区块链配置
export const BLOCKCHAIN_CONFIG = {
  DIFFICULTY: 4,
  MINING_REWARD: 50,
  MAX_WALLETS: 5,
} as const;

// 存储键名
export const STORAGE_KEYS = {
  WALLETS: 'wallets',
  WALLET: 'wallet',
  ACTIVE_WALLET: 'activeWallet',
} as const;

// 地址显示配置
export const ADDRESS_DISPLAY = {
  START_LENGTH: 10,
  END_LENGTH: 10,
} as const;

// 刷新间隔（毫秒）
export const REFRESH_INTERVALS = {
  BLOCKCHAIN_STATS: 10000, // 10秒
  PENDING_TRANSACTIONS: 5000, // 5秒
} as const;

