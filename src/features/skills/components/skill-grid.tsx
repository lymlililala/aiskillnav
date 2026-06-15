'use client';

import { useEffect } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useIsEn } from '@/hooks/use-is-en';
import { skillsStrings } from '../i18n';
import { sitesQueryOptions } from '../api/queries';
import { SkillCard, SkillCardSkeleton } from './skill-card';

function batchPrefetch(urls: string[]) {
  const seen = new Set<string>();
  for (const url of urls) {
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

export function SkillGrid() {
  const isEn = useIsEn();
  const t = skillsStrings(isEn);
  const [params, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      search: parseAsString.withDefault(''),
      region: parseAsString.withDefault('all'),
      platform: parseAsString.withDefault('all')
    },
    { shallow: true }
  );

  const filters = {
    page: params.page,
    limit: PAGE_SIZE,
    status: 'published',
    ...(params.search && { search: params.search }),
    ...(params.region !== 'all' && { region: params.region }),
    ...(params.platform !== 'all' && { platform: params.platform })
  };

  const { data } = useSuspenseQuery(sitesQueryOptions(filters));

  const totalPages = Math.ceil(data.total_items / PAGE_SIZE);

  // 数据加载后批量预热当前页所有外链域名
  useEffect(() => {
    batchPrefetch(data.items.map((s) => s.url));
  }, [data.items]);

  if (data.items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl border bg-muted/50'>
          <Icons.search className='h-5 w-5 text-muted-foreground' />
        </div>
        <p className='text-sm font-medium'>{t.noSites}</p>
        <p className='mt-1 text-xs text-muted-foreground'>{t.noSitesHint}</p>
      </div>
    );
  }

  return (
    <div className='space-y-5'>
      {/* Results count */}
      <p className='text-xs text-muted-foreground'>
        {t.sitesCount(data.total_items)}
        {(params.region !== 'all' || params.platform !== 'all' || params.search) && (
          <span>{t.filtered}</span>
        )}
      </p>

      {/* 紧凑 4 列 Grid — Hub 导航站风格 */}
      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {data.items.map((site) => (
          <SkillCard key={site.id} site={site} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-1 pt-2'>
          <Button
            variant='outline'
            size='sm'
            className='h-7 w-7 p-0'
            disabled={params.page <= 1}
            onClick={() => setParams({ ...params, page: params.page - 1 })}
          >
            <Icons.chevronLeft className='h-3.5 w-3.5' />
          </Button>
          {(() => {
            const current = params.page;
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
                  <span key={`e-${i}`} className='px-1 text-xs text-muted-foreground'>
                    …
                  </span>
                );
              }
              const p = pages[i];
              items.push(
                <Button
                  key={p}
                  variant={current === p ? 'default' : 'outline'}
                  size='sm'
                  className='h-7 w-7 p-0 text-xs'
                  onClick={() => setParams({ ...params, page: p })}
                >
                  {p}
                </Button>
              );
            }
            return items;
          })()}
          <Button
            variant='outline'
            size='sm'
            className='h-7 w-7 p-0'
            disabled={params.page >= totalPages}
            onClick={() => setParams({ ...params, page: params.page + 1 })}
          >
            <Icons.chevronRight className='h-3.5 w-3.5' />
          </Button>
        </div>
      )}
    </div>
  );
}

export function SkillGridSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-4 w-24 animate-pulse rounded bg-muted' />
      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: 12 }).map((_, i) => (
          <SkillCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
