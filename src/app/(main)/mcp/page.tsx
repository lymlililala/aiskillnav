import PageContainer from '@/components/layout/page-container';
import { searchParamsCache } from '@/lib/searchparams';
import McpListingPage from '@/features/mcp/components/mcp-listing';
import type { SearchParams } from 'nuqs/server';
import type { Metadata } from 'next';
import { hreflangFor } from '@/features/seo/hreflang';

export async function generateMetadata(): Promise<Metadata> {
  const { resolvePageMeta } = await import('@/features/seo/api/service');
  const meta = await resolvePageMeta('/dashboard/mcp');
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: hreflangFor('/mcp'),
    openGraph: meta.openGraph,
    twitter: meta.twitter
  };
}

type PageProps = { searchParams: Promise<SearchParams> };

// ItemList 结构化数据（静态）
const mcpItemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'MCP 专区 — Model Context Protocol Server 导航',
  url: 'https://aiskillnav.com/mcp',
  description:
    'Model Context Protocol Server 精选导航，让 AI 连接文件、数据库、GitHub、Notion 等工具。'
};

export default async function McpPage({ searchParams }: PageProps) {
  await searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='MCP 专区'
      pageDescription='Model Context Protocol — AI Agent 的标准化工具接口，收录最实用的 MCP Server'
    >
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mcpItemListJsonLd) }}
      />
      <McpListingPage />
    </PageContainer>
  );
}
