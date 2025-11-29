// lib/types.ts

// 1. lib/types/player.ts で定義した全ての型をここから使えるようにする
export * from './types/player';

// ============================================
// General Types (試合、チーム、ニュースなど)
// ============================================

export type GameStatus = 'scheduled' | 'live' | 'final';

export type Team = {
  id: string;
  name: string;
  shortName: string;
  // color: string; // 必要であれば追加
};

export type Game = {
  id: string;
  date: string;
  status: GameStatus;
  homeTeam: Team;
  visitorTeam: Team;
  homeScore: number;
  visitorScore: number;
  inning?: string;   // 例: "7回裏"
  startTime: string; // 例: "18:00"
  stadium: string;
};

export type StandingItem = {
  league: 'セ・リーグ' | 'パ・リーグ';
  rank: number;
  teamShort: string;
  teamName: string;
  wins: number;
  losses: number;
  draws: number;
  winPct: number;
  gb: string;
  recent: string;
  streak: string;
  runDiff: number;
  runsScored: number;
  runsAllowed: number;
};

export type StandingsByLeague = {
  central: StandingItem[];
  pacific: StandingItem[];
};

export type Article = {
  id: string;
  title: string;
  summary: string;
  category: string; // "コラム" | "ニュース" | "戦評"
  imageUrl?: string;
  publishedAt: string;
};

export type StatLeader = {
  rank: number;
  player: string;
  team: string; // チーム略称
  value: string;
};

// ホーム画面のリーダーズ表示用（mockDataで使用）
export type LeadersByLeague = {
  central: { batting: StatLeader[] };
  pacific: { batting: StatLeader[] };
};