'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Icons } from '@/components/icons';
import { useIsEn } from '@/hooks/use-is-en';
import { agentsStrings } from '../i18n';
import { AgentCard, AgentCardSkeleton } from './agent-card';
import { featuredAgentsOptions } from '../api/queries';

export function FeaturedAgents() {
  const t = agentsStrings(useIsEn());
  const { data: featured } = useSuspenseQuery(featuredAgentsOptions());

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <Icons.sparkles className='h-3.5 w-3.5 text-amber-500' />
        <span className='text-xs font-semibold text-foreground'>{t.featuredTitle}</span>
        <span className='text-[11px] text-muted-foreground'>{t.countUnit(featured.length)}</span>
      </div>
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {featured.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}

export function FeaturedAgentsSkeleton() {
  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <div className='h-3.5 w-3.5 animate-pulse rounded bg-muted' />
        <div className='h-3.5 w-20 animate-pulse rounded bg-muted' />
      </div>
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <AgentCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
