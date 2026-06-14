import { Metadata } from 'next';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { slugify } from '@/lib/slug';
import { getPublishedEnglishAgents } from '@/features/agents/api/service';

export const metadata: Metadata = {
  title: 'AI Agents Directory | AI Skill Navigation',
  description: 'Discover AI agents and autonomous tools across categories.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/agents',
    languages: { 'zh-CN': 'https://aiskillnav.com/agents', en: 'https://aiskillnav.com/en/agents' }
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function EnAgentsPage() {
  const items = await getPublishedEnglishAgents();
  return (
    <PageContainer
      pageTitle='Agents'
      pageDescription='Top AI agents and autonomous frameworks — filter and compare.'
    >
      {items.length === 0 ? (
        <p className='text-sm text-muted-foreground'>Coming soon.</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((a) => {
            const slug = slugify(a.name);
            const inner = (
              <>
                <h2 className='text-sm font-semibold leading-snug transition-colors group-hover:text-primary'>
                  {a.name}
                </h2>
                {a.description_en && (
                  <p className='line-clamp-3 text-xs leading-relaxed text-muted-foreground'>
                    {a.description_en}
                  </p>
                )}
              </>
            );
            return slug ? (
              <Link
                key={a.id}
                href={`/en/agents/${slug}`}
                className='group flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'
              >
                {inner}
              </Link>
            ) : (
              <div
                key={a.id}
                className='flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm'
              >
                {inner}
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
