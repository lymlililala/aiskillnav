'use client';

import { useState, useCallback } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsEn } from '@/hooks/use-is-en';
import { skillsStrings, type SkillsStrings } from '../i18n';
import { skillToolsQueryOptions } from '../api/queries';
import type { SkillTool } from '../api/types';

const PAGE_SIZE = 12;

// 分类配置
const CATEGORY_STYLE: Record<string, { color: string; bg: string; dot: string }> = {
  开发工具: {
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-500'
  },
  效率与协作: {
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    dot: 'bg-blue-500'
  },
  中文平台: {
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    dot: 'bg-red-500'
  },
  内容生成: {
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    dot: 'bg-pink-500'
  },
  'AI Agent': {
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    dot: 'bg-indigo-500'
  },
  网页与浏览器: {
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/20',
    dot: 'bg-sky-500'
  },
  邮件与通信: {
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    dot: 'bg-amber-500'
  },
  安全与审计: {
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    dot: 'bg-orange-500'
  },
  工具与运维: {
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-500/10 border-slate-500/20',
    dot: 'bg-slate-500'
  }
};

const DEFAULT_STYLE = {
  color: 'text-muted-foreground',
  bg: 'bg-muted/30 border-border',
  dot: 'bg-muted-foreground'
};

function getStyle(category: string) {
  return CATEGORY_STYLE[category] ?? DEFAULT_STYLE;
}

// 从 URL 提取 skill slug，构造安装命令
function getInstallCmd(tool: SkillTool): string {
  const slug = tool.url.split('/').filter(Boolean).pop() ?? tool.name.toLowerCase();
  return `clawhub install ${slug}`;
}

// 复制按钮组件
function CopyButton({ text, t }: { text: string; t: SkillsStrings }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // fallback
      }
    },
    [text]
  );

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all duration-150',
        copied
          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
      title={t.copyInstall}
    >
      {copied ? (
        <>
          <Icons.copyCheck className='h-3 w-3' />
          {t.copied}
        </>
      ) : (
        <>
          <Icons.copy className='h-3 w-3' />
          {t.copy}
        </>
      )}
    </button>
  );
}

/**
 * OpenClaw Skills 卡片 — 宽版列表风格
 * 设计语言：极客/开发者工具感，突出终端命令块，不做整卡跳转
 */
function SkillToolCard({ tool, t, isEn }: { tool: SkillTool; t: SkillsStrings; isEn: boolean }) {
  const style = getStyle(tool.category);
  const isClawhub = tool.url.includes('clawhub.ai');
  const installCmd = getInstallCmd(tool);
  const displayName = isEn ? tool.name_en || tool.name : tool.name;
  const displayDesc = isEn ? tool.description_en || tool.description : tool.description;
  const catLabel = isEn
    ? (t.cat[tool.category] ?? tool.category).replace(/^[^\p{L}]+/u, '')
    : tool.category;

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm',
        'transition-all duration-200 hover:shadow-md hover:border-primary/20',
        tool.is_featured && 'ring-1 ring-violet-500/20'
      )}
    >
      {/* 推荐标记 */}
      {tool.is_featured && (
        <div className='absolute -top-2 right-3'>
          <span className='inline-flex items-center gap-0.5 rounded-full bg-violet-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm'>
            <Icons.sparkles className='h-2.5 w-2.5' />
            {t.recommended}
          </span>
        </div>
      )}

      {/* ── Header ── */}
      <div className='flex items-start gap-3'>
        {/* 分类色点 + 名称区 */}
        <div className='flex min-w-0 flex-1 items-center gap-2.5'>
          <div className={cn('mt-0.5 h-2 w-2 shrink-0 rounded-full', style.dot)} />
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='font-mono text-sm font-semibold text-foreground'>{displayName}</span>
              {/* 版本号占位 */}
              <span className='rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground'>
                v1.0
              </span>
              <Badge
                variant='outline'
                className={cn('h-4 px-1.5 text-[9px] font-normal', style.color, style.bg)}
              >
                {catLabel}
              </Badge>
            </div>
            <p className='mt-0.5 line-clamp-1 text-[11px] text-muted-foreground'>
              {displayDesc}
            </p>
          </div>
        </div>

        {/* 右上：来源标识 */}
        <div className='shrink-0'>
          {isClawhub ? (
            <span className='flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/8 px-2 py-0.5 text-[9px] font-medium text-emerald-600 dark:text-emerald-400'>
              <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
              {t.verified}
            </span>
          ) : (
            <span className='flex items-center gap-1 rounded-full border bg-muted/40 px-2 py-0.5 text-[9px] font-medium text-muted-foreground'>
              {t.community}
            </span>
          )}
        </div>
      </div>

      {/* ── 描述（完整两行）── */}
      <p className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
        {displayDesc}
      </p>

      {/* ── Tags ── */}
      {tool.tags && tool.tags.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {tool.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className='rounded border bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground'
            >
              {tag}
            </span>
          ))}
          {tool.tags.length > 4 && (
            <span className='rounded border bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground/60'>
              +{tool.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* ── 终端命令块 —— 核心差异点 ── */}
      <div className='overflow-hidden rounded-lg border border-border/60 bg-[#0d1117] dark:bg-[#010409]'>
        {/* 终端顶栏 */}
        <div className='flex items-center gap-1.5 border-b border-white/5 px-3 py-1.5'>
          <span className='h-2 w-2 rounded-full bg-red-500/60' />
          <span className='h-2 w-2 rounded-full bg-yellow-500/60' />
          <span className='h-2 w-2 rounded-full bg-green-500/60' />
          <span className='ml-1 font-mono text-[9px] text-white/30'>terminal</span>
        </div>
        {/* 命令行 */}
        <div className='flex items-center justify-between gap-2 px-3 py-2'>
          <div className='flex min-w-0 items-center gap-2'>
            <span className='shrink-0 font-mono text-[11px] text-green-400/80'>$</span>
            <span className='truncate font-mono text-[11px] text-green-300'>{installCmd}</span>
          </div>
          <CopyButton text={installCmd} t={t} />
        </div>
      </div>

      {/* ── Footer 操作区 ── */}
      <div className='flex items-center justify-between gap-2 pt-0.5'>
        {/* 左：数据指标占位（下载量/star 等，暂无真实数据用样式占位）*/}
        <div className='flex items-center gap-3 text-[10px] text-muted-foreground/50'>
          <span className='flex items-center gap-1'>
            <Icons.exclusive className='h-3 w-3' />—
          </span>
          <span className='flex items-center gap-1'>
            <Icons.trendingUp className='h-3 w-3' />—
          </span>
        </div>

        {/* 右：查看详情按钮 */}
        <Link
          href={tool.url}
          target='_blank'
          rel='noopener noreferrer'
          onClick={(e) => e.stopPropagation()}
          className='flex items-center gap-1 rounded-lg border bg-background px-3 py-1.5 text-[11px] font-medium text-foreground transition-all hover:border-primary/30 hover:bg-accent hover:text-primary'
        >
          {t.viewDetails}
          <Icons.externalLink className='h-3 w-3' />
        </Link>
      </div>
    </div>
  );
}

