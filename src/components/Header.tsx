'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: '/', icon: '🏠', label: '首页' },
    { path: '/blocks', icon: '📦', label: '区块浏览' },
    { path: '/wallet', icon: '👛', label: '钱包' },
    { path: '/mine', icon: '⛏️', label: '挖矿' },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold flex items-center space-x-2">
            <span className="text-3xl">⛓️</span>
            <span>YJP区块链</span>
          </Link>
          
          <nav className="flex space-x-1">
            {navItems.map(({ path, icon, label }) => (
              <Link
                key={path}
                href={path}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive(path) 
                    ? 'bg-white/20 font-semibold' 
                    : 'hover:bg-white/10'
                }`}
              >
                {icon} {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
