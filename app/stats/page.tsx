// app/stats/page.tsx
'use client';

import { useState } from 'react';
import { StatTable } from '@/components/stats/StatTable';
import { LEADERS } from '@/lib/mockData';
import Link from 'next/link';

// 成績項目の定義
const statCategories = [
    { key: 'AVG', label: '打率' },
    { key: 'HR', label: '本塁打' },
    { key: 'RBI', label: '打点' },
    { key: 'ERA', label: '防御率' },
    { key: 'WINS', label: '勝利' },
    //... さらに多くの項目を追加可能
];

type League = 'CENTRAL' | 'PACIFIC';

export default function StatsPage() {
    const [activeLeague, setActiveLeague] = useState<League>('CENTRAL');
    const [activeStat, setActiveStat] = useState(statCategories[0]);

    // 選択されたリーグと項目に基づいてデータを取得
    const currentData = activeLeague === 'CENTRAL' 
        ? LEADERS.central.batting // 現在は打撃データのみ（拡張が必要）
        : LEADERS.pacific.batting;

    // TODO: ここでStatTableに渡す前に、activeStatに基づいてデータをフィルタ・ソートするロジックを追加する

    return (
        <main className="pb-10 min-h-screen bg-[#f3f4f6]">
            <div className="container mx-auto max-w-6xl mt-6 px-4">
                
                {/* ページタイトルとパンくずリスト（簡易） */}
                <div className="mb-6">
                    <div className="text-xs text-gray-500 mb-1">
                        <Link href="/" className="hover:underline">ホーム</Link> / 
                        <span className="font-bold">個人成績</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        プロ野球 個人成績ランキング
                    </h1>
                </div>

                {/* 統計項目セレクター (タブ) */}
                <div className="flex flex-wrap gap-2 mb-6 bg-white p-3 border border-gray-200 rounded-md shadow-sm">
                    <span className="text-sm font-bold text-gray-700 mr-2 shrink-0">項目選択:</span>
                    {statCategories.map((stat) => (
                        <button
                            key={stat.key}
                            onClick={() => setActiveStat(stat)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors shrink-0
                                ${activeStat.key === stat.key 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {stat.label}
                        </button>
                    ))}
                </div>

                {/* リーグセレクター (ボタン) */}
                <div className="flex mb-4">
                    <button
                        onClick={() => setActiveLeague('CENTRAL')}
                        className={`px-6 py-2 text-lg font-bold transition-colors border-b-2
                            ${activeLeague === 'CENTRAL' 
                                ? 'border-green-700 text-green-700 bg-white' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        セ・リーグ
                    </button>
                    <button
                        onClick={() => setActiveLeague('PACIFIC')}
                        className={`px-6 py-2 text-lg font-bold transition-colors border-b-2
                            ${activeLeague === 'PACIFIC' 
                                ? 'border-blue-600 text-blue-600 bg-white' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        パ・リーグ
                    </button>
                </div>

                {/* 成績テーブル本体 */}
                <StatTable 
                    data={currentData} 
                    statTitle={activeStat.label} 
                />

                <div className="text-xs text-gray-400 mt-4 text-right">
                    ※ {activeStat.label}は本日時点の速報データに基づいています。
                </div>

            </div>
        </main>
    );
}