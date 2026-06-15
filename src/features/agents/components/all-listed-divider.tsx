'use client';

import { useIsEn } from '@/hooks/use-is-en';
import { agentsStrings } from '../i18n';

/** “全部收录 / All listed” 分隔条（client，locale 感知） */
export function AllListedDivider() {
  const t = agentsStrings(useIsEn());
  return (
    <div className='flex items-center gap-3'>
      <div className='h-px flex-1 bg-border/50' />
      <span className='text-[11px] text-muted-foreground/60'>{t.allListed}</span>
      <div className='h-px flex-1 bg-border/50' />
    </div>
  );
}
