import { Metadata } from 'next';
import Link from 'next/link';
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
    <div className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
      <header className='mb-10'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>AI News</h1>
        <p className='mt-3 text-lg text-muted-foreground'>
          Latest developments across the AI landscape.
        </p>
      </header>
      {items.length === 0 ? (
        <p className='text-muted-foreground'>English news is coming soon.</p>
      ) : (
        <div className='space-y-4'>
          {items.map((n) => (
            <Link
              key={n.slug}
              href={`/en/news/${n.slug}`}
              className='group block rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30'
            >
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <span className='rounded-md border bg-muted/50 px-2 py-0.5'>{n.category}</span>
                <span>
                  {new Date(n.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <h2 className='mt-2 font-semibold leading-snug group-hover:text-primary'>
                {n.title_en}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
