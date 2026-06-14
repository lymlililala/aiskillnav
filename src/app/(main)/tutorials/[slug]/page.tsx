import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTutorialBySlug, getRelatedTutorials } from '@/features/tutorials/api/service';
import { NOINDEX_TUTORIAL_SLUGS } from '@/features/tutorials/noindex-slugs';
import { EN_TUTORIAL_SLUGS } from '@/features/tutorials/en-slugs';
import { getMcpSlugSet } from '@/features/mcp/api/service';
import { matchPillarTopics } from '@/features/tutorials/topics';
import { extractFaq, buildFaqJsonLd } from '@/features/tutorials/faq';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import PageContainer from '@/components/layout/page-container';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTutorialBySlug(slug);
  if (!t) return { title: '教程不存在' };
  const url = `https://aiskillnav.com/tutorials/${slug}`;
  // 损坏的批量模板页：加 noindex（仍 follow，让内链权重流动），并随名单移除而恢复
  const noindex = NOINDEX_TUTORIAL_SLUGS.has(slug);
  // 有英文版的教程：声明中英 hreflang 互指
  const hasEn = EN_TUTORIAL_SLUGS.has(slug);
  return {
    title: `${t.title} | 教程中心`,
    description: t.summary,
    keywords: t.tags,
    alternates: {
      canonical: url,
      ...(hasEn
        ? {
            languages: {
              'zh-CN': url,
              en: `https://aiskillnav.com/en/tutorials/${slug}`,
              'x-default': url
            }
          }
        : {})
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'article',
      url,
      title: t.title,
      description: t.summary,
      siteName: 'AI Skill Navigation',
      locale: 'zh_CN',
      publishedTime: t.published_at,
      authors: ['AI Skill Navigation'],
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: t.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.summary,
      images: ['/og-image.png']
    }
  };
}

// 动态渲染 + ISR：按需渲染，首次访问后缓存 1 小时
// 移除 generateStaticParams 以避免 build 时预渲染 2000+ 篇文章导致构建超时
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 小时 ISR 缓存

const LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  beginner: { label: '入门', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
  intermediate: { label: '进阶', color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
  advanced: { label: '高级', color: 'text-violet-600 bg-violet-500/10 border-violet-500/20' }
};

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
      // 站内链接用普通 <a>（不 target=_blank），让 Googlebot 当内链跟随；外链新窗口打开
      const isInternal = /^\/(tutorials|news|mcp|agents|models|skills|usecases)(\/|\?|$)/.test(url);
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

export default async function TutorialDetailPage({ params }: Props) {
  const { slug } = await params;
  const tutorial = await getTutorialBySlug(slug);
  if (!tutorial) notFound();

  // 相关教程：tags 加权打分取 6 篇（DB 端过滤，不再拉全量）；并取 mcp 映射表把 related_tools 做成内链
  const [related, mcpSlugSet] = await Promise.all([
    getRelatedTutorials(
      { slug, category: tutorial.category, tags: tutorial.tags, title: tutorial.title },
      6
    ),
    getMcpSlugSet()
  ]);

  const level = LEVEL_CONFIG[tutorial.level];
  // 该教程命中的主题集群（pillar），用于"所属主题"回流链
  const topics = matchPillarTopics(tutorial.tags, tutorial.title);
  const html = renderMarkdown(tutorial.content);

  // FAQ 结构化数据：正文带 "## FAQ" 段（重写批次的统一格式）时输出 FAQPage，
  // 利于 AI 搜索（GEO）与问答抽取；解析不到（<2 对）则不输出。
  const faqPairs = extractFaq(tutorial.content);
  const faqJsonLd = faqPairs.length ? buildFaqJsonLd(faqPairs) : null;

  // Article 结构化数据
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: tutorial.title,
    description: tutorial.summary,
    keywords: tutorial.tags.join(', '),
    author: {
      '@type': 'Organization',
      name: 'AI Skill Navigation',
      url: 'https://aiskillnav.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Skill Navigation',
      url: 'https://aiskillnav.com'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://aiskillnav.com/tutorials/${slug}`
    }
  };

  // BreadcrumbList 结构化数据
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: 'https://aiskillnav.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: '教程中心',
        item: 'https://aiskillnav.com/tutorials'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tutorial.title,
        item: `https://aiskillnav.com/tutorials/${slug}`
      }
    ]
  };

  return (
    <PageContainer pageTitle={tutorial.title} pageDescription={tutorial.subtitle}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className='mx-auto max-w-3xl space-y-8'>
        <Link
          href='/tutorials'
          className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <Icons.chevronLeft className='h-4 w-4' />
          返回教程列表
        </Link>

        <header className='space-y-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='outline' className={`text-xs ${level.color}`}>
              {level.label}
            </Badge>
            <span className='flex items-center gap-1 text-xs text-muted-foreground'>
              <Icons.clock className='h-3.5 w-3.5' />约 {tutorial.estimated_minutes} 分钟
            </span>
          </div>
          <h1 className='text-2xl font-bold leading-tight md:text-3xl'>{tutorial.title}</h1>
          <p className='text-base text-muted-foreground'>{tutorial.subtitle}</p>
          <p className='text-sm leading-relaxed text-muted-foreground'>{tutorial.summary}</p>
          <div className='flex flex-wrap gap-1.5'>
            {tutorial.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tutorials?tut_cat=${encodeURIComponent(tutorial.category)}`}
                className='rounded-md bg-muted/50 border px-2 py-0.5 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors'
              >
                {tag}
              </Link>
            ))}
          </div>
          <div className='border-b' />
        </header>

        <div className='prose-sm max-w-none text-sm' dangerouslySetInnerHTML={{ __html: html }} />

        {tutorial.related_tools.length > 0 && (
          <div className='rounded-xl border bg-muted/30 p-5'>
            <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              相关工具
            </p>
            <div className='flex flex-wrap gap-2'>
              {tutorial.related_tools.map((tool) => {
                const mcp = mcpSlugSet.get(tool.toLowerCase());
                return mcp ? (
                  <Link
                    key={tool}
                    href={`/mcp/${mcp}`}
                    className='rounded-lg border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary/30 hover:text-primary transition-colors'
                  >
                    {tool}
                  </Link>
                ) : (
                  <span
                    key={tool}
                    className='rounded-lg border bg-card px-3 py-1.5 text-xs font-medium'
                  >
                    {tool}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* 所属主题（pillar 回流链） */}
        {topics.length > 0 && (
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-xs font-medium text-muted-foreground'>所属主题：</span>
            {topics.map((tp) => (
              <Link
                key={tp.slug}
                href={`/tutorials/topic/${tp.slug}`}
                className='rounded-full border px-3 py-1 text-xs font-medium hover:border-primary/30 hover:text-primary transition-colors'
              >
                {tp.title}
              </Link>
            ))}
          </div>
        )}

        {/* 相关教程推荐 — 增强内链网络，提升 Google 抓取深度 */}
        {related.length > 0 && (
          <div className='rounded-xl border bg-muted/30 p-5 space-y-3'>
            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
              相关教程
            </p>
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/tutorials/${t.slug}`}
                className='flex items-start gap-3 rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors group'
              >
                <div className='flex-1 min-w-0'>
                  <span className='font-medium line-clamp-1 group-hover:text-primary transition-colors'>
                    {t.title}
                  </span>
                  <p className='text-xs text-muted-foreground mt-0.5 line-clamp-1'>{t.subtitle}</p>
                </div>
                <Icons.chevronRight className='h-4 w-4 shrink-0 text-muted-foreground mt-0.5' />
              </Link>
            ))}
          </div>
        )}

        <div className='rounded-xl border bg-muted/30 p-5 space-y-2'>
          <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
            继续探索
          </p>
          <Link
            href='/tutorials'
            className='flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors'
          >
            <span className='font-medium'>查看更多教程</span>
            <Icons.chevronRight className='h-4 w-4 text-muted-foreground' />
          </Link>
          <Link
            href='/mcp'
            className='flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors'
          >
            <span className='font-medium'>浏览 MCP 专区</span>
            <Icons.chevronRight className='h-4 w-4 text-muted-foreground' />
          </Link>
          <Link
            href='/agents'
            className='flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors'
          >
            <span className='font-medium'>浏览 Agent Hub</span>
            <Icons.externalLink className='h-4 w-4 text-muted-foreground' />
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
