import type { Metadata } from 'next';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { getPublishedEnglishUseCases, type EnglishUseCase } from '@/features/usecases/api/service';
import { enEstimatedTime } from '@/features/usecases/estimated-time-i18n';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import type { SearchParams } from 'nuqs/server';

export const metadata: Metadata = {
  title: 'AI Use Cases — real-world AI Agent workflows',
  description:
    'Real-world AI Agent use cases from marketing to engineering, research to productivity — with recommended tool stacks and step-by-step guides.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/usecases',
    languages: { 'zh-CN': 'https://aiskillnav.com/usecases', en: 'https://aiskillnav.com/en/usecases' }
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const INDUSTRY_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  marketing: { label: 'Marketing', icon: Icons.trendingUp, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
  engineering: { label: 'Engineering', icon: Icons.settings, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
  research: { label: 'Research', icon: Icons.search, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10' },
  productivity: { label: 'Productivity', icon: Icons.checks, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  industry: { label: 'Industry', icon: Icons.briefcase, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' }
};

const DIFFICULTY_CONFIG: Record<number, { stars: string; label: string; color: string }> = {
  1: { stars: '⭐', label: 'Easy', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
  2: { stars: '⭐⭐', label: 'Medium', color: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
  3: { stars: '⭐⭐⭐', label: 'Advanced', color: 'text-rose-600 bg-rose-500/10 border-rose-500/20' }
};

const INDUSTRY_FALLBACK = { label: 'Other', icon: Icons.briefcase, color: 'text-muted-foreground', bg: 'bg-muted/30' };

function UseCaseCard({ uc }: { uc: EnglishUseCase }) {
  const ind = INDUSTRY_CONFIG[uc.industry] ?? INDUSTRY_FALLBACK;
  const diff = DIFFICULTY_CONFIG[uc.difficulty] ?? DIFFICULTY_CONFIG[1];
  const IndIcon = ind.icon;
  const steps = uc.steps_en ?? [];
  return (
    <Link
      href={`/en/usecases/${uc.id}`}
      className='group flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
    >
      <div className='mb-3 flex items-start justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${ind.bg}`}>
            <IndIcon className={`h-4 w-4 ${ind.color}`} />
          </div>
          <Badge variant='outline' className={`text-[10px] ${diff.color}`}>
            {diff.stars}
          </Badge>
        </div>
        <span className='text-[10px] text-muted-foreground shrink-0'>
          {enEstimatedTime(uc.estimated_time)}
        </span>
      </div>

      <h3 className='mb-2 text-sm font-semibold leading-snug'>{uc.title_en}</h3>
      <p className='mb-3 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3'>
        {uc.description_en}
      </p>

      {steps.length > 0 && (
        <div className='mb-3 rounded-lg bg-muted/30 p-3'>
          <p className='mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
            Steps
          </p>
          <ol className='space-y-1'>
            {steps.slice(0, 3).map((step, i) => (
              <li key={i} className='flex items-start gap-1.5 text-[11px] text-muted-foreground'>
                <span className='shrink-0 font-mono text-primary'>{i + 1}.</span>
                <span className='line-clamp-1'>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className='mb-3'>
        <p className='mb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide'>
          Recommended tools
        </p>
        <div className='flex flex-wrap gap-1'>
          {uc.tools.map((t) => (
            <span key={t} className='rounded border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium'>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className='flex flex-wrap gap-1'>
        {(uc.tags_en && uc.tags_en.length ? uc.tags_en : uc.tags).slice(0, 3).map((t) => (
          <span key={t} className='rounded border bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground'>
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}

type PageProps = { searchParams: Promise<SearchParams> };

export default async function EnUseCasesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const industry = typeof params.industry === 'string' ? params.industry : 'all';
  const difficulty = typeof params.diff === 'string' ? Number(params.diff) || 0 : 0;

  const all = await getPublishedEnglishUseCases();
  const byIndustry: Record<string, number> = {};
  for (const u of all) byIndustry[u.industry] = (byIndustry[u.industry] ?? 0) + 1;

  const usecases = all.filter(
    (u) =>
      (industry === 'all' || u.industry === industry) &&
      (!difficulty || u.difficulty === difficulty)
  );
  const featured = industry === 'all' && !difficulty ? all.slice(0, 3) : [];

  const itemListJsonLd =
    industry === 'all' && !difficulty
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Use Cases — real-world AI Agent workflows',
          url: 'https://aiskillnav.com/en/usecases',
          description:
            'Real-world AI Agent use cases with recommended tool stacks and step-by-step guides',
          numberOfItems: usecases.length,
          itemListElement: usecases.slice(0, 20).map((uc, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: uc.title_en
          }))
        }
      : null;

  const industryTabs = [
    { v: 'all', l: 'All industries' },
    ...Object.entries(INDUSTRY_CONFIG).map(([v, c]) => ({ v, l: c.label }))
  ];
  const diffTabs = [
    { v: 0, l: 'All levels' },
    { v: 1, l: '⭐ Easy' },
    { v: 2, l: '⭐⭐ Medium' },
    { v: 3, l: '⭐⭐⭐ Advanced' }
  ];

  return (
    <PageContainer
      pageTitle='Use Cases'
      pageDescription='Real-world AI Agent use cases from marketing to engineering, research to productivity — with recommended tool stacks and step-by-step guides'
    >
      {itemListJsonLd && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <div className='space-y-8'>
        {/* Industry stats */}
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-5'>
          {Object.entries(INDUSTRY_CONFIG).map(([key, cfg]) => {
            const IndIcon = cfg.icon;
            const count = byIndustry[key] ?? 0;
            return (
              <div
                key={key}
                className='flex flex-col items-center gap-2 rounded-xl border bg-card px-3 py-4 text-center shadow-sm'
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${cfg.bg}`}>
                  <IndIcon className={`h-4 w-4 ${cfg.color}`} />
                </div>
                <div>
                  <p className='text-lg font-bold'>{count}</p>
                  <p className='text-[11px] text-muted-foreground'>{cfg.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <section>
            <div className='mb-3 flex items-center gap-2'>
              <Icons.sparkles className='h-4 w-4 text-amber-500' />
              <h2 className='text-sm font-semibold'>Featured use cases</h2>
            </div>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {featured.map((u) => (
                <UseCaseCard key={u.id} uc={u} />
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex flex-wrap gap-1.5'>
            {industryTabs.map((tab) => (
              <a key={tab.v} href={`/en/usecases?industry=${tab.v}${difficulty ? `&diff=${difficulty}` : ''}`}>
                <button
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${industry === tab.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground hover:bg-accent'}`}
                >
                  {tab.l}
                </button>
              </a>
            ))}
          </div>
          <div className='flex gap-1.5'>
            {diffTabs.map((tab) => (
              <a key={tab.v} href={`/en/usecases?diff=${tab.v}${industry !== 'all' ? `&industry=${industry}` : ''}`}>
                <button
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${difficulty === tab.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground hover:bg-accent'}`}
                >
                  {tab.l}
                </button>
              </a>
            ))}
          </div>
        </div>

        {/* Grid */}
        {usecases.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16'>
            <Icons.search className='mb-3 h-10 w-10 text-muted-foreground/40' />
            <p className='text-sm text-muted-foreground'>No matching use cases</p>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {usecases.map((u) => (
              <UseCaseCard key={u.id} uc={u} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
