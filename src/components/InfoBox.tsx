/**
 * 信息提示框组件
 * 用于显示提示、说明等信息
 */

interface InfoBoxProps {
  type?: 'info' | 'warning' | 'success';
  title?: string;
  children: React.ReactNode;
}

// 信息框样式映射
const infoBoxStyles = {
  info: 'bg-gray-50 dark:bg-black border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300',
  warning: 'bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300',
  success: 'bg-gray-50 dark:bg-black border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300',
};

const titleColors = {
  info: 'text-gray-800 dark:text-gray-200',
  warning: 'text-gray-800 dark:text-gray-200',
  success: 'text-gray-800 dark:text-gray-200',
};

export default function InfoBox({ type = 'info', title, children }: InfoBoxProps) {
  return (
    <div className={`p-4 rounded-lg border ${infoBoxStyles[type]}`}>
      {title && (
        <h3 className={`font-semibold mb-2 ${titleColors[type]}`}>
          {title}
        </h3>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
}

