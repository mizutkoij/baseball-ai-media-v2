// lib/mockData.ts
import { Game, StandingItem, Article, StatLeader } from './types';

// チーム定義
export const TEAMS: Record<string, any> = {
  T: { id: 'T', name: '阪神', fullName: '阪神タイガース', color: '#FFE100' },
  G: { id: 'G', name: '巨人', fullName: '読売ジャイアンツ', color: '#F97600' },
  DB: { id: 'DB', name: 'DeNA', fullName: '横浜DeNAベイスターズ', color: '#0055A5' },
  C: { id: 'C', name: '広島', fullName: '広島東洋カープ', color: '#FF0000' },
  S: { id: 'S', name: 'ヤクルト', fullName: '東京ヤクルトスワローズ', color: '#96C800' },
  D: { id: 'D', name: '中日', fullName: '中日ドラゴンズ', color: '#002569' },
};

// 今日の試合（ダミー）
export const TODAYS_GAMES: Game[] = [
  {
    id: '1',
    date: '2025-06-15',
    status: 'final',
    homeTeam: TEAMS.T,
    visitorTeam: TEAMS.G,
    homeScore: 4,
    visitorScore: 2,
    startTime: '14:00',
    stadium: '甲子園',
  },
  {
    id: '2',
    date: '2025-06-15',
    status: 'live',
    homeTeam: TEAMS.DB,
    visitorTeam: TEAMS.C,
    homeScore: 1,
    visitorScore: 3,
    inning: '6回表',
    startTime: '14:00',
    stadium: '横浜',
  },
  {
    id: '3',
    date: '2025-06-15',
    status: 'scheduled',
    homeTeam: TEAMS.S,
    visitorTeam: TEAMS.D,
    homeScore: 0,
    visitorScore: 0,
    startTime: '18:00',
    stadium: '神宮',
  },
];

// 順位表（セ・リーグ）
export const STANDINGS_CENTRAL: StandingItem[] = [
  { rank: 1, team: TEAMS.T, played: 60, win: 35, loss: 22, draw: 3, gamesBack: '-', pct: '.614' },
  { rank: 2, team: TEAMS.G, played: 60, win: 32, loss: 25, draw: 3, gamesBack: '3.0', pct: '.561' },
  { rank: 3, team: TEAMS.DB, played: 59, win: 30, loss: 27, draw: 2, gamesBack: '2.0', pct: '.526' },
  { rank: 4, team: TEAMS.C, played: 61, win: 28, loss: 30, draw: 3, gamesBack: '2.0', pct: '.483' },
  { rank: 5, team: TEAMS.S, played: 60, win: 25, loss: 33, draw: 2, gamesBack: '3.0', pct: '.431' },
  { rank: 6, team: TEAMS.D, played: 60, win: 22, loss: 36, draw: 2, gamesBack: '3.0', pct: '.379' },
];

// 個人成績リーダーズ
export const LEADERS = {
  batting: [
    { rank: 1, player: '近本 光司', team: 'T', value: '.315' },
    { rank: 2, player: '牧 秀悟', team: 'DB', value: '.308' },
    { rank: 3, player: '岡本 和真', team: 'G', value: '.301' },
  ],
  homerun: [
    { rank: 1, player: '村上 宗隆', team: 'S', value: '18' },
    { rank: 2, player: '佐藤 輝明', team: 'T', value: '16' },
    { rank: 3, player: '岡本 和真', team: 'G', value: '15' },
  ],
};

// ニュース記事
export const ARTICLES: Article[] = [
  {
    id: '1',
    title: '【分析】佐藤輝明の打撃改造は成功したのか？ データで見る「打球角度」の変化',
    summary: 'フライボール革命への適応か、それとも原点回帰か。最新のトラッキングデータから、好調の要因をセイバーメトリクスで紐解く。',
    category: 'コラム',
    publishedAt: '2025/06/15 10:00',
  },
  {
    id: '2',
    title: 'セ・リーグ前半戦総括：投高打低トレンドに変化の兆し',
    summary: '防御率ランキングの上位を独占していた投手陣に対し、各球団のアプローチが変化しつつある。',
    category: '戦評',
    publishedAt: '2025/06/14 21:00',
  },
];
