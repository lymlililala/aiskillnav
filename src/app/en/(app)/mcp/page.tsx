import { Metadata } from 'next';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
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
    <PageContainer
      pageTitle='MCP Servers'
      pageDescription='Model Context Protocol servers connecting AI to your tools and data.'
    >
      {items.length === 0 ? (
        <p className='text-sm text-muted-foreground'>Coming soon.</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((m) => (
            <Link
              key={m.slug}
              href={`/en/mcp/${m.slug}`}
              className='group flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'
            >
              <h2 className='font-mono text-sm font-semibold leading-snug transition-colors group-hover:text-primary'>
                {m.name}
              </h2>
              {m.description_en && (
                <p className='line-clamp-3 text-xs leading-relaxed text-muted-foreground'>
                  {m.description_en}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
