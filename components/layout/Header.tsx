// components/layout/Header.tsx
import Link from 'next/link';
// ↓ ここを変更: 'react-icons/ci' ではなく 'react-icons/bi' を使い、アイコン名を変更
import { BiMenu, BiBaseball, BiBarChart, BiCalendar } from 'react-icons/bi';

const navItems = [
  { label: '日程・結果', href: '/games', icon: BiCalendar },
  { label: '順位表', href: '/standings', icon: BiBaseball },
  { label: '個人成績', href: '/stats', icon: BiBarChart },
  { label: 'チーム一覧', href: '/teams', icon: BiMenu },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        
        {/* 左側: ロゴ */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-700 rounded-sm flex items-center justify-center text-white font-bold font-mono text-xs shrink-0">
            BA
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            Baseball AI Media
          </span>
        </Link>

        {/* 右側: メインナビゲーション (PC) */}
        <nav className="hidden sm:block">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link 
                  href={item.href} 
                  className="flex items-center space-x-1 text-sm font-semibold text-gray-700 hover:text-blue-700 transition-colors py-1"
                >
                  {/* アイコンを表示 */}
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 右端: メニューボタン (スマホ) */}
        <button className="sm:hidden p-1 text-gray-600 hover:text-blue-700">
          <BiMenu className="w-6 h-6" />
        </button>

      </div>
      
      {/* サブメニュー */}
      <div className="w-full bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto max-w-6xl px-4">
          <ul className="flex justify-center text-xs space-x-4 py-2 overflow-x-auto">
            <li className="shrink-0">
              <Link href="/standings/central" className="text-gray-600 font-bold hover:text-green-700">セ・リーグ順位</Link>
            </li>
            <li className="shrink-0">
              <Link href="/standings/pacific" className="text-gray-600 font-bold hover:text-blue-600">パ・リーグ順位</Link>
            </li>
            <li className="shrink-0">
              <Link href="/stats/batting" className="text-gray-600 hover:text-blue-700">打撃成績</Link>
            </li>
            <li className="shrink-0">
              <Link href="/stats/pitching" className="text-gray-600 hover:text-blue-700">投手成績</Link>
            </li>
          </ul>
        </div>
      </div>
      
    </header>
  );
}