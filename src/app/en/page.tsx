import { Metadata } from 'next';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { getAgentStats } from '@/features/agents/api/service';
import { getMcpStats } from '@/features/mcp/api/service';
import { getModelStats } from '@/features/models/api/service';
import { getUseCaseStats } from '@/features/usecases/api/service';
import { getTutorialStats, getPublishedEnglishTutorials } from '@/features/tutorials/api/service';
import { getNewsStats, getPublishedEnglishNews } from '@/features/news/api/service';

export const metadata: Metadata = {
  title: 'AI Skill Navigation — Curated AI Tools, Models & Tutorials',
  description:
    'A one-stop navigation hub for AI Agent tools: Skills, Agents, MCP servers, model comparisons, in-depth tutorials and use cases — for developers and teams.',
  alternates: {
    canonical: 'https://aiskillnav.com/en',
    languages: {
      'zh-CN': 'https://aiskillnav.com',
      en: 'https://aiskillnav.com/en',
      'x-default': 'https://aiskillnav.com'
    }
  },
  openGraph: {
    title: 'AI Skill Navigation — Curated AI Tools, Models & Tutorials',
    description: 'A one-stop navigation hub for AI Agent tools, models and in-depth tutorials.',
    url: 'https://aiskillnav.com/en',
    type: 'website',
    locale: 'en_US'
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const MODULES = [
  {
    icon: Icons.skillsHub,
    title: 'Skills',
    description: 'Curated AI skill platforms and community hubs — one click away.',
    href: '/en/skills',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600'
  },
  {
    icon: Icons.sparkles,
    title: 'Agents',
    description: 'Top AI agents like Manus, Devin, Dify and more — filter and compare.',
    href: '/en/agents',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600'
  },
  {
    icon: Icons.settings,
    title: 'MCP Servers',
    description:
      'Model Context Protocol servers connecting AI to files, DBs, GitHub, Notion and more.',
    href: '/en/mcp',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600'
  },
  {
    icon: Icons.trendingUp,
    title: 'Models',
    description:
      'Compare GPT, Claude, DeepSeek, Gemini and others — capability scores and pricing.',
    href: '/en/models',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600'
  },
  {
    icon: Icons.post,
    title: 'Tutorials',
    description: 'In-depth, practical guides on RAG, agents, deployment, fine-tuning and more.',
    href: '/en/tutorials',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-600'
  },
  {
    icon: Icons.checks,
    title: 'Use Cases',
    description: 'Real-world AI workflows with recommended tool stacks and step-by-step guides.',
    href: '/en/usecases',
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-600'
  },
  {
    icon: Icons.trendingUp,
    title: 'AI News',
    description: 'Track major events across the AI Agent landscape.',
    href: '/en/news',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-600'
  }
];

async function getStats() {
  const [agents, mcp, models, usecases, tutorials, news] = await Promise.all([
    getAgentStats().catch(() => ({ total: 0 })),
    getMcpStats().catch(() => ({ total: 0 })),
    getModelStats().catch(() => ({ total: 0 })),
    getUseCaseStats().catch(() => ({ total: 0 })),
    getTutorialStats().catch(() => ({ total: 0 })),
    getNewsStats().catch(() => ({ published: 0 }))
  ]);
  return [
    { value: `${agents.total}+`, label: 'AI Agents' },
    { value: `${mcp.total}+`, label: 'MCP Servers' },
    { value: `${models.total}`, label: 'Models' },
    { value: `${usecases.total}`, label: 'Use Cases' },
    { value: `${tutorials.total}`, label: 'Tutorials' },
    { value: `${news.published ?? 0}`, label: 'News' }
  ];
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AI Skill Navigation',
  url: 'https://aiskillnav.com/en',
  description: 'A one-stop navigation hub for AI Agent tools, models and in-depth tutorials.',
  inLanguage: 'en',
  publisher: {
    '@type': 'Organization',
    name: 'AI Skill Navigation',
    url: 'https://aiskillnav.com',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@aiskillnav.com',
      contactType: 'customer support'
    }
  }
};

export default async function EnHomePage() {
  const [stats, tutorials, news] = await Promise.all([
    getStats(),
    getPublishedEnglishTutorials().catch(() => []),
    getPublishedEnglishNews().catch(() => [])
  ]);
  const featured = tutorials.slice(0, 6);
  const latestNews = news.slice(0, 6);

  return (
    <div className='text-foreground'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className='relative overflow-hidden border-b py-20 md:py-28'>
        <div className='pointer-events-none absolute inset-0 -z-10'>
          <div className='absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl' />
        </div>
        <div className='mx-auto max-w-4xl px-4 text-center md:px-6'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm'>
            <span className='flex h-1.5 w-1.5 rounded-full bg-emerald-500' />
            aiskillnav.com · AI Agent tooling hub
          </div>
          <h1 className='mb-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'>
            Discover the best <span className='text-primary'>AI Agent</span> tools
          </h1>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-muted-foreground'>
            A one-stop hub for Skills, Agents, MCP servers, model comparisons, in-depth tutorials
            and real-world use cases.
          </p>
          <div className='flex justify-center gap-3'>
            <Link
              href='/en/tutorials'
              className='rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'
            >
              Browse tutorials
            </Link>
            <Link
              href='/en/agents'
              className='rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent'
            >
              Explore agents
            </Link>
            <Link
              href='/en/mcp'
              className='rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent'
            >
              MCP servers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className='border-b bg-muted/20 py-10'>
        <div className='mx-auto grid max-w-6xl grid-cols-3 gap-6 px-4 md:grid-cols-6 md:px-6'>
          {stats.map((s) => (
            <div key={s.label} className='text-center'>
              <div className='text-3xl font-bold'>{s.value}</div>
              <div className='mt-1 text-xs text-muted-foreground'>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className='mx-auto max-w-6xl px-4 py-16 md:px-6'>
        <div className='mb-8 text-center'>
          <h2 className='text-2xl font-bold'>Everything you need</h2>
          <p className='mt-2 text-muted-foreground'>
            7 modules covering the full AI Agent workflow.
          </p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {MODULES.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className='group rounded-xl border bg-card p-6 shadow-sm transition-colors hover:border-primary/30'
            >
              <div
                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${m.iconBg}`}
              >
                <m.icon className={`h-5 w-5 ${m.iconColor}`} />
              </div>
              <h3 className='font-semibold group-hover:text-primary'>{m.title}</h3>
              <p className='mt-1.5 text-sm leading-relaxed text-muted-foreground'>
                {m.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured tutorials */}
      {featured.length > 0 && (
        <section className='border-t bg-muted/20 py-16'>
          <div className='mx-auto max-w-6xl px-4 md:px-6'>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-2xl font-bold'>Featured tutorials</h2>
              <Link href='/en/tutorials' className='text-sm text-primary hover:underline'>
                View all →
              </Link>
            </div>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {featured.map((t) => (
                <Link
                  key={t.slug}
                  href={`/en/tutorials/${t.slug}`}
                  className='group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30'
                >
                  <h3 className='font-semibold leading-snug group-hover:text-primary'>
                    {t.title_en}
                  </h3>
                  {t.summary_en && (
                    <p className='mt-2 line-clamp-2 text-sm text-muted-foreground'>
                      {t.summary_en}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest news */}
      {latestNews.length > 0 && (
        <section className='mx-auto max-w-6xl px-4 py-16 md:px-6'>
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-2xl font-bold'>Latest news</h2>
            <Link href='/en/news' className='text-sm text-primary hover:underline'>
              View all →
            </Link>
          </div>
          <div className='space-y-3'>
            {latestNews.map((n) => (
              <Link
                key={n.slug}
                href={`/en/news/${n.slug}`}
                className='group block rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-primary/30'
              >
                <span className='font-medium group-hover:text-primary'>{n.title_en}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className='border-t py-16'>
        <div className='mx-auto max-w-3xl px-4 text-center md:px-6'>
          <h2 className='text-2xl font-bold'>Start exploring</h2>
          <p className='mt-2 text-muted-foreground'>
            Find the right AI tools and learn how to ship with them.
          </p>
          <div className='mt-6 flex justify-center gap-3'>
            <Link
              href='/en/tutorials'
              className='rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90'
            >
              Tutorials
            </Link>
            <Link
              href='/en/usecases'
              className='rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-accent'
            >
              Use cases
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
