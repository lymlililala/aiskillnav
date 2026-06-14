import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageContainer from '@/components/layout/page-container';
import { getNewsBySlug, getRelatedNews } from '@/features/news/api/service';
import { getTutorialsByTags } from '@/features/tutorials/api/service';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: '资讯不存在' };
  return {
    title: item.title,
    description: item.summary,
    alternates: {
      canonical: `https://aiskillnav.com/news/${slug}`,
      ...((item as { en_status?: string }).en_status === 'published'
        ? {
            languages: {
              'zh-CN': `https://aiskillnav.com/news/${slug}`,
              en: `https://aiskillnav.com/en/news/${slug}`
            }
          }
        : {})
    },
    openGraph: {
      title: item.title,
      description: item.summary,
      type: 'article',
      publishedTime: item.published_at
    }
  };
}

// 动态渲染 + ISR：按需渲染，首次访问后缓存 1 小时
// 移除 generateStaticParams 以避免 build 时预渲染 1000+ 篇新闻导致构建超时
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 小时 ISR 缓存

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

const CATEGORY_COLOR: Record<string, string> = {
  Agent: 'text-violet-600 bg-violet-500/10 border-violet-500/20',
  框架: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
  模型: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
  工具: 'text-orange-600 bg-orange-500/10 border-orange-500/20',
  融资: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
  研究: 'text-pink-600 bg-pink-500/10 border-pink-500/20'
};

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  // 相关资讯（tags 加权取 6 篇）+ 跨类型"延伸阅读：相关教程"（按 tags 重叠匹配 tutorials）
  const [relatedNews, relatedTutorials] = await Promise.all([
    getRelatedNews({ slug, category: item.category, tags: item.tags, title: item.title }, 6),
    getTutorialsByTags(item.tags ?? [], 4)
  ]);

  // Article 结构化数据（完善版，含 author/publisher）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.summary,
    datePublished: item.published_at,
    keywords: item.tags.join(', '),
    author: {
      '@type': 'Organization',
      name: item.source_name
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Skill Navigation',
      url: 'https://aiskillnav.com'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://aiskillnav.com/news/${slug}`
    }
  };

  // BreadcrumbList 结构化数据
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: 'https://aiskillnav.com' },
      { '@type': 'ListItem', position: 2, name: 'AI News', item: 'https://aiskillnav.com/news' },
      {
        '@type': 'ListItem',
        position: 3,
        name: item.title,
        item: `https://aiskillnav.com/news/${slug}`
      }
    ]
  };

  const catColor = CATEGORY_COLOR[item.category] ?? CATEGORY_COLOR['Agent'];

  return (
    <PageContainer>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className='mx-auto max-w-3xl space-y-8'>
        <Link
          href='/news'
          className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <Icons.chevronLeft className='h-4 w-4' />
          返回资讯列表
        </Link>

        <header className='space-y-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='outline' className={`text-xs ${catColor}`}>
              {item.category}
            </Badge>
            {item.is_featured && (
              <Badge
                variant='outline'
                className='text-xs bg-amber-500/10 text-amber-600 border-amber-500/20'
              >
                <Icons.sparkles className='mr-1 h-3 w-3' />
                重点
              </Badge>
            )}
          </div>

          <h1 className='text-2xl font-bold leading-tight tracking-tight md:text-3xl'>
            {item.title}
          </h1>

          <div className='prose prose-sm dark:prose-invert max-w-none text-muted-foreground [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:text-base [&_h3]:font-medium [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-1 [&_strong]:text-foreground [&_table]:text-xs [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-1.5 [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-1.5 [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_hr]:border-border'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.summary}</ReactMarkdown>
          </div>

          <div className='flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
            <span className='flex items-center gap-1'>
              <Icons.clock className='h-3.5 w-3.5' />
              {formatDate(item.published_at)}
            </span>
            <span className='flex items-center gap-1'>
              <Icons.externalLink className='h-3.5 w-3.5' />
              来源：{item.source_name}
            </span>
          </div>

          <div className='flex flex-wrap gap-1.5'>
            {item.tags.map((tag) => (
              <Link
                key={tag}
                href={`/news?category=${encodeURIComponent(item.category)}`}
                className='rounded-md bg-muted/50 border px-2 py-0.5 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors'
              >
                {tag}
              </Link>
            ))}
          </div>
          <div className='border-b' />
        </header>

        {/* CTA — 站内延伸阅读（内链）或外部原文，二者皆无则不渲染 */}
        {item.source_url &&
          (item.source_url.startsWith('/') ? (
            <div className='rounded-xl border bg-muted/30 p-5 space-y-3'>
              <p className='text-sm font-medium'>延伸阅读</p>
              <p className='text-xs text-muted-foreground'>
                想深入了解该主题，查看站内相关教程与解析。
              </p>
              <Link
                href={item.source_url}
                className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors'
              >
                查看相关主题
                <Icons.chevronRight className='h-3.5 w-3.5' />
              </Link>
            </div>
          ) : (
            <div className='rounded-xl border bg-muted/30 p-5 space-y-3'>
              <p className='text-sm font-medium'>阅读原文</p>
              <p className='text-xs text-muted-foreground'>
                本条资讯来源于 <strong>{item.source_name}</strong>，点击查看完整报道。
              </p>
              <Link
                href={item.source_url}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors'
              >
                前往 {item.source_name}
                <Icons.externalLink className='h-3.5 w-3.5' />
              </Link>
            </div>
          ))}

        {/* Related News — 增强内链网络，提升 Google 抓取深度 */}
        {relatedNews.length > 0 && (
          <div className='rounded-xl border bg-muted/30 p-5 space-y-3'>
            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
              相关资讯
            </p>
            {relatedNews.map((n) => (
              <Link
                key={n.slug}
                href={`/news/${n.slug}`}
                className='flex items-start gap-3 rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors group'
              >
                <div className='flex-1 min-w-0'>
                  <span className='font-medium line-clamp-1 group-hover:text-primary transition-colors'>
                    {n.title}
                  </span>
                  <p className='text-xs text-muted-foreground mt-0.5 line-clamp-1'>
                    {new Date(n.published_at).toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric'
                    })}{' '}
                    · {n.source_name}
                  </p>
                </div>
                <Icons.chevronRight className='h-4 w-4 shrink-0 text-muted-foreground mt-0.5' />
              </Link>
            ))}
          </div>
        )}

        {/* 延伸阅读：相关教程（news → tutorials 跨类型内链） */}
        {relatedTutorials.length > 0 && (
          <div className='rounded-xl border bg-muted/30 p-5 space-y-3'>
            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
              延伸阅读 · 相关教程
            </p>
            {relatedTutorials.map((t) => (
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

        {/* Related Resources */}
        <div className='rounded-xl border bg-muted/30 p-5 space-y-2'>
          <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
            相关资源
          </p>
          <Link
            href='/agents'
            className='flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors'
          >
            <span className='font-medium'>浏览 Agent Hub</span>
            <Icons.externalLink className='h-4 w-4 text-muted-foreground' />
          </Link>
          <Link
            href='/mcp'
            className='flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors'
          >
            <span className='font-medium'>探索 MCP 专区</span>
            <Icons.chevronRight className='h-4 w-4 text-muted-foreground' />
          </Link>
          <Link
            href='/news'
            className='flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors'
          >
            <span className='font-medium'>查看更多资讯</span>
            <Icons.chevronRight className='h-4 w-4 text-muted-foreground' />
          </Link>
        </div>
      </article>
    </PageContainer>
  );
}
