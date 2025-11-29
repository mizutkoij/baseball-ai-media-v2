'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';
import type { CompletePlayerData, NF3AllStatsData } from '@/lib/types';

const EXCLUDE_FIELDS = ['詳細URL', 'nf3_player_id', 'url', 'nf3_id', '年度'];

// --- 1. タイトルマッピング ---
const TITLE_MAP: Record<string, string> = {
  'Day_Nighter別成績': 'デー・ナイター別',
  'Home_Visitor別成績': 'ホーム・ビジター別',
  'QS_HQS_SQS達成状況': '先発クオリティ指標',
  '対チーム別成績(リーグ)': '対チーム別（リーグ）',
  '対チーム別成績(交流戦)': '対チーム別（交流戦）',
  '月別成績': '月別成績',
  '球場別成績': '球場別成績',
  'カウント別成績': 'カウント別成績',
  '球種一覧 (※参照データ：Sportsnavi・与四球に故意四球はカウントせず)': '球種別成績',
  '球種一覧 (※参照データ：Sportsnavi・四球に故意四球はカウントせず)': '球種別成績',
  '登録履歴': '登録履歴',
  '対打者結果一覧(フライはライナー・犠飛含む)': '打球タイプ別',
  '打撃内容一覧(フライはライナー・犠飛含む)': '打球タイプ詳細',
  '打球方向(安打・本塁・凡打はそれぞれに対する割合)': '打球方向',
  '左右別成績': '対左右投手別',
  '得点圏成績': '得点圏成績',
  '代打成績': '代打成績',
  '打順別成績(先発時)': '打順別（先発）',
  '打席別成績(先発時)': '打席別（先発）',
  '本塁打の種別一覧': '本塁打内訳',
  '盗塁状況別マトリクス - 二塁盗塁 -': '二盗成功率',
  '盗塁状況別マトリクス - 三塁盗塁 -': '三盗成功率',
  '盗塁状況別マトリクス - 本塁盗塁 -': '本盗成功率',
  '先発時の守備位置別成績(偵察メンバーからの交代出場は除く)': '守備位置別（先発）',
  '守備起用一覧': '守備起用内訳',
  '起用一覧': '起用スタッツ',
  '連続打席フラグ': '連続記録（打席）',
  '連続試合フラグ': '連続記録（試合）',
  '先発時のイニング毎失点数(降板後の失点も加算)': 'イニング別失点',
  '連投の回数一覧(日付ベース)': '連投回数 (日付)',
  'ランナ−別成績': 'ランナー別成績',
  '先発・救援別成績': '先発・救援別',
  '通算成績': '年度別成績',
  '通算成績(各種指標)': '各種指標',
  '各種成績': '各種指標（マルチ・猛打賞等）'
};

const replaceText = (text: string): string => {
  if (typeof text !== 'string') return text;
  return text.replace('Ce その他', 'セ その他').replace('Pa その他', 'パ その他');
};

const filterData = (data: any): any => {
  if (Array.isArray(data)) return data.map((item: any) => filterData(item));
  if (typeof data === 'object' && data !== null) {
    const filtered: any = {};
    Object.entries(data).forEach(([key, value]) => {
      if (!EXCLUDE_FIELDS.includes(key)) {
        const val = filterData(value);
        filtered[key] = typeof val === 'string' ? replaceText(val) : val;
      }
    });
    return filtered;
  }
  return typeof data === 'string' ? replaceText(data) : data;
};

const parseRegistrationHistoryArray = (dataArray: any[]): { 日付: string; 内容: string }[] => {
    if (!Array.isArray(dataArray)) return [];
    const result: { 日付: string; 内容: string }[] = [];
    dataArray.forEach(item => {
        if (typeof item !== 'string') return;
        const match = item.match(/^([△▼])(\d{1,2}\/\d{1,2})(.*)$/);
        if (match) result.push({ 日付: match[2], 内容: `${match[1]}${match[3]}` });
    });
    return result;
};

/**
 * キー結合のクリーニング (修正版)
 * "防御率1.74" -> { "防御率": "1.74" }
 * "Whiff%" -> そのまま (数値を含まないため)
 */
