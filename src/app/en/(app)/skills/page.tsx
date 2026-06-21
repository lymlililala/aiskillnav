import PageContainer from '@/components/layout/page-container';
import SkillListingPage from '@/features/skills/components/skill-listing';
import Link from 'next/link';
import { SKILL_CATEGORIES } from '@/features/skills/categories';
import { searchParamsCache } from '@/lib/searchparams';
import type { SearchParams } from 'nuqs/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Skills Directory',
  description:
    'Discover, save and use community-curated AI Skills & Agent resources — official platforms, mirrors and aggregators.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/skills',
    languages: { 'zh-CN': 'https://aiskillnav.com/skills', en: 'https://aiskillnav.com/en/skills' }
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const skillsItemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'AI Skills Directory — curated AI Skill resources',
  url: 'https://aiskillnav.com/en/skills',
  description:
    'Curated global AI Skill resource sites, covering ClaWHub, OpenClaw and community aggregators — one click away.'
};

export default async function EnSkillsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='AI Skill Navigation'
      pageDescription='Discover, save and use community-curated AI Skills & Agent resources'
    >
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(skillsItemListJsonLd) }}
      />
      <div className='mb-6 space-y-2'>
        <h2 className='text-sm font-semibold'>Browse by platform</h2>
        <div className='flex flex-wrap gap-2'>
          {SKILL_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/en/skills/category/${c.slug}`}
              className='rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors'
            >
              {c.labelEn ?? c.label}
            </Link>
          ))}
        </div>
      </div>
      <SkillListingPage />
    </PageContainer>
  );
}
