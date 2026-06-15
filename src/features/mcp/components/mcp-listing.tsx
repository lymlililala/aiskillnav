import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getQueryClient } from '@/lib/query-client';
import { searchParamsCache } from '@/lib/searchparams';
import { mcpQueryOptions, mcpStatsOptions } from '../api/queries';
import { McpStats, McpStatsSkeleton } from './mcp-stats';
import { McpFilters } from './mcp-filters';
import { McpGrid, McpGridSkeleton } from './mcp-grid';
import { McpIntro } from './mcp-intro';

export default function McpListingPage() {
  const page = searchParamsCache.get('mcp_page') ?? 1;
  const search = searchParamsCache.get('mcp_search') ?? '';
  const category = searchParamsCache.get('mcp_cat') ?? 'all';

  const filters = {
    page,
    limit: 24,
    ...(search && { search }),
    ...(category !== 'all' && { category })
  };

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(mcpQueryOptions(filters));
  void queryClient.prefetchQuery(mcpStatsOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='space-y-6'>
        <Suspense fallback={<McpStatsSkeleton />}>
          <McpStats />
        </Suspense>

        <McpIntro />

        <McpFilters />

        <Suspense fallback={<McpGridSkeleton />}>
          <McpGrid />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
