import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUseCaseById, type EnglishUseCase } from '@/features/usecases/api/service';

type Props = { params: Promise<{ id: string }> };

export const dynamic = 'force-dynamic';
export const revalidate = 3600;
const SITE = 'https://aiskillnav.com';

const INDUSTRY: Record<string, string> = {
  marketing: 'Marketing',
  engineering: 'Engineering',
  research: 'Research',
  productivity: 'Productivity',
  industry: 'Industry'
};
const DIFFICULTY: Record<number, string> = { 1: 'Easy', 2: 'Medium', 3: 'Advanced' };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const u = (await getUseCaseById(Number(id))) as EnglishUseCase | null;
  if (!u || !u.description_en || u.en_status !== 'published') return { title: 'Not found' };
  const enUrl = `${SITE}/en/usecases/${id}`;
  const zhUrl = `${SITE}/usecases/${id}`;
  return {
    title: `${u.title_en} — AI Use Case | AI Skill Navigation`,
    description: u.description_en ?? undefined,
    keywords: u.tags,
    alternates: { canonical: enUrl, languages: { 'zh-CN': zhUrl, en: enUrl, 'x-default': zhUrl } },
    openGraph: {
      title: u.title_en ?? undefined,
      description: u.description_en ?? undefined,
      url: enUrl,
      type: 'article',
      locale: 'en_US'
    }
  };
}

export default async function EnUseCaseDetailPage({ params }: Props) {
  const { id } = await params;
  const u = (await getUseCaseById(Number(id))) as EnglishUseCase | null;
  if (!u || !u.description_en || u.en_status !== 'published') notFound();

  const steps = Array.isArray(u.steps_en) && u.steps_en.length ? u.steps_en : [];
  const enUrl = `${SITE}/en/usecases/${id}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: u.title_en,
    description: u.description_en,
    inLanguage: 'en',
    ...(u.estimated_time ? { totalTime: u.estimated_time } : {}),
    step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s }))
  };

  return (
    <article className='mx-auto max-w-3xl px-4 py-12 md:px-6'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href='/en/usecases'
        className='mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground'
      >
        ← Back to use cases
      </Link>
      <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
        <span className='rounded-md border bg-muted/50 px-2 py-0.5'>
          {INDUSTRY[u.industry] ?? u.industry}
        </span>
        <span className='rounded-md border bg-muted/50 px-2 py-0.5'>
          {DIFFICULTY[u.difficulty] ?? u.difficulty}
        </span>
        {u.estimated_time && <span>{u.estimated_time}</span>}
      </div>
      <h1 className='mt-3 text-3xl font-bold leading-tight tracking-tight'>{u.title_en}</h1>
      <p className='mt-4 text-lg leading-relaxed text-muted-foreground'>{u.description_en}</p>

      {steps.length > 0 && (
        <section className='mt-10'>
          <h2 className='mb-4 text-xl font-semibold'>Steps</h2>
          <ol className='space-y-3'>
            {steps.map((s, i) => (
              <li key={i} className='flex gap-3 rounded-xl border bg-card p-4'>
                <span className='flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground'>
                  {i + 1}
                </span>
                <p className='text-sm leading-relaxed'>{s}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {Array.isArray(u.tools) && u.tools.length > 0 && (
        <section className='mt-8'>
          <h2 className='mb-3 text-xl font-semibold'>Recommended tools</h2>
          <div className='flex flex-wrap gap-2'>
            {u.tools.map((t) => (
              <span
                key={t}
                className='rounded-md border bg-muted/50 px-2.5 py-1 text-sm text-muted-foreground'
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className='mt-12 rounded-xl border bg-muted/30 p-5'>
        <p className='text-sm text-muted-foreground'>
          Also available in{' '}
          <Link href={`/usecases/${id}`} className='text-primary hover:underline'>
            中文
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
