import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { MODEL_SERIES, getModelSeriesBySlug } from '@/features/models/series';
import { getModelsBySeries } from '@/features/models/api/service';
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
  if (!s) return { title: '系列不存在' };
  const url = `https://aiskillnav.com/models/series/${s.slug}`;
  return {
    title: `${s.label} 全系列对比 — 各版本参数、价格与能力`,
    description: s.description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: `${s.label} 全系列对比`, description: s.description, siteName: 'AI Skill Navigation' }
  };
}

function Score({ score }: { score: number }) {
  return <span className='font-mono text-xs'>{'●'.repeat(score)}{'○'.repeat(Math.max(0, 5 - score))}</span>;
}

export default async function ModelSeriesPage({ params }: Props) {
  const { series } = await params;
  const s = getModelSeriesBySlug(series);
  if (!s) notFound();

  const models = await getModelsBySeries(s.slug);
  const url = `https://aiskillnav.com/models/series/${s.slug}`;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${s.label} 全系列对比`,
    url,
    description: s.description,
    numberOfItems: models.length,
    itemListElement: models.map((m, i) => ({
      '@type': 'ListItem', position: i + 1,
      url: `https://aiskillnav.com/models/${slugify(m.name)}`, name: m.name
    }))
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: 'https://aiskillnav.com' },
      { '@type': 'ListItem', position: 2, name: 'AI 模型对比', item: 'https://aiskillnav.com/models' },
      { '@type': 'ListItem', position: 3, name: s.label, item: url }
    ]
  };

  return (
    <PageContainer pageTitle={`${s.label} 全系列对比`} pageDescription={s.description}>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className='space-y-8'>
        {/* Intro */}
        <div className='space-y-3'>
          <Link href='/models' className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'>
            <Icons.chevronLeft className='h-4 w-4' />
            全部模型
          </Link>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>{s.label} 全系列对比</h1>
          <p className='max-w-2xl text-muted-foreground'>{s.description}</p>
          <p className='text-sm text-muted-foreground'>共收录 {models.length} 个版本（按能力排序）</p>
        </div>

        {models.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <Icons.sparkles className='mb-3 h-10 w-10 text-muted-foreground/40' />
            <p className='text-sm text-muted-foreground'>该系列暂无收录版本</p>
          </div>
        ) : (
          <>
            {/* 对比表 */}
            <div className='overflow-x-auto rounded-xl border'>
              <table className='w-full min-w-[680px] text-sm'>
                <thead>
                  <tr className='border-b bg-muted/40 text-left text-xs text-muted-foreground'>
                    <th className='px-4 py-3 font-medium'>版本</th>
                    <th className='px-3 py-3 font-medium'>上下文</th>
                    <th className='px-3 py-3 font-medium'>输入价</th>
                    <th className='px-3 py-3 font-medium'>输出价</th>
                    <th className='px-3 py-3 font-medium'>推理</th>
                    <th className='px-3 py-3 font-medium'>代码</th>
                    <th className='px-3 py-3 font-medium'>速度</th>
                    <th className='px-3 py-3 font-medium'>开源</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map((m) => (
                    <tr key={m.id} className='border-b last:border-0 hover:bg-accent/40 transition-colors'>
                      <td className='px-4 py-3'>
                        <Link href={`/models/${slugify(m.name)}`} className='font-medium hover:text-primary transition-colors'>
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
                        {m.is_open_source
                          ? <Badge variant='outline' className='text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/20'>开源</Badge>
                          : <span className='text-xs text-muted-foreground'>闭源</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 卡片网格（链到各版本详情） */}
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {models.map((m) => (
                <Link
                  key={m.id}
                  href={`/models/${slugify(m.name)}`}
                  className='flex flex-col gap-1.5 rounded-xl border bg-card p-4 hover:border-primary/30 hover:bg-accent transition-colors group'
                >
                  <span className='text-sm font-semibold group-hover:text-primary transition-colors'>{m.name}</span>
                  <span className='line-clamp-2 text-xs text-muted-foreground'>{m.description}</span>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* 其他系列 — 互链 */}
        <div className='space-y-3 border-t pt-6'>
          <h2 className='text-sm font-semibold'>其他系列</h2>
          <div className='flex flex-wrap gap-2'>
            {MODEL_SERIES.filter((x) => x.slug !== s.slug).map((x) => (
              <Link
                key={x.slug}
                href={`/models/series/${x.slug}`}
                className='rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors'
              >
                {x.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
