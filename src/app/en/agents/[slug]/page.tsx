import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAgentBySlug } from '@/features/agents/api/service';
import { slugify } from '@/lib/slug';

type Props = { params: Promise<{ slug: string }> };
type EnAgent = {
  name: string;
  description?: string;
  description_en?: string | null;
  url?: string;
  en_status?: string | null;
  agent_type?: string;
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;
const SITE = 'https://aiskillnav.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = (await getAgentBySlug(slug)) as EnAgent | null;
  if (!a || a.en_status !== 'published') return { title: 'Not found' };
  const enUrl = `${SITE}/en/agents/${slug}`;
  return {
    title: `${a.name} | AI Agents | AI Skill Navigation`,
    description: a.description_en ?? undefined,
    alternates: { canonical: enUrl, languages: { 'zh-CN': `${SITE}/agents/${slug}`, en: enUrl } },
    openGraph: {
      title: a.name,
      description: a.description_en ?? undefined,
      url: enUrl,
      type: 'website',
      locale: 'en_US'
    }
  };
}

export default async function EnAgentDetailPage({ params }: Props) {
  const { slug } = await params;
  const a = (await getAgentBySlug(slug)) as EnAgent | null;
  if (!a || a.en_status !== 'published') notFound();

  return (
    <div className='mx-auto max-w-3xl px-4 py-12 md:px-6'>
      <Link
        href='/en/agents'
        className='mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground'
      >
        ← Back to agents
      </Link>
      <h1 className='text-3xl font-bold leading-tight tracking-tight'>{a.name}</h1>
      {a.description_en && (
        <p className='mt-4 text-lg leading-relaxed text-muted-foreground'>{a.description_en}</p>
      )}
      {a.url && (
        <a
          href={a.url}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'
        >
          Visit website ↗
        </a>
      )}
      <div className='mt-12 rounded-xl border bg-muted/30 p-5'>
        <p className='text-sm text-muted-foreground'>
          Also available in{' '}
          <Link href={`/agents/${slugify(a.name)}`} className='text-primary hover:underline'>
            中文
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
