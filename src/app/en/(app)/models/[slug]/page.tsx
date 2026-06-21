import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getModelBySlug } from '@/features/models/api/service';
import { slugify } from '@/lib/slug';

type Props = { params: Promise<{ slug: string }> };
type EnModel = {
  name: string;
  vendor?: string;
  description?: string;
  description_en?: string | null;
  url?: string;
  context_window?: string;
  price_input?: string;
  price_output?: string;
  en_status?: string | null;
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;
const SITE = 'https://aiskillnav.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = (await getModelBySlug(slug)) as EnModel | null;
  if (!m || m.en_status !== 'published') return { title: 'Not found' };
  const enUrl = `${SITE}/en/models/${slug}`;
  return {
    title: `${m.name} | AI Models`,
    description: m.description_en ?? undefined,
    alternates: { canonical: enUrl, languages: { 'zh-CN': `${SITE}/models/${slug}`, en: enUrl } },
    openGraph: {
      title: m.name,
      description: m.description_en ?? undefined,
      url: enUrl,
      type: 'website',
      locale: 'en_US'
    }
  };
}

export default async function EnModelDetailPage({ params }: Props) {
  const { slug } = await params;
  const m = (await getModelBySlug(slug)) as EnModel | null;
  if (!m || m.en_status !== 'published') notFound();

  const specs: [string, string | undefined][] = [
    ['Vendor', m.vendor],
    ['Context window', m.context_window],
    ['Input price', m.price_input],
    ['Output price', m.price_output]
  ];

  return (
    <div className='mx-auto max-w-3xl px-4 py-12 md:px-6'>
      <Link
        href='/en/models'
        className='mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground'
      >
        ← Back to models
      </Link>
      <h1 className='text-3xl font-bold leading-tight tracking-tight'>{m.name}</h1>
      {m.vendor && <p className='mt-1 text-muted-foreground'>{m.vendor}</p>}
      {m.description_en && (
        <p className='mt-4 text-lg leading-relaxed text-muted-foreground'>{m.description_en}</p>
      )}

      <table className='mt-8 w-full text-sm'>
        <tbody>
          {specs
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <tr key={k} className='border-b'>
                <td className='py-2 pr-4 font-medium text-muted-foreground'>{k}</td>
                <td className='py-2'>{v}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {m.url && (
        <a
          href={m.url}
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
          <Link href={`/models/${slugify(m.name)}`} className='text-primary hover:underline'>
            中文
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
