import { Metadata } from 'next';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import {
  getTutorialStats,
  getPublishedEnglishTutorials,
  type EnglishTutorial
} from '@/features/tutorials/api/service';
import { PILLAR_TOPICS } from '@/features/tutorials/topics';
import type { SearchParams } from 'nuqs/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'AI Tutorials',
  description:
    'In-depth, practical tutorials for AI engineers — RAG, agents, deployment, fine-tuning and more.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/tutorials',
    languages: {
      'zh-CN': 'https://aiskillnav.com/tutorials',
      en: 'https://aiskillnav.com/en/tutorials'
    }
  }
};

const LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  beginner: {
    label: 'Beginner',
    color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
  },
  intermediate: { label: 'Intermediate', color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
  advanced: { label: 'Advanced', color: 'text-violet-600 bg-violet-500/10 border-violet-500/20' }
};
const CATEGORY_CONFIG: Record<string, string> = {
  concept: 'Concept',
  'hands-on': 'Hands-on',
  mcp: 'MCP',
  agent: 'Agent',
  workflow: 'Workflow',
  creative: 'Creative',
  productivity: 'Productivity'
};
const TOPIC_EN: Record<string, string> = {
  rag: 'RAG',
  agent: 'AI Agents',
  'model-deployment': 'Deployment',
  workflow: 'Workflow',
  openai: 'OpenAI',
  claude: 'Claude / Anthropic',
  langchain: 'LangChain',
  'fine-tuning': 'Fine-tuning',
  'prompt-engineering': 'Prompt Engineering',
  mcp: 'MCP',
  evaluation: 'Evaluation',
  security: 'AI Security',
  'api-integration': 'API & Integration'
};

function TutorialCard({ t }: { t: EnglishTutorial }) {
  const level = LEVEL_CONFIG[t.level] ?? {
    label: t.level,
    color: 'text-muted-foreground bg-muted/30'
  };
  const cat = CATEGORY_CONFIG[t.category] ?? 'Other';
  return (
    <Link
      href={`/en/tutorials/${t.slug}`}
      className='group flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
    >
      <div className='flex items-center justify-between gap-2'>
        <Badge variant='outline' className={`text-[10px] ${level.color}`}>
          {level.label}
        </Badge>
        <span className='text-[10px] text-muted-foreground'>{cat}</span>
      </div>
      <h3 className='text-sm font-semibold leading-snug transition-colors group-hover:text-primary'>
        {t.title_en}
      </h3>
      <p className='line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground'>
        {t.summary_en}
      </p>
      <div className='flex items-center justify-between'>
        <div className='flex flex-wrap gap-1'>
          {(t.tags ?? []).slice(0, 2).map((tag) => (
            <span
              key={tag}
              className='rounded border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground'
            >
              {tag}
            </span>
          ))}
        </div>
        <span className='flex items-center gap-1 text-[11px] text-muted-foreground'>
          <Icons.clock className='h-3 w-3' />
          {t.estimated_minutes} min
        </span>
      </div>
    </Link>
  );
}

type PageProps = { searchParams: Promise<SearchParams> };

export default async function EnTutorialsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const level = typeof params.level === 'string' ? params.level : 'all';
  const category = typeof params.tut_cat === 'string' ? params.tut_cat : 'all';
  const page = typeof params.page === 'string' ? Number(params.page) || 1 : 1;
  const limit = 48;

  const [all, stats] = await Promise.all([getPublishedEnglishTutorials(), getTutorialStats()]);
  const filtered = all.filter(
    (t) => (level === 'all' || t.level === level) && (category === 'all' || t.category === category)
  );
  const total_items = filtered.length;
  const totalPages = Math.ceil(total_items / limit);
  const items = filtered.slice((page - 1) * limit, page * limit);
  const featured = all.filter((t) => t.is_featured).slice(0, 6);

  const pageUrl = (p: number) => {
    const sp = new URLSearchParams();
    if (p > 1) sp.set('page', String(p));
    if (level !== 'all') sp.set('level', level);
    if (category !== 'all') sp.set('tut_cat', category);
    const qs = sp.toString();
    return `/en/tutorials${qs ? `?${qs}` : ''}`;
  };

  return (
    <PageContainer
      pageTitle='Tutorials'
      pageDescription='In-depth AI tutorials — from fundamentals to production: RAG, agents, deployment, fine-tuning and more.'
    >
      <div className='space-y-8'>
        {/* Stats */}
        <div className='grid grid-cols-3 gap-3'>
          {[
            { label: 'Total tutorials', value: stats.total, icon: Icons.post },
            { label: 'Beginner', value: stats.byLevel?.beginner ?? 0, icon: Icons.info },
            { label: 'Hands-on', value: stats.byCategory?.['hands-on'] ?? 0, icon: Icons.settings }
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

        {/* Browse by topic */}
        <div className='space-y-2'>
          <h2 className='text-sm font-semibold'>Browse by topic</h2>
          <div className='flex flex-wrap gap-2'>
            {PILLAR_TOPICS.map((tp) => (
              <Link
                key={tp.slug}
                href={`/en/tutorials/topic/${tp.slug}`}
                className='rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground'
              >
                {TOPIC_EN[tp.slug] ?? tp.slug}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured */}
        {featured.length > 0 && level === 'all' && category === 'all' && page === 1 && (
          <section>
            <div className='mb-3 flex items-center gap-2'>
              <Icons.sparkles className='h-4 w-4 text-amber-500' />
              <h2 className='text-sm font-semibold'>Featured</h2>
            </div>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {featured.map((t) => (
                <TutorialCard key={t.slug} t={t} />
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex gap-1.5'>
            {[
              { v: 'all', l: 'All levels' },
              { v: 'beginner', l: 'Beginner' },
              { v: 'intermediate', l: 'Intermediate' },
              { v: 'advanced', l: 'Advanced' }
            ].map((tab) => (
              <Link
                key={tab.v}
                href={`/en/tutorials?level=${tab.v}${category !== 'all' ? `&tut_cat=${category}` : ''}`}
              >
                <button
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${level === tab.v ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-accent'}`}
                >
                  {tab.l}
                </button>
              </Link>
            ))}
          </div>
          <div className='flex flex-wrap gap-1.5'>
            {[
              { v: 'all', l: 'All types' },
              ...Object.entries(CATEGORY_CONFIG).map(([v, l]) => ({ v, l }))
            ].map((tab) => (
              <Link
                key={tab.v}
                href={`/en/tutorials?tut_cat=${tab.v}${level !== 'all' ? `&level=${level}` : ''}`}
              >
                <button
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${category === tab.v ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-accent'}`}
                >
                  {tab.l}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* List */}
        {items.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <Icons.post className='mb-3 h-10 w-10 text-muted-foreground/40' />
            <p className='text-sm text-muted-foreground'>No tutorials found.</p>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {items.map((t) => (
              <TutorialCard key={t.slug} t={t} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-center gap-2'>
            {page > 1 && (
              <Link
                href={pageUrl(page - 1)}
                className='flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition-colors hover:bg-accent'
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
                href={pageUrl(page + 1)}
                className='flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition-colors hover:bg-accent'
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
