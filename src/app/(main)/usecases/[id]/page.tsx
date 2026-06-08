import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { getUseCaseById, getRelatedUseCases } from '@/features/usecases/api/service';
import { getAgentSlugSet } from '@/features/agents/api/service';

type Props = { params: Promise<{ id: string }> };

// 动态渲染 + ISR
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const INDUSTRY_LABEL: Record<string, string> = {
  marketing: '营销',
  engineering: '编程',
  research: '研究',
  productivity: '效率',
  industry: '垂直行业'
};
const DIFFICULTY_LABEL: Record<number, string> = { 1: '简单', 2: '中等', 3: '复杂' };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const uc = await getUseCaseById(Number(id));
  if (!uc) return { title: '场景不存在' };
  const url = `https://aiskillnav.com/usecases/${uc.id}`;
  return {
    title: `${uc.title} — AI 应用场景与实现步骤 | AI Skill Navigation`,
    description: uc.description,
    keywords: uc.tags,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: uc.title,
      description: uc.description,
      siteName: 'AI Skill Navigation'
    }
  };
}

export default async function UseCaseDetailPage({ params }: Props) {
  const { id } = await params;
  const uc = await getUseCaseById(Number(id));
  if (!uc) notFound();

  const [related, agentSlugSet] = await Promise.all([
    getRelatedUseCases({ id: uc.id, industry: uc.industry }, 6),
    getAgentSlugSet()
  ]);
  const url = `https://aiskillnav.com/usecases/${uc.id}`;

  // HowTo 结构化数据（steps 天然命中"怎么做 X"搜索）
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: uc.title,
    description: uc.description,
    ...(uc.estimated_time ? { totalTime: uc.estimated_time } : {}),
    step: uc.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s }))
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: 'https://aiskillnav.com' },
      { '@type': 'ListItem', position: 2, name: '场景库', item: 'https://aiskillnav.com/usecases' },
      { '@type': 'ListItem', position: 3, name: uc.title, item: url }
    ]
  };

  return (
    <PageContainer pageTitle={uc.title} pageDescription={uc.description}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className='mx-auto max-w-3xl space-y-8'>
        <Link
          href='/usecases'
          className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <Icons.chevronLeft className='h-4 w-4' />
          返回场景库
        </Link>

        <header className='space-y-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='outline' className='text-xs'>
              {INDUSTRY_LABEL[uc.industry] ?? uc.industry}
            </Badge>
            <Badge variant='outline' className='text-xs'>
              难度：{DIFFICULTY_LABEL[uc.difficulty] ?? uc.difficulty}
            </Badge>
            {uc.estimated_time && (
              <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                <Icons.clock className='h-3.5 w-3.5' />
                {uc.estimated_time}
              </span>
            )}
          </div>
          <h1 className='text-2xl font-bold leading-tight md:text-3xl'>{uc.title}</h1>
          <p className='text-base leading-relaxed text-muted-foreground'>{uc.description}</p>
          <div className='border-b' />
        </header>

        {/* 实现步骤 */}
        {uc.steps.length > 0 && (
          <section className='space-y-3'>
            <h2 className='text-base font-semibold'>实现步骤</h2>
            <ol className='space-y-3'>
              {uc.steps.map((step, i) => (
                <li key={i} className='flex gap-3 rounded-xl border bg-muted/30 p-4'>
                  <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
                    {i + 1}
                  </span>
                  <p className='text-sm leading-relaxed text-foreground/90'>{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* 推荐工具栈 — 链到 agents 列表过滤 */}
        {uc.tools.length > 0 && (
          <section className='space-y-3'>
            <h2 className='text-base font-semibold'>推荐工具栈</h2>
            <div className='flex flex-wrap gap-2'>
              {uc.tools.map((tool) => {
                const agentSlug = agentSlugSet.get(tool.toLowerCase());
                return (
                  <Link
                    key={tool}
                    href={
                      agentSlug
                        ? `/agents/${agentSlug}`
                        : `/agents?agent_search=${encodeURIComponent(tool)}`
                    }
                    className='rounded-lg border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary/30 hover:text-primary transition-colors'
                  >
                    {tool}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {uc.tags.length > 0 && (
          <div className='flex flex-wrap gap-1.5'>
            {uc.tags.map((tag) => (
              <span
                key={tag}
                className='rounded-md bg-muted/50 border px-2 py-0.5 text-xs text-muted-foreground'
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 相关场景 */}
        {related.length > 0 && (
          <div className='rounded-xl border bg-muted/30 p-5 space-y-3'>
            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
              相关场景
            </p>
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/usecases/${r.id}`}
                className='flex items-start gap-3 rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors group'
              >
                <div className='flex-1 min-w-0'>
                  <span className='font-medium line-clamp-1 group-hover:text-primary transition-colors'>
                    {r.title}
                  </span>
                  <p className='text-xs text-muted-foreground mt-0.5 line-clamp-1'>
                    {r.description}
                  </p>
                </div>
                <Icons.chevronRight className='h-4 w-4 shrink-0 text-muted-foreground mt-0.5' />
              </Link>
            ))}
          </div>
        )}

        {/* 继续探索 */}
        <div className='rounded-xl border bg-muted/30 p-5 space-y-2'>
          <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
            继续探索
          </p>
          <Link
            href='/usecases'
            className='flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors'
          >
            <span className='font-medium'>浏览更多场景</span>
            <Icons.chevronRight className='h-4 w-4 text-muted-foreground' />
          </Link>
          <Link
            href='/agents'
            className='flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors'
          >
            <span className='font-medium'>浏览 Agent Hub</span>
            <Icons.chevronRight className='h-4 w-4 text-muted-foreground' />
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
