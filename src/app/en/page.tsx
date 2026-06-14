import { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedEnglishTutorials } from '@/features/tutorials/api/service';

export const metadata: Metadata = {
  title: 'AI Skill Navigation — Curated AI Tools, Models & Tutorials',
  description:
    'AI Skill Navigation (aiskillnav.com) is a navigation hub for AI Agent tools, MCP servers, model comparisons and in-depth tutorials — helping developers and teams discover and use AI effectively.',
  alternates: {
    canonical: 'https://aiskillnav.com/en',
    languages: { 'zh-CN': 'https://aiskillnav.com', en: 'https://aiskillnav.com/en', 'x-default': 'https://aiskillnav.com' }
  },
  openGraph: {
    title: 'AI Skill Navigation — Curated AI Tools, Models & Tutorials',
    description: 'A navigation hub for AI Agent tools, models and in-depth tutorials.',
    url: 'https://aiskillnav.com/en',
    type: 'website',
    locale: 'en_US'
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function EnHomePage() {
  const tutorials = await getPublishedEnglishTutorials();

  return (
    <div className='mx-auto max-w-6xl px-4 py-16 md:px-6'>
      {/* Hero */}
      <section className='text-center'>
        <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
          Navigate the AI tooling landscape
        </h1>
        <p className='mx-auto mt-5 max-w-2xl text-lg text-muted-foreground'>
          In-depth, practical tutorials and comparisons for AI engineers — RAG, agents, model
          selection, deployment and more. Curated and written for developers.
        </p>
        <div className='mt-8 flex justify-center gap-3'>
          <Link
            href='/en/tutorials'
            className='rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'
          >
            Browse tutorials
          </Link>
          <Link
            href='/en/about'
            className='rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent'
          >
            About us
          </Link>
        </div>
      </section>

      {/* Featured tutorials */}
      {tutorials.length > 0 && (
        <section className='mt-20'>
          <h2 className='text-2xl font-bold'>Latest tutorials</h2>
          <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {tutorials.slice(0, 12).map((t) => (
              <Link
                key={t.slug}
                href={`/en/tutorials/${t.slug}`}
                className='group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30'
              >
                <h3 className='font-semibold leading-snug group-hover:text-primary'>
                  {t.title_en}
                </h3>
                {t.summary_en && (
                  <p className='mt-2 line-clamp-3 text-sm text-muted-foreground'>{t.summary_en}</p>
                )}
                <div className='mt-3 flex flex-wrap gap-1.5'>
                  {(t.tags ?? []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className='rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
