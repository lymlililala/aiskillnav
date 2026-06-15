'use client';

import { useState, useCallback, useRef } from 'react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useIsEn } from '@/hooks/use-is-en';
import { skillsStrings } from '../i18n';
import type { Site, SitePlatform, SiteRegion } from '../api/types';

/** hover 时预连接外部域名，加速后续跳转 */
function prefetchExternalUrl(url: string) {
  try {
    const origin = new URL(url).origin;
    if (document.querySelector(`link[href="${origin}"][rel="preconnect"]`)) return;
    const dns = document.createElement('link');
    dns.rel = 'dns-prefetch';
    dns.href = origin;
    document.head.appendChild(dns);
    const pre = document.createElement('link');
    pre.rel = 'preconnect';
    pre.href = origin;
    pre.crossOrigin = 'anonymous';
    document.head.appendChild(pre);
  } catch {
    // ignore invalid url
  }
}

/**
 * DuckDuckGo favicon API — 比 Google 快，无需代理，全球 CDN
 * 失败兜底：直接访问 /favicon.ico
 */
function getFaviconUrl(url: string): string {
  try {
    const { hostname } = new URL(url);
    return `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
  } catch {
    return '';
  }
}

function getFaviconFallbackUrl(url: string): string {
  try {
    const { origin } = new URL(url);
    return `${origin}/favicon.ico`;
  } catch {
    return '';
  }
}

export const PLATFORM_BADGE: Record<SitePlatform, { label: string; color: string }> = {
  official: { label: '官方', color: 'text-blue-600 dark:text-blue-400' },
  mirror: { label: '镜像', color: 'text-orange-600 dark:text-orange-400' },
  github: { label: 'GitHub', color: 'text-slate-600 dark:text-slate-300' },
  aggregator: { label: '聚合', color: 'text-violet-600 dark:text-violet-400' },
  community: { label: '社区', color: 'text-emerald-600 dark:text-emerald-400' },
  tool: { label: '工具', color: 'text-amber-600 dark:text-amber-400' }
};

export const REGION_CONFIG: Record<SiteRegion, { label: string; flag: string }> = {
  global: { label: '国际', flag: '🌐' },
  cn: { label: '中文', flag: '🇨🇳' }
};

interface SiteCardProps {
  site: Site;
}

/**
 * Favicon 图标组件 — 三层降级策略：
 * 1. DuckDuckGo favicon API（快，全球 CDN）
 * 2. 直接 /favicon.ico
 * 3. 首字母占位块
 */
function SiteFavicon({ site }: { site: Site }) {
  // 0 = 用 duckduckgo, 1 = 用 /favicon.ico, 2 = 用首字母
  const [fallbackLevel, setFallbackLevel] = useState(0);

  const primaryUrl = getFaviconUrl(site.url);
  const fallbackUrl = getFaviconFallbackUrl(site.url);
  const currentSrc = fallbackLevel === 0 ? primaryUrl : fallbackUrl;

  if (fallbackLevel >= 2 || !primaryUrl) {
    return (
      <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground'>
        {site.name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={site.name}
      width={36}
      height={36}
      loading='lazy'
      decoding='async'
      className='h-9 w-9 rounded-lg object-contain'
      onError={() => setFallbackLevel((l) => l + 1)}
    />
  );
}

/**
 * Hub 导航站卡片
 * 设计语言：紧凑横向、Favicon 大图标优先、整卡可点、hover 显示跳转箭头
 */
export function SkillCard({ site }: SiteCardProps) {
  const isEn = useIsEn();
  const t = skillsStrings(isEn);
  const badgeColor = (PLATFORM_BADGE[site.platform] ?? { color: 'text-muted-foreground' }).color;
  const badgeLabel = t.platform[site.platform] ?? t.platform.other;
  const regionFlag = (REGION_CONFIG[site.region] ?? { flag: '🌐' }).flag;
  const displayName = isEn ? site.name_en || site.name : site.name;
  const displayDesc = isEn ? site.description_en || site.description : site.description;

  const [clicking, setClicking] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    prefetchExternalUrl(site.url);
  }, [site.url]);

  const handleClick = useCallback(() => {
    setClicking(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setClicking(false), 2000);
  }, []);

  return (
    <a
      href={site.url}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(
        'group relative flex items-center gap-3 rounded-xl border bg-card px-4 py-3',
        'cursor-pointer transition-all duration-150',
        'hover:shadow-md hover:-translate-y-px hover:border-primary/25',
        site.is_featured && 'ring-1 ring-primary/15',
        clicking && 'scale-[0.99] border-primary/30 shadow-sm'
      )}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      {/* Favicon / Logo 图标区 */}
      <div className='relative h-9 w-9 shrink-0'>
        <SiteFavicon site={site} />

        {/* 精选角标 */}
        {site.is_featured && (
          <span className='absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground'>
            ✦
          </span>
        )}
      </div>

      {/* 文本内容区 */}
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-1.5'>
          <span className='truncate text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary'>
            {displayName}
          </span>
          {/* 平台类型 + 地区 */}
          <span className={cn('shrink-0 text-[10px] font-medium', badgeColor)}>{badgeLabel}</span>
          <span className='shrink-0 text-[10px] text-muted-foreground/60'>{regionFlag}</span>
        </div>
        <p className='mt-0.5 truncate text-[11px] leading-tight text-muted-foreground'>
          {displayDesc}
        </p>
      </div>

      {/* 右侧跳转图标区 — hover 时显现 */}
      <div
        className={cn(
          'shrink-0 transition-all duration-150',
          clicking ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        {clicking ? (
          <Icons.spinner className='h-3.5 w-3.5 animate-spin text-primary' />
        ) : (
          <Icons.externalLink className='h-3.5 w-3.5 text-muted-foreground group-hover:text-primary' />
        )}
      </div>
    </a>
  );
}

export function SkillCardSkeleton() {
  return (
    <div className='flex items-center gap-3 rounded-xl border bg-card px-4 py-3'>
      <div className='h-9 w-9 shrink-0 animate-pulse rounded-lg bg-muted' />
      <div className='flex-1 space-y-1.5'>
        <div className='h-3.5 w-3/4 animate-pulse rounded bg-muted' />
        <div className='h-3 w-full animate-pulse rounded bg-muted' />
      </div>
    </div>
  );
}
