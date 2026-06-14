import { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedEnglishUseCases } from '@/features/usecases/api/service';

export const metadata: Metadata = {
  title: 'AI Use Cases in English | AI Skill Navigation',
  description:
    'Practical, step-by-step AI use cases across marketing, engineering, research and productivity.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/usecases',
    languages: {
      'zh-CN': 'https://aiskillnav.com/usecases',
      en: 'https://aiskillnav.com/en/usecases'
    }
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const INDUSTRY: Record<string, string> = {
  marketing: 'Marketing',
  engineering: 'Engineering',
  research: 'Research',
  productivity: 'Productivity',
  industry: 'Industry'
};
const DIFFICULTY: Record<number, string> = { 1: 'Easy', 2: 'Medium', 3: 'Advanced' };

export default async function EnUseCasesListPage() {
  const items = await getPublishedEnglishUseCases();
  return (
    <div className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
      <header className='mb-10'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>AI Use Cases</h1>
        <p className='mt-3 text-lg text-muted-foreground'>Actionable, step-by-step AI workflows.</p>
      </header>
      {items.length === 0 ? (
        <p className='text-muted-foreground'>English use cases are coming soon.</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((u) => (
            <Link
              key={u.id}
              href={`/en/usecases/${u.id}`}
              className='group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30'
            >
              <h2 className='font-semibold leading-snug group-hover:text-primary'>{u.title_en}</h2>
              {u.description_en && (
                <p className='mt-2 line-clamp-3 text-sm text-muted-foreground'>
                  {u.description_en}
                </p>
              )}
              <div className='mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground'>
                <span className='rounded-md border bg-muted/50 px-2 py-0.5'>
                  {INDUSTRY[u.industry] ?? u.industry}
                </span>
                <span className='rounded-md border bg-muted/50 px-2 py-0.5'>
                  {DIFFICULTY[u.difficulty] ?? u.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
