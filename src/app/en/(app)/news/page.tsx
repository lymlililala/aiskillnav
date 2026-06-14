import { Metadata } from 'next';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { getPublishedEnglishNews } from '@/features/news/api/service';

export const metadata: Metadata = {
  title: 'AI News in English | AI Skill Navigation',
  description: 'Latest AI industry news and analysis — models, frameworks, tools and funding.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/news',
    languages: { 'zh-CN': 'https://aiskillnav.com/news', en: 'https://aiskillnav.com/en/news' }
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function EnNewsListPage() {
  const items = await getPublishedEnglishNews();
  return (
    <PageContainer
      pageTitle='AI News'
      pageDescription='Latest developments across the AI landscape.'
    >
      {items.length === 0 ? (
        <p className='text-sm text-muted-foreground'>English news is coming soon.</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((n) => (
            <Link
              key={n.slug}
              href={`/en/news/${n.slug}`}
              className='group flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'
            >
              <div className='flex items-center gap-2 text-[10px] text-muted-foreground'>
                <span className='rounded border bg-muted/50 px-1.5 py-0.5'>{n.category}</span>
                <span>
                  {new Date(n.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <h2 className='text-sm font-semibold leading-snug transition-colors group-hover:text-primary'>
                {n.title_en}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
