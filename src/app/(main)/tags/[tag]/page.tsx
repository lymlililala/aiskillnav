import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { TAG_PAGES, getTagPage } from '@/features/tags/registry';
import {
  getTutorialsByTagTokens,
  getMcpByTagTokens,
  getAgentsByTagTokens
} from '@/features/tags/api/service';
import { INDEX_MCP_SLUGS } from '@/features/mcp/index-allowlist';
import { INDEX_AGENT_SLUGS } from '@/features/agents/index-allowlist';
import { slugify } from '@/lib/slug';

type Props = { params: Promise<{ tag: string }> };

// 标签页数量固定且少（注册表驱动），预渲染为静态页 + ISR，对 SEO 最友好
export function generateStaticParams() {
  return TAG_PAGES.map((t) => ({ tag: t.slug }));
}

export const revalidate = 3600;

const SITE = 'https://aiskillnav.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const t = getTagPage(tag);
  if (!t) return { title: '标签不存在' };
  const url = `${SITE}/tags/${t.slug}`;
  return {
    title: `${t.title} — 教程与资源合集`,
    description: t.description,
    keywords: t.matchTokens,
    alternates: {
      canonical: url,
      languages: { 'zh-CN': url, en: `${SITE}/en/tags/${t.slug}`, 'x-default': url }
    },
    openGraph: {
      type: 'website',
      url,
      title: t.title,
      description: t.description,
      siteName: 'AI Skill Navigation',
      locale: 'zh_CN'
    }
  };
}

const LEVEL_LABEL: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级'
};

export default async function TagHubPage({ params }: Props) {
  const { tag } = await params;
  const t = getTagPage(tag);
  if (!t) notFound();

  const [tutorials, mcps, agents] = await Promise.all([
    getTutorialsByTagTokens(t.matchTokens, 60),
    getMcpByTagTokens(t.matchTokens, 24),
    getAgentsByTagTokens(t.matchTokens, 24)
  ]);
  const url = `${SITE}/tags/${t.slug}`;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.title,
    url,
    description: t.description,
    numberOfItems: tutorials.length + mcps.length + agents.length,
    itemListElement: [
      ...tutorials.slice(0, 10).map((x, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/tutorials/${x.slug}`,
        name: x.title
      })),
      ...mcps
        .filter((m) => INDEX_MCP_SLUGS.has(m.slug))
        .slice(0, 5)
        .map((x, i) => ({
          '@type': 'ListItem',
          position: tutorials.length + i + 1,
          url: `${SITE}/mcp/${x.slug}`,
          name: x.name
        }))
    ]
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: SITE },
      { '@type': 'ListItem', position: 2, name: '标签合集', item: `${SITE}/tags` },
      { '@type': 'ListItem', position: 3, name: t.title, item: url }
    ]
  };

  return (
    <PageContainer pageTitle={t.title} pageDescription={t.description}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className='space-y-10'>
        {/* Intro */}
        <div className='space-y-3'>
          <Link
            href='/tags'
            className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <Icons.chevronLeft className='h-4 w-4' />
            全部标签
          </Link>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>{t.title}</h1>
          <p className='max-w-2xl text-muted-foreground'>{t.description}</p>
          <p className='text-sm text-muted-foreground'>
            {tutorials.length} 篇教程 · {mcps.length} 个 MCP Server · {agents.length} 个 Agent
          </p>
        </div>

        {/* 教程 */}
        {tutorials.length > 0 && (
          <section className='space-y-4'>
            <h2 className='text-lg font-semibold'>相关教程</h2>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {tutorials.map((tut) => (
                <Link
                  key={tut.slug}
                  href={`/tutorials/${tut.slug}`}
                  className='group flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
                >
                  <Badge variant='outline' className='w-fit text-[10px] text-muted-foreground'>
                    {LEVEL_LABEL[tut.level] ?? tut.level}
                  </Badge>
                  <h3 className='text-sm font-semibold leading-snug group-hover:text-primary transition-colors'>
                    {tut.title}
                  </h3>
                  <p className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
                    {tut.subtitle || tut.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* MCP Server：白名单内可点，其余仅展示（noindex 页不浪费内链权重） */}
        {mcps.length > 0 && (
          <section className='space-y-4'>
            <h2 className='text-lg font-semibold'>相关 MCP Server</h2>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {mcps.map((m) => {
                const indexable = INDEX_MCP_SLUGS.has(m.slug);
                const body = (
                  <>
                    <span className='flex items-center justify-between gap-2'>
                      <span className='truncate text-sm font-semibold font-mono group-hover:text-primary transition-colors'>
                        {m.name}
                      </span>
                      {(m.stars ?? 0) > 0 && (
                        <span className='shrink-0 text-[10px] text-muted-foreground'>
                          ★ {m.stars! >= 1000 ? `${(m.stars! / 1000).toFixed(1)}k` : m.stars}
                        </span>
                      )}
                    </span>
                    <span className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
                      {m.description}
                    </span>
                  </>
                );
                return indexable ? (
                  <Link
                    key={m.slug}
                    href={`/mcp/${m.slug}`}
                    className='group flex flex-col gap-1.5 rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
                  >
                    {body}
                  </Link>
                ) : (
                  <div
                    key={m.slug}
                    className='flex flex-col gap-1.5 rounded-xl border bg-card/60 p-4'
                  >
                    {body}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Agent */}
        {agents.length > 0 && (
          <section className='space-y-4'>
            <h2 className='text-lg font-semibold'>相关 Agent 工具</h2>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {agents.map((a) => {
                const aSlug = slugify(a.name);
                const indexable = INDEX_AGENT_SLUGS.has(aSlug);
                const body = (
                  <>
                    <span className='truncate text-sm font-semibold group-hover:text-primary transition-colors'>
                      {a.name}
                    </span>
                    <span className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
                      {a.description}
                    </span>
                  </>
                );
                return indexable ? (
                  <Link
                    key={a.id}
                    href={`/agents/${aSlug}`}
                    className='group flex flex-col gap-1.5 rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
                  >
                    {body}
                  </Link>
                ) : (
                  <div
                    key={a.id}
                    className='flex flex-col gap-1.5 rounded-xl border bg-card/60 p-4'
                  >
                    {body}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 其他标签 — 中枢互链 */}
        <div className='space-y-3 border-t pt-6'>
          <h2 className='text-sm font-semibold'>浏览其他标签</h2>
          <div className='flex flex-wrap gap-2'>
            {TAG_PAGES.filter((x) => x.slug !== t.slug).map((x) => (
              <Link
                key={x.slug}
                href={`/tags/${x.slug}`}
                className='rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors'
              >
                {x.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
