// lib/mockPlayerData.ts
import type { CompletePlayerData } from './types';

// ============================================
// NF3AllStatsData のダミー型（簡易版）
// PlayerDetailClient.tsx のロジックを動かすため
// ============================================

export interface NF3AllStatsData {
  basic_info?: any;
  batterStats?: { [key: string]: any[] };
  pitcherStats?: { [key: string]: any[] };
  [key: string]: any;
}


// ============================================
// MOCK_PLAYER_DATA (CompletePlayerData 型のダミー)
// ============================================

export const MOCK_PLAYER_DATA: CompletePlayerData = {
  profile: {
    playerId: 'M_3_荻野貴司',
    name: '荻野 貴司',
    nameKana: 'オギノ タカシ',
    nameKanji: '荻野 貴司', // page.tsx で使用
    teamId: 'M',
    teamName: '千葉ロッテマリーンズ',
    currentTeam: 'ロッテ',
    uniformNumber: 0,
    currentNumber: '0',
    position: '外野手',
    throws: '右',
    bats: '右',
    height: 172,
    weight: 70,
    birthDate: '1985-10-21',
    birthplacePrefecture: '奈良県',
    draftYear: 2009,
    proYear: 2010,
  },
  career: {
    firstYear: 2010,
    latestYear: 2025,
    totalYears: 16,
    teams: [{ teamId: 'M', fromYear: 2010 }],
  },
  season_stats: {
    pitching: [],
    batting: [
      {
        year: 2025,
        teamId: 'M',
        games: 60,
        plateAppearances: 250,
        atBats: 220,
        runs: 35,
        hits: 60,
        doubles: 10,
        triples: 2,
        homeRuns: 3,
        runsBattedIn: 25,
        steals: 15,
        caughtStealing: 3,
        walks: 25,
        strikeouts: 50,
        hitByPitch: 2,
        sacrificeHits: 5,
        sacrificeFlies: 0,
        gidp: 5,
        avg: 0.273,
        obp: 0.355,
        slg: 0.400,
        ops: 0.755,
      },
    ],
    fielding: [],
  },
  advanced_stats: {
    war: { total: 1.5, batting: 1.0, pitching: 0.0, fielding: 0.5 },
    batting: {
      year: 2025,
      teamId: 'M',
      wrcPlus: 125,
      babip: 0.320,
      iso: 0.127,
    },
    pitching: null,
  },
  splits: {},
  original_metrics: {},
  farm_stats: {},
  recent_plate_appearances: [],
  links: [],
  meta: { version: '1.0.0', data_quality: { completeness: 0.9, reliability: 'high' } },
};

// ============================================
// MOCK_RAW_DATA (PlayerDetailClient.tsx の表表示ロジックを動かすためのダミー)
// ============================================

export const MOCK_RAW_DATA: NF3AllStatsData = {
  basic_info: {
    // PlayerDetailClient内で使用されていないため省略
  },
  batterStats: {
    // PlayerDetailClient のタブとテーブル表示をテストするためのダミーデータ
    '年度別成績': [
      { '年度': 2025, '打率': '.273', '本': 3, '点': 25, '盗': 15, 'OPS': '.755' },
      { '年度': 2024, '打率': '.280', '本': 5, '点': 30, '盗': 20, 'OPS': '.780' },
    ],
    '状況別打率': [
      { '走者': 'なし', '打率': '.300' },
      { '走者': 'あり', '打率': '.250' },
    ],
  },
  // 投手データは今回は野手の荻野選手なので省略
  pitcherStats: undefined
};