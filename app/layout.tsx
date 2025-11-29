// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header'; // ヘッダー
import { Footer } from '@/components/layout/Footer'; // 👈 フッターを追加

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Baseball AI Media',
  description: 'Pro Baseball Statistics and AI Analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      {/* flex-col と min-h-screen でフッターを最下部に押し下げる */}
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#f3f4f6]`}>
        
        <Header /> {/* 上部ナビゲーション */}
        
        {/* メインコンテンツ */}
        <div className="flex-1">
          {children}
        </div>

        <Footer /> {/* 👈 下部ナビゲーション */}
        
      </body>
    </html>
  );
}