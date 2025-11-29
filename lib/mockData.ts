// lib/mockData.ts
import { Game, StandingsByLeague, Article, Team, LeadersByLeague } from './types';

// チームカラー定義
export const TEAM_COLORS: Record<string, string> = {
  T: '#FFE100', G: '#F97600', DB: '#0055A5', C: '#FF0000', S: '#96C800', D: '#002569',
  H: '#FCC800', F: '#006298', M: '#000000', E: '#860010', L: '#1F366A', Bs: '#00081D',
};

// チーム定義 (Team型に準拠して統一)
export const TEAMS: Record<string, Team> = {
  // セ・リーグ
  T: { id: 'T', name: '阪神タイガース', shortName: '阪神', color: TEAM_COLORS.T },
  G: { id: 'G', name: '読売ジャイアンツ', shortName: '巨人', color: TEAM_COLORS.G },
  DB: { id: 'DB', name: '横浜DeNAベイスターズ', shortName: 'DeNA', color: TEAM_COLORS.DB },
  C: { id: 'C', name: '広島東洋カープ', shortName: '広島', color: TEAM_COLORS.C },
  S: { id: 'S', name: '東京ヤクルトスワローズ', shortName: 'ヤクルト', color: TEAM_COLORS.S },
  D: { id: 'D', name: '中日ドラゴンズ', shortName: '中日', color: TEAM_COLORS.D },
  // パ・リーグ
  H: { id: 'H', name: '福岡ソフトバンクホークス', shortName: 'ソフトバンク', color: TEAM_COLORS.H },
  F: { id: 'F', name: '北海道日本ハムファイターズ', shortName: '日本ハム', color: TEAM_COLORS.F },
  M: { id: 'M', name: '千葉ロッテマリーンズ', shortName: 'ロッテ', color: TEAM_COLORS.M },
  E: { id: 'E', name: '東北楽天ゴールデンイーグルス', shortName: '楽天', color: TEAM_COLORS.E },
  L: { id: 'L', name: '埼玉西武ライオンズ', shortName: '西武', color: TEAM_COLORS.L },
  Bs: { id: 'Bs', name: 'オリックス・バファローズ', shortName: 'オリックス', color: TEAM_COLORS.Bs },
};

// 今日の試合
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

// 順位表データ
export const STANDINGS: StandingsByLeague = {
  central: [
    { league: 'セ・リーグ', rank: 1, teamShort: '阪神', teamName: '阪神タイガース', wins: 35, losses: 22, draws: 3, winPct: 0.614, gb: '-', recent: '3勝2敗', streak: '勝2', runDiff: 15, runsScored: 200, runsAllowed: 185 },
    { league: 'セ・リーグ', rank: 2, teamShort: '巨人', teamName: '読売ジャイアンツ', wins: 32, losses: 25, draws: 3, winPct: 0.561, gb: '3.0', recent: '2勝3敗', streak: '負1', runDiff: 5, runsScored: 190, runsAllowed: 185 },
    { league: 'セ・リーグ', rank: 3, teamShort: 'DeNA', teamName: '横浜DeNAベイスターズ', wins: 30, losses: 27, draws: 2, winPct: 0.526, gb: '2.0', recent: '4勝1敗', streak: '勝3', runDiff: 8, runsScored: 195, runsAllowed: 187 },
    { league: 'セ・リーグ', rank: 4, teamShort: '広島', teamName: '広島東洋カープ', wins: 28, losses: 30, draws: 3, winPct: 0.483, gb: '2.5', recent: '1勝4敗', streak: '負2', runDiff: -10, runsScored: 170, runsAllowed: 180 },
    { league: 'セ・リーグ', rank: 5, teamShort: 'ヤクルト', teamName: '東京ヤクルトスワローズ', wins: 25, losses: 33, draws: 2, winPct: 0.431, gb: '3.0', recent: '3勝2敗', streak: '勝1', runDiff: -15, runsScored: 180, runsAllowed: 195 },
    { league: 'セ・リーグ', rank: 6, teamShort: '中日', teamName: '中日ドラゴンズ', wins: 22, losses: 36, draws: 2, winPct: 0.379, gb: '3.0', recent: '2勝3敗', streak: '負1', runDiff: -20, runsScored: 150, runsAllowed: 170 },
  ],
  pacific: [
    { league: 'パ・リーグ', rank: 1, teamShort: 'ソフトバンク', teamName: '福岡ソフトバンクホークス', wins: 38, losses: 20, draws: 2, winPct: 0.655, gb: '-', recent: '5勝0敗', streak: '勝5', runDiff: 40, runsScored: 220, runsAllowed: 180 },
    { league: 'パ・リーグ', rank: 2, teamShort: '日本ハム', teamName: '北海道日本ハムファイターズ', wins: 32, losses: 26, draws: 2, winPct: 0.552, gb: '5.0', recent: '3勝2敗', streak: '勝1', runDiff: 10, runsScored: 190, runsAllowed: 180 },
    { league: 'パ・リーグ', rank: 3, teamShort: 'ロッテ', teamName: '千葉ロッテマリーンズ', wins: 30, losses: 28, draws: 2, winPct: 0.517, gb: '2.0', recent: '2勝3敗', streak: '負1', runDiff: 0, runsScored: 185, runsAllowed: 185 },
    { league: 'パ・リーグ', rank: 4, teamShort: '楽天', teamName: '東北楽天ゴールデンイーグルス', wins: 28, losses: 31, draws: 1, winPct: 0.475, gb: '2.5', recent: '2勝3敗', streak: '負2', runDiff: -5, runsScored: 175, runsAllowed: 180 },
    { league: 'パ・リーグ', rank: 5, teamShort: 'オリックス', teamName: 'オリックス・バファローズ', wins: 26, losses: 32, draws: 2, winPct: 0.448, gb: '1.5', recent: '1勝4敗', streak: '負3', runDiff: -15, runsScored: 160, runsAllowed: 175 },
    { league: 'パ・リーグ', rank: 6, teamShort: '西武', teamName: '埼玉西武ライオンズ', wins: 20, losses: 38, draws: 2, winPct: 0.345, gb: '6.0', recent: '1勝4敗', streak: '負1', runDiff: -30, runsScored: 155, runsAllowed: 185 },
  ]
};

// 個人成績リーダーズ
export const LEADERS: LeadersByLeague = {
  central: {
    batting: [
      { rank: 1, player: '近本 光司', team: '阪神', value: '.315' },
      { rank: 2, player: '牧 秀悟', team: 'DeNA', value: '.308' },
      { rank: 3, player: '岡本 和真', team: '巨人', value: '.301' },
    ],
  },
  pacific: {
    batting: [
      { rank: 1, player: '近藤 健介', team: 'ソフトバンク', value: '.342' },
      { rank: 2, player: '柳田 悠岐', team: 'ソフトバンク', value: '.318' },
      { rank: 3, player: '万波 中正', team: '日本ハム', value: '.295' },
    ],
  }
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