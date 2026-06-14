import { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedEnglishMcp } from '@/features/mcp/api/service';

export const metadata: Metadata = {
  title: 'MCP Servers Directory | AI Skill Navigation',
  description: 'Browse Model Context Protocol (MCP) servers and integrations.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/mcp',
    languages: { 'zh-CN': 'https://aiskillnav.com/mcp', en: 'https://aiskillnav.com/en/mcp' }
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function EnMcpPage() {
  const items = await getPublishedEnglishMcp();
  return (
    <div className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
      <header className='mb-10'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>MCP Servers</h1>
        <p className='mt-3 text-lg text-muted-foreground'>
          Model Context Protocol servers and integrations.
        </p>
      </header>
      {items.length === 0 ? (
        <p className='text-muted-foreground'>Coming soon.</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((m) => (
            <Link
              key={m.slug}
              href={`/en/mcp/${m.slug}`}
              className='group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30'
            >
              <h2 className='font-mono text-sm font-semibold group-hover:text-primary'>{m.name}</h2>
              {m.description_en && (
                <p className='mt-2 line-clamp-3 text-sm text-muted-foreground'>
                  {m.description_en}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
