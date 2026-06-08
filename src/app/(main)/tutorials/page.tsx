import PageContainer from '@/components/layout/page-container';
import { getTutorialsPage, getFeaturedTutorials, getTutorialStats } from '@/features/tutorials/api/service';
import { PILLAR_TOPICS } from '@/features/tutorials/topics';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Tutorial, TutorialLevel, TutorialCategory } from '@/features/tutorials/api/service';
import type { SearchParams } from 'nuqs/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { resolvePageMeta } = await import('@/features/seo/api/service');
  const meta = await resolvePageMeta('/dashboard/tutorials');
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: 'https://aiskillnav.com/tutorials' },
    openGraph: meta.openGraph,
    twitter: meta.twitter
  };
}

const LEVEL_CONFIG: Record<TutorialLevel, { label: string; color: string }> = {
  beginner: { label: '入门', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
  intermediate: { label: '进阶', color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
  advanced: { label: '高级', color: 'text-violet-600 bg-violet-500/10 border-violet-500/20' }
};

const CATEGORY_CONFIG: Record<TutorialCategory, { label: string }> = {
  concept: { label: '概念理解' },
  'hands-on': { label: '实操教程' },
  mcp: { label: 'MCP' },
  agent: { label: 'Agent' },
  workflow: { label: '工作流' },
  creative: { label: '创意生成' },
  productivity: { label: '效率工具' }
};

const CATEGORY_FALLBACK = { label: '其他' };
const LEVEL_FALLBACK = { label: '未知', color: 'text-muted-foreground bg-muted/30' };

function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  const level = LEVEL_CONFIG[tutorial.level] ?? LEVEL_FALLBACK;
  const cat = CATEGORY_CONFIG[tutorial.category] ?? CATEGORY_FALLBACK;
  return (
    <Link
      href={`/tutorials/${tutorial.slug}`}
      className='group flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
    >
      <div className='flex items-center justify-between gap-2'>
        <Badge variant='outline' className={`text-[10px] ${level.color}`}>
          {level.label}
        </Badge>
        <span className='text-[10px] text-muted-foreground'>{cat.label}</span>
      </div>
      <div>
        <h3 className='text-sm font-semibold group-hover:text-primary transition-colors leading-snug'>
          {tutorial.title}
        </h3>
        <p className='mt-0.5 text-xs text-muted-foreground'>{tutorial.subtitle}</p>
      </div>
      <p className='flex-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
        {tutorial.summary}
      </p>
      <div className='flex items-center justify-between'>
        <div className='flex flex-wrap gap-1'>
          {tutorial.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className='rounded border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground'
            >
              {t}
            </span>
          ))}
        </div>
        <span className='flex items-center gap-1 text-[11px] text-muted-foreground'>
          <Icons.clock className='h-3 w-3' />
          {tutorial.estimated_minutes}分钟
        </span>
      </div>
    </Link>
  );
}

type PageProps = { searchParams: Promise<SearchParams> };

