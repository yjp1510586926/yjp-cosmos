/**
 * 统计卡片组件
 * 功能：以卡片形式展示统计数据
 */

interface StatCardProps {
  title: string;
  value: string | number;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
}

// 颜色主题映射
const colorClasses: Record<string, string> = {
  blue: 'from-gray-900 to-black',
  green: 'from-black to-gray-900',
  purple: 'from-gray-800 to-black',
  orange: 'from-black to-gray-800',
  pink: 'from-gray-900 to-black',
};

export default function StatCard({ title, value, color = 'blue' }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-lg shadow-lg p-6`}>
      <p className="text-white/80 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