export function SkillToolCardSkeleton() {
  return (
    <div className='flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm'>
      <div className='flex items-start gap-3'>
        <div className='mt-0.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-muted' />
        <div className='flex-1 space-y-1.5'>
          <div className='flex gap-2'>
            <div className='h-4 w-32 animate-pulse rounded bg-muted' />
            <div className='h-4 w-8 animate-pulse rounded bg-muted' />
          </div>
          <div className='h-3 w-3/4 animate-pulse rounded bg-muted' />
        </div>
        <div className='h-4 w-16 animate-pulse rounded-full bg-muted' />
      </div>
      <div className='space-y-1'>
        <div className='h-3 w-full animate-pulse rounded bg-muted' />
        <div className='h-3 w-4/5 animate-pulse rounded bg-muted' />
      </div>
      <div className='flex gap-1'>
        <div className='h-4 w-12 animate-pulse rounded bg-muted' />
        <div className='h-4 w-12 animate-pulse rounded bg-muted' />
        <div className='h-4 w-10 animate-pulse rounded bg-muted' />
      </div>
      <div className='h-16 animate-pulse rounded-lg bg-muted' />
      <div className='flex justify-end'>
        <div className='h-7 w-20 animate-pulse rounded-lg bg-muted' />
      </div>
    </div>
  );
}

export function SkillToolGrid() {
  const isEn = useIsEn();
  const t = skillsStrings(isEn);
  const [params, setParams] = useQueryStates(
    {
      skill_tool_page: parseAsInteger.withDefault(1),
      skill_tool_search: parseAsString.withDefault(''),
      skill_tool_cat: parseAsString.withDefault('all')
    },
    { shallow: true }
  );

  const filters = {
    page: params.skill_tool_page,
    limit: PAGE_SIZE,
    status: 'published',
    ...(params.skill_tool_search && { search: params.skill_tool_search }),
    ...(params.skill_tool_cat !== 'all' && { category: params.skill_tool_cat })
  };

  const { data } = useSuspenseQuery(skillToolsQueryOptions(filters));
  const totalPages = Math.ceil(data.total_items / PAGE_SIZE);
  const hasFilter = params.skill_tool_search !== '' || params.skill_tool_cat !== 'all';

  if (data.items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl border bg-muted/50'>
          <Icons.terminal className='h-5 w-5 text-muted-foreground' />
        </div>
        <p className='text-sm font-medium'>{t.noTools}</p>
        <p className='mt-1 text-xs text-muted-foreground'>{t.noToolsHint}</p>
      </div>
    );
  }

  return (
    <div className='space-y-5'>
      <p className='text-xs text-muted-foreground'>
        {t.toolsCount(data.total_items)}
        {hasFilter && <span>{t.filtered}</span>}
        <span className='ml-2 text-muted-foreground/50'>{t.toolsClickHint}</span>
      </p>

      {/* 宽版 2 列列表 — Skills 市场风格 */}
      <div className='grid gap-3 lg:grid-cols-2'>
        {data.items.map((tool) => (
          <SkillToolCard key={tool.id} tool={tool} t={t} isEn={isEn} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-1 pt-2'>
          <Button
            variant='outline'
            size='sm'
            className='h-7 w-7 p-0'
            disabled={params.skill_tool_page <= 1}
            onClick={() => setParams({ ...params, skill_tool_page: params.skill_tool_page - 1 })}
          >
            <Icons.chevronLeft className='h-3.5 w-3.5' />
          </Button>

          {(() => {
            const current = params.skill_tool_page;
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
                  onClick={() => setParams({ ...params, skill_tool_page: p })}
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
            disabled={params.skill_tool_page >= totalPages}
            onClick={() => setParams({ ...params, skill_tool_page: params.skill_tool_page + 1 })}
          >
            <Icons.chevronRight className='h-3.5 w-3.5' />
          </Button>
        </div>
      )}
    </div>
  );
}

export function SkillToolGridSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-4 w-48 animate-pulse rounded bg-muted' />
      <div className='grid gap-3 lg:grid-cols-2'>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkillToolCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
