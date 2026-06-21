import PageContainer from '@/components/layout/page-container';
import AgentListingPage from '@/features/agents/components/agent-listing';
import { searchParamsCache } from '@/lib/searchparams';
import type { SearchParams } from 'nuqs/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent Hub — Top AI Agent tools',
  description:
    'Browse top AI agents like Manus, Devin, OpenClaw and Dify — filter by type and compare side by side.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/agents',
    languages: { 'zh-CN': 'https://aiskillnav.com/agents', en: 'https://aiskillnav.com/en/agents' }
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const agentsItemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Agent Hub — top AI Agent tools',
  url: 'https://aiskillnav.com/en/agents',
  description: 'Top AI agents like Manus, Devin, OpenClaw and Dify — filter by type and compare.'
};

export default async function EnAgentsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Agent Hub'
      pageDescription='Top AI agents worldwide — general autonomy, deep research, build platforms, computer control, vertical creativity, proactive sensing'
    >
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentsItemListJsonLd) }}
      />
      <AgentListingPage />
    </PageContainer>
  );
}
