// lib/types.ts
// ✅ とりあえずビルド通したいなら
import {
  PitchingSeasonStats,
  BattingSeasonStats,
  StarScore,
} from '@/lib/types';
// lib/types.ts
export type { CompletePlayerData } from './types/player';


export type StandingItem = {
  id: string;          // 追加
  rank: number;
  name: string;
  gamesBack: string;
  pct: string;
  color: string;
  // ほかのフィールド…
};


export type GameStatus = 'scheduled' | 'live' | 'final';

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

// StandingItem は既存のままでOK
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

// ★ 追加：セパをまとめた型
export type StandingsByLeague = {
  central: StandingItem[];  // セ・リーグ
  pacific: StandingItem[];  // パ・リーグ
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

// ===============================
// Player / Stats for nf3 mapper
// ===============================

export type PlayerProfile = {
  /** 一意な選手ID（nf3のplayerIdなど） */
  playerId: string;
  /** 表示名（例: "牧 秀悟"） */
  name: string;
  /** カナなど任意の補助情報 */
  nameKana?: string;

  /** 所属球団ID（チームページ絞り込み用） */
  teamId: string;
  teamName?: string;

  /** 背番号 */
  uniformNumber?: number;

  /** ポジション（例: "投手", "捕手", "内野手", "外野手"） */
  position: string;

  /** 投/打 */
  throws?: '右' | '左' | '両' | string;
  bats?: '右' | '左' | '両' | string;

  /** プロフィール系 */
  height?: number;
  weight?: number;
  birthDate?: string; // "YYYY-MM-DD"
  birthPlace?: string;

  /** ドラフト・プロ入りなど */
  draftYear?: number;
  draftRound?: number;
  proYear?: number;
};

/**
 * 選手のキャリア情報（ざっくりでOK、必要に応じて拡張）
 */
export type PlayerCareer = {
  firstYear?: number;
  latestYear?: number;
  totalYears?: number;
  /** 所属球団の遍歴など */
  teams?: {
    teamId: string;
    teamName?: string;
    fromYear?: number;
    toYear?: number;
  }[];
  notes?: string;
};

/**
 * 年度別の投手成績
 * ※ nf3 から取れる範囲で mapper 側で埋める想定
 */
export type PitchingSeasonStats = {
  year: number;
  teamId: string;

  games: number;           // 登板
  gamesStarted?: number;   // 先発
  wins: number;
  losses: number;
  saves?: number;
  holds?: number;

  innings: number;         // 投球回（ex: 12.2 回 → 12.2 として扱う）
  battersFaced?: number;

  hits: number;
  homeRuns: number;
  strikeouts: number;
  walks: number;
  hitByPitch?: number;

  runs: number;
  earnedRuns: number;

  era: number;             // 防御率
  whip?: number;
  fip?: number;
};

/**
 * 年度別の打撃成績
 */
export type BattingSeasonStats = {
  year: number;
  teamId: string;

  games: number;
  plateAppearances: number;
  atBats: number;

  runs: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  runsBattedIn: number;

  steals: number;
  caughtStealing: number;

  walks: number;
  strikeouts: number;
  hitByPitch: number;
  sacrificeHits: number;   // 犠打
  sacrificeFlies: number;  // 犠飛
  gidp: number;            // 併殺打

  avg: number;             // 打率
  obp: number;             // 出塁率
  slg: number;             // 長打率
  ops: number;             // OPS

  iso?: number;            // ISO (長打率 - 打率)
  babip?: number;
  wrcPlus?: number;
};

/**
 * 年度別の守備成績
 */
export type FieldingSeasonStats = {
  year: number;
  teamId: string;
  position: string; // "一塁", "二塁", "遊撃", "左翼" 等

  games: number;
  innings?: number;

  putouts?: number;   // 刺
  assists?: number;   // 補
  errors?: number;    // 失
  doublePlays?: number;

  fieldingPct?: number;
  rangeFactor?: number;
  uzr?: number;
  drs?: number;
};

/**
 * CompletePlayerData は lib/types/player.ts から再エクスポートされます
 * 詳細な型定義は lib/types/player.ts を参照してください
 */

