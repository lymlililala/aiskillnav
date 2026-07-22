import type { Metadata } from 'next';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { TAG_PAGES } from '@/features/tags/registry';

// Tag hubs index (EN mirror of /tags)
export const metadata: Metadata = {
  title: 'Tag Hubs — Tutorials, MCP Servers & Agent Tools',
  description:
    'Curated collections of AI tutorials, MCP servers, and agent tools by tag: developer tools, browser automation, databases, LLM engineering, Python AI development, and more.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/tags',
    languages: {
      'zh-CN': 'https://aiskillnav.com/tags',
      en: 'https://aiskillnav.com/en/tags',
      'x-default': 'https://aiskillnav.com/tags'
    }
  }
};

export const revalidate = 3600;

export default function EnTagsIndexPage() {
  return (
    <PageContainer
      pageTitle='Tag Hubs'
      pageDescription='Tutorials, MCP servers, and agent tools curated by topic tag'
    >
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {TAG_PAGES.map((t) => (
          <Link
            key={t.slug}
            href={`/en/tags/${t.slug}`}
            className='group flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
          >
            <span className='flex items-center gap-1.5 text-sm font-semibold group-hover:text-primary transition-colors'>
              <Icons.tag className='h-3.5 w-3.5 text-muted-foreground' />
              {t.titleEn}
            </span>
            <span className='line-clamp-3 text-xs leading-relaxed text-muted-foreground'>
              {t.descriptionEn}
            </span>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
