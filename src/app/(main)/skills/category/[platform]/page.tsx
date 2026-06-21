import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { SKILL_CATEGORIES, getSkillCategory } from '@/features/skills/categories';
import { getSitesByPlatform } from '@/features/skills/api/service';

type Props = { params: Promise<{ platform: string }> };

// 分类固定（6 个），预渲染为静态页 + ISR
export function generateStaticParams() {
  return SKILL_CATEGORIES.map((c) => ({ platform: c.slug }));
}

export const revalidate = 3600;

const REGION_LABEL: Record<string, string> = { global: '全球', cn: '国内' };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  const cat = getSkillCategory(platform);
  if (!cat) return { title: '分类不存在' };
  const url = `https://aiskillnav.com/skills/category/${cat.slug}`;
  return {
    title: `${cat.label} — AI Skill 资源站合集`,
    description: cat.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${cat.label} — AI Skill 资源站合集`,
      description: cat.description,
      siteName: 'AI Skill Navigation'
    }
  };
}

export default async function SkillCategoryPage({ params }: Props) {
  const { platform } = await params;
  const cat = getSkillCategory(platform);
  if (!cat) notFound();

  const sites = await getSitesByPlatform(cat.slug, 100);
  const url = `https://aiskillnav.com/skills/category/${cat.slug}`;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cat.label} — AI Skill 资源站合集`,
    url,
    description: cat.description,
    numberOfItems: sites.length,
    itemListElement: sites.slice(0, 20).map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: s.url,
      name: s.name
    }))
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: 'https://aiskillnav.com' },
      { '@type': 'ListItem', position: 2, name: 'AI Skills', item: 'https://aiskillnav.com/skills' },
      { '@type': 'ListItem', position: 3, name: cat.label, item: url }
    ]
  };

  return (
    <PageContainer pageTitle={cat.label} pageDescription={cat.description}>
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
            href='/skills'
            className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <Icons.chevronLeft className='h-4 w-4' />
            全部 Skills
          </Link>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>{cat.label}</h1>
          <p className='max-w-2xl text-muted-foreground'>{cat.description}</p>
          <p className='text-sm text-muted-foreground'>本分类共 {sites.length} 个站点</p>
        </div>

        {/* Sites grid（外链官网） */}
        {sites.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <Icons.skillsHub className='mb-3 h-10 w-10 text-muted-foreground/40' />
            <p className='text-sm text-muted-foreground'>该分类暂无站点</p>
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
                    {s.name}
                  </h2>
                  <Badge variant='outline' className='shrink-0 text-[10px] text-muted-foreground'>
                    {REGION_LABEL[s.region] ?? s.region}
                  </Badge>
                </div>
                <p className='line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground'>
                  {s.description}
                </p>
                <span className='flex items-center gap-1 text-[11px] text-muted-foreground/60 group-hover:text-primary transition-colors'>
                  访问 <Icons.externalLink className='h-3 w-3' />
                </span>
              </a>
            ))}
          </div>
        )}

        {/* 其他分类 — 互链 */}
        <div className='space-y-3 border-t pt-6'>
          <h2 className='text-sm font-semibold'>其他分类</h2>
          <div className='flex flex-wrap gap-2'>
            {SKILL_CATEGORIES.filter((x) => x.slug !== cat.slug).map((x) => (
              <Link
                key={x.slug}
                href={`/skills/category/${x.slug}`}
                className='rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors'
              >
                {x.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
