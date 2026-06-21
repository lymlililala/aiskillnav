import PageContainer from '@/components/layout/page-container';
import AgentListingPage from '@/features/agents/components/agent-listing';
import { searchParamsCache } from '@/lib/searchparams';
import type { SearchParams } from 'nuqs/server';
import type { Metadata } from 'next';
import { hreflangFor } from '@/features/seo/hreflang';

export async function generateMetadata(): Promise<Metadata> {
  const { resolvePageMeta } = await import('@/features/seo/api/service');
  const meta = await resolvePageMeta('/dashboard/agents');
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: hreflangFor('/agents'),
    openGraph: meta.openGraph,
    twitter: meta.twitter
  };
}

type PageProps = {
  searchParams: Promise<SearchParams>;
};

// ItemList 结构化数据（静态）
const agentsItemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Agent Hub — 全球顶级 AI Agent 工具导航',
  url: 'https://aiskillnav.com/agents',
  description: '汇聚 Manus、Devin、OpenClaw、Dify 等全球顶级 AI Agent 工具，支持类型筛选和对比。'
};

export default async function AgentsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Agent Hub'
      pageDescription='汇聚全球优秀 AI Agent — 通用自主、深度研究、构建平台、电脑操控、垂直创意、主动感知'
    >
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentsItemListJsonLd) }}
      />
      <AgentListingPage />
    </PageContainer>
  );
}
