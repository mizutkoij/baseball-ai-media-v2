import type {
  Game,
  Highlight,
  NewsArticle,
  StandingItem,
  StandingsByLeague,   // ★ 追加
  StatLeader,
  LeaderBoardCategory,
} from './types';

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

// 順位表（
// 既存の STANDINGS をこういう形に一つだけまとめる

export const STANDINGS = {
  // セリーグ（左用）
  central: [
    // ここにセの6球団
    // { rank: 1, team: TEAMS.T, ... },
    // { rank: 2, team: TEAMS.G, ... },
  ],

  // パリーグ（右用）
  pacific: [
    // { rank: 1, team: TEAMS.H, ... },
    // { rank: 2, team: TEAMS.L, ... },
  ],
};


// 個人成績リーダーズ
export const LEADERS = {
  central: {
    batting: [
      { rank: 1, player: '近本 光司', team: 'T', value: '.315' },
      { rank: 2, player: '牧 秀悟', team: 'DB', value: '.308' },
      { rank: 3, player: '岡本 和真', team: 'G', value: '.301' },
    ],
    // 必要なら homerun もここに
    homerun: [
      { rank: 1, player: '村上 宗隆', team: 'S', value: '18' },
      { rank: 2, player: '佐藤 輝明', team: 'T', value: '16' },
      { rank: 3, player: '岡本 和真', team: 'G', value: '15' },
    ],
  },
  pacific: {
    batting: [
      // ダミーデータでOK
      // { rank: 1, player: '〜', team: 'H', value: '.320' },
    ],
    homerun: [
      // ここもあとで埋める
    ],
  },
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
