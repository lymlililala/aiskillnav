import { Metadata } from 'next';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
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
    <PageContainer
      pageTitle='Models'
      pageDescription='Compare leading AI models — capabilities, pricing and context windows.'
    >
      {items.length === 0 ? (
        <p className='text-sm text-muted-foreground'>Coming soon.</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((m) => {
            const slug = slugify(m.name);
            const inner = (
              <>
                <h2 className='text-sm font-semibold leading-snug transition-colors group-hover:text-primary'>
                  {m.name}
                </h2>
                {m.vendor && <p className='text-[10px] text-muted-foreground'>{m.vendor}</p>}
                {m.description_en && (
                  <p className='line-clamp-3 text-xs leading-relaxed text-muted-foreground'>
                    {m.description_en}
                  </p>
                )}
              </>
            );
            return slug ? (
              <Link
                key={m.id}
                href={`/en/models/${slug}`}
                className='group flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'
              >
                {inner}
              </Link>
            ) : (
              <div
                key={m.id}
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
