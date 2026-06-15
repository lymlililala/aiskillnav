'use client';

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/slug';
import { useIsEn } from '@/hooks/use-is-en';
import { agentsStrings } from '../i18n';
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
  const isEn = useIsEn();
  const t = agentsStrings(isEn);
  const typeCfg = AGENT_TYPE_CONFIG[agent.agent_type] ?? AGENT_TYPE_FALLBACK;
  const TypeIcon = typeCfg.icon;
  const typeColor = typeCfg.color;
  const typeLabel = t.typeLabel[agent.agent_type] ?? t.typeLabel.other;
  const isExternal = agent.url !== '#';
  const isGithub = agent.url.includes('github.com');
  const displayName = isEn ? agent.name_en || agent.name : agent.name;
  const displayDesc = isEn ? agent.description_en || agent.description : agent.description;

  const visibleTags = (isEn ? agent.tags_en || agent.tags : agent.tags).slice(0, 2);
  const tagsLen = (isEn ? agent.tags_en || agent.tags : agent.tags).length;
  const extraTagCount = tagsLen > 2 ? tagsLen - 2 : 0;

  // slug 为空（名称无字母/数字/中文）时站内详情页打不开，整卡不可点、不显示「查看详情」
  const slug = slugify(agent.name);
  const hasDetail = slug.length > 0;
  const detailHref = `${isEn ? '/en' : ''}/agents/${slug}`;

  const cardClass = cn(
    'group relative flex h-[180px] flex-col overflow-hidden rounded-xl border border-border/50 bg-card p-4',
    'shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] transition-all duration-300 ease-out',
    hasDetail &&
      'cursor-pointer hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_24px_-6px_hsl(var(--primary)/0.12)]'
  );

  const inner = (
    <>
      {/* hover 时浮现的主色背景光晕 */}
      {hasDetail && (
        <div className='pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100' />
      )}

      {/* Header */}
      <div className='relative mb-2.5 flex items-start gap-3'>
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
            isGithub ? 'bg-muted/60' : 'bg-gradient-to-br from-muted/70 to-muted/30'
          )}
        >
          {isGithub ? (
            <Icons.github className='h-5 w-5 text-foreground/70' />
          ) : (
            <TypeIcon className={cn('h-5 w-5', typeColor)} />
          )}
        </div>
        <div className='min-w-0 flex-1 pt-0.5'>
          <h3 className='truncate text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary'>
            {displayName}
          </h3>
          <p className='mt-0.5 truncate text-[11px] text-muted-foreground/70'>
            {isExternal ? agent.url.replace(/^https?:\/\//, '') : t.inBeta}
          </p>
        </div>
        {agent.is_featured && (
          <span className='absolute -right-1 -top-1 inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600 ring-1 ring-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20'>
            <Icons.sparkles className='h-2.5 w-2.5' />
            {t.featuredBadge}
          </span>
        )}
      </div>

      {/* Body — 描述 + 标签紧贴聚拢，填补空洞 */}
      <div className='mb-auto space-y-2'>
        <p className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>{displayDesc}</p>
        <div className='flex flex-wrap items-center gap-1'>
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className='rounded-md bg-primary/[0.06] px-2 py-0.5 text-[10px] font-medium text-primary/70'
            >
              {tag}
            </span>
          ))}
          {extraTagCount > 0 && (
            <span className='rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground'>
              +{extraTagCount}
            </span>
          )}
          {tagsLen === 0 && (
            <span className='rounded-md bg-primary/[0.06] px-2 py-0.5 text-[10px] font-medium text-primary/70'>
              {isGithub ? 'GitHub' : typeLabel}
            </span>
          )}
        </div>
      </div>

      {/* Footer — CTA 胶囊按钮，hover 实色化 + 箭头平移 */}
      {hasDetail && (
        <div className='mt-3 flex items-center justify-end'>
          <span className='inline-flex items-center gap-1 rounded-lg bg-primary/[0.06] px-2.5 py-1 text-[11px] font-semibold text-primary/80 transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground'>
            {t.viewDetails}
            <Icons.chevronRight className='h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5' />
          </span>
        </div>
      )}
    </>
  );

  // 整卡链到站内详情页（不再直接外链官网；官网在详情页内提供）
  if (!hasDetail) {
    return <div className={cardClass}>{inner}</div>;
  }
  return (
    <Link href={detailHref} className={cardClass}>
      {inner}
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
