/**
 * 导航头部组件
 * 功能：提供全局导航菜单
 */

import { Link, useLocation } from 'react-router-dom';

// 导航菜单配置
const navItems = [
  { path: '/', label: '首页' },
  { path: '/blocks', label: '区块浏览' },
  { path: '/wallet', label: '钱包' },
  { path: '/mine', label: '挖矿' },
];

export default function Header() {
  const location = useLocation();
  
  // 判断当前路径是否为活动状态
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-black text-white shadow-lg border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
            YJP区块链
          </Link>
          
          {/* 导航菜单 */}
          <nav className="flex space-x-1">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive(path) 
                    ? 'bg-gray-800 font-semibold border border-gray-700' 
                    : 'hover:bg-gray-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

