import PageContainer from '@/components/layout/page-container';
import { searchParamsCache } from '@/lib/searchparams';
import McpListingPage from '@/features/mcp/components/mcp-listing';
import type { SearchParams } from 'nuqs/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MCP Servers Directory',
  description:
    'Curated Model Context Protocol (MCP) servers — connect AI to files, databases, GitHub, Notion and more.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/mcp',
    languages: { 'zh-CN': 'https://aiskillnav.com/mcp', en: 'https://aiskillnav.com/en/mcp' }
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

type PageProps = { searchParams: Promise<SearchParams> };

const mcpItemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'MCP Hub — Model Context Protocol server directory',
  url: 'https://aiskillnav.com/en/mcp',
  description:
    'A curated directory of Model Context Protocol servers connecting AI to files, databases, GitHub, Notion and more.'
};

export default async function EnMcpPage({ searchParams }: PageProps) {
  await searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='MCP Servers'
      pageDescription='Model Context Protocol — the standard tool interface for AI Agents; a curated directory of the most useful MCP Servers'
    >
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mcpItemListJsonLd) }}
      />
      <McpListingPage />
    </PageContainer>
  );
}