export default async function TutorialsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const level = typeof params.level === 'string' ? params.level : 'all';
  const category = typeof params.tut_cat === 'string' ? params.tut_cat : 'all';
  const page = typeof params.page === 'string' ? Number(params.page) || 1 : 1;
  const limit = 48;

  const [{ items, total_items }, featured, stats] = await Promise.all([
    getTutorialsPage({
      page,
      limit,
      level: level !== 'all' ? level : undefined,
      category: category !== 'all' ? category : undefined
    }),
    getFeaturedTutorials(),
    getTutorialStats()
  ]);

  const totalPages = Math.ceil(total_items / limit);
  const pageUrl = (p: number) => {
    const sp = new URLSearchParams();
    if (p > 1) sp.set('page', String(p));
    if (level !== 'all') sp.set('level', level);
    if (category !== 'all') sp.set('tut_cat', category);
    const qs = sp.toString();
    return `/tutorials${qs ? `?${qs}` : ''}`;
  };

  // ItemList 结构化数据 — 仅首页（page=1）时输出，避免分页重复
  const itemListJsonLd =
    page === 1
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: '教程中心 — AI Agent 实战教程',
          url: 'https://aiskillnav.com/tutorials',
          description: 'AI Agent 从入门到实战：概念理解、MCP 使用、平台实操、工作流自动化',
          numberOfItems: total_items,
          itemListElement: items.slice(0, 20).map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://aiskillnav.com/tutorials/${t.slug}`,
            name: t.title
          }))
        }
      : null;

  return (
    <PageContainer
      pageTitle='教程中心'
      pageDescription='AI Agent 从入门到实战：概念理解、MCP 使用、平台实操、工作流自动化'
    >
      {itemListJsonLd && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <div className='space-y-8'>
        {/* Quick stats */}
        <div className='grid grid-cols-3 gap-3'>
          {[
            { label: '教程总数', value: stats.total, icon: Icons.post },
            { label: '入门教程', value: stats.byLevel.beginner ?? 0, icon: Icons.info },
            { label: '实操教程', value: stats.byCategory['hands-on'] ?? 0, icon: Icons.settings }
          ].map((s) => (
            <div
              key={s.label}
              className='flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm'
            >
              <s.icon className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-xl font-bold'>{s.value}</p>
                <p className='text-xs text-muted-foreground'>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 按主题浏览 — pillar 主题枢纽入口 */}
        <div className='space-y-2'>
          <h2 className='text-sm font-semibold'>按主题浏览</h2>
          <div className='flex flex-wrap gap-2'>
            {PILLAR_TOPICS.map((tp) => (
              <Link
                key={tp.slug}
                href={`/tutorials/topic/${tp.slug}`}
                className='rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors'
              >
                {tp.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured */}
        {featured.length > 0 && level === 'all' && category === 'all' && page === 1 && (
          <section>
            <div className='mb-3 flex items-center gap-2'>
              <Icons.sparkles className='h-4 w-4 text-amber-500' />
              <h2 className='text-sm font-semibold'>推荐阅读</h2>
            </div>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {featured.map((t) => (
                <TutorialCard key={t.id} tutorial={t} />
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex gap-1.5'>
            {[
              { v: 'all', l: '全部级别' },
              { v: 'beginner', l: '入门' },
              { v: 'intermediate', l: '进阶' },
              { v: 'advanced', l: '高级' }
            ].map((tab) => (
              <Link
                key={tab.v}
                href={`/tutorials?level=${tab.v}${category !== 'all' ? `&tut_cat=${category}` : ''}`}
              >
                <button
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${level === tab.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground hover:bg-accent'}`}
                >
                  {tab.l}
                </button>
              </Link>
            ))}
          </div>
          <div className='flex gap-1.5'>
            {[
              { v: 'all', l: '全部类型' },
              ...Object.entries(CATEGORY_CONFIG).map(([v, c]) => ({ v, l: c.label }))
            ].map((tab) => (
              <Link
                key={tab.v}
                href={`/tutorials?tut_cat=${tab.v}${level !== 'all' ? `&level=${level}` : ''}`}
              >
                <button
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${category === tab.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground hover:bg-accent'}`}
                >
                  {tab.l}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Full list */}
        {items.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <Icons.post className='mb-3 h-10 w-10 text-muted-foreground/40' />
            <p className='text-sm text-muted-foreground'>暂无相关教程</p>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {items.map((t) => (
              <TutorialCard key={t.id} tutorial={t} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-center gap-2'>
            {page > 1 && (
              <Link
                href={pageUrl(page - 1)}
                className='flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs hover:bg-accent transition-colors'
              >
                <Icons.chevronLeft className='h-3.5 w-3.5' />
                上一页
              </Link>
            )}
            <span className='text-xs text-muted-foreground'>
              第 {page} / {totalPages} 页
            </span>
            {page < totalPages && (
              <Link
                href={pageUrl(page + 1)}
                className='flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs hover:bg-accent transition-colors'
              >
                下一页
                <Icons.chevronRight className='h-3.5 w-3.5' />
              </Link>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
