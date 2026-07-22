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
import type { Tutorial } from '@/constants/mock-api-tutorials';

type Props = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return TAG_PAGES.map((t) => ({ tag: t.slug }));
}

export const revalidate = 3600;

const SITE = 'https://aiskillnav.com';

// DB 运行时携带的英文字段（Tutorial 类型未声明，同 EnglishTutorial 约定）
type EnFields = {
  title_en?: string | null;
  subtitle_en?: string | null;
  summary_en?: string | null;
  en_status?: string | null;
};
type EnMcpFields = { en_status?: string | null };
type EnAgentFields = { en_status?: string | null };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const t = getTagPage(tag);
  if (!t) return { title: 'Tag not found' };
  const enUrl = `${SITE}/en/tags/${t.slug}`;
  const zhUrl = `${SITE}/tags/${t.slug}`;
  return {
    title: `${t.titleEn} — Guides & Resources`,
    description: t.descriptionEn,
    keywords: t.matchTokens,
    alternates: {
      canonical: enUrl,
      languages: { 'zh-CN': zhUrl, en: enUrl, 'x-default': zhUrl }
    },
    openGraph: {
      type: 'website',
      url: enUrl,
      title: t.titleEn,
      description: t.descriptionEn,
      siteName: 'AI Skill Navigation',
      locale: 'en_US'
    }
  };
}

const LEVEL_LABEL: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced'
};

export default async function EnTagHubPage({ params }: Props) {
  const { tag } = await params;
  const t = getTagPage(tag);
  if (!t) notFound();

  // 英文页只展示已发布英文版的内容（与各 EN 详情页的渲染门槛一致）
  const [tutorialsAll, mcpsAll, agentsAll] = await Promise.all([
    getTutorialsByTagTokens(t.matchTokens, 60),
    getMcpByTagTokens(t.matchTokens, 24),
    getAgentsByTagTokens(t.matchTokens, 24)
  ]);
  const tutorials = tutorialsAll.filter(
    (x): x is Tutorial & EnFields => (x as Tutorial & EnFields).en_status === 'published'
  );
  const mcps = mcpsAll.filter(
    (m) => (m as typeof m & EnMcpFields).en_status === 'published' && INDEX_MCP_SLUGS.has(m.slug)
  );
  const agents = agentsAll.filter(
    (a) =>
      (a as typeof a & EnAgentFields).en_status === 'published' &&
      INDEX_AGENT_SLUGS.has(slugify(a.name))
  );
  const enUrl = `${SITE}/en/tags/${t.slug}`;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.titleEn,
    url: enUrl,
    description: t.descriptionEn,
    numberOfItems: tutorials.length + mcps.length + agents.length,
    itemListElement: [
      ...tutorials.slice(0, 10).map((x, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/en/tutorials/${x.slug}`,
        name: (x as Tutorial & EnFields).title_en ?? x.title
      })),
      ...mcps.slice(0, 5).map((x, i) => ({
        '@type': 'ListItem',
        position: tutorials.length + i + 1,
        url: `${SITE}/en/mcp/${x.slug}`,
        name: x.name
      }))
    ]
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/en` },
      { '@type': 'ListItem', position: 2, name: 'Tag Hubs', item: `${SITE}/en/tags` },
      { '@type': 'ListItem', position: 3, name: t.titleEn, item: enUrl }
    ]
  };

  return (
    <PageContainer pageTitle={t.titleEn} pageDescription={t.descriptionEn}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className='space-y-10'>
        <div className='space-y-3'>
          <Link
            href='/en/tags'
            className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <Icons.chevronLeft className='h-4 w-4' />
            All tags
          </Link>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>{t.titleEn}</h1>
          <p className='max-w-2xl text-muted-foreground'>{t.descriptionEn}</p>
          <p className='text-sm text-muted-foreground'>
            {tutorials.length} tutorials · {mcps.length} MCP servers · {agents.length} agents
          </p>
        </div>

        {tutorials.length > 0 && (
          <section className='space-y-4'>
            <h2 className='text-lg font-semibold'>Related tutorials</h2>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {tutorials.map((tut) => (
                <Link
                  key={tut.slug}
                  href={`/en/tutorials/${tut.slug}`}
                  className='group flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
                >
                  <Badge variant='outline' className='w-fit text-[10px] text-muted-foreground'>
                    {LEVEL_LABEL[tut.level] ?? tut.level}
                  </Badge>
                  <h3 className='text-sm font-semibold leading-snug group-hover:text-primary transition-colors'>
                    {(tut as Tutorial & EnFields).title_en ?? tut.title}
                  </h3>
                  <p className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
                    {(tut as Tutorial & EnFields).subtitle_en ??
                      (tut as Tutorial & EnFields).summary_en ??
                      tut.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {mcps.length > 0 && (
          <section className='space-y-4'>
            <h2 className='text-lg font-semibold'>Related MCP servers</h2>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {mcps.map((m) => (
                <Link
                  key={m.slug}
                  href={`/en/mcp/${m.slug}`}
                  className='group flex flex-col gap-1.5 rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
                >
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
                    {m.description_en ?? m.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {agents.length > 0 && (
          <section className='space-y-4'>
            <h2 className='text-lg font-semibold'>Related agent tools</h2>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {agents.map((a) => (
                <Link
                  key={a.id}
                  href={`/en/agents/${slugify(a.name)}`}
                  className='group flex flex-col gap-1.5 rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
                >
                  <span className='truncate text-sm font-semibold group-hover:text-primary transition-colors'>
                    {a.name}
                  </span>
                  <span className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
                    {a.description_en ?? a.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className='space-y-3 border-t pt-6'>
          <h2 className='text-sm font-semibold'>Browse other tags</h2>
          <div className='flex flex-wrap gap-2'>
            {TAG_PAGES.filter((x) => x.slug !== t.slug).map((x) => (
              <Link
                key={x.slug}
                href={`/en/tags/${x.slug}`}
                className='rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors'
              >
                {x.titleEn}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
