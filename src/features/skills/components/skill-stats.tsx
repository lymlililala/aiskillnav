'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Icons } from '@/components/icons';
import { useIsEn } from '@/hooks/use-is-en';
import { skillsStrings } from '../i18n';
import { siteStatsOptions, skillToolStatsOptions } from '../api/queries';

export function SkillStats() {
  const isEn = useIsEn();
  const t = skillsStrings(isEn);
  const { data: siteStats } = useSuspenseQuery(siteStatsOptions());
  const { data: toolStats } = useSuspenseQuery(skillToolStatsOptions());

  const statItems = [
    {
      label: t.statHubSites,
      value: siteStats.total,
      sub: `${siteStats.byRegion['cn'] ?? 0} ${t.cnUnit}  ·  ${siteStats.byRegion['global'] ?? 0} ${t.intlUnit}`,
      icon: Icons.skillsHub,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10',
      accent: 'border-l-2 border-l-blue-500'
    },
    {
      label: t.statFeatured,
      value: siteStats.featured,
      sub: t.statEditorPicks,
      icon: Icons.sparkles,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
      accent: 'border-l-2 border-l-amber-500'
    },
    {
      label: 'OpenClaw Skills',
      value: toolStats.total,
      sub: `${toolStats.featured} ${t.featuredSuffix} · clawhub.ai`,
      icon: Icons.sparkles,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-500/10',
      accent: 'border-l-2 border-l-violet-500'
    },
    {
      label: t.statCategories,
      value: Object.keys(toolStats.byCategory).length,
      sub: t.statScenarioCoverage,
      icon: Icons.adjustments,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      accent: 'border-l-2 border-l-emerald-500'
    }
  ];

  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
      {statItems.map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm ${item.accent}`}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
          >
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </div>
          <div className='min-w-0'>
            <p className='text-xl font-bold leading-tight'>{item.value}</p>
            <p className='truncate text-[10px] font-medium text-muted-foreground'>{item.label}</p>
            <p className='truncate text-[9px] text-muted-foreground/60'>{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkillStatsSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className='flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm'
        >
          <div className='h-9 w-9 animate-pulse rounded-lg bg-muted' />
          <div className='space-y-1'>
            <div className='h-6 w-10 animate-pulse rounded bg-muted' />
            <div className='h-3 w-16 animate-pulse rounded bg-muted' />
            <div className='h-2.5 w-20 animate-pulse rounded bg-muted' />
          </div>
        </div>
      ))}
    </div>
  );
}
