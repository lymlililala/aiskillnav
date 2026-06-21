import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { PILLAR_TOPICS, getPillarTopic } from '@/features/tutorials/topics';
import { getTutorialsByTopic } from '@/features/tutorials/api/service';

type Props = { params: Promise<{ topic: string }> };

// 主题数量固定且少（~13），预渲染为静态页 + ISR，对 SEO 最友好
export function generateStaticParams() {
  return PILLAR_TOPICS.map((t) => ({ topic: t.slug }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const t = getPillarTopic(topic);
  if (!t) return { title: '主题不存在' };
  const url = `https://aiskillnav.com/tutorials/topic/${t.slug}`;
  return {
    title: `${t.title} — AI 教程合集`,
    description: t.description,
    keywords: t.matchTokens,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${t.title} — AI 教程合集`,
      description: t.description,
      siteName: 'AI Skill Navigation'
    }
  };
}

const LEVEL_LABEL: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级'
};

export default async function TopicPage({ params }: Props) {
  const { topic } = await params;
  const t = getPillarTopic(topic);
  if (!t) notFound();

  const tutorials = await getTutorialsByTopic(t.matchTokens, 100);
  const url = `https://aiskillnav.com/tutorials/topic/${t.slug}`;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${t.title} — AI 教程合集`,
    url,
    description: t.description,
    numberOfItems: tutorials.length,
    itemListElement: tutorials.slice(0, 20).map((tut, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://aiskillnav.com/tutorials/${tut.slug}`,
      name: tut.title
    }))
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: 'https://aiskillnav.com' },
      { '@type': 'ListItem', position: 2, name: '教程中心', item: 'https://aiskillnav.com/tutorials' },
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
      <div className='space-y-8'>
        {/* Intro */}
        <div className='space-y-3'>
          <Link
            href='/tutorials'
            className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <Icons.chevronLeft className='h-4 w-4' />
            全部教程
          </Link>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>{t.title}</h1>
          <p className='max-w-2xl text-muted-foreground'>{t.description}</p>
          <p className='text-sm text-muted-foreground'>本主题共 {tutorials.length} 篇教程</p>
        </div>

        {/* Tutorials grid */}
        {tutorials.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <Icons.post className='mb-3 h-10 w-10 text-muted-foreground/40' />
            <p className='text-sm text-muted-foreground'>该主题暂无教程</p>
          </div>
        ) : (
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
                <h2 className='text-sm font-semibold leading-snug group-hover:text-primary transition-colors'>
                  {tut.title}
                </h2>
                <p className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
                  {tut.subtitle || tut.summary}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Other topics — pillar 互链 */}
        <div className='space-y-3 border-t pt-6'>
          <h2 className='text-sm font-semibold'>浏览其他主题</h2>
          <div className='flex flex-wrap gap-2'>
            {PILLAR_TOPICS.filter((x) => x.slug !== t.slug).map((x) => (
              <Link
                key={x.slug}
                href={`/tutorials/topic/${x.slug}`}
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
