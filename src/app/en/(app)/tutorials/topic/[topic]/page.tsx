import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { PILLAR_TOPICS, getPillarTopic, matchPillarTopics } from '@/features/tutorials/topics';
import { getPublishedEnglishTutorials } from '@/features/tutorials/api/service';

type Props = { params: Promise<{ topic: string }> };

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const TOPIC_EN: Record<string, string> = {
  rag: 'RAG',
  agent: 'AI Agents',
  'model-deployment': 'Model Deployment',
  workflow: 'Workflow & Automation',
  openai: 'OpenAI',
  claude: 'Claude / Anthropic',
  langchain: 'LangChain / LangGraph',
  'fine-tuning': 'Fine-tuning',
  'prompt-engineering': 'Prompt Engineering',
  mcp: 'MCP',
  evaluation: 'Evaluation & Observability',
  security: 'AI Security',
  'api-integration': 'API & Integration'
};
const LEVEL_LABEL: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced'
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const t = getPillarTopic(topic);
  if (!t) return { title: 'Topic not found' };
  const label = TOPIC_EN[t.slug] ?? t.slug;
  const url = `https://aiskillnav.com/en/tutorials/topic/${t.slug}`;
  return {
    title: `${label} — AI Tutorials | AI Skill Navigation`,
    description: `Curated ${label} tutorials for AI engineers.`,
    keywords: t.matchTokens,
    alternates: {
      canonical: url,
      languages: { 'zh-CN': `https://aiskillnav.com/tutorials/topic/${t.slug}`, en: url }
    }
  };
}

export default async function EnTopicPage({ params }: Props) {
  const { topic } = await params;
  const t = getPillarTopic(topic);
  if (!t) notFound();
  const label = TOPIC_EN[t.slug] ?? t.slug;

  const all = await getPublishedEnglishTutorials();
  const tutorials = all.filter((tut) =>
    matchPillarTopics(tut.tags ?? [], tut.title_en ?? '').some((p) => p.slug === t.slug)
  );

  return (
    <PageContainer pageTitle={label} pageDescription={`Curated ${label} tutorials.`}>
      <div className='space-y-8'>
        <div className='space-y-3'>
          <Link
            href='/en/tutorials'
            className='inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
          >
            <Icons.chevronLeft className='h-4 w-4' />
            All tutorials
          </Link>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>{label}</h1>
          <p className='text-sm text-muted-foreground'>
            {tutorials.length} tutorials in this topic
          </p>
        </div>

        {tutorials.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <Icons.post className='mb-3 h-10 w-10 text-muted-foreground/40' />
            <p className='text-sm text-muted-foreground'>No tutorials in this topic yet.</p>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {tutorials.map((tut) => (
              <Link
                key={tut.slug}
                href={`/en/tutorials/${tut.slug}`}
                className='group flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'
              >
                <Badge variant='outline' className='w-fit text-[10px] text-muted-foreground'>
                  {LEVEL_LABEL[tut.level] ?? tut.level}
                </Badge>
                <h2 className='text-sm font-semibold leading-snug transition-colors group-hover:text-primary'>
                  {tut.title_en}
                </h2>
                <p className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
                  {tut.summary_en}
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className='space-y-3 border-t pt-6'>
          <h2 className='text-sm font-semibold'>Browse other topics</h2>
          <div className='flex flex-wrap gap-2'>
            {PILLAR_TOPICS.filter((x) => x.slug !== t.slug).map((x) => (
              <Link
                key={x.slug}
                href={`/en/tutorials/topic/${x.slug}`}
                className='rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground'
              >
                {TOPIC_EN[x.slug] ?? x.slug}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
