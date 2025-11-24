/**
 * 消息提示组件
 * 用于显示成功、错误、警告、信息等提示消息
 */

import { MessageType } from '@/lib/utils';

interface MessageProps {
  type: MessageType;
  children: React.ReactNode;
}

// 消息类型对应的样式映射
const messageStyles: Record<MessageType, string> = {
  success: 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-black dark:border-gray-800 dark:text-gray-200',
  error: 'bg-red-100 border-red-300 text-red-800 dark:bg-gray-900 dark:border-red-900 dark:text-red-400',
  warning: 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300',
  info: 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-black dark:border-gray-800 dark:text-gray-200',
};

export default function Message({ type, children }: MessageProps) {
  return (
    <div className={`p-4 rounded-lg mb-6 border ${messageStyles[type]}`}>
      {children}
    </div>
  );
}

