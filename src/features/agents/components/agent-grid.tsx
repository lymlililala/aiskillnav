'use client';

import { useEffect } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { agentsQueryOptions } from '../api/queries';
import { AgentCard, AgentCardSkeleton } from './agent-card';

/** 批量 DNS prefetch 一组 URL 的域名 */
function batchPrefetch(urls: string[]) {
  const seen = new Set<string>();
  for (const url of urls) {
    if (url === '#') continue;
    try {
      const origin = new URL(url).origin;
      if (seen.has(origin)) continue;
      seen.add(origin);
      if (document.querySelector(`link[href="${origin}"][rel="preconnect"]`)) continue;
      const dns = document.createElement('link');
      dns.rel = 'dns-prefetch';
      dns.href = origin;
      document.head.appendChild(dns);
    } catch {
      // ignore
    }
  }
}

const PAGE_SIZE = 24;

function sourceToUrlGroup(source: string): string | undefined {
  if (source === 'app') return '1';
  if (source === 'github') return '2';
  return undefined;
}

export function AgentGrid() {
  const [params, setParams] = useQueryStates(
    {
      agent_page: parseAsInteger.withDefault(1),
      agent_search: parseAsString.withDefault(''),
      agent_type: parseAsString.withDefault('all'),
      agent_source: parseAsString.withDefault('all')
    },
    { shallow: true }
  );

  const filters = {
    page: params.agent_page,
    limit: PAGE_SIZE,
    status: 'published',
    ...(params.agent_search && { search: params.agent_search }),
    ...(params.agent_type !== 'all' && { agent_type: params.agent_type }),
    ...(params.agent_source !== 'all' && { url_group: sourceToUrlGroup(params.agent_source) })
  };

  const { data } = useSuspenseQuery(agentsQueryOptions(filters));
  const totalPages = Math.ceil(data.total_items / PAGE_SIZE);

  useEffect(() => {
    batchPrefetch(data.items.map((a) => a.url));
  }, [data.items]);

  const hasFilter =
    params.agent_type !== 'all' || params.agent_source !== 'all' || params.agent_search !== '';

  if (data.items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-muted/40'>
          <Icons.search className='h-4.5 w-4.5 text-muted-foreground/60' />
        </div>
        <p className='text-sm font-medium text-foreground'>未找到相关 Agent</p>
        <p className='mt-1 text-xs text-muted-foreground'>尝试调整搜索词或分类筛选</p>
      </div>
    );
  }

  return (
    <div className='space-y-5'>
      {/* 计数行 */}
      <p className='text-[11px] text-muted-foreground'>
        共 <span className='font-medium text-foreground'>{data.total_items}</span> 个 Agent
        {hasFilter && <span className='ml-1 text-muted-foreground/60'>（已过滤）</span>}
      </p>

      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {data.items.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-1 pt-2'>
          <Button
            variant='outline'
            size='sm'
            className='h-7 w-7 p-0'
            disabled={params.agent_page <= 1}
            onClick={() => setParams({ ...params, agent_page: params.agent_page - 1 })}
          >
            <Icons.chevronLeft className='h-3.5 w-3.5' />
          </Button>
          {(() => {
            const current = params.agent_page;
            const visible = new Set(
              [1, totalPages, current, current - 1, current + 1].filter(
                (p) => p >= 1 && p <= totalPages
              )
            );
            const pages = Array.from(visible).sort((a, b) => a - b);
            const items: React.ReactNode[] = [];
            for (let i = 0; i < pages.length; i++) {
              if (i > 0 && pages[i] - pages[i - 1] > 1) {
                items.push(
                  <span key={`ellipsis-${i}`} className='px-1 text-xs text-muted-foreground'>
                    …
                  </span>
                );
              }
              const page = pages[i];
              items.push(
                <Button
                  key={page}
                  variant={current === page ? 'default' : 'outline'}
                  size='sm'
                  className='h-7 w-7 p-0 text-xs'
                  onClick={() => setParams({ ...params, agent_page: page })}
                >
                  {page}
                </Button>
              );
            }
            return items;
          })()}
          <Button
            variant='outline'
            size='sm'
            className='h-7 w-7 p-0'
            disabled={params.agent_page >= totalPages}
            onClick={() => setParams({ ...params, agent_page: params.agent_page + 1 })}
          >
            <Icons.chevronRight className='h-3.5 w-3.5' />
          </Button>
        </div>
      )}
    </div>
  );
}

export function AgentGridSkeleton() {
  return (
    <div className='space-y-5'>
      <div className='h-3.5 w-24 animate-pulse rounded bg-muted' />
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 12 }).map((_, i) => (
          <AgentCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
