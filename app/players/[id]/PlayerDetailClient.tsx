// components/stats/PlayerDetailClient.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
// lucide-react がない場合は react-icons/bi を使用
import { BiArrowBack } from 'react-icons/bi'; 
import type { CompletePlayerData, NF3AllStatsData } from '@/lib/types';

// デザイン変更: ダークモード用クラスを白ベース用クラスに置換するためのマッピング
// (実際にはコード内のクラスを直接書き換えます)

const EXCLUDE_FIELDS = ['詳細URL', 'nf3_player_id', 'url', 'nf3_id'];

const filterData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map((item: any) => filterData(item));
  }
  if (typeof data === 'object' && data !== null) {
    const filtered: any = {};
    Object.entries(data).forEach(([key, value]) => {
      if (!EXCLUDE_FIELDS.includes(key)) {
        filtered[key] = filterData(value);
      }
    });
    return filtered;
  }
  return data;
};

export function PlayerDetailClient({ playerData, rawData }: PlayerDetailClientProps) ({
  title,
  data,
  showTitle = true,
}: {
  title: string;
  data: any;
  showTitle?: boolean;
}) => {
  const filteredData = filterData(data);

  if (!filteredData || (typeof filteredData === 'object' && Object.keys(filteredData).length === 0)) {
    return null;
  }

  // 配列の場合
  if (Array.isArray(filteredData)) {
    if (filteredData.length === 0) return null;
    const firstRow = filteredData[0];
    if (!firstRow || typeof firstRow !== 'object') return null;
    const columns = Object.keys(firstRow);

    return (
      <div className="mb-8 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        {showTitle && (
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center">
            <h3 className="font-bold text-gray-800 border-l-4 border-blue-600 pl-3 text-sm">{title}</h3>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-600 border-b border-gray-200 font-medium">
              <tr>
                {columns.map((key) => (
                  <th key={key} className="px-3 py-2 border-r border-gray-200 last:border-r-0 font-bold">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                  {columns.map((key, j) => (
                    <td key={j} className="px-3 py-2 border-r border-gray-100 last:border-r-0 text-gray-800 font-mono">
                      {typeof (row as any)[key] === 'object'
                        ? JSON.stringify((row as any)[key])
                        : String((row as any)[key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // オブジェクトの場合
  if (typeof filteredData === 'object') {
    return (
      <div className="mb-8 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        {showTitle && (
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center">
            <h3 className="font-bold text-gray-800 border-l-4 border-blue-600 pl-3 text-sm">{title}</h3>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <tbody className="divide-y divide-gray-100">
              {Object.entries(filteredData).map(([key, value]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500 font-medium bg-gray-50/50 border-r border-gray-100 w-1/3">
                    {key}
                  </td>
                  <td className="px-4 py-2 text-gray-800 font-mono">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value ?? '-')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};

type ActiveTab = 'overview' | 'career' | 'situational' | 'detailed' | 'batting' | 'farm' | 'other';

interface PlayerDetailClientProps {
  playerData: CompletePlayerData;
  rawData: NF3AllStatsData;
}

export default function PlayerDetailClient({ playerData, rawData }: PlayerDetailClientProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // 利用可能な年度一覧を抽出
  const availableYears = useMemo<number[]>(() => {
    const years = new Set<number>();
    const pushFromArray = (arr: any[] | undefined, key: string = '年度') => {
      if (!Array.isArray(arr)) return;
      arr.forEach((row) => {
        const y = (row as any)?.[key];
        if (!y) return;
        const n = Number(String(y).replace(/[^\d]/g, ''));
        if (!Number.isNaN(n)) years.add(n);
      });
    };

    if (rawData?.pitcherStats?.['通算成績']) {
      pushFromArray(rawData.pitcherStats['通算成績'] as any[]);
    }
    if (rawData?.batterStats) {
      Object.entries(rawData.batterStats)
        .filter(([k]) => k !== 'basic_info')
        .forEach(([, val]) => {
          pushFromArray(val as any[]);
        });
    }
    // データがない場合のフォールバック（モックデータ用）
    if (years.size === 0) return [2025, 2024, 2023, 2022];

    return Array.from(years).sort((a, b) => b - a);
  }, [rawData]);

  // 年度ごとの通算成績（今季概要用）
  const seasonSummaryForYear = useMemo(() => {
    const rows = rawData?.pitcherStats?.['通算成績'];
    if (!rows) return null;
    if (!Array.isArray(rows)) return rows;
    const filtered = rows.filter((row: any) => String(row?.['年度']) === String(selectedYear));
    return filtered.length > 0 ? filtered : rows;
  }, [rawData, selectedYear]);

  const seasonIndicatorsForYear = useMemo(() => {
    const rows = rawData?.pitcherStats?.['通算成績(各種指標)'];
    if (!rows) return null;
    if (!Array.isArray(rows)) return rows;
    const filtered = rows.filter((row: any) => String(row?.['年度']) === String(selectedYear));
    return filtered.length > 0 ? filtered : rows;
  }, [rawData, selectedYear]);

  const { profile, meta } = playerData;

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-12">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        
        {/* 戻るボタン */}
        <div className="mb-4">
          <Link
            href="/stats"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-xs font-bold"
          >
            <BiArrowBack className="w-4 h-4" />
            選手一覧に戻る
          </Link>
        </div>

        {/* ヘッダーバー (プロフィール) */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden mb-6">
          <div className="p-6 flex flex-col md:flex-row gap-6">
            {/* アイコンの代わりの円 */}
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold border-2 border-gray-200 shrink-0">
               Photo
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-end gap-3">
                {profile.name_kanji}
                <span className="text-sm text-gray-500 font-normal mb-1">{profile.name_kana}</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-gray-700 mb-4">
                <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-sm text-xs">
                  {profile.current_team}
                </span>
                {profile.current_number && (
                  <>
                    <span className="font-mono">#{profile.current_number}</span>
                    <span className="text-gray-300">|</span>
                  </>
                )}
                <span>{profile.position}</span>
                <span className="text-gray-300">|</span>
                <span>{profile.throws}投{profile.bats}打</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-sm border border-gray-200">
                <div>
                  <span className="block text-gray-400 mb-0.5">生年月日</span>
                  <span className="font-medium">{profile.birth_date}</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-0.5">体格</span>
                  <span className="font-medium">{profile.height} / {profile.weight}</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-0.5">ドラフト</span>
                  <span className="font-medium">データなし</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-0.5">出身地</span>
                  <span className="font-medium">{profile.birthplace_prefecture || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 年度選択 */}
        <div className="bg-white border border-gray-200 rounded-t-sm p-3 mb-0 flex items-center gap-3">
            <label htmlFor="year-select" className="text-xs font-bold text-gray-600">
              表示年度:
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white border border-gray-200 border-t-0 rounded-b-sm shadow-sm mb-8">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {[
              { id: 'overview', label: '今季概要' },
              { id: 'career', label: '通算成績' },
              ...(rawData?.pitcherStats ? [
                { id: 'situational', label: '状況別成績' },
                { id: 'detailed', label: '詳細分析' }
              ] : []),
              ...(rawData?.batterStats ? [
                { id: 'batting', label: '打撃成績' }
              ] : []),
              { id: 'farm', label: '二軍成績' },
              { id: 'other', label: 'その他' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* タブコンテンツエリア */}
          <div className="p-6 min-h-[300px]">
            
            {/* 打撃成績 (野手用) */}
            {activeTab === 'batting' && rawData?.batterStats && (
              <div className="space-y-8">
                {Object.entries(rawData.batterStats)
                  .filter(([key]) => key !== 'basic_info')
                  .map(([key, value]) => (
                    <StatsSection key={key} title={key} data={value} showTitle={true} />
                  ))}
              </div>
            )}

            {/* その他のタブの中身（必要に応じて実装を追加） */}
            {activeTab === 'overview' && (
               <div className="text-center text-gray-400 py-10">（ここに概要データを表示）</div>
            )}
             {activeTab === 'career' && (
               <div className="text-center text-gray-400 py-10">（ここに通算成績を表示）</div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}