import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTutorialBySlug, type EnglishTutorial } from '@/features/tutorials/api/service';

type Props = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const SITE = 'https://aiskillnav.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = (await getTutorialBySlug(slug)) as EnglishTutorial | null;
  if (!t || !t.content_en || t.en_status !== 'published') return { title: 'Not found' };

  const enUrl = `${SITE}/en/tutorials/${slug}`;
  const zhUrl = `${SITE}/tutorials/${slug}`;
  return {
    title: `${t.title_en}`,
    description: t.summary_en ?? undefined,
    keywords: t.tags,
    alternates: {
      canonical: enUrl,
      languages: { 'zh-CN': zhUrl, en: enUrl, 'x-default': zhUrl }
    },
    openGraph: {
      title: t.title_en ?? undefined,
      description: t.summary_en ?? undefined,
      url: enUrl,
      type: 'article',
      locale: 'en_US',
      publishedTime: t.published_at ?? undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title_en ?? undefined,
      description: t.summary_en ?? undefined
    }
  };
}

// Markdown → HTML（与中文详情页同方言；内链支持 /en/ 前缀）
function renderMarkdown(md: string): string {
  if (!md) return '';
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-8 mb-4">$1</h1>')
    .replace(
      /^> (.+)$/gm,
      '<blockquote class="border-l-2 pl-4 text-muted-foreground italic my-4">$1</blockquote>'
    )
    .replace(
      /```([\s\S]*?)```/gm,
      '<pre class="rounded-lg bg-muted px-4 py-3 text-sm font-mono overflow-x-auto my-4"><code>$1</code></pre>'
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-sm font-mono">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, (_m, text: string, url: string) => {
      const isInternal =
        /^\/(en\/)?(tutorials|news|mcp|agents|models|skills|usecases)(\/|\?|$)/.test(url);
      return isInternal
        ? `<a href="${url}" class="text-primary underline underline-offset-4 hover:no-underline">${text}</a>`
        : `<a href="${url}" class="text-primary underline underline-offset-4 hover:no-underline" target="_blank" rel="noopener">${text}</a>`;
    })
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc my-0.5">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal my-0.5">$1</li>')
    .replace(/^\|(.+)\|$/gm, (match) => {
      if (match.includes('---')) return '';
      const cells = match
        .split('|')
        .filter(Boolean)
        .map((c) => c.trim());
      return `<tr>${cells.map((c) => `<td class="border px-3 py-1.5 text-sm">${c}</td>`).join('')}</tr>`;
    })
    .replace(/^---$/gm, '<hr class="my-6 border-border" />')
    .replace(/\n{2,}/g, '</p><p class="leading-relaxed text-foreground/90 my-3">')
    .replace(/^/, '<p class="leading-relaxed text-foreground/90 my-3">')
    .replace(/$/, '</p>');
}

export default async function EnTutorialDetailPage({ params }: Props) {
  const { slug } = await params;
  // 仅 en_status=published 且有英文正文的教程提供英文页；否则 404，杜绝英文URL+中文正文
  const t = (await getTutorialBySlug(slug)) as EnglishTutorial | null;
  if (!t || !t.content_en || t.en_status !== 'published') notFound();

  const enUrl = `${SITE}/en/tutorials/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: t.title_en,
    description: t.summary_en,
    inLanguage: 'en',
    url: enUrl,
    datePublished: t.published_at,
    author: { '@type': 'Organization', name: 'AI Skill Navigation' },
    publisher: { '@type': 'Organization', name: 'AI Skill Navigation' }
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/en` },
      { '@type': 'ListItem', position: 2, name: 'Tutorials', item: `${SITE}/en/tutorials` },
      { '@type': 'ListItem', position: 3, name: t.title_en, item: enUrl }
    ]
  };

  return (
    <article className='mx-auto max-w-3xl px-4 py-12 md:px-6'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Link
        href='/en/tutorials'
        className='mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground'
      >
        ← Back to tutorials
      </Link>

      <h1 className='text-3xl font-bold leading-tight tracking-tight'>{t.title_en}</h1>
      {t.subtitle_en && <p className='mt-3 text-lg text-muted-foreground'>{t.subtitle_en}</p>}

      <div
        className='mt-8 text-[15px]'
        dangerouslySetInnerHTML={{ __html: renderMarkdown(t.content_en) }}
      />

      <div className='mt-12 rounded-xl border bg-muted/30 p-5'>
        <p className='text-sm text-muted-foreground'>
          Also available in{' '}
          <Link href={`/tutorials/${slug}`} className='text-primary hover:underline'>
            中文
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
