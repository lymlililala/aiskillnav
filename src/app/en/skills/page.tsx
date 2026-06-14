import { Metadata } from 'next';
import { getPublishedEnglishSkills } from '@/features/skills/api/service';

export const metadata: Metadata = {
  title: 'AI Skills Directory | AI Skill Navigation',
  description: 'A curated directory of AI skills and tools for developers and teams.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/skills',
    languages: { 'zh-CN': 'https://aiskillnav.com/skills', en: 'https://aiskillnav.com/en/skills' }
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function EnSkillsPage() {
  const items = await getPublishedEnglishSkills();
  return (
    <div className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
      <header className='mb-10'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>AI Skills</h1>
        <p className='mt-3 text-lg text-muted-foreground'>Curated AI skills and tools.</p>
      </header>
      {items.length === 0 ? (
        <p className='text-muted-foreground'>Coming soon.</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target='_blank'
              rel='noopener noreferrer'
              className='group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30'
            >
              <h2 className='font-semibold leading-snug group-hover:text-primary'>{s.name}</h2>
              {s.description_en && (
                <p className='mt-2 line-clamp-3 text-sm text-muted-foreground'>
                  {s.description_en}
                </p>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
