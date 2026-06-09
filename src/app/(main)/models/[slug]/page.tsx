import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { getModelBySlug, getRelatedModels } from '@/features/models/api/service';
import { slugify } from '@/lib/slug';

type Props = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

function ScoreBar({ score }: { score: number }) {
  return (
    <div className='flex items-center gap-2'>
      <div className='flex gap-1'>
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 w-5 rounded-full ${i < score ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>
      <span className='text-xs font-medium tabular-nums text-muted-foreground'>{score} / 5</span>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = await getModelBySlug(slug);
  if (!model) return { title: '模型不存在' };
  const url = `https://aiskillnav.com/models/${slug}`;
  return {
    title: `${model.name}（${model.vendor}）— 参数、价格与能力评测 | AI Skill Navigation`,
    description: model.description,
    keywords: model.tags,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: model.name,
      description: model.description,
      siteName: 'AI Skill Navigation'
    }
  };
}

export default async function ModelDetailPage({ params }: Props) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);
  if (!model) notFound();

  const related = await getRelatedModels(
    { id: model.id, vendor: model.vendor, model_type: model.model_type },
    6
  );
  const url = `https://aiskillnav.com/models/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: model.name,
    applicationCategory: 'AI Model',
    description: model.description,
    operatingSystem: 'Cloud',
    url: model.url,
    ...(model.price_input
      ? { offers: { '@type': 'Offer', description: `输入 ${model.price_input}` } }
      : {})
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: 'https://aiskillnav.com' },
      { '@type': 'ListItem', position: 2, name: 'AI 模型对比', item: 'https://aiskillnav.com/models' },
      { '@type': 'ListItem', position: 3, name: model.name, item: url }
    ]
  };

  const specs = [
    { label: '厂商', value: model.vendor },
    { label: '上下文窗口', value: model.context_window || '—' },
    { label: '多模态', value: model.multimodal ? '支持' : '不支持' },
    { label: '开源', value: model.is_open_source ? '是' : '否' },
    { label: '输入价格', value: model.price_input || '—' },
    { label: '输出价格', value: model.price_output || '—' }
  ];

  return (
    <PageContainer pageTitle={model.name} pageDescription={model.description}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className='mx-auto max-w-3xl space-y-8'>
        <Link
          href='/models'
          className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <Icons.chevronLeft className='h-4 w-4' />
          返回模型对比
        </Link>

        <header className='space-y-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='outline' className='text-xs'>
              {model.vendor}
            </Badge>
            {model.is_open_source && (
              <Badge
                variant='outline'
                className='text-xs text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
              >
                开源
              </Badge>
            )}
            {model.multimodal && (
              <Badge
                variant='outline'
                className='text-xs text-blue-600 bg-blue-500/10 border-blue-500/20'
              >
                多模态
              </Badge>
            )}
          </div>
          <h1 className='text-2xl font-bold md:text-3xl'>{model.name}</h1>
          <p className='text-base leading-relaxed text-muted-foreground'>{model.description}</p>
          <div className='flex flex-wrap gap-1.5'>
            {model.model_type.map((t) => (
              <span
                key={t}
                className='rounded-md bg-muted/50 border px-2 py-0.5 text-xs text-muted-foreground'
              >
                {t}
              </span>
            ))}
          </div>
          <div className='border-b' />
        </header>

        {/* 参数规格 */}
        <section className='space-y-3'>
          <h2 className='text-base font-semibold'>参数规格</h2>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
            {specs.map((s) => (
              <div key={s.label} className='rounded-lg border bg-muted/30 px-3 py-2.5'>
                <p className='text-[11px] text-muted-foreground'>{s.label}</p>
                <p className='text-sm font-semibold'>{s.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 能力评分 */}
        <section className='space-y-3'>
          <h2 className='text-base font-semibold'>能力评分</h2>
          <div className='space-y-3 rounded-xl border bg-muted/30 p-5'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>推理能力</span>
              <ScoreBar score={model.reasoning_score} />
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>代码能力</span>
              <ScoreBar score={model.code_score} />
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>响应速度</span>
              <ScoreBar score={model.speed_score} />
            </div>
          </div>
        </section>

        {/* 官网 */}
        <Link
          href={model.url}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors'
        >
          访问官网 <Icons.externalLink className='h-3.5 w-3.5' />
        </Link>

        {/* 同类模型对比 */}
        {related.length > 0 && (
          <section className='space-y-3'>
            <h2 className='text-base font-semibold'>同类模型对比</h2>
            <div className='grid gap-3 sm:grid-cols-2'>
              {related.map((m) => (
                <Link
                  key={m.id}
                  href={`/models/${slugify(m.name)}`}
                  className='flex flex-col gap-1.5 rounded-xl border bg-card px-4 py-3 hover:border-primary/30 hover:bg-accent transition-colors group'
                >
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-semibold group-hover:text-primary transition-colors'>
                      {m.name}
                    </span>
                    <span className='text-[11px] text-muted-foreground'>{m.vendor}</span>
                  </div>
                  <span className='line-clamp-2 text-xs text-muted-foreground'>{m.description}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 继续探索 */}
        <div className='rounded-xl border bg-muted/30 p-5 space-y-2'>
          <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
            继续探索
          </p>
          <Link
            href='/models'
            className='flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors'
          >
            <span className='font-medium'>查看全部模型对比</span>
            <Icons.chevronRight className='h-4 w-4 text-muted-foreground' />
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
