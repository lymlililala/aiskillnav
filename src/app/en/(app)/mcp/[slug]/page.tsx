import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMcpBySlug } from '@/features/mcp/api/service';

type Props = { params: Promise<{ slug: string }> };
type EnMcp = {
  name: string;
  slug: string;
  description?: string;
  description_en?: string | null;
  url?: string;
  install_cmd?: string;
  en_status?: string | null;
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;
const SITE = 'https://aiskillnav.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = (await getMcpBySlug(slug)) as EnMcp | null;
  if (!m || m.en_status !== 'published') return { title: 'Not found' };
  const enUrl = `${SITE}/en/mcp/${slug}`;
  return {
    title: `${m.name} | MCP Servers | AI Skill Navigation`,
    description: m.description_en ?? undefined,
    alternates: { canonical: enUrl, languages: { 'zh-CN': `${SITE}/mcp/${slug}`, en: enUrl } },
    openGraph: {
      title: m.name,
      description: m.description_en ?? undefined,
      url: enUrl,
      type: 'website',
      locale: 'en_US'
    }
  };
}

export default async function EnMcpDetailPage({ params }: Props) {
  const { slug } = await params;
  const m = (await getMcpBySlug(slug)) as EnMcp | null;
  if (!m || m.en_status !== 'published') notFound();

  return (
    <div className='mx-auto max-w-3xl px-4 py-12 md:px-6'>
      <Link
        href='/en/mcp'
        className='mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground'
      >
        ← Back to MCP servers
      </Link>
      <h1 className='font-mono text-2xl font-bold leading-tight'>{m.name}</h1>
      {m.description_en && (
        <p className='mt-4 text-lg leading-relaxed text-muted-foreground'>{m.description_en}</p>
      )}
      {m.install_cmd && (
        <div className='mt-6'>
          <p className='mb-2 text-sm font-medium'>Install</p>
          <pre className='overflow-x-auto rounded-lg bg-muted px-4 py-3 text-sm font-mono'>
            <code>{m.install_cmd}</code>
          </pre>
        </div>
      )}
      {m.url && (
        <a
          href={m.url}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'
        >
          Visit repository ↗
        </a>
      )}
      <div className='mt-12 rounded-xl border bg-muted/30 p-5'>
        <p className='text-sm text-muted-foreground'>
          Also available in{' '}
          <Link href={`/mcp/${slug}`} className='text-primary hover:underline'>
            中文
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
