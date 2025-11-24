/**
 * 项目全局常量配置
 * 
 * 集中管理所有的配置常量，便于维护和修改
 */

/**
 * 区块链配置
 */
export const BLOCKCHAIN_CONFIG = {
  DIFFICULTY: 4,        // 挖矿难度（哈希值前导0的数量）
  MINING_REWARD: 50,    // 挖矿奖励（代币数量）
  MAX_WALLETS: 5,       // 最大钱包数量限制
} as const;

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  WALLETS: 'wallets',           // 钱包列表
  WALLET: 'wallet',             // 当前钱包
  ACTIVE_WALLET: 'activeWallet', // 活动钱包ID
} as const;

/**
 * 地址显示配置
 */
export const ADDRESS_DISPLAY = {
  START_LENGTH: 10,    // 地址开头显示的字符数
  END_LENGTH: 10,      // 地址结尾显示的字符数
} as const;

/**
 * 自动刷新间隔配置（毫秒）
 */
export const REFRESH_INTERVALS = {
  BLOCKCHAIN_STATS: 10000,        // 区块链统计数据刷新间隔（10秒）
  PENDING_TRANSACTIONS: 5000,     // 待处理交易刷新间隔（5秒）
} as const;
