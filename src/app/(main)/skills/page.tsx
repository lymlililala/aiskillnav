import PageContainer from '@/components/layout/page-container';
import SkillListingPage from '@/features/skills/components/skill-listing';
import { searchParamsCache } from '@/lib/searchparams';
import type { SearchParams } from 'nuqs/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { resolvePageMeta } = await import('@/features/seo/api/service');
  const meta = await resolvePageMeta('/dashboard/skills');
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: 'https://aiskillnav.com/skills' },
    openGraph: meta.openGraph,
    twitter: meta.twitter
  };
}

type PageProps = {
  searchParams: Promise<SearchParams>;
};

// ItemList 结构化数据（静态，指向频道入口）
const skillsItemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'AI Skills 导航 — 精选 AI Skill 资源站',
  url: 'https://aiskillnav.com/skills',
  description: '精选全球 AI Skill 资源站，覆盖 ClaWHub、OpenClaw 等官方平台及社区聚合站，一键直达。'
};

export default async function SkillsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='AI Skill Navigation'
      pageDescription='汇聚 AI Skills & Agent 资源，发现、收藏并使用社区精选工具'
    >
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(skillsItemListJsonLd) }}
      />
      <SkillListingPage />
    </PageContainer>
  );
}
