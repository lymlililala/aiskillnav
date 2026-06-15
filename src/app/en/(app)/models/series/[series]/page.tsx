import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { MODEL_SERIES, getModelSeriesBySlug } from '@/features/models/series';
import { getPublishedEnglishModels } from '@/features/models/api/service';
import { slugify } from '@/lib/slug';

type Props = { params: Promise<{ series: string }> };

export function generateStaticParams() {
  return MODEL_SERIES.map((s) => ({ series: s.slug }));
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series } = await params;
  const s = getModelSeriesBySlug(series);
  if (!s) return { title: 'Series not found' };
  const url = `https://aiskillnav.com/en/models/series/${s.slug}`;
  return {
    title: `${s.labelEn} series comparison — versions, pricing & capabilities | AI Skill Navigation`,
    description: s.descriptionEn,
    alternates: {
      canonical: url,
      languages: { 'zh-CN': `https://aiskillnav.com/models/series/${s.slug}`, en: url }
    },
    openGraph: {
      type: 'website',
      url,
      title: `${s.labelEn} series comparison`,
      description: s.descriptionEn,
      siteName: 'AI Skill Navigation',
      locale: 'en_US'
    }
  };
}

function Score({ score }: { score: number }) {
  return (
    <span className='font-mono text-xs'>
      {'●'.repeat(score)}
      {'○'.repeat(Math.max(0, 5 - score))}
    </span>
  );
}

export default async function EnModelSeriesPage({ params }: Props) {
  const { series } = await params;
  const s = getModelSeriesBySlug(series);
  if (!s) notFound();

  const all = await getPublishedEnglishModels();
  const models = all.filter((m) => s.match.test(m.name));
  const url = `https://aiskillnav.com/en/models/series/${s.slug}`;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${s.labelEn} series comparison`,
    url,
    description: s.descriptionEn,
    numberOfItems: models.length,
    itemListElement: models.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://aiskillnav.com/en/models/${slugify(m.name)}`,
      name: m.name
    }))
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aiskillnav.com/en' },
      { '@type': 'ListItem', position: 2, name: 'AI Models', item: 'https://aiskillnav.com/en/models' },
      { '@type': 'ListItem', position: 3, name: s.labelEn, item: url }
    ]
  };

  return (
    <PageContainer pageTitle={`${s.labelEn} series comparison`} pageDescription={s.descriptionEn}>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className='space-y-8'>
        {/* Intro */}
        <div className='space-y-3'>
          <Link href='/en/models' className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'>
            <Icons.chevronLeft className='h-4 w-4' />
            All models
          </Link>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>{s.labelEn} series comparison</h1>
          <p className='max-w-2xl text-muted-foreground'>{s.descriptionEn}</p>
          <p className='text-sm text-muted-foreground'>{models.length} versions (sorted by capability)</p>
        </div>

        {models.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <Icons.sparkles className='mb-3 h-10 w-10 text-muted-foreground/40' />
            <p className='text-sm text-muted-foreground'>No versions in this series yet</p>
          </div>
        ) : (
          <>
            {/* Comparison table */}
            <div className='overflow-x-auto rounded-xl border'>
              <table className='w-full min-w-[680px] text-sm'>
                <thead>
                  <tr className='border-b bg-muted/40 text-left text-xs text-muted-foreground'>
                    <th className='px-4 py-3 font-medium'>Version</th>
                    <th className='px-3 py-3 font-medium'>Context</th>
                    <th className='px-3 py-3 font-medium'>Input</th>
                    <th className='px-3 py-3 font-medium'>Output</th>
                    <th className='px-3 py-3 font-medium'>Reasoning</th>
                    <th className='px-3 py-3 font-medium'>Code</th>
                    <th className='px-3 py-3 font-medium'>Speed</th>
                    <th className='px-3 py-3 font-medium'>Open source</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map((m) => (
                    <tr key={m.id} className='border-b last:border-0 hover:bg-accent/40 transition-colors'>
                      <td className='px-4 py-3'>
                        <Link href={`/en/models/${slugify(m.name)}`} className='font-medium hover:text-primary transition-colors'>
                          {m.name}
                        </Link>
                      </td>
                      <td className='px-3 py-3 text-muted-foreground'>{m.context_window || '—'}</td>
                      <td className='px-3 py-3 text-muted-foreground'>{m.price_input || '—'}</td>
                      <td className='px-3 py-3 text-muted-foreground'>{m.price_output || '—'}</td>
                      <td className='px-3 py-3'><Score score={m.reasoning_score} /></td>
                      <td className='px-3 py-3'><Score score={m.code_score} /></td>
                      <td className='px-3 py-3'><Score score={m.speed_score} /></td>
                      <td className='px-3 py-3'>
                        {m.is_open_source ? (
                          <Badge variant='outline' className='text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/20'>
                            Open
                          </Badge>
                        ) : (
                          <span className='text-xs text-muted-foreground'>Closed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card grid */}
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {models.map((m) => (
                <Link
                  key={m.id}
                  href={`/en/models/${slugify(m.name)}`}
                  className='flex flex-col gap-1.5 rounded-xl border bg-card p-4 hover:border-primary/30 hover:bg-accent transition-colors group'
                >
                  <span className='text-sm font-semibold group-hover:text-primary transition-colors'>{m.name}</span>
                  <span className='line-clamp-2 text-xs text-muted-foreground'>{m.description_en || m.description}</span>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Other series */}
        <div className='space-y-3 border-t pt-6'>
          <h2 className='text-sm font-semibold'>Other series</h2>
          <div className='flex flex-wrap gap-2'>
            {MODEL_SERIES.filter((x) => x.slug !== s.slug).map((x) => (
              <Link
                key={x.slug}
                href={`/en/models/series/${x.slug}`}
                className='rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors'
              >
                {x.labelEn}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
