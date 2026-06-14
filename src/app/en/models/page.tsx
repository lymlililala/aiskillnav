import { Metadata } from 'next';
import Link from 'next/link';
import { slugify } from '@/lib/slug';
import { getPublishedEnglishModels } from '@/features/models/api/service';

export const metadata: Metadata = {
  title: 'AI Models Comparison | AI Skill Navigation',
  description: 'Compare leading AI models — capabilities, pricing and context windows.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/models',
    languages: { 'zh-CN': 'https://aiskillnav.com/models', en: 'https://aiskillnav.com/en/models' }
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function EnModelsPage() {
  const items = await getPublishedEnglishModels();
  return (
    <div className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
      <header className='mb-10'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>AI Models</h1>
        <p className='mt-3 text-lg text-muted-foreground'>Compare leading AI models.</p>
      </header>
      {items.length === 0 ? (
        <p className='text-muted-foreground'>Coming soon.</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((m) => {
            const slug = slugify(m.name);
            const inner = (
              <>
                <h2 className='font-semibold leading-snug group-hover:text-primary'>{m.name}</h2>
                {m.vendor && <p className='mt-0.5 text-xs text-muted-foreground'>{m.vendor}</p>}
                {m.description_en && (
                  <p className='mt-2 line-clamp-3 text-sm text-muted-foreground'>
                    {m.description_en}
                  </p>
                )}
              </>
            );
            return slug ? (
              <Link
                key={m.id}
                href={`/en/models/${slug}`}
                className='group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30'
              >
                {inner}
              </Link>
            ) : (
              <div key={m.id} className='rounded-xl border bg-card p-5 shadow-sm'>
                {inner}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
