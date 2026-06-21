import type { Metadata } from 'next';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import {
  getPublishedEnglishModels,
  getBenchmarksEn,
  type AiModel,
  type Benchmark
} from '@/features/models/api/service';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { slugify } from '@/lib/slug';
import { MODEL_SERIES } from '@/features/models/series';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'AI Model Comparison — capability, pricing & benchmarks',
  description:
    'Compare mainstream AI models side by side: capability scores, pricing, context windows and benchmark rankings.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/models',
    languages: { 'zh-CN': 'https://aiskillnav.com/models', en: 'https://aiskillnav.com/en/models' }
  }
};

type EnModel = AiModel & { description_en?: string | null };
type EnBenchmark = Benchmark & { description_en?: string | null };

function ModelCard({ model }: { model: EnModel }) {
  return (
    <Link
      href={`/en/models/${slugify(model.name)}`}
      className='group flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
    >
      <div className='mb-4 flex items-start justify-between gap-2'>
        <div>
          <div className='flex items-center gap-2'>
            <h3 className='text-sm font-bold'>{model.name}</h3>
            {model.is_featured && <Icons.sparkles className='h-3.5 w-3.5 text-amber-500' />}
          </div>
          <p className='text-xs text-muted-foreground'>{model.vendor}</p>
        </div>
        <div className='flex flex-col items-end gap-1'>
          {model.is_open_source && (
            <Badge variant='outline' className='text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/20'>
              Open source
            </Badge>
          )}
          {model.multimodal && (
            <Badge variant='outline' className='text-[10px] text-blue-600 bg-blue-500/10 border-blue-500/20'>
              Multimodal
            </Badge>
          )}
        </div>
      </div>

      <p className='mb-4 text-xs leading-relaxed text-muted-foreground line-clamp-2'>
        {model.description_en || model.description}
      </p>

      <div className='mb-4 grid grid-cols-3 gap-2'>
        <div className='rounded-lg bg-muted/30 px-2.5 py-2'>
          <p className='text-[10px] text-muted-foreground'>Context window</p>
          <p className='text-xs font-semibold'>{model.context_window ?? '—'}</p>
        </div>
        <div className='rounded-lg bg-muted/30 px-2.5 py-2'>
          <p className='text-[10px] text-muted-foreground'>Input price</p>
          <p className='text-xs font-semibold'>{model.price_input ?? '—'}</p>
        </div>
        <div className='rounded-lg bg-muted/30 px-2.5 py-2'>
          <p className='text-[10px] text-muted-foreground'>Output price</p>
          <p className='text-xs font-semibold'>{model.price_output ?? '—'}</p>
        </div>
      </div>

      <span className='mt-auto flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors group-hover:bg-accent'>
        View details <Icons.chevronRight className='h-3 w-3' />
      </span>
    </Link>
  );
}