const cleanCorruptedRow = (row: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {};
    Object.entries(row).forEach(([key, value]) => {
        // 正規表現修正: 末尾部分に「数字」が少なくとも1つ含まれることを必須とする
        // これにより "Whiff%" のような項目名を誤って分離するのを防ぐ
        const match = key.match(/^([^0-9]+?)([0-9\.\-%]*\d[0-9\.\-%]*)$/);
        
        if (match) {
            const newKey = match[1].trim();
            const extractedValue = match[2].trim();
            
            // 元の値が無効な場合のみ、キーから抽出した値を採用
            if (value === null || (typeof value === 'string' && isNaN(Number(value)) && value !== '-')) {
                 cleaned[newKey] = extractedValue;
            } else {
                 cleaned[newKey] = value || extractedValue;
            }
        } else {
            cleaned[key] = value;
        }
    });
    return cleaned;
};

/** 分割された行をマージする */
const mergeSplitRows = (data: any[]): any[] => {
    const merged: any[] = [];
    let skipNext = false;
    for (let i = 0; i < data.length; i++) {
        if (skipNext) { skipNext = false; continue; }
        const row = data[i];
        const nextRow = data[i + 1];
        const keys = Object.keys(row);
        // キー結合の疑いがあるか
        const hasCorruptedKeys = keys.some(k => /^[^0-9]+[0-9\.\-%]*\d[0-9\.\-%]*$/.test(k));

        if (hasCorruptedKeys && nextRow && JSON.stringify(keys) === JSON.stringify(Object.keys(nextRow))) {
            const newRow: Record<string, any> = {};
            keys.forEach(key => {
                // キーから抽出
                const match = key.match(/^([^0-9]+?)([0-9\.\-%]*\d[0-9\.\-%]*)$/);
                if (match) {
                    newRow[match[1].trim()] = match[2].trim();
                }
                // 値から抽出
                const header2 = row[key]; 
                const value2 = nextRow[key];
                if (typeof header2 === 'string' && header2 !== '-' && header2 !== '年度') {
                    newRow[header2] = value2;
                }
            });
            // 年度などはnextRowから補完
            if (nextRow['年度']) newRow['年度'] = nextRow['年度'];

            merged.push(newRow);
            skipNext = true;
        } else {
            merged.push(cleanCorruptedRow(row));
        }
    }
    return merged;
};

// 今季概要用
const formatBasicStats = (data: any[], selectedYear: number, isPitcher: boolean) => {
    const mergedData = mergeSplitRows(data);
    const targetRow = mergedData.find((row: any) => String(row['年度']) === String(selectedYear)) || mergedData[0]; 
    if (!targetRow) return null;

    const result: Record<string, any> = {};
    const pitcherKeys = ['防御率', '試合', '勝利', '敗戦', 'Ｓ', 'ＨＰ', '奪三振', '回数', 'WHIP', '勝率'];
    const batterKeys = ['打率', '試合', '本塁', '打点', '安打', '盗塁', '出塁率', '長打率', 'OPS', '得点圏'];
    const targetKeys = isPitcher ? pitcherKeys : batterKeys;

    targetKeys.forEach(key => {
        const foundKey = Object.keys(targetRow).find(k => k === key || k.startsWith(key));
        if (foundKey) result[key] = targetRow[foundKey];
    });
    return result;
};

// --- 3. コンポーネント ---

