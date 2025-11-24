'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold flex items-center space-x-2">
            <span className="text-3xl">⛓️</span>
            <span>YJP区块链</span>
          </Link>
          
          <nav className="flex space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-white/20 font-semibold' 
                  : 'hover:bg-white/10'
              }`}
            >
              🏠 首页
            </Link>
            <Link
              href="/blocks"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/blocks') 
                  ? 'bg-white/20 font-semibold' 
                  : 'hover:bg-white/10'
              }`}
            >
              📦 区块浏览
            </Link>
            <Link
              href="/wallet"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/wallet') 
                  ? 'bg-white/20 font-semibold' 
                  : 'hover:bg-white/10'
              }`}
            >
              👛 钱包
            </Link>
            <Link
              href="/mine"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/mine') 
                  ? 'bg-white/20 font-semibold' 
                  : 'hover:bg-white/10'
              }`}
            >
              ⛏️ 挖矿
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

