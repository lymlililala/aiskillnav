import { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedEnglishTutorials } from '@/features/tutorials/api/service';

export const metadata: Metadata = {
  title: 'AI Tutorials in English | AI Skill Navigation',
  description:
    'In-depth, practical AI engineering tutorials in English — RAG, agents, model comparisons, deployment, fine-tuning and more.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/tutorials',
    languages: { 'zh-CN': 'https://aiskillnav.com/tutorials', en: 'https://aiskillnav.com/en/tutorials' }
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function EnTutorialsListPage() {
  const tutorials = await getPublishedEnglishTutorials();

  return (
    <div className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
      <header className='mb-10'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>AI Tutorials</h1>
        <p className='mt-3 text-lg text-muted-foreground'>
          Practical, in-depth guides for AI engineers.
        </p>
      </header>

      {tutorials.length === 0 ? (
        <p className='text-muted-foreground'>English tutorials are coming soon.</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {tutorials.map((t) => (
            <Link
              key={t.slug}
              href={`/en/tutorials/${t.slug}`}
              className='group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30'
            >
              <h2 className='font-semibold leading-snug group-hover:text-primary'>{t.title_en}</h2>
              {t.summary_en && (
                <p className='mt-2 line-clamp-3 text-sm text-muted-foreground'>{t.summary_en}</p>
              )}
              <div className='mt-3 flex flex-wrap items-center gap-1.5'>
                {(t.tags ?? []).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className='rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground'
                  >
                    {tag}
                  </span>
                ))}
                {t.estimated_minutes ? (
                  <span className='ml-auto text-xs text-muted-foreground'>
                    {t.estimated_minutes} min
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