const QSAnalysis = ({ data }: { data: any[] }) => {
    if (!Array.isArray(data) || data.length < 2) return null;
    const values = data[1]; if (!values) return null;

    const extract = (prefix: string) => {
        const rateKey = Object.keys(values).find(k => k.startsWith(prefix) && k.includes('率'));
        const winKey = Object.keys(values).find(k => k.startsWith(prefix) && k.includes('勝敗') && !k.includes('.1')); 
        const lossKey = Object.keys(values).find(k => k.startsWith(prefix) && k.includes('勝敗') && k.includes('.1')); 
        
        const rateStr = values[rateKey || ''] || '-';
        const rateMatch = rateStr.match(/([\d\.]+)%/);
        const winStr = values[winKey || ''] || '0';
        const winMatch = winStr.match(/(\d+)/);
        const lossStr = values[lossKey || ''] || '0';
        const lossMatch = lossStr.match(/(\d+)/);
        const countMatch = rateStr.match(/\((\d+)\/(\d+)\)/);

        return {
            rate: rateMatch ? rateMatch[1] : '-',
            count: countMatch ? countMatch[1] : '-',
            total: countMatch ? countMatch[2] : '-',
            wins: winMatch ? winMatch[1] : '-',
            losses: lossMatch ? lossMatch[1] : '-',
        };
    };

    const qs = extract('QS');
    const hqs = extract('HQS');
    const sqs = extract('SQS');

    const Card = ({ label, metric, color }: any) => (
        <div className="bg-white border border-gray-200 rounded-sm p-3 shadow-sm flex flex-col items-center text-center min-w-[100px]">
            <h4 className={`text-xs font-bold ${color} mb-1 uppercase tracking-wider`}>{label}</h4>
            <div className="flex items-baseline gap-0.5 mb-1">
                <span className="text-2xl font-extrabold text-gray-800">{metric.rate}</span>
                <span className="text-[10px] text-gray-500 font-bold">%</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono mb-2">
                {metric.count}/{metric.total}
            </div>
            <div className="w-full border-t border-gray-100 pt-1 flex justify-between text-[10px] px-1">
                <div><span className="text-gray-400 scale-90">勝</span><span className="font-bold text-red-600 ml-1">{metric.wins}</span></div>
                <div><span className="text-gray-400 scale-90">敗</span><span className="font-bold text-blue-600 ml-1">{metric.losses}</span></div>
            </div>
        </div>
    );

    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 px-1">
                <h3 className="font-bold text-gray-700 text-sm border-l-4 border-blue-600 pl-3">先発クオリティ指標</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-2">
                <Card label="QS" metric={qs} color="text-blue-600" />
                <Card label="HQS" metric={hqs} color="text-yellow-600" />
                <Card label="SQS" metric={sqs} color="text-red-600" />
            </div>
            <div className="text-[10px] text-gray-400 text-right px-1">※SQS(沢村賞式QS): 先発で7回3自責点以下</div>
        </div>
    );
};

