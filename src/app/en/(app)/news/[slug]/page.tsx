import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getNewsBySlug, type EnglishNews } from '@/features/news/api/service';
import { INDEX_NEWS_SLUGS } from '@/features/news/index-allowlist';
import { enNewsCategory } from '@/features/news/category-i18n';

type Props = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';
export const revalidate = 3600;
const SITE = 'https://aiskillnav.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = (await getNewsBySlug(slug)) as EnglishNews | null;
  if (!n || !n.summary_en || n.en_status !== 'published') return { title: 'Not found' };
  // Thin summary pages default to noindex (still follow); only allowlisted slugs are indexed
  const noindex = !INDEX_NEWS_SLUGS.has(slug);
  const enUrl = `${SITE}/en/news/${slug}`;
  const zhUrl = `${SITE}/news/${slug}`;
  return {
    title: `${n.title_en}`,
    description: (n.summary_en || '').replace(/[#*`>\-]/g, '').slice(0, 160),
    keywords: n.tags,
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    alternates: { canonical: enUrl, languages: { 'zh-CN': zhUrl, en: enUrl, 'x-default': zhUrl } },
    openGraph: {
      title: n.title_en ?? undefined,
      url: enUrl,
      type: 'article',
      locale: 'en_US',
      publishedTime: n.published_at
    }
  };
}

export default async function EnNewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const n = (await getNewsBySlug(slug)) as EnglishNews | null;
  if (!n || !n.summary_en || n.en_status !== 'published') notFound();

  const enUrl = `${SITE}/en/news/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: n.title_en,
    inLanguage: 'en',
    url: enUrl,
    datePublished: n.published_at,
    // Author is the site entity, not the original source; visible source attribution stays unchanged
    author: { '@type': 'Organization', name: 'AI Skill Navigation', url: SITE },
    publisher: { '@type': 'Organization', name: 'AI Skill Navigation' }
  };

  return (
    <article className='mx-auto max-w-3xl px-4 py-12 md:px-6'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href='/en/news'
        className='mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground'
      >
        ← Back to news
      </Link>
      <div className='flex items-center gap-2 text-xs text-muted-foreground'>
        <span className='rounded-md border bg-muted/50 px-2 py-0.5'>
          {enNewsCategory(n.category)}
        </span>
        <span>
          {new Date(n.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>
      <h1 className='mt-3 text-3xl font-bold leading-tight tracking-tight'>{n.title_en}</h1>
      <div className='prose prose-sm dark:prose-invert mt-8 max-w-none [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:my-2 [&_li]:my-1 [&_strong]:text-foreground'>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{n.summary_en}</ReactMarkdown>
      </div>
      <div className='mt-12 rounded-xl border bg-muted/30 p-5'>
        <p className='text-sm text-muted-foreground'>
          Also available in{' '}
          <Link href={`/news/${slug}`} className='text-primary hover:underline'>
            中文
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
