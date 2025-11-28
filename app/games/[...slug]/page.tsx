import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function GamePage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // slug例: ["2025", "game-20250423-c-s-03-npb-home"]
  if (!slug || slug.length < 2) {
    notFound();
  }

  const year = slug[0];
  const fileName = slug[1];

  // HTMLファイルのパスを構築
  const htmlPath = path.join(
    process.cwd(),
    'public',
    'games',
    year,
    `${fileName}.html`
  );

  // ファイルが存在するか確認
  if (!fs.existsSync(htmlPath)) {
    notFound();
  }

  // HTMLファイルを読み込み
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  // HTMLからbody内のコンテンツを抽出
  const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/i);
  const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/i);
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);

  const bodyContent = bodyMatch ? bodyMatch[1] : '';
  const styleContent = styleMatch ? styleMatch[1] : '';
  const pageTitle = titleMatch ? titleMatch[1] : '試合詳細';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <style dangerouslySetInnerHTML={{ __html: styleContent }} />

      {/* ゲームページのコンテンツを埋め込み */}
      <div
        className="game-content"
        dangerouslySetInnerHTML={{ __html: bodyContent }}
      />
    </div>
  );
}

// 静的パスを生成（オプション - ビルド時に全ページを生成）
export async function generateStaticParams() {
  const gamesDir = path.join(process.cwd(), 'public', 'games', '2025');

  // ディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(gamesDir)) {
    return [];
  }

  const files = fs.readdirSync(gamesDir);
  const htmlFiles = files.filter(file => file.endsWith('.html'));

  return htmlFiles.map(file => ({
    slug: ['2025', file.replace('.html', '')]
  }));
}
