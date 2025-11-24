/**
 * 页面布局组件
 * 统一的页面容器，包含Header和主要内容区域
 */

import Header from './Header';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageLayout({ children, title, subtitle, action }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {(title || action) && (
          <div className="flex items-center justify-between mb-8">
            <div>
              {title && (
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
              )}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
        
        {children}
      </main>
    </div>
  );
}

