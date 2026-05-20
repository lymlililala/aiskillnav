'use client';

import { parseAsString, useQueryStates } from 'nuqs';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TYPE_TABS = [
  { value: 'all', label: '全部' },
  { value: 'general', label: '🤖 通用自主' },
  { value: 'research', label: '🔍 深度研究' },
  { value: 'builder', label: '🏗️ 构建平台' },
  { value: 'computer', label: '🖥️ 电脑操控' },
  { value: 'creative', label: '🎨 创意生成' },
  { value: 'proactive', label: '🔮 主动感知' }
];

/** 热门场景快捷筛选（仅在 creative 或 all 时显示） */
const SCENE_TAGS = [
  { label: '📖 小说生成', query: '小说' },
  { label: '📄 简历生成', query: '简历' },
  { label: '📊 周报生成', query: '周报' },
  { label: '🎭 漫剧生成', query: '漫剧' },
  { label: '🎬 短视频生成', query: '短视频' }
];

/** 应用 / 开源 来源分类 */
const SOURCE_TABS = [
  { value: 'all', label: '全部' },
  { value: 'app', label: '🚀 应用产品' },
  { value: 'github', label: '🐙 开源项目' }
];

export function AgentFilters() {
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
      {/* Search */}
      <div className='relative'>
        <Icons.search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder='搜索 Agent 名称、描述、标签...'
          value={params.agent_search}
          onChange={(e) => setParams({ ...params, agent_search: e.target.value || '' })}
          className='h-9 pl-9 pr-8'
        />
        {params.agent_search && (
          <button
            onClick={() => setParams({ ...params, agent_search: '' })}
            className='absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors'
          >
            <Icons.close className='h-3.5 w-3.5' />
          </button>
        )}
      </div>

      {/* 热门场景快捷筛选 */}
      {showSceneTags && (
        <div className='flex flex-wrap gap-1.5'>
          <span className='self-center text-[11px] text-muted-foreground'>热门需求：</span>
          {SCENE_TAGS.map((tag) => (
            <button
              key={tag.query}
              onClick={() =>
                setParams({ ...params, agent_search: tag.query, agent_type: 'creative' })
              }
              className='rounded-full border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground'
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}

      {/* 第一行：功能分类 */}
      <div className='flex flex-wrap gap-1.5'>
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setParams({ ...params, agent_type: tab.value })}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150',
              params.agent_type === tab.value
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 第二行：来源分类 + 重置 */}
      <div className='flex items-center gap-2'>
        <div className='flex gap-1.5'>
          {SOURCE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setParams({ ...params, agent_source: tab.value })}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150',
                params.agent_source === tab.value
                  ? 'bg-secondary text-secondary-foreground border-secondary shadow-sm'
                  : 'bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {hasActive && (
          <Button
            variant='ghost'
            size='sm'
            className='h-7 gap-1 px-2 text-xs text-muted-foreground'
            onClick={() => setParams({ agent_search: '', agent_type: 'all', agent_source: 'all' })}
          >
            <Icons.close className='h-3 w-3' />
            重置
          </Button>
        )}
      </div>
    </div>
  );
}
