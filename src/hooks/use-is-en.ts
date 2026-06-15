'use client';

import { usePathname } from 'next/navigation';

/**
 * 当前是否处于英文站（/en 或 /en/* 路径）。
 * 供共享的客户端组件做 locale 感知：英文站切英文文案、读 _en 字段、链接加 /en 前缀。
 * 中文站行为完全不变。
 */
export function useIsEn(): boolean {
  const pathname = usePathname();
  return pathname === '/en' || pathname.startsWith('/en/');
}
