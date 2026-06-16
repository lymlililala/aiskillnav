'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIsEn } from '@/hooks/use-is-en';
import { cn } from '@/lib/utils';

/**
 * 侧边栏应用外壳的中英切换按钮。
 * 当前在英文站 → 链到去掉 /en 前缀的中文同栏目；中文站 → 链到加 /en 的英文同栏目。
 * 保留后续路径段（如 /tutorials/topic/xxx ↔ /en/tutorials/topic/xxx）。
 */
export function LocaleToggle() {
  const pathname = usePathname();
  const isEn = useIsEn();

  // 计算对侧语言的对应路径
  let target: string;
  if (isEn) {
    target = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  } else {
    target = pathname === '/' ? '/en' : `/en${pathname}`;
  }

  return (
    <Link
      href={target}
      prefetch={false}
      aria-label={isEn ? 'Switch to Chinese' : '切换到英文'}
      className={cn(
        'inline-flex h-8 items-center justify-center rounded-md px-2.5 text-xs font-medium',
        'text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
      )}
    >
      {isEn ? '中文' : 'EN'}
    </Link>
  );
}
