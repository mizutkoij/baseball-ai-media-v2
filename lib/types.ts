// lib/types.ts

export type Team = {
  id: string;
  name: string;      // 例: 阪神
  fullName: string;  // 例: 阪神タイガース
  color: string;     // チームカラー
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

export type StandingItem = {
  rank: number;
  team: Team;
  played: number; // 試合数
  win: number;
  loss: number;
  draw: number;
  gamesBack: string; // ゲーム差 ("-" or "1.5")
  pct: string;       // 勝率 (".580")
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
