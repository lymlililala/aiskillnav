'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { useSuspenseQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { useIsEn } from '@/hooks/use-is-en';
import { skillsStrings } from '../i18n';
import { siteStatsOptions, skillToolStatsOptions } from '../api/queries';

export function SkillTabSwitcher() {
  const isEn = useIsEn();
  const t = skillsStrings(isEn);
  const [tab, setTab] = useQueryState(
    'skill_tab',
    parseAsString.withDefault('tools').withOptions({ shallow: true })
  );

  const { data: siteStats } = useSuspenseQuery(siteStatsOptions());
  const { data: toolStats } = useSuspenseQuery(skillToolStatsOptions());

  const isSites = tab === 'sites';
  const isTools = tab === 'tools';

  return (
    <div className='relative overflow-hidden rounded-2xl border bg-card shadow-sm'>
      {/* 背景底纹 — 根据当前 Tab 切换 */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 transition-all duration-500',
          isSites
            ? 'bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.12),transparent_60%)]'
            : 'bg-[radial-gradient(ellipse_at_top_right,hsl(263_70%_50%/0.14),transparent_60%)]'
        )}
      />

      <div className='relative p-4'>
        {/* 顶部说明文字 */}
        <p className='mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60'>
          {t.chooseChannel}
        </p>

        {/* Tab 分段控制器 */}
        <div className='grid grid-cols-2 gap-2'>
          {/* Hub 导航站 Tab */}
          <button
            onClick={() => setTab('sites')}
            className={cn(
              'group relative flex flex-col gap-2 overflow-hidden rounded-xl border p-4 text-left transition-all duration-200',
              isSites
                ? 'border-primary/40 bg-primary/10 shadow-sm'
                : 'border-border bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/50'
            )}
          >
            {/* 激活时的高亮条 */}
            {isSites && (
              <div className='absolute left-0 top-0 h-full w-1 rounded-l-xl bg-primary' />
            )}

            <div className='flex items-start justify-between'>
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200',
                  isSites ? 'bg-primary/10' : 'bg-muted/60 group-hover:bg-muted'
                )}
              >
                <Icons.skillsHub
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isSites ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
              </div>
              <div
                className={cn(
                  'flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors',
                  isSites ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                {siteStats.total}
              </div>
            </div>

            <div>
              <div
                className={cn(
                  'flex items-center gap-1.5 text-sm font-semibold transition-colors',
                  isSites ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {t.hubTitle}
              </div>
              <p
                className={cn(
                  'mt-0.5 text-[11px] leading-relaxed transition-colors',
                  isSites ? 'text-muted-foreground' : 'text-muted-foreground/50'
                )}
              >
                {t.hubDesc}
              </p>
            </div>

            {/* 底部标签 */}
            <div className='flex flex-wrap gap-1 pt-0.5'>
              {t.hubTags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    'rounded-md px-1.5 py-0.5 text-[9px] font-medium transition-colors',
                    isSites
                      ? 'bg-primary/8 text-primary/80'
                      : 'bg-muted/60 text-muted-foreground/60'
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>

          {/* OpenClaw Skills Tab */}
          <button
            onClick={() => setTab('tools')}
            className={cn(
              'group relative flex flex-col gap-2 overflow-hidden rounded-xl border p-4 text-left transition-all duration-200',
              isTools
                ? 'border-violet-500/40 bg-violet-500/10 shadow-sm'
                : 'border-border bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/50'
            )}
          >
            {/* 激活时的高亮条 */}
            {isTools && (
              <div className='absolute left-0 top-0 h-full w-1 rounded-l-xl bg-violet-500' />
            )}

            <div className='flex items-start justify-between'>
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200',
                  isTools ? 'bg-violet-500/10' : 'bg-muted/60 group-hover:bg-muted'
                )}
              >
                <Icons.sparkles
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isTools
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
              </div>
              <div
                className={cn(
                  'flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors',
                  isTools ? 'bg-violet-500 text-white' : 'bg-muted text-muted-foreground'
                )}
              >
                {toolStats.total}
              </div>
            </div>

            <div>
              <div
                className={cn(
                  'flex items-center gap-1.5 text-sm font-semibold transition-colors',
                  isTools ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {t.marketTitle}
              </div>
              <p
                className={cn(
                  'mt-0.5 text-[11px] leading-relaxed transition-colors',
                  isTools ? 'text-muted-foreground' : 'text-muted-foreground/50'
                )}
              >
                {t.marketDesc}
              </p>
            </div>

            {/* 底部标签 */}
            <div className='flex flex-wrap gap-1 pt-0.5'>
              {t.marketTags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    'rounded-md px-1.5 py-0.5 text-[9px] font-medium transition-colors',
                    isTools
                      ? 'bg-violet-500/8 text-violet-600/70 dark:text-violet-400/70'
                      : 'bg-muted/60 text-muted-foreground/60'
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        </div>

        {/* 底部提示语 — 仅 Skills 市场显示 */}
        {isTools && (
          <div className='mt-3 flex items-center gap-2 rounded-lg bg-violet-500/8 px-3 py-2 text-[11px] text-violet-600/70 dark:text-violet-400/70 transition-all duration-300'>
            <Icons.terminal className='h-3 w-3 shrink-0' />
            <span>{t.installTip}</span>
          </div>
        )}
      </div>
    </div>
  );
}
