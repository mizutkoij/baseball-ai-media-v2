'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Twitter, Instagram, Loader2 } from 'lucide-react';

// 新しい型定義をインポート
import type { CompletePlayerData } from '@/lib/types/player';

// nf3データ用のマッパーをインポート
import { mapNF3ToCompletePlayerData, type NF3AllStatsData } from '@/lib/mappers/nf3PlayerMapper';

// 除外するフィールド
const EXCLUDE_FIELDS = ['詳細URL', 'nf3_player_id', 'url', 'nf3_id'];

// データをフィルタリングする関数
const filterData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => filterData(item));
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

// 統計データを見やすく表示するコンポーネント
const StatsSection = ({ title, data, showTitle = true }: { title: string; data: any; showTitle?: boolean }) => {
  const filteredData = filterData(data);

  if (!filteredData || (typeof filteredData === 'object' && Object.keys(filteredData).length === 0)) {
    return null;
  }

  // 配列の場合
  if (Array.isArray(filteredData)) {
    if (filteredData.length === 0) return null;

    return (
      <div className="mb-6">
        {showTitle && (
          <h3 className="text-sm font-bold text-slate-200 mb-3 border-b-2 border-blue-500 pb-1 inline-block">{title}</h3>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm bg-slate-800/50 border border-slate-700">
            <thead>
              <tr className="bg-slate-700/50 border-b-2 border-slate-600">
                {Object.keys(filteredData[0]).map((key) => (
                  <th key={key} className="text-left px-3 py-2 text-slate-300 font-bold whitespace-nowrap">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30 hover:bg-slate-700/30" : "bg-slate-800/50 hover:bg-slate-700/40"}>
                  {Object.values(row).map((value: any, j) => (
                    <td key={j} className="px-3 py-2 text-slate-200 border-b border-slate-700/50 whitespace-nowrap">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
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
      <div className="mb-6">
        {showTitle && (
          <h3 className="text-sm font-bold text-slate-200 mb-3 border-b-2 border-blue-500 pb-1 inline-block">{title}</h3>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm bg-slate-800/50 border border-slate-700">
            <tbody>
              {Object.entries(filteredData).map(([key, value], i) => (
                <tr key={key} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/50"}>
                  <td className="px-3 py-2 text-slate-400 font-medium border-b border-slate-700/50 whitespace-nowrap w-1/3">{key}</td>
                  <td className="px-3 py-2 text-slate-200 border-b border-slate-700/50">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PlayerDetailPage({ params }: PageProps) {
  const [playerId, setPlayerId] = useState<string>('');
  const [rawData, setRawData] = useState<NF3AllStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'career' | 'situational' | 'detailed' | 'batting' | 'farm' | 'other'>('overview');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // 新しい型に変換
  const playerData: CompletePlayerData | null = useMemo(() => {
    if (!rawData) return null;
    return mapNF3ToCompletePlayerData(rawData);
  }, [rawData]);

  useEffect(() => {
    params.then(p => {
      // Decode the URL-encoded player ID
      const decodedId = decodeURIComponent(p.id);
      setPlayerId(decodedId);
    });
  }, [params]);

  useEffect(() => {
    if (!playerId) return;

    // Parse player ID: format is "team_number_name"
    const parts = playerId.split('_');
    if (parts.length < 3) {
      setError('Invalid player ID format');
      setLoading(false);
      return;
    }

    const team = parts[0];
    const number = parts[1];
    const name = parts.slice(2).join('_');

    fetch(`/api/players/all-stats?name=${encodeURIComponent(name)}&team=${encodeURIComponent(team)}&number=${encodeURIComponent(number)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setRawData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching player data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [playerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">選手データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !playerData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
            <p className="text-red-400 mb-2">エラーが発生しました</p>
            <p className="text-slate-300 text-sm">{error || 'データの取得に失敗しました'}</p>
          </div>
          <Link
            href="/players"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block"
          >
            選手一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const { profile, career, season_stats, original_metrics, meta } = playerData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* 戻るボタン */}
        <div className="mb-4">
          <Link
            href="/players"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            選手一覧に戻る
          </Link>
        </div>

        {/* ヘッダーバー（チームカラー） */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b-4 border-blue-500 rounded-t-md overflow-hidden mb-0">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {profile.name_kanji}
                </h1>
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <span className="font-bold">#{profile.current_number}</span>
                  <span>|</span>
                  <span className="font-medium">{profile.current_team}</span>
                  <span>|</span>
                  <span>{profile.throws}投{profile.bats}打</span>
                  {rawData?.pitcherStats?.basic_info?.最終登板 && (
                    <>
                      <span>|</span>
                      <span>最終登板: {rawData.pitcherStats.basic_info.最終登板}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 選手情報セクション - プロフィールデータがないため非表示 */}

        {/* 年度選択 */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-t-md shadow-sm p-3 mb-0">
          <div className="flex items-center gap-3">
            <label htmlFor="year-select" className="text-xs font-medium text-slate-300">
              表示年度:
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-sm bg-slate-700 border border-slate-600 text-slate-200 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {/* TODO: 実際の年度データをここに挿入 */}
              <option value={2025}>2025年</option>
              <option value={2024}>2024年</option>
              <option value={2023}>2023年</option>
              <option value={2022}>2022年</option>
            </select>
            <span className="text-xs text-slate-400">※ 年度を切り替えて過去の成績を表示</span>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-slate-800/50 border border-slate-700 border-t-0 rounded-b-md shadow-sm mb-6">
          <div className="flex gap-0 overflow-x-auto border-b border-slate-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-400 bg-slate-700/50'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
              }`}
            >
              今季概要
            </button>
            <button
              onClick={() => setActiveTab('career')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === 'career'
                  ? 'border-blue-500 text-blue-400 bg-slate-700/50'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
              }`}
            >
              通算成績
            </button>
            {rawData?.pitcherStats && (
              <button
                onClick={() => setActiveTab('situational')}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === 'situational'
                    ? 'border-blue-500 text-blue-400 bg-slate-700/50'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                }`}
              >
                状況別成績
              </button>
            )}
            {rawData?.pitcherStats && (
              <button
                onClick={() => setActiveTab('detailed')}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === 'detailed'
                    ? 'border-blue-500 text-blue-400 bg-slate-700/50'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                }`}
              >
                詳細分析
              </button>
            )}
            {rawData?.batterStats && (
              <button
                onClick={() => setActiveTab('batting')}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === 'batting'
                    ? 'border-blue-500 text-blue-400 bg-slate-700/50'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                }`}
              >
                打撃成績
              </button>
            )}
            <button
              onClick={() => setActiveTab('farm')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === 'farm'
                  ? 'border-blue-500 text-blue-400 bg-slate-700/50'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
              }`}
            >
              二軍成績
            </button>
            <button
              onClick={() => setActiveTab('other')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === 'other'
                  ? 'border-blue-500 text-blue-400 bg-slate-700/50'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
              }`}
            >
              その他
            </button>
          </div>

          {/* タブコンテンツ */}
          <div className="p-4 sm:p-6 min-h-[400px]">
            {/* 概要タブ */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {rawData?.pitcherStats?.['通算成績'] && (
                  <StatsSection
                    title={`${selectedYear}年 シーズン成績`}
                    data={rawData.pitcherStats['通算成績']}
                    showTitle={true}
                  />
                )}
                {rawData?.pitcherStats?.['通算成績(各種指標)'] && (
                  <StatsSection
                    title={`${selectedYear}年 各種指標`}
                    data={rawData.pitcherStats['通算成績(各種指標)']}
                    showTitle={true}
                  />
                )}
              </div>
            )}

            {/* 通算成績タブ */}
            {activeTab === 'career' && (
              <div className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-6">
                  <h3 className="text-sm font-bold text-slate-200 mb-3 border-b-2 border-blue-500 pb-1 inline-block">
                    プロ通算成績
                  </h3>
                  <div className="space-y-4">
                    {/* TODO: 実際の通算成績データをここに挿入 */}
                    <div className="text-sm text-slate-400">
                      <p className="mb-4">プロ入り以降の全年度通算成績が表示されます。</p>

                      {/* プレースホルダー：通算投手成績 */}
                      <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700 mb-4">
                        <h4 className="text-xs font-bold text-slate-300 mb-2">通算投手成績</h4>
                        <div className="text-slate-500 text-xs">
                          [登板数、投球回、防御率、勝敗、奪三振、WHIP などの通算データ]
                        </div>
                      </div>

                      {/* プレースホルダー：年度別成績一覧 */}
                      <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700">
                        <h4 className="text-xs font-bold text-slate-300 mb-2">年度別成績</h4>
                        <div className="text-slate-500 text-xs">
                          [各年度の成績を一覧表示]
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 状況別成績タブ */}
            {activeTab === 'situational' && rawData?.pitcherStats && (
              <div className="space-y-6">
                {rawData.pitcherStats['対チーム別成績(リーグ)'] && (
                  <StatsSection
                    title="対チーム別成績（リーグ）"
                    data={rawData.pitcherStats['対チーム別成績(リーグ)']}
                    showTitle={true}
                  />
                )}
                {rawData.pitcherStats['対チーム別成績(交流戦)'] && (
                  <StatsSection
                    title="対チーム別成績（交流戦）"
                    data={rawData.pitcherStats['対チーム別成績(交流戦)']}
                    showTitle={true}
                  />
                )}
                {rawData.pitcherStats['月別成績'] && (
                  <StatsSection
                    title="月別成績"
                    data={rawData.pitcherStats['月別成績']}
                    showTitle={true}
                  />
                )}
                {rawData.pitcherStats['球場別成績'] && (
                  <StatsSection
                    title="球場別成績"
                    data={rawData.pitcherStats['球場別成績']}
                    showTitle={true}
                  />
                )}
              </div>
            )}

            {/* 詳細分析タブ */}
            {activeTab === 'detailed' && rawData?.pitcherStats && (
              <div className="space-y-6">
                {rawData.pitcherStats['カウント別成績'] && (
                  <StatsSection
                    title="カウント別成績"
                    data={rawData.pitcherStats['カウント別成績']}
                    showTitle={true}
                  />
                )}
                {rawData.pitcherStats['球種一覧 (※参照データ：Sportsnavi・与四球に故意四球はカウントせず)'] && (
                  <StatsSection
                    title="球種一覧"
                    data={rawData.pitcherStats['球種一覧 (※参照データ：Sportsnavi・与四球に故意四球はカウントせず)']}
                    showTitle={true}
                  />
                )}
              </div>
            )}

            {/* 打撃成績タブ */}
            {activeTab === 'batting' && rawData?.batterStats && (
              <div className="space-y-6">
                {Object.entries(rawData.batterStats)
                  .filter(([key]) => key !== 'basic_info')
                  .map(([key, value]) => (
                    <StatsSection
                      key={key}
                      title={key}
                      data={value}
                      showTitle={true}
                    />
                  ))}
              </div>
            )}

            {/* 二軍成績タブ */}
            {activeTab === 'farm' && (
              <div className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-6">
                  <h3 className="text-sm font-bold text-slate-200 mb-3 border-b-2 border-blue-500 pb-1 inline-block">
                    二軍成績（イースタン/ウエスタン）
                  </h3>
                  <div className="space-y-4">
                    {/* TODO: 実際の二軍成績データをここに挿入 */}
                    <div className="text-sm text-slate-400">
                      <p className="mb-4">二軍での成績データが表示されます。</p>

                      {/* プレースホルダー：二軍投手成績 */}
                      <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700 mb-4">
                        <h4 className="text-xs font-bold text-slate-300 mb-2">二軍投手成績（今季）</h4>
                        <div className="text-slate-500 text-xs">
                          [試合数、投球回、防御率、勝敗、奪三振、与四球などのデータ]
                        </div>
                      </div>

                      {/* プレースホルダー：二軍年度別成績 */}
                      <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700 mb-4">
                        <h4 className="text-xs font-bold text-slate-300 mb-2">二軍年度別成績</h4>
                        <div className="text-slate-500 text-xs">
                          [年度ごとの二軍成績テーブル]
                        </div>
                      </div>

                      {/* プレースホルダー：二軍詳細分析 */}
                      <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700">
                        <h4 className="text-xs font-bold text-slate-300 mb-2">二軍詳細データ</h4>
                        <div className="text-slate-500 text-xs">
                          [球種別成績、対戦相手別成績など]
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* その他タブ */}
            {activeTab === 'other' && rawData?.pitcherStats && (
              <div className="space-y-6">
                {rawData.pitcherStats['登録履歴'] && (
                  <StatsSection
                    title="登録履歴"
                    data={rawData.pitcherStats['登録履歴']}
                    showTitle={true}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* データメタ情報セクション */}
        <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-md shadow-sm p-4">
          <h3 className="text-sm font-bold text-slate-200 mb-3 border-b-2 border-blue-500 pb-1 inline-block">
            この選手データについて
          </h3>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-slate-400">最終更新:</div>
              <div className="text-xs">
                {new Date(meta.last_updated).toLocaleString('ja-JP')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-slate-400">データソース:</div>
              <div>
                <ul className="list-disc list-inside text-xs">
                  {meta.data_sources.map((source, i) => (
                    <li key={i}>{source.name} - {source.data_type.join(', ')}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-slate-400">データ品質:</div>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${
                  meta.data_quality.reliability === 'high' ? 'bg-green-500' :
                  meta.data_quality.reliability === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></span>
                <span className="text-xs">
                  {meta.data_quality.reliability === 'high' ? '高' :
                   meta.data_quality.reliability === 'medium' ? '中' : '低'}
                  （完全性: {(meta.data_quality.completeness * 100).toFixed(0)}%）
                </span>
              </div>
            </div>
            {meta.data_quality.notes && (
              <div className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-700">
                {meta.data_quality.notes}
              </div>
            )}
            <div className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-700">
              バージョン: {meta.version}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
