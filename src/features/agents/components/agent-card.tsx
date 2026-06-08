'use client';

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/slug';
import type { Agent, AgentType, AgentOpenSource } from '../api/types';

export const AGENT_TYPE_CONFIG: Record<
  AgentType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  general: { label: '通用自主', icon: Icons.sparkles, color: 'text-violet-500' },
  research: { label: '深度研究', icon: Icons.search, color: 'text-blue-500' },
  builder: { label: '构建平台', icon: Icons.settings, color: 'text-emerald-500' },
  computer: { label: '电脑操控', icon: Icons.laptop, color: 'text-orange-500' },
  creative: { label: '垂直创意', icon: Icons.palette, color: 'text-pink-500' },
  proactive: { label: '主动感知', icon: Icons.trendingUp, color: 'text-amber-500' }
};

export const OPEN_SOURCE_CONFIG: Record<AgentOpenSource, { label: string }> = {
  open: { label: '开源' },
  closed: { label: '闭源' },
  partial: { label: '部分开源' }
};

const AGENT_TYPE_FALLBACK: (typeof AGENT_TYPE_CONFIG)[AgentType] = {
  label: '其他',
  icon: Icons.sparkles,
  color: 'text-muted-foreground'
};

export function AgentCard({ agent }: { agent: Agent }) {
  const type = AGENT_TYPE_CONFIG[agent.agent_type] ?? AGENT_TYPE_FALLBACK;
  const TypeIcon = type.icon;
  const isExternal = agent.url !== '#';
  const isGithub = agent.url.includes('github.com');

  const visibleTags = agent.tags.slice(0, 2);
  const extraTagCount = agent.tags.length > 2 ? agent.tags.length - 2 : 0;

  const cardClass = cn(
    'group relative flex h-[180px] flex-col rounded-xl border border-border/60 bg-card p-4 transition-all duration-200',
    'hover:-translate-y-0.5 hover:border-border hover:shadow-md'
  );

  // 整卡链到站内详情页（不再直接外链官网；官网在详情页内提供）
  return (
    <Link href={`/agents/${slugify(agent.name)}`} className={cardClass}>
      {/* Header */}
      <div className='relative mb-3 flex items-start gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/50'>
          {isGithub ? (
            <Icons.github className='h-4.5 w-4.5 text-foreground/70' />
          ) : (
            <TypeIcon className={cn('h-4.5 w-4.5', type.color)} />
          )}
        </div>
        <div className='min-w-0 flex-1 pt-0.5'>
          <h3 className='flex items-center gap-1 truncate text-sm font-semibold leading-tight text-foreground'>
            <span className='truncate'>{agent.name}</span>
          </h3>
          <p className='mt-0.5 truncate text-[11px] text-muted-foreground/70'>
            {isExternal ? agent.url.replace(/^https?:\/\//, '') : '内测中'}
          </p>
        </div>
        {agent.is_featured && (
          <span className='absolute -right-1 -top-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600 ring-1 ring-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20'>
            精选
          </span>
        )}
      </div>

      {/* Body */}
      <p className='mb-auto line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
        {agent.description}
      </p>

      {/* Footer */}
      <div className='mt-4 flex items-center justify-between border-t border-border/40 pt-3'>
        <div className='flex items-center gap-1.5'>
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className='rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground'
            >
              {tag}
            </span>
          ))}
          {extraTagCount > 0 && (
            <span className='rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground'>
              +{extraTagCount}
            </span>
          )}
          {agent.tags.length === 0 && (
            <span className='rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground'>
              {isGithub ? 'GitHub' : type.label}
            </span>
          )}
        </div>
        <span className='flex items-center gap-1 text-xs font-medium text-muted-foreground/50 group-hover:text-primary transition-colors'>
          查看详情
          <Icons.chevronRight className='h-3 w-3' />
        </span>
      </div>
    </Link>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className='flex h-[180px] flex-col rounded-xl border border-border/60 bg-card p-4'>
      {/* Header */}
      <div className='mb-3 flex items-start gap-3'>
        <div className='h-10 w-10 animate-pulse rounded-lg bg-muted' />
        <div className='flex-1 space-y-1.5 pt-0.5'>
          <div className='h-4 w-3/4 animate-pulse rounded bg-muted' />
          <div className='h-3 w-1/2 animate-pulse rounded bg-muted' />
        </div>
      </div>
      {/* Body */}
      <div className='space-y-1.5'>
        <div className='h-3 w-full animate-pulse rounded bg-muted' />
        <div className='h-3 w-5/6 animate-pulse rounded bg-muted' />
      </div>
      {/* Footer */}
      <div className='mt-auto flex items-center justify-between border-t border-border/40 pt-3'>
        <div className='flex gap-1.5'>
          <div className='h-4 w-12 animate-pulse rounded-md bg-muted' />
          <div className='h-4 w-12 animate-pulse rounded-md bg-muted' />
        </div>
        <div className='h-3 w-8 animate-pulse rounded bg-muted' />
      </div>
    </div>
  );
}
