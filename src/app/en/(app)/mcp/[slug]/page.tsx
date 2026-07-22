import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMcpBySlug } from '@/features/mcp/api/service';
import { mcpDisplayName } from '@/features/mcp/display-name';
import { findTagPageForTag } from '@/features/tags/registry';

type Props = { params: Promise<{ slug: string }> };
type EnMcp = {
  name: string;
  slug: string;
  description?: string;
  description_en?: string | null;
  url?: string;
  install_cmd?: string;
  category?: string;
  tags?: string[];
  en_status?: string | null;
};

// "What is X" intro per category (unique description stays in the header; no on-page duplication)
const CATEGORY_INTRO_EN: Record<string, (n: string) => string> = {
  filesystem: (n) =>
    `${n} is a filesystem MCP server that lets Claude, Cursor, and other AI assistants read and write files inside authorized directories — useful for working on local projects, organizing documents, or generating code.`,
  database: (n) =>
    `${n} is a database MCP server that lets AI assistants query and analyze databases in natural language — no hand-written SQL needed for reporting, lookups, or data exploration.`,
  browser: (n) =>
    `${n} is a browser-automation MCP server that lets AI assistants drive a real browser — clicking, filling forms, taking screenshots, and scraping. Commonly used for end-to-end testing and web data collection.`,
  devtools: (n) =>
    `${n} is a developer-tools MCP server that exposes everyday dev operations — docs lookup, scripts, logs, API calls — to AI assistants, letting Claude or Cursor take part in your development workflow.`,
  productivity: (n) =>
    `${n} is a productivity MCP server that connects calendars, tasks, notes, and messaging tools to AI assistants, so Claude or Cursor can handle routine collaboration chores for you.`,
  search: (n) =>
    `${n} is a search MCP server that gives AI assistants live web access beyond their training cutoff — built for research, monitoring, and fact-checking.`,
  ai: (n) =>
    `${n} is an AI-model MCP server that exposes model capabilities — reasoning, generation, multimodal processing — to AI assistants over the standard MCP protocol.`,
  default: (n) =>
    `${n} is an MCP server that exposes external tools and data sources to Claude, Cursor, and other AI assistants over the Model Context Protocol.`
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
    title: `${mcpDisplayName(m.name)} MCP Server — Install & Setup Guide`,
    description: m.description_en ?? undefined,
    alternates: { canonical: enUrl, languages: { 'zh-CN': `${SITE}/mcp/${slug}`, en: enUrl } },
    openGraph: {
      title: `${mcpDisplayName(m.name)} MCP Server`,
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
      {(m.tags ?? []).some((tag) => findTagPageForTag(tag)) && (
        <div className='mt-4 flex flex-wrap gap-1.5'>
          {(m.tags ?? [])
            .filter((tag) => findTagPageForTag(tag))
            .map((tag) => (
              <Link
                key={tag}
                href={`/en/tags/${findTagPageForTag(tag)!.slug}`}
                className='rounded-md bg-muted/50 border px-2 py-0.5 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors'
              >
                {tag}
              </Link>
            ))}
        </div>
      )}
      <section className='mt-6 space-y-2'>
        <h2 className='text-base font-semibold'>What is {mcpDisplayName(m.name)} MCP Server?</h2>
        <p className='text-sm leading-relaxed text-muted-foreground'>
          {(CATEGORY_INTRO_EN[m.category ?? ''] ?? CATEGORY_INTRO_EN.default)(
            mcpDisplayName(m.name)
          )}
        </p>
      </section>
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
