import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { getAgentBySlug, getRelatedAgents } from '@/features/agents/api/service';
import { INDEX_AGENT_SLUGS } from '@/features/agents/index-allowlist';
import { getUseCasesByTool } from '@/features/usecases/api/service';
import { slugify } from '@/lib/slug';

type Props = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const AGENT_TYPE_LABEL: Record<string, string> = {
  general: '通用自主',
  research: '深度研究',
  builder: '构建平台',
  computer: '电脑操控',
  creative: '垂直创意',
  proactive: '主动感知'
};
const OPEN_SOURCE_LABEL: Record<string, string> = {
  open: '开源',
  closed: '闭源',
  partial: '部分开源'
};
const REGION_LABEL: Record<string, string> = { global: '全球', cn: '国内' };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  if (!agent) return { title: 'Agent 不存在' };
  const url = `https://aiskillnav.com/agents/${slug}`;
  // 薄目录页太多（217 条，描述中位 62 字）：仅白名单内的页可索引，其余 noindex（仍 follow）
  const noindex = !INDEX_AGENT_SLUGS.has(slugify(agent.name));
  return {
    title: `${agent.name} — AI Agent 介绍与同类对比`,
    description: agent.description,
    keywords: agent.tags,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'website',
      url,
      title: agent.name,
      description: agent.description,
      siteName: 'AI Skill Navigation'
    }
  };
}

export default async function AgentDetailPage({ params }: Props) {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  if (!agent) notFound();

  const [relatedAgents, relatedUseCases] = await Promise.all([
    getRelatedAgents({ id: agent.id, agent_type: agent.agent_type }, 6),
    getUseCasesByTool(agent.name, 6)
  ]);
  const url = `https://aiskillnav.com/agents/${slug}`;
  const isExternal = agent.url !== '#';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: agent.name,
    applicationCategory: 'AI Agent',
    description: agent.description,
    operatingSystem: 'Cloud',
    ...(isExternal ? { url: agent.url } : {})
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: 'https://aiskillnav.com' },
      { '@type': 'ListItem', position: 2, name: 'Agent Hub', item: 'https://aiskillnav.com/agents' },
      { '@type': 'ListItem', position: 3, name: agent.name, item: url }
    ]
  };

  return (
    <PageContainer pageTitle={agent.name} pageDescription={agent.description}>
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
          href='/agents'
          className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <Icons.chevronLeft className='h-4 w-4' />
          返回 Agent Hub
        </Link>

        <header className='space-y-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='outline' className='text-xs'>
              {AGENT_TYPE_LABEL[agent.agent_type] ?? agent.agent_type}
            </Badge>
            <Badge variant='outline' className='text-xs'>
              {OPEN_SOURCE_LABEL[agent.open_source] ?? agent.open_source}
            </Badge>
            <Badge variant='outline' className='text-xs'>
              {REGION_LABEL[agent.region] ?? agent.region}
            </Badge>
          </div>
          <h1 className='text-2xl font-bold md:text-3xl'>{agent.name}</h1>
          <p className='text-base leading-relaxed text-muted-foreground'>{agent.description}</p>
          {agent.tags.length > 0 && (
            <div className='flex flex-wrap gap-1.5'>
              {agent.tags.map((tag) => (
                <span
                  key={tag}
                  className='rounded-md bg-muted/50 border px-2 py-0.5 text-xs text-muted-foreground'
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className='border-b' />
        </header>

        {/* 官网 */}
        {isExternal && (
          <Link
            href={agent.url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors'
          >
            访问官网 <Icons.externalLink className='h-3.5 w-3.5' />
          </Link>
        )}

        {/* 关联用例（usecases.tools 包含此 agent） */}
        {relatedUseCases.length > 0 && (
          <section className='space-y-3'>
            <h2 className='text-base font-semibold'>用 {agent.name} 能做什么</h2>
            <div className='space-y-2'>
              {relatedUseCases.map((uc) => (
                <Link
                  key={uc.id}
                  href={`/usecases/${uc.id}`}
                  className='flex items-start gap-3 rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors group'
                >
                  <div className='flex-1 min-w-0'>
                    <span className='font-medium line-clamp-1 group-hover:text-primary transition-colors'>
                      {uc.title}
                    </span>
                    <p className='text-xs text-muted-foreground mt-0.5 line-clamp-1'>
                      {uc.description}
                    </p>
                  </div>
                  <Icons.chevronRight className='h-4 w-4 shrink-0 text-muted-foreground mt-0.5' />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 同类 Agent */}
        {relatedAgents.length > 0 && (
          <section className='space-y-3'>
            <h2 className='text-base font-semibold'>同类 Agent</h2>
            <div className='grid gap-3 sm:grid-cols-2'>
              {relatedAgents.map((a) => (
                <Link
                  key={a.id}
                  href={`/agents/${slugify(a.name)}`}
                  className='flex flex-col gap-1.5 rounded-xl border bg-card px-4 py-3 hover:border-primary/30 hover:bg-accent transition-colors group'
                >
                  <span className='text-sm font-semibold group-hover:text-primary transition-colors'>
                    {a.name}
                  </span>
                  <span className='line-clamp-2 text-xs text-muted-foreground'>{a.description}</span>
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
            href='/agents'
            className='flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors'
          >
            <span className='font-medium'>浏览全部 Agent</span>
            <Icons.chevronRight className='h-4 w-4 text-muted-foreground' />
          </Link>
          <Link
            href='/usecases'
            className='flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm hover:border-primary/30 hover:bg-accent transition-colors'
          >
            <span className='font-medium'>浏览应用场景库</span>
            <Icons.chevronRight className='h-4 w-4 text-muted-foreground' />
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
