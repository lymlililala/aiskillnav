import { Metadata } from 'next';
import PageContainer from '@/components/layout/page-container';
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
    <PageContainer
      pageTitle='Skills'
      pageDescription='Curated AI skills and tools — one click away.'
    >
      {items.length === 0 ? (
        <p className='text-sm text-muted-foreground'>Coming soon.</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target='_blank'
              rel='noopener noreferrer'
              className='group flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'
            >
              <h2 className='text-sm font-semibold leading-snug transition-colors group-hover:text-primary'>
                {s.name}
              </h2>
              {s.description_en && (
                <p className='line-clamp-3 text-xs leading-relaxed text-muted-foreground'>
                  {s.description_en}
                </p>
              )}
            </a>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
