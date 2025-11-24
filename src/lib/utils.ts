/**
 * 通用工具函数库
 * 
 * 提供常用的辅助功能：
 * - 地址格式化
 * - 日期格式化
 * - 剪贴板操作
 * - 本地存储操作
 * - 消息样式工具
 */

/**
 * 截断地址显示
 * 
 * 将长地址缩短为更易读的格式
 * 例如：0x1234...5678
 * 
 * @param address 完整地址
 * @param startLength 前面保留的字符数（默认10）
 * @param endLength 后面保留的字符数（默认10）
 * @returns 截断后的地址
 */
export function truncateAddress(
  address: string | null,
  startLength: number = 10,
  endLength: number = 10
): string {
  // 如果地址为null，说明是系统奖励
  if (!address) return '系统奖励';
  
  // 如果地址足够短，直接返回
  if (address.length <= startLength + endLength) return address;
  
  // 返回截断格式
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
}

/**
 * 格式化日期时间
 * 
 * 将时间戳转换为易读的中文日期时间格式
 * 
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的日期时间字符串
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * 复制文本到剪贴板
 * 
 * 使用现代Clipboard API复制文本
 * 
 * @param text 要复制的文本
 * @returns Promise<boolean> 成功返回true，失败返回false
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
}

/**
 * 消息类型定义
 */
export type MessageType = 'success' | 'error' | 'info' | 'warning';

/**
 * 消息接口
 */
export interface Message {
  type: MessageType;
  text: string;
}

/**
 * 获取消息样式类名
 * 
 * 根据消息类型返回对应的Tailwind CSS类名
 * 
 * @param type 消息类型
 * @returns 样式类名字符串
 */
export function getMessageClasses(type: MessageType): string {
  const baseClasses = 'p-4 rounded-lg mb-6 border';
  const typeClasses = {
    success: 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-black dark:border-gray-800 dark:text-gray-200',
    error: 'bg-red-100 border-red-300 text-red-800 dark:bg-gray-900 dark:border-red-900 dark:text-red-400',
    warning: 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300',
    info: 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-black dark:border-gray-800 dark:text-gray-200',
  };
  return `${baseClasses} ${typeClasses[type]}`;
}

/**
 * LocalStorage 操作辅助工具
 * 
 * 提供类型安全的本地存储操作
 */
export const storage = {
  /**
   * 从LocalStorage读取数据
   * 
   * @param key 存储键名
   * @param defaultValue 默认值（当键不存在或解析失败时返回）
   * @returns 存储的值或默认值
   */
  get<T>(key: string, defaultValue: T): T {
    // 服务端渲染时返回默认值
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`读取 localStorage 失败 (${key}):`, error);
      return defaultValue;
    }
  },

  /**
   * 将数据保存到LocalStorage
   * 
   * @param key 存储键名
   * @param value 要保存的值
   * @returns 成功返回true，失败返回false
   */
  set<T>(key: string, value: T): boolean {
    // 服务端渲染时返回false
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`写入 localStorage 失败 (${key}):`, error);
      return false;
    }
  },

  /**
   * 从LocalStorage删除数据
   * 
   * @param key 存储键名
   * @returns 成功返回true，失败返回false
   */
  remove(key: string): boolean {
    // 服务端渲染时返回false
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`删除 localStorage 失败 (${key}):`, error);
      return false;
    }
  },
};