const BENCHMARK_CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  agent: { label: 'Agent', color: 'text-violet-600 bg-violet-500/10 border-violet-500/20' },
  code: { label: 'Code', color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
  reasoning: { label: 'Reasoning', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
  knowledge: { label: 'Knowledge', color: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
  preference: { label: 'User preference', color: 'text-pink-600 bg-pink-500/10 border-pink-500/20' }
};

function BenchmarkRow({ bench }: { bench: EnBenchmark }) {
  const cfg = BENCHMARK_CATEGORY_CONFIG[bench.category] ?? { label: bench.category, color: '' };
  return (
    <div className='flex items-center gap-4 rounded-lg border bg-card px-4 py-3'>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-semibold'>{bench.name}</span>
          <Badge variant='outline' className={`shrink-0 text-[10px] ${cfg.color}`}>
            {cfg.label}
          </Badge>
        </div>
        <p className='mt-0.5 text-xs text-muted-foreground'>{bench.description_en || bench.description}</p>
      </div>
      <div className='shrink-0 text-right'>
        <p className='text-xs font-medium text-foreground'>{bench.current_leader}</p>
        {bench.leader_score && <p className='text-[11px] text-muted-foreground'>{bench.leader_score}</p>}
      </div>
      <Link href={bench.url} target='_blank' rel='noopener noreferrer' className='shrink-0'>
        <Icons.externalLink className='h-4 w-4 text-muted-foreground hover:text-foreground transition-colors' />
      </Link>
    </div>
  );
}

export default async function EnModelsPage() {
  const [models, benchmarks] = await Promise.all([getPublishedEnglishModels(), getBenchmarksEn()]);

  const stats = {
    total: models.length,
    openSource: models.filter((m) => m.is_open_source).length,
    multimodal: models.filter((m) => m.multimodal).length,
    vendors: new Set(models.map((m) => m.vendor).filter(Boolean)).size
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Model Comparison — side-by-side evaluation of mainstream LLMs',
    url: 'https://aiskillnav.com/en/models',
    description:
      'Compare mainstream AI models: capability scores, pricing, context windows and benchmark rankings',
    numberOfItems: models.length,
    itemListElement: models.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://aiskillnav.com/en/models/${slugify(m.name)}`,
      name: m.name
    }))
  };

  const statItems = [
    { label: 'Models', value: stats.total, icon: Icons.sparkles, color: 'text-violet-600', bg: 'bg-violet-500/10' },
    { label: 'Open source', value: stats.openSource, icon: Icons.github, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'Multimodal', value: stats.multimodal, icon: Icons.media, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Vendors', value: stats.vendors, icon: Icons.teams, color: 'text-amber-600', bg: 'bg-amber-500/10' }
  ];

  return (
    <PageContainer
      pageTitle='AI Model Comparison'
      pageDescription='Compare mainstream AI models side by side: capability scores, pricing, context windows and benchmark rankings'
    >
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className='space-y-8'>
        {/* Stats */}
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          {statItems.map((s) => (
            <div key={s.label} className='flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm'>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className='text-xl font-bold'>{s.value}</p>
                <p className='text-xs text-muted-foreground'>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Browse by series */}
        <div className='space-y-2'>
          <h2 className='text-sm font-semibold'>Compare by series</h2>
          <div className='flex flex-wrap gap-2'>
            {MODEL_SERIES.filter((s) => models.some((m) => s.match.test(m.name))).map((s) => (
              <Link
                key={s.slug}
                href={`/en/models/series/${s.slug}`}
                className='rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors'
              >
                {s.labelEn}
              </Link>
            ))}
          </div>
        </div>

        {/* Models grouped by series */}
        {MODEL_SERIES.map((series) => {
          const group = models.filter((m) => series.match.test(m.name));
          if (group.length === 0) return null;
          return (
            <section key={series.slug}>
              <div className='mb-4 flex items-center justify-between gap-2'>
                <h2 className='text-base font-semibold'>{series.labelEn}</h2>
                <Link
                  href={`/en/models/series/${series.slug}`}
                  className='flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors'
                >
                  Series comparison <Icons.chevronRight className='h-3.5 w-3.5' />
                </Link>
              </div>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {group.map((m) => (
                  <ModelCard key={m.id} model={m} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Others */}
        {(() => {
          const others = models.filter((m) => !MODEL_SERIES.some((s) => s.match.test(m.name)));
          if (others.length === 0) return null;
          return (
            <section>
              <h2 className='mb-4 text-base font-semibold'>Other models</h2>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {others.map((m) => (
                  <ModelCard key={m.id} model={m} />
                ))}
              </div>
            </section>
          );
        })()}

        {/* Benchmarks */}
        {benchmarks.length > 0 && (
          <section>
            <div className='mb-4 flex items-center gap-2'>
              <Icons.trendingUp className='h-4 w-4 text-muted-foreground' />
              <h2 className='text-base font-semibold'>Benchmark rankings</h2>
            </div>
            <div className='space-y-2'>
              {benchmarks.map((b) => (
                <BenchmarkRow key={b.id} bench={b} />
              ))}
            </div>
          </section>
        )}

        {/* Pricing note */}
        <div className='rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground'>
          <p className='font-medium text-foreground mb-1'>Pricing note</p>
          Prices are indicative; check each vendor&apos;s official site for the latest. Some models
          offer free tiers or API trials. Open-source models can be self-hosted, paying only compute
          cost.
        </div>
      </div>
    </PageContainer>
  );
}
