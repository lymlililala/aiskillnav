'use client';

import { parseAsString, useQueryStates } from 'nuqs';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useIsEn } from '@/hooks/use-is-en';
import { agentsStrings } from '../i18n';

export function AgentFilters() {
  const t = agentsStrings(useIsEn());
  const TYPE_TABS = t.typeTabs;
  const SCENE_TAGS = t.sceneTags;
  const SOURCE_TABS = t.sourceTabs;
  const [params, setParams] = useQueryStates(
    {
      agent_search: parseAsString.withDefault(''),
      agent_type: parseAsString.withDefault('all'),
      agent_source: parseAsString.withDefault('all')
    },
    { shallow: true }
  );

  const hasActive =
    params.agent_search !== '' || params.agent_type !== 'all' || params.agent_source !== 'all';

  const showSceneTags =
    (params.agent_type === 'all' || params.agent_type === 'creative') && !params.agent_search;

  return (
    <div className='space-y-3'>
      {/* Search — 无边框浅灰背景风格 */}
      <div className='relative'>
        <Icons.search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60' />
        <Input
          placeholder={t.searchPlaceholder}
          value={params.agent_search}
          onChange={(e) => setParams({ ...params, agent_search: e.target.value || '' })}
          className='h-10 border-0 bg-muted/50 pl-9 pr-8 text-sm placeholder:text-muted-foreground/50 focus-visible:bg-muted/70 focus-visible:ring-1 focus-visible:ring-border'
        />
        {params.agent_search && (
          <button
            onClick={() => setParams({ ...params, agent_search: '' })}
            className='absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground'
          >
            <Icons.close className='h-3.5 w-3.5' />
          </button>
        )}
      </div>

      {/* 热门场景快捷筛选 */}
      {showSceneTags && (
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-[11px] text-muted-foreground/60'>{t.popularNeeds}</span>
          {SCENE_TAGS.map((tag) => (
            <button
              key={tag.query}
              onClick={() =>
                setParams({ ...params, agent_search: tag.query, agent_type: 'creative' })
              }
              className='rounded-md px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}

      {/* 功能分类 Tabs — 底部下划线风格 */}
      <div className='flex flex-wrap gap-x-1 gap-y-1 border-b border-border/50'>
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setParams({ ...params, agent_type: tab.value })}
            className={cn(
              'relative -mb-px px-3 py-2 text-xs font-medium transition-colors',
              params.agent_type === tab.value
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 来源分类 + 重置 */}
      <div className='flex items-center justify-between'>
        <div className='flex gap-1'>
          {SOURCE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setParams({ ...params, agent_source: tab.value })}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                params.agent_source === tab.value
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {hasActive && (
          <button
            className='flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground'
            onClick={() => setParams({ agent_search: '', agent_type: 'all', agent_source: 'all' })}
          >
            <Icons.close className='h-3 w-3' />
            {t.resetFilters}
          </button>
        )}
      </div>
    </div>
  );
}
