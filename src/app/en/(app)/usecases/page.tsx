import { Metadata } from 'next';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
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
    <PageContainer
      pageTitle='Use Cases'
      pageDescription='Actionable, step-by-step AI workflows with recommended tool stacks.'
    >
      {items.length === 0 ? (
        <p className='text-sm text-muted-foreground'>English use cases are coming soon.</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((u) => (
            <Link
              key={u.id}
              href={`/en/usecases/${u.id}`}
              className='group flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'
            >
              <h2 className='text-sm font-semibold leading-snug transition-colors group-hover:text-primary'>
                {u.title_en}
              </h2>
              {u.description_en && (
                <p className='line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground'>
                  {u.description_en}
                </p>
              )}
              <div className='flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground'>
                <span className='rounded border bg-muted/50 px-1.5 py-0.5'>
                  {INDUSTRY[u.industry] ?? u.industry}
                </span>
                <span className='rounded border bg-muted/50 px-1.5 py-0.5'>
                  {DIFFICULTY[u.difficulty] ?? u.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
