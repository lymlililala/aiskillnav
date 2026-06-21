import type { Metadata } from 'next';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { getPublishedEnglishNews, getTimelineEn } from '@/features/news/api/service';
import { enNewsCategory } from '@/features/news/category-i18n';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import type { SearchParams } from 'nuqs/server';

export const metadata: Metadata = {
  title: 'AI News in English',
  description:
    'Track major events across the AI Agent landscape — model releases, funding, frameworks and breakthroughs.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/news',
    languages: { 'zh-CN': 'https://aiskillnav.com/news', en: 'https://aiskillnav.com/en/news' }
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const CATEGORY_STYLE: Record<string, { color: string; bg: string }> = {
  Agent: { color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  Frameworks: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  Models: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  Tools: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  Funding: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  Research: { color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' }
};
const DEFAULT_STYLE = { color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' };
const styleFor = (label: string) => CATEGORY_STYLE[label] ?? DEFAULT_STYLE;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

type PageProps = { searchParams: Promise<SearchParams> };

const PAGE_SIZE = 9;

export default async function EnNewsListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const page = typeof params.page === 'string' ? Number(params.page) || 1 : 1;

  const all = await getPublishedEnglishNews();
  // 英文分类标签 → 原始分类值 的映射（去重展示，过滤仍按原始值）
  const labelToRaw = new Map<string, string>();
  for (const n of all) {
    const label = enNewsCategory(n.category);
    if (!labelToRaw.has(label)) labelToRaw.set(label, n.category);
  }
  const categoryLabels = Array.from(labelToRaw.keys()).sort();

  const filtered = category ? all.filter((n) => n.category === category) : all;
  const total_items = filtered.length;
  const totalPages = Math.ceil(total_items / PAGE_SIZE);
  const news = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 头部 featured：首页无筛选时取前 2 篇
  const featured = !category && page === 1 ? all.slice(0, 2) : [];
  const timeline = getTimelineEn().toSorted(
    (a, b) => new Date(b.date + '-01').getTime() - new Date(a.date + '-01').getTime()
  );

  const itemListJsonLd =
    page === 1
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'AI Agent News — latest industry news',
          url: 'https://aiskillnav.com/en/news',
          description:
            'Track major events, funding, model releases and breakthroughs across the AI Agent landscape',
          numberOfItems: total_items,
          itemListElement: news.slice(0, 10).map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://aiskillnav.com/en/news/${item.slug}`,
            name: item.title_en
          }))
        }
      : null;

  const catHref = (raw?: string) =>
    raw ? `/en/news?category=${encodeURIComponent(raw)}` : '/en/news';

  return (
    <PageContainer
      pageTitle='AI Agent News'
      pageDescription='Track major events, funding, model releases and breakthroughs across the AI Agent landscape'
    >
      {itemListJsonLd && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <div className='space-y-10'>
        {/* Hero */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Icons.trendingUp className='h-5 w-5 text-primary' />
            <span className='text-sm font-semibold text-primary'>AI Agent updates</span>
          </div>
          <h2 className='text-3xl font-bold tracking-tight md:text-4xl'>Latest industry news</h2>
          <p className='max-w-2xl text-muted-foreground'>
            Track major events, funding, model releases and breakthroughs across the AI Agent
            landscape
          </p>
        </div>

        {/* Timeline */}
        <div className='rounded-xl border bg-card p-5'>
          <div className='mb-4 flex items-center gap-2'>
            <Icons.clock className='h-4 w-4 text-muted-foreground' />
            <h2 className='text-sm font-semibold'>Key events timeline</h2>
          </div>
          <div className='relative space-y-0 pl-4'>
            <div className='absolute left-0 top-2 bottom-2 w-px bg-border' />
            {timeline.map((event, i) => (
              <div key={i} className='relative flex gap-4 py-2.5'>
                <div className='absolute -left-1.5 top-3.5 h-3 w-3 rounded-full border-2 border-primary bg-background' />
                <div className='min-w-[60px] pt-1 text-[11px] font-medium text-muted-foreground shrink-0'>
                  {event.date}
                </div>
                <div>
                  <p className='text-sm font-medium'>{event.title}</p>
                  <p className='text-xs text-muted-foreground'>{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <Icons.sparkles className='h-4 w-4 text-amber-500' />
              <h2 className='text-sm font-semibold'>In focus</h2>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              {featured.map((item) => {
                const label = enNewsCategory(item.category);
                const cfg = styleFor(label);
                return (
                  <Link
                    key={item.slug}
                    href={`/en/news/${item.slug}`}
                    className='group flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 ring-1 ring-primary/10'
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <Badge variant='outline' className={`text-[10px] font-medium ${cfg.bg} ${cfg.color}`}>
                        {label}
                      </Badge>
                      <span className='text-[11px] text-muted-foreground'>
                        {formatDate(item.published_at)}
                      </span>
                    </div>
                    <h3 className='text-sm font-semibold leading-snug group-hover:text-primary transition-colors'>
                      {item.title_en}
                    </h3>
                    <p className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
                      {item.summary_en}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className='flex flex-wrap gap-2'>
          <Link href='/en/news'>
            <Badge variant={!category ? 'default' : 'outline'} className='cursor-pointer'>
              All
            </Badge>
          </Link>
          {categoryLabels.map((label) => {
            const raw = labelToRaw.get(label)!;
            return (
              <Link key={label} href={catHref(raw)}>
                <Badge variant={category === raw ? 'default' : 'outline'} className='cursor-pointer'>
                  {label}
                </Badge>
              </Link>
            );
          })}
        </div>

        {/* News grid */}
        {news.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <Icons.trendingUp className='mb-3 h-10 w-10 text-muted-foreground/40' />
            <p className='text-sm text-muted-foreground'>No news yet</p>
          </div>
        ) : (
          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {news.map((item) => {
              const label = enNewsCategory(item.category);
              const cfg = styleFor(label);
              return (
                <Link
                  key={item.slug}
                  href={`/en/news/${item.slug}`}
                  className='group flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
                >
                  <div className='flex items-center justify-between'>
                    <Badge variant='outline' className={`text-[10px] font-medium ${cfg.bg} ${cfg.color}`}>
                      {label}
                    </Badge>
                    <span className='text-[11px] text-muted-foreground'>
                      {formatDate(item.published_at)}
                    </span>
                  </div>
                  <h2 className='line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary transition-colors'>
                    {item.title_en}
                  </h2>
                  <p className='line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground'>
                    {item.summary_en}
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-center gap-2'>
            {page > 1 && (
              <Link
                href={`/en/news?page=${page - 1}${category ? `&category=${encodeURIComponent(category)}` : ''}`}
                className='flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs hover:bg-accent transition-colors'
              >
                <Icons.chevronLeft className='h-3.5 w-3.5' />
                Prev
              </Link>
            )}
            <span className='text-xs text-muted-foreground'>
              Page {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/en/news?page=${page + 1}${category ? `&category=${encodeURIComponent(category)}` : ''}`}
                className='flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs hover:bg-accent transition-colors'
              >
                Next
                <Icons.chevronRight className='h-3.5 w-3.5' />
              </Link>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
