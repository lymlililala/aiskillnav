'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { useIsEn } from '@/hooks/use-is-en';
import { skillsStrings } from '../i18n';
import { SkillFilters } from './skill-filters';
import { SkillGrid, SkillGridSkeleton } from './skill-grid';
import { SkillToolFilters } from './skill-tool-filters';
import { SkillToolGrid, SkillToolGridSkeleton } from './skill-tool-grid';
import { SkillTabSwitcher } from './skill-tab-switcher';
import { FeaturedSkills, FeaturedSkillsSkeleton } from './featured-skills';
import { Icons } from '@/components/icons';

export function SkillTabContent() {
  const isEn = useIsEn();
  const t = skillsStrings(isEn);
  const [tab] = useQueryState('skill_tab', parseAsString.withDefault('tools'));
  const isTools = tab === 'tools';

  return (
    <div className='space-y-6'>
      {/* Tab 切换器 */}
      <SkillTabSwitcher />

      {/* 内容区 — 根据 tab 切换整体氛围 */}
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border transition-all duration-500',
          isTools ? 'border-violet-500/30 bg-violet-500/5' : 'border-primary/20 bg-primary/5'
        )}
      >
        {/* 顶部分区指示条 */}
        <div
          className={cn(
            'flex items-center gap-2 border-b px-4 py-2.5 transition-all duration-300',
            isTools ? 'border-violet-500/20 bg-violet-500/8' : 'border-primary/15 bg-primary/8'
          )}
        >
          {isTools ? (
            <>
              <Icons.terminal className='h-3.5 w-3.5 text-violet-500' />
              <span className='text-[11px] font-semibold text-violet-600 dark:text-violet-400'>
                {t.marketLabel}
              </span>
              <span className='text-[10px] text-muted-foreground/60'>{t.marketHint}</span>
            </>
          ) : (
            <>
              <Icons.skillsHub className='h-3.5 w-3.5 text-primary/70' />
              <span className='text-[11px] font-semibold text-primary/80'>{t.sitesLabel}</span>
              <span className='text-[10px] text-muted-foreground/60'>{t.sitesHint}</span>
            </>
          )}
        </div>

        {/* 实际内容 */}
        <div className='p-4'>
          {isTools ? (
            <div className='space-y-4'>
              <SkillToolFilters />
              <Suspense fallback={<SkillToolGridSkeleton />}>
                <SkillToolGrid />
              </Suspense>
            </div>
          ) : (
            <div className='space-y-5'>
              {/* 精选 Hub 站点分区 */}
              <Suspense fallback={<FeaturedSkillsSkeleton />}>
                <FeaturedSkills />
              </Suspense>

              <div className='flex items-center gap-3'>
                <div className='h-px flex-1 bg-border' />
                <span className='text-xs font-medium text-muted-foreground'>{t.allListedSites}</span>
                <div className='h-px flex-1 bg-border' />
              </div>

              <SkillFilters />

              <Suspense fallback={<SkillGridSkeleton />}>
                <SkillGrid />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
