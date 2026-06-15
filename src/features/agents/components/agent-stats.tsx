'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Icons } from '@/components/icons';
import { useIsEn } from '@/hooks/use-is-en';
import { agentsStrings } from '../i18n';
import { agentStatsOptions } from '../api/queries';

export function AgentStats() {
  const t = agentsStrings(useIsEn());
  const { data: stats } = useSuspenseQuery(agentStatsOptions());

  const statItems = [
    {
      label: t.statTotal,
      value: stats.total,
      icon: Icons.sparkles,
      iconColor: 'text-violet-500'
    },
    {
      label: t.statFeatured,
      value: stats.featured,
      icon: Icons.exclusive,
      iconColor: 'text-amber-500'
    },
    {
      label: t.statOpenSource,
      value: stats.openCount,
      icon: Icons.github,
      iconColor: 'text-emerald-500'
    },
    {
      label: t.statCategories,
      value: 6,
      icon: Icons.adjustments,
      iconColor: 'text-blue-500'
    }
  ];

  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
      {statItems.map((item) => (
        <div
          key={item.label}
          className='flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3.5 shadow-none transition-shadow hover:shadow-sm'
        >
          <item.icon className={`h-4 w-4 shrink-0 ${item.iconColor}`} />
          <div>
            <p className='text-2xl font-bold leading-tight tracking-tight'>{item.value}</p>
            <p className='text-[11px] text-muted-foreground'>{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AgentStatsSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className='flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3.5'
        >
          <div className='h-4 w-4 animate-pulse rounded bg-muted' />
          <div className='space-y-1.5'>
            <div className='h-6 w-8 animate-pulse rounded bg-muted' />
            <div className='h-2.5 w-14 animate-pulse rounded bg-muted' />
          </div>
        </div>
      ))}
    </div>
  );
}
