'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { featuredSitesOptions } from '../api/queries';
import { SkillCard } from './skill-card';
import type { SitePlatform } from '../api/types';

// 平台分区配置
const HUB_ZONES: {
  key: string;
  title: string;
  desc: string;
  platforms: SitePlatform[];
  accent: string;
  iconColor: string;
  tagline: string;
}[] = [
  {
    key: 'official',
    title: '官方生态',
    desc: '原生 · 标准',
    platforms: ['official'],
    accent: 'border-blue-500/20 bg-blue-500/3',
    iconColor: 'text-blue-600 dark:text-blue-400',
    tagline: '由各大 AI 平台官方维护'
  },
  {
    key: 'community',
    title: '社区开发者',
    desc: '海量 · 灵感',
    platforms: ['community', 'aggregator'],
    accent: 'border-violet-500/20 bg-violet-500/3',
    iconColor: 'text-violet-600 dark:text-violet-400',
    tagline: '社区贡献，创意无限'
  },
  {
    key: 'deploy',
    title: '私有化 & 工作流',
    desc: '生产力 · 工作流',
    platforms: ['tool', 'github', 'mirror'],
    accent: 'border-emerald-500/20 bg-emerald-500/3',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    tagline: '深度集成，企业自部署'
  }
];

export function FeaturedSkills() {
  const { data: featured } = useSuspenseQuery(featuredSitesOptions());

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Icons.skillsHub className='h-4 w-4 text-blue-500' />
        <h2 className='text-sm font-semibold'>Hub 聚合平台</h2>
        <Badge variant='secondary' className='text-[10px]'>
          {featured.length}
        </Badge>
        <span className='text-xs text-muted-foreground'>— 按平台属性分区，快速定位来源</span>
      </div>

      <div className='space-y-3'>
        {HUB_ZONES.map((zone) => {
          const zoneSites = featured.filter((s) => zone.platforms.includes(s.platform));
          if (zoneSites.length === 0) return null;

          return (
            <div key={zone.key} className={cn('rounded-xl border p-3.5', zone.accent)}>
              {/* Zone Header */}
              <div className='mb-2.5 flex items-center gap-2'>
                <span className={cn('text-xs font-semibold', zone.iconColor)}>{zone.title}</span>
                <span className='rounded-full border px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground'>
                  {zone.desc}
                </span>
                <div className='h-px flex-1 bg-border/50' />
                <span className='text-[10px] text-muted-foreground/60'>{zone.tagline}</span>
              </div>

              {/* Zone Cards — 紧凑 4 列横向布局 */}
              <div className='grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {zoneSites.map((site) => (
                  <SkillCard key={site.id} site={site} />
                ))}
              </div>
            </div>
          );
        })}

        {/* 兜底区：不在以上分区的站点 */}
        {(() => {
          const allZonePlatforms = HUB_ZONES.flatMap((z) => z.platforms);
          const others = featured.filter((s) => !allZonePlatforms.includes(s.platform));
          if (others.length === 0) return null;
          return (
            <div className='grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {others.map((site) => (
                <SkillCard key={site.id} site={site} />
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export function FeaturedSkillsSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <div className='h-4 w-4 animate-pulse rounded bg-muted' />
        <div className='h-4 w-24 animate-pulse rounded bg-muted' />
        <div className='h-4 w-6 animate-pulse rounded bg-muted' />
      </div>
      <div className='space-y-3'>
        {Array.from({ length: 2 }).map((_, zi) => (
          <div key={zi} className='rounded-xl border bg-muted/5 p-3.5'>
            <div className='mb-2.5 h-3 w-24 animate-pulse rounded bg-muted' />
            <div className='grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className='flex items-center gap-3 rounded-xl border bg-card px-4 py-3'
                >
                  <div className='h-9 w-9 animate-pulse rounded-lg bg-muted' />
                  <div className='flex-1 space-y-1.5'>
                    <div className='h-3.5 w-3/4 animate-pulse rounded bg-muted' />
                    <div className='h-3 w-full animate-pulse rounded bg-muted' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