const StatsSection = ({ title, data, showTitle = true, forceHorizontal = false }: any) => {
  let filteredData = filterData(data);
  if (!filteredData || (typeof filteredData === 'object' && Object.keys(filteredData).length === 0)) return null;
  
  if (title === 'QS_HQS_SQS達成状況') return <QSAnalysis data={filteredData} />;

  let caption: string | null = null;
  if (title === '登録履歴' && Array.isArray(filteredData)) {
      const parsed = parseRegistrationHistoryArray(filteredData);
      if (parsed.length > 0) filteredData = parsed;
  }

  if (Array.isArray(filteredData)) {
    if (filteredData.length === 0) return null;
    
    // 分割行のマージ処理を実行
    let displayData = mergeSplitRows(filteredData);
    if (displayData.length === 0) return null;

    let columns = Object.keys(displayData[0]);

    // 1行目がヘッダーの場合の処理
    const firstRowValues = Object.values(displayData[0]);
    if (firstRowValues.some(v => typeof v === 'string' && /[一-龠]{2,}/.test(v))) {
            columns = firstRowValues.map(v => String(v));
            displayData = displayData.slice(1).map((row: any) => {
                const vals = Object.values(row);
                const newRow: any = {};
                columns.forEach((col, idx) => { if(col) newRow[col] = vals[idx]; });
                return newRow;
            });
    }

    const displayTitle = TITLE_MAP[title] || title;

    return (
      <div className="mb-8 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        {showTitle && (
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center">
            <h3 className="font-bold text-gray-800 border-l-4 border-blue-600 pl-3 text-sm">{displayTitle}</h3>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-600 border-b border-gray-200 font-medium">
              <tr>
                {columns.map((key, idx) => (
                  <th key={`${key}-${idx}`} className="px-3 py-2 border-r border-gray-200 last:border-r-0 font-bold min-w-[60px]">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayData.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                  {columns.map((key, j) => (
                    <td key={`${key}-${j}`} className="px-3 py-2 border-r border-gray-100 last:border-r-0 text-gray-800 font-mono">
                      {typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {caption && <div className="px-4 py-2 text-[10px] text-gray-500 bg-gray-50 border-t border-gray-200">{caption}</div>}
      </div>
    );
  }

  // オブジェクト
  if (typeof filteredData === 'object' && !Array.isArray(filteredData)) {
    const columns = Object.keys(filteredData);
    const displayTitle = TITLE_MAP[title] || title;
    
    if (forceHorizontal || columns.length > 4) {
        return (
            <div className="mb-8 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                {showTitle && (
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center">
                    <h3 className="font-bold text-gray-800 border-l-4 border-blue-600 pl-3 text-sm">{displayTitle}</h3>
                </div>
                )}
                <div className="overflow-x-auto">
                <table className="w-full text-xs text-left whitespace-nowrap">
                    <thead className="bg-gray-100 text-gray-600 border-b border-gray-200 font-medium">
                    <tr>
                        {columns.map((key) => <th key={key} className="px-3 py-2 border-r border-gray-200 last:border-r-0 font-bold">{key}</th>)}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-blue-50/50">
                        {columns.map((key) => (
                        <td key={key} className="px-3 py-2 border-r border-gray-100 last:border-r-0 text-gray-800 font-mono font-medium text-sm">{String(filteredData[key] ?? '-')}</td>
                        ))}
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
        );
    }

    return (
      <div className="mb-8 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        {showTitle && (
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center">
            <h3 className="font-bold text-gray-800 border-l-4 border-blue-600 pl-3 text-sm">{displayTitle}</h3>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <tbody className="divide-y divide-gray-100">
              {Object.entries(filteredData).map(([key, value]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500 font-medium bg-gray-50/50 border-r border-gray-100 w-1/3">{key}</td>
                  <td className="px-4 py-2 text-gray-800 font-mono">{typeof value === 'object' ? JSON.stringify(value) : String(value ?? '-')}</td>
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

// --- 4. メイン ---
type ActiveTab = 'overview' | 'career' | 'situational' | 'detailed' | 'defense' | 'farm';

interface PlayerDetailClientProps {
  playerData: CompletePlayerData;
  rawData: NF3AllStatsData;
}

export function PlayerDetailClient({ playerData, rawData }: PlayerDetailClientProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const availableYears = useMemo<number[]>(() => {
    const years = new Set<number>();
    const pushFromArray = (arr: any[] | undefined) => {
      if (Array.isArray(arr)) arr.forEach((row) => {
        const n = Number(String(row['年度'] || row['打率'+row['年度']] || '').replace(/[^\d]/g, '')); 
        if (!Number.isNaN(n) && n > 2000) years.add(n);
        years.add(2025); 
      });
    };
    pushFromArray(rawData.pitcherStats?.['通算成績']);
    if (rawData.batterStats) {
        Object.entries(rawData.batterStats).filter(([k]) => k !== 'basic_info').forEach(([, val]) => pushFromArray(val as any[]));
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [rawData]);

  const isPitcher = !!rawData.pitcherStats && Object.keys(rawData.pitcherStats).length > 0;
  const statsSource = isPitcher ? rawData.pitcherStats : rawData.batterStats;

  const basicStats = useMemo(() => {
    let info = statsSource?.basic_info;
    if (Array.isArray(info)) info = info[0];
    if (info && Object.keys(info).length > 0) return formatBasicStats([info], selectedYear, isPitcher); 

    const rows = statsSource?.['通算成績'];
    if (Array.isArray(rows)) {
        return formatBasicStats(rows, selectedYear, isPitcher);
    }
    return null;
  }, [rawData, selectedYear, isPitcher, statsSource]);

  const hasStarts = useMemo(() => {
      if (!isPitcher) return false;
      let info = statsSource?.basic_info;
      if (Array.isArray(info)) info = info[0];
      if (info && info['先発'] && Number(info['先発']) > 0) return true;

      const rows = rawData.pitcherStats?.['通算成績'];
      if (Array.isArray(rows)) {
         const merged = mergeSplitRows(rows);
         const found = merged.find((row: any) => String(row['年度']) === String(selectedYear));
         if (found && (Number(found['先発']) > 0)) return true;
      }
      return false;
  }, [rawData, isPitcher, selectedYear, statsSource]);

  const { profile } = playerData;
  
  const TAB_KEYS = {
      situational: [
          '左右別成績', '得点圏成績', '代打成績', 
          '月別成績', '球場別成績', 'Day_Nighter別成績', 'Home_Visitor別成績',
          '対チーム別成績(リーグ)', '対チーム別成績(交流戦)',
          '打順別成績(先発時)', '打席別成績(先発時)', 'カウント別成績', 'ランナ−別成績'
      ],
      detailed: [
          '打球方向(安打・本塁・凡打はそれぞれに対する割合)', '打撃内容一覧(フライはライナー・犠飛含む)', '対打者結果一覧(フライはライナー・犠飛含む)',
          '本塁打の種別一覧', 
          '球種一覧 (※参照データ：Sportsnavi・四球に故意四球はカウントせず)',
          '球種一覧 (※参照データ：Sportsnavi・与四球に故意四球はカウントせず)',
          '盗塁状況別マトリクス - 二塁盗塁 -', '盗塁状況別マトリクス - 三塁盗塁 -', '盗塁状況別マトリクス - 本塁盗塁 -',
          '連続打席フラグ', '連続試合フラグ', '先発時のイニング毎失点数(降板後の失点も加算)',
          '先発・救援別成績'
      ],
      defense: [
          '守備起用一覧', '先発時の守備位置別成績(偵察メンバーからの交代出場は除く)', '起用一覧'
      ]
  };

  const getTabItems = (tabKey: keyof typeof TAB_KEYS) => {
      return Object.entries(statsSource || {})
          .filter(([key]) => TAB_KEYS[tabKey].includes(key))
          .map(([key, value]) => <StatsSection key={key} title={key} data={value} />);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-12">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="mb-4">
          <Link href="/stats" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 text-xs font-bold"><BiArrowBack /> 選手一覧に戻る</Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 mb-6 flex flex-col md:flex-row gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold border-2 border-gray-200 shrink-0">Photo</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-end gap-3">
                {profile.name_kanji} <span className="text-sm text-gray-500 font-normal mb-1">{profile.name_kana}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-gray-700 mb-4">
                <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-sm text-xs">{profile.current_team}</span>
                <span className="font-mono">#{profile.current_number}</span><span className="text-gray-300">|</span>
                <span>{isPitcher ? '投手' : '野手'}</span><span className="text-gray-300">|</span>
                <span>{profile.throws}投{profile.bats}打</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-sm border border-gray-200">
                <div><span className="block text-gray-400 mb-0.5">生年月日</span><span className="font-medium">{profile.birth_date || '-'}</span></div>
                <div><span className="block text-gray-400 mb-0.5">体格</span><span className="font-medium">{profile.height}cm / {profile.weight}kg</span></div>
                <div><span className="block text-gray-400 mb-0.5">出身地</span><span className="font-medium">{profile.birthplace_prefecture || '-'}</span></div>
                <div><span className="block text-gray-400 mb-0.5">プロ入り</span><span className="font-medium">-</span></div>
              </div>
            </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-t-sm p-3 flex items-center gap-3">
            <label className="text-xs font-bold text-gray-600">表示年度:</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="text-sm bg-gray-50 border border-gray-300 rounded px-3 py-1">
                {availableYears.map(y => <option key={y} value={y}>{y}年</option>)}
            </select>
        </div>

        <div className="bg-white border border-gray-200 border-t-0 rounded-b-sm shadow-sm mb-8">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {[
              { id: 'overview', label: '今季概要' },
              { id: 'career', label: '通算成績' },
              { id: 'situational', label: '状況別' },
              { id: 'detailed', label: '詳細分析' },
              { id: 'defense', label: '守備・その他' },
              { id: 'farm', label: '二軍成績' },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 min-h-[300px]">
            {activeTab === 'overview' && (
               <div className="space-y-8">
                  {basicStats ? <StatsSection title={`${selectedYear}年 基本成績`} data={[basicStats]} showTitle={true} forceHorizontal={true} /> 
                              : <div className="text-center text-gray-400 text-sm py-4">データなし</div>}
                  
                  <StatsSection title="各種指標" data={statsSource?.['通算成績(各種指標)']} forceHorizontal={true} />
                  <StatsSection title="各種成績" data={statsSource?.['各種成績']} forceHorizontal={true} />
                  
                  {!isPitcher && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatsSection title="左右別成績" data={statsSource?.['左右別成績']} />
                        <StatsSection title="得点圏成績" data={statsSource?.['得点圏成績']} />
                    </div>
                  )}
                  {isPitcher && hasStarts && <StatsSection title="QS_HQS_SQS達成状況" data={statsSource?.['QS_HQS_SQS達成状況']} />}
               </div>
            )}

            {activeTab === 'career' && <div className="space-y-8"><StatsSection title="通算成績" data={statsSource?.['通算成績']} /></div>}

            {activeTab === 'situational' && <div className="space-y-8">{getTabItems('situational')}</div>}
            {activeTab === 'detailed' && <div className="space-y-8">{getTabItems('detailed')}</div>}
            {activeTab === 'defense' && (
                <div className="space-y-8">
                    {getTabItems('defense')}
                    {statsSource?.['登録履歴'] && <StatsSection title="登録履歴" data={statsSource['登録履歴']} />}
                </div>
            )}

            {activeTab === 'farm' && (
               <div className="text-center text-gray-500 text-sm py-10">
                 {statsSource?.farm_stats ? "二軍データあり (詳細表示は未実装)" : "二軍データはありません。"}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}