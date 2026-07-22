import type { Metadata } from 'next';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { TAG_PAGES } from '@/features/tags/registry';

// 标签中枢索引页：16 个精选标签合集的总入口
export const metadata: Metadata = {
  title: '标签合集 — 教程、MCP 与 Agent 资源导航',
  description:
    '按标签聚合站内的 AI 教程、MCP Server 与 Agent 工具：开发者工具、浏览器自动化、数据库、LLM 实战、Python AI 开发等精选合集。',
  alternates: {
    canonical: 'https://aiskillnav.com/tags',
    languages: {
      'zh-CN': 'https://aiskillnav.com/tags',
      en: 'https://aiskillnav.com/en/tags',
      'x-default': 'https://aiskillnav.com/tags'
    }
  }
};

export const revalidate = 3600;

export default function TagsIndexPage() {
  return (
    <PageContainer
      pageTitle='标签合集'
      pageDescription='按主题标签聚合的教程、MCP Server 与 Agent 工具资源'
    >
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {TAG_PAGES.map((t) => (
          <Link
            key={t.slug}
            href={`/tags/${t.slug}`}
            className='group flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
          >
            <span className='flex items-center gap-1.5 text-sm font-semibold group-hover:text-primary transition-colors'>
              <Icons.tag className='h-3.5 w-3.5 text-muted-foreground' />
              {t.title}
            </span>
            <span className='line-clamp-3 text-xs leading-relaxed text-muted-foreground'>
              {t.description}
            </span>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
