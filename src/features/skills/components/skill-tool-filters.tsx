'use client';

import { useEffect, useState } from 'react';
import { parseAsString, useQueryStates } from 'nuqs';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsEn } from '@/hooks/use-is-en';
import { skillsStrings } from '../i18n';

// OpenClaw Skills 分类（value 为 DB 中文键，label 走 i18n）
const CATEGORY_VALUES = [
  'all', '小说生成', '简历生成', '周报生成', '漫剧生成', '短视频生成', '内容生成', '开发工具',
  '效率与协作', '中文平台', 'AI Agent', '网页与浏览器', '邮件与通信', '安全与审计', '工具与运维'
];

export function SkillToolFilters() {
  const isEn = useIsEn();
  const t = skillsStrings(isEn);
  const CATEGORY_TABS = CATEGORY_VALUES.map((v) => ({
    value: v,
    label: v === 'all' ? t.catAll : t.cat[v] ?? v
  }));
  const SEARCH_EXAMPLES = t.searchExamples;
  const QUICK_TAGS = t.quickTags;

  const [params, setParams] = useQueryStates(
    {
      skill_tool_search: parseAsString.withDefault(''),
      skill_tool_cat: parseAsString.withDefault('all')
    },
    { shallow: true }
  );

  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  // 每 3s 切换一个示例 placeholder
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % SEARCH_EXAMPLES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [SEARCH_EXAMPLES.length]);

  const hasActive = params.skill_tool_search !== '' || params.skill_tool_cat !== 'all';
  const placeholder = params.skill_tool_search ? '' : t.toolSearchTry(SEARCH_EXAMPLES[placeholderIdx]);

  return (
    <div className='space-y-3'>
      {/* Search */}
      <div className='relative'>
        <Icons.search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder={placeholder}
          value={params.skill_tool_search}
          onChange={(e) => setParams({ ...params, skill_tool_search: e.target.value || '' })}
          className='h-9 pl-9 pr-8'
        />
        {params.skill_tool_search && (
          <button
            onClick={() => setParams({ ...params, skill_tool_search: '' })}
            className='absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground'
          >
            <Icons.close className='h-3.5 w-3.5' />
          </button>
        )}
      </div>

      {/* 快捷场景标签（无搜索词时显示）*/}
      {!params.skill_tool_search && (
        <div className='flex flex-wrap gap-1.5'>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag.query}
              onClick={() => setParams({ ...params, skill_tool_search: tag.query })}
              className='rounded-full border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground'
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}

      {/* 分类 Tabs */}
      <div className='flex flex-wrap items-center gap-2'>
        <div className='flex flex-wrap gap-1.5'>
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setParams({ ...params, skill_tool_cat: tab.value })}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150',
                params.skill_tool_cat === tab.value
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
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
            onClick={() => setParams({ skill_tool_search: '', skill_tool_cat: 'all' })}
          >
            <Icons.close className='h-3 w-3' />
            {t.reset}
          </Button>
        )}
      </div>
    </div>
  );
}
