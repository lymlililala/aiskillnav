'use client';

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { useIsEn } from '@/hooks/use-is-en';
import { mcpStrings } from '../i18n';

/** “什么是 MCP” 介绍块 + “全部收录”分隔条（client，locale 感知） */
export function McpIntro() {
  const t = mcpStrings(useIsEn());
  return (
    <>
      <div className='rounded-xl border bg-gradient-to-r from-primary/5 to-transparent p-5'>
        <div className='flex items-start gap-3'>
          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
            <Icons.info className='h-4 w-4 text-primary' />
          </div>
          <div>
            <h2 className='text-sm font-semibold'>{t.whatIsTitle}</h2>
            <p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
              {t.whatIsBody}
              <br />
              <strong className='text-foreground'>{t.analogy}</strong>
              {t.analogyTail}
            </p>
            <Link
              href={t.learnMoreHref}
              className='mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline'
            >
              {t.learnMore} <Icons.chevronRight className='h-3 w-3' />
            </Link>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <div className='h-px flex-1 bg-border' />
        <span className='text-xs font-medium text-muted-foreground'>{t.allListed}</span>
        <div className='h-px flex-1 bg-border' />
      </div>
    </>
  );
}
