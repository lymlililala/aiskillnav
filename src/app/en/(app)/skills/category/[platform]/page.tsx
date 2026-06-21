import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { SKILL_CATEGORIES, getSkillCategory } from '@/features/skills/categories';
import { getSitesByPlatform } from '@/features/skills/api/service';

type Props = { params: Promise<{ platform: string }> };

export function generateStaticParams() {
  return SKILL_CATEGORIES.map((c) => ({ platform: c.slug }));
}

export const revalidate = 3600;

const REGION_LABEL: Record<string, string> = { global: 'Global', cn: 'China' };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  const cat = getSkillCategory(platform);
  if (!cat) return { title: 'Category not found' };
  const url = `https://aiskillnav.com/en/skills/category/${cat.slug}`;
  return {
    title: `${cat.labelEn} — AI Skill resource sites`,
    description: cat.descriptionEn,
    alternates: {
      canonical: url,
      languages: {
        'zh-CN': `https://aiskillnav.com/skills/category/${cat.slug}`,
        en: url
      }
    },
    openGraph: {
      type: 'website',
      url,
      title: `${cat.labelEn} — AI Skill resource sites`,
      description: cat.descriptionEn,
      siteName: 'AI Skill Navigation',
      locale: 'en_US'
    }
  };
}

export default async function EnSkillCategoryPage({ params }: Props) {
  const { platform } = await params;
  const cat = getSkillCategory(platform);
  if (!cat) notFound();

  const sites = await getSitesByPlatform(cat.slug, 100);
  const url = `https://aiskillnav.com/en/skills/category/${cat.slug}`;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cat.labelEn} — AI Skill resource sites`,
    url,
    description: cat.descriptionEn,
    numberOfItems: sites.length,
    itemListElement: sites.slice(0, 20).map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: s.url,
      name: s.name_en || s.name
    }))
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aiskillnav.com/en' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'AI Skills',
        item: 'https://aiskillnav.com/en/skills'
      },
      { '@type': 'ListItem', position: 3, name: cat.labelEn, item: url }
    ]
  };

  return (
    <PageContainer pageTitle={cat.labelEn} pageDescription={cat.descriptionEn}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className='space-y-8'>
        {/* Intro */}
        <div className='space-y-3'>
          <Link
            href='/en/skills'
            className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <Icons.chevronLeft className='h-4 w-4' />
            All Skills
          </Link>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>{cat.labelEn}</h1>
          <p className='max-w-2xl text-muted-foreground'>{cat.descriptionEn}</p>
          <p className='text-sm text-muted-foreground'>{sites.length} sites in this category</p>
        </div>

        {/* Sites grid（外链官网） */}
        {sites.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <Icons.skillsHub className='mb-3 h-10 w-10 text-muted-foreground/40' />
            <p className='text-sm text-muted-foreground'>No sites in this category yet</p>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {sites.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target='_blank'
                rel='noopener noreferrer'
                className='group flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
              >
                <div className='flex items-start justify-between gap-2'>
                  <h2 className='text-sm font-semibold leading-snug group-hover:text-primary transition-colors'>
                    {s.name_en || s.name}
                  </h2>
                  <Badge variant='outline' className='shrink-0 text-[10px] text-muted-foreground'>
                    {REGION_LABEL[s.region] ?? s.region}
                  </Badge>
                </div>
                <p className='line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground'>
                  {s.description_en || s.description}
                </p>
                <span className='flex items-center gap-1 text-[11px] text-muted-foreground/60 group-hover:text-primary transition-colors'>
                  Visit <Icons.externalLink className='h-3 w-3' />
                </span>
              </a>
            ))}
          </div>
        )}

        {/* 其他分类 — 互链 */}
        <div className='space-y-3 border-t pt-6'>
          <h2 className='text-sm font-semibold'>Other categories</h2>
          <div className='flex flex-wrap gap-2'>
            {SKILL_CATEGORIES.filter((x) => x.slug !== cat.slug).map((x) => (
              <Link
                key={x.slug}
                href={`/en/skills/category/${x.slug}`}
                className='rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors'
              >
                {x.labelEn}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
