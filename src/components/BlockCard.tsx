import { Block } from '@/lib/blockchain/Block';
import { formatDate, truncateAddress } from '@/lib/utils';

interface BlockCardProps {
  block: Block;
}

export default function BlockCard({ block }: BlockCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            区块 #{block.index}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(block.timestamp)}
          </p>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">
          {block.transactions.length} 笔交易
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start">
          <span className="text-gray-600 dark:text-gray-400 w-24 flex-shrink-0">哈希:</span>
          <code className="text-blue-600 dark:text-blue-400 font-mono break-all">
            {truncateAddress(block.hash)}
          </code>
        </div>
        <div className="flex items-start">
          <span className="text-gray-600 dark:text-gray-400 w-24 flex-shrink-0">前序哈希:</span>
          <code className="text-gray-600 dark:text-gray-400 font-mono break-all">
            {truncateAddress(block.previousHash)}
          </code>
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 dark:text-gray-400 w-24 flex-shrink-0">Nonce:</span>
          <span className="font-mono">{block.nonce}</span>
        </div>
      </div>

      {block.transactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            交易列表:
          </h4>
          <div className="space-y-2">
            {block.transactions.map((tx, idx) => (
              <div key={idx} className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {truncateAddress(tx.fromAddress)}
                  </span>
                  <span className="mx-2">→</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {truncateAddress(tx.toAddress)}
                  </span>
                  <span className="ml-2 font-bold text-green-600">
                    {tx.amount} 代币
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
