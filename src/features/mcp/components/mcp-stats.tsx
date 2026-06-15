'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Icons } from '@/components/icons';
import { useIsEn } from '@/hooks/use-is-en';
import { mcpStrings } from '../i18n';
import { mcpStatsOptions } from '../api/queries';

export function McpStats() {
  const t = mcpStrings(useIsEn());
  const { data: stats } = useSuspenseQuery(mcpStatsOptions());

  const statItems = [
    {
      label: t.statTotal,
      value: stats.total,
      icon: Icons.settings,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      label: t.statOfficial,
      value: stats.official,
      icon: Icons.badgeCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      label: t.statCommunity,
      value: stats.total - stats.official,
      icon: Icons.github,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-500/10'
    }
  ];

  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
      {statItems.map((item) => (
        <div
          key={item.label}
          className='flex min-w-0 items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm'
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
          >
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </div>
          <div className='min-w-0'>
            <p className='text-xl font-bold leading-tight'>{item.value}</p>
            <p className='truncate text-xs text-muted-foreground'>{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function McpStatsSkeleton() {
  return (
    <div className='grid grid-cols-3 gap-3'>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className='flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm'
        >
          <div className='h-9 w-9 animate-pulse rounded-lg bg-muted' />
          <div className='space-y-1'>
            <div className='h-6 w-10 animate-pulse rounded bg-muted' />
            <div className='h-3 w-14 animate-pulse rounded bg-muted' />
          </div>
        </div>
      ))}
    </div>
  );
}
