import { Metadata } from 'next';
import Link from 'next/link';
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
    <div className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
      <header className='mb-10'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>AI Agents</h1>
        <p className='mt-3 text-lg text-muted-foreground'>Autonomous AI agents and frameworks.</p>
      </header>
      {items.length === 0 ? (
        <p className='text-muted-foreground'>Coming soon.</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((a) => {
            const slug = slugify(a.name);
            const inner = (
              <>
                <h2 className='font-semibold leading-snug group-hover:text-primary'>{a.name}</h2>
                {a.description_en && (
                  <p className='mt-2 line-clamp-3 text-sm text-muted-foreground'>
                    {a.description_en}
                  </p>
                )}
              </>
            );
            return slug ? (
              <Link
                key={a.id}
                href={`/en/agents/${slug}`}
                className='group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30'
              >
                {inner}
              </Link>
            ) : (
              <div key={a.id} className='rounded-xl border bg-card p-5 shadow-sm'>
                {inner}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
