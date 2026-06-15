import { Metadata } from 'next';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { getAgentStats } from '@/features/agents/api/service';
import { getMcpStats } from '@/features/mcp/api/service';
import { getModelStats } from '@/features/models/api/service';
import { getUseCaseStats } from '@/features/usecases/api/service';
import { getTutorialStats, getPublishedEnglishTutorials } from '@/features/tutorials/api/service';
import { getNewsStats, getPublishedEnglishNews } from '@/features/news/api/service';
import { enNewsCategory } from '@/features/news/category-i18n';

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

// ── Module cards ─────────────────────────────────────────────────────────────

const MODULES = [
  {
    icon: Icons.skillsHub,
    title: 'Skills',
    description: 'Curated global AI skill platforms and community hubs — official sites and aggregators, one click away.',
    href: '/en/skills',
    badge: 'Curated',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    gradient: 'from-blue-500/10 to-transparent',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600'
  },
  {
    icon: Icons.sparkles,
    title: 'Agent Hub',
    description: 'Top AI agents like Manus, Devin, OpenClaw and Dify — filter by type and compare side by side.',
    href: '/en/agents',
    badge: '27+ Agents',
    badgeColor: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    gradient: 'from-violet-500/10 to-transparent',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600'
  },
  {
    icon: Icons.settings,
    title: 'MCP Servers',
    description:
      'Model Context Protocol servers that connect AI to files, databases, GitHub, Notion and more — 20+ ready to use.',
    href: '/en/mcp',
    badge: '20+ Servers',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    gradient: 'from-emerald-500/10 to-transparent',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600'
  },
  {
    icon: Icons.trendingUp,
    title: 'Model Comparison',
    description:
      'GPT-4o, Claude 3.5, DeepSeek-V3, Gemini 2.0 and more — capability scores, pricing and benchmark rankings.',
    href: '/en/models',
    badge: '8 Models',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    gradient: 'from-amber-500/10 to-transparent',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600'
  },
  {
    icon: Icons.post,
    title: 'Tutorials',
    description:
      'From "what is an AI Agent" to hands-on builds — systematic guides covering MCP, Dify and n8n automation.',
    href: '/en/tutorials',
    badge: '8 Guides',
    badgeColor: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    gradient: 'from-orange-500/10 to-transparent',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-600'
  },
  {
    icon: Icons.checks,
    title: 'Use Cases',
    description:
      'Real-world workflows: marketing automation, auto bug-fixing, industry research, email triage — with tool stacks and steps.',
    href: '/en/usecases',
    badge: '15 Cases',
    badgeColor: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
    gradient: 'from-pink-500/10 to-transparent',
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-600'
  },
  {
    icon: Icons.trendingUp,
    title: 'AI News',
    description:
      'Track major events across the AI Agent landscape: Manus acquired by Meta, DeepSeek-R1 open-sourced, MCP born — full timeline.',
    href: '/en/news',
    badge: 'Live',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    gradient: 'from-rose-500/10 to-transparent',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-600'
  }
];

// ── Stats ─────────────────────────────────────────────────────────────────────

async function getLiveStats() {
  const [agents, mcp, models, usecases, tutorials, news] = await Promise.all([
    getAgentStats().catch(() => ({ total: 0 })),
    getMcpStats().catch(() => ({ total: 0 })),
    getModelStats().catch(() => ({ total: 0 })),
    getUseCaseStats().catch(() => ({ total: 0 })),
    getTutorialStats().catch(() => ({ total: 0 })),
    getNewsStats().catch(() => ({ published: 0 }))
  ]);
  return { agents, mcp, models, usecases, tutorials, news };
}

function buildStats(live: Awaited<ReturnType<typeof getLiveStats>>) {
  return [
    { value: `${live.agents.total}+`, label: 'AI Agents' },
    { value: `${live.mcp.total}+`, label: 'MCP Servers' },
    { value: `${live.models.total}`, label: 'Models' },
    { value: `${live.usecases.total}`, label: 'Use Cases' },
    { value: `${live.tutorials.total}`, label: 'Tutorials' },
    { value: `${live.news.published ?? 0}`, label: 'News' }
  ];
}

function patchModuleBadges(live: Awaited<ReturnType<typeof getLiveStats>>) {
  return MODULES.map((mod) => {
    switch (mod.href) {
      case '/en/agents':
        return { ...mod, badge: `${live.agents.total}+ Agents` };
      case '/en/mcp':
        return { ...mod, badge: `${live.mcp.total}+ Servers` };
      case '/en/models':
        return { ...mod, badge: `${live.models.total} Models` };
      case '/en/tutorials':
        return { ...mod, badge: `${live.tutorials.total} Guides` };
      case '/en/usecases':
        return { ...mod, badge: `${live.usecases.total} Cases` };
      case '/en/news':
        return { ...mod, badge: `${live.news.published ?? 0} News` };
      default:
        return mod;
    }
  });
}

// ── Timeline preview ──────────────────────────────────────────────────────────

const TIMELINE_PREVIEW = [
  { date: '2024-11', title: 'MCP protocol born', desc: 'AI Agent interfaces standardized' },
  { date: '2025-01', title: 'DeepSeek-R1', desc: 'Open-source reasoning at 3% of the cost' },
  { date: '2025-03', title: 'Manus goes viral', desc: 'The year of the general-purpose Agent' },
  { date: '2025-12', title: 'Meta acquires Manus', desc: 'Big tech bets on the Agent race' }
];

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
  const [liveStats, tutorials, news] = await Promise.all([
    getLiveStats(),
    getPublishedEnglishTutorials().catch(() => []),
    getPublishedEnglishNews().catch(() => [])
  ]);
  const STATS = buildStats(liveStats);
  const dynamicModules = patchModuleBadges(liveStats);
  const featured = tutorials.slice(0, 4);
  const latestNews = news.slice(0, 6);

  return (
    <div className='text-foreground'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
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
            Discover the best
            <span className='relative mx-2 text-primary'>AI Agent</span>
            tools
          </h1>
          <p className='mx-auto mb-8 max-w-2xl text-base text-muted-foreground md:text-lg'>
            A one-stop hub for Skills, Agents, MCP servers and model comparisons,
            <br className='hidden md:block' />
            with hands-on tutorials and real-world use cases.
          </p>
          <div className='flex flex-wrap justify-center gap-3'>
            <Link
              href='/en/skills'
              className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0'
            >
              <Icons.skillsHub className='h-[18px] w-[18px]' />
              Browse Skills
            </Link>
            <Link
              href='/en/agents'
              className='inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-5 py-3 text-sm font-semibold shadow-[0_1px_3px_0_rgba(0,0,0,0.08),0_1px_2px_0_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-border hover:bg-accent hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08)] active:translate-y-0'
            >
              <Icons.sparkles className='h-[18px] w-[18px]' />
              Explore Agents
            </Link>
            <Link
              href='/en/mcp'
              className='inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-5 py-3 text-sm font-semibold shadow-[0_1px_3px_0_rgba(0,0,0,0.08),0_1px_2px_0_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-border hover:bg-accent hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08)] active:translate-y-0'
            >
              <Icons.settings className='h-[18px] w-[18px]' />
              MCP Servers
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className='border-b bg-muted/30'>
        <div className='mx-auto max-w-6xl px-4 py-8 md:px-6'>
          <div className='grid grid-cols-3 gap-4 sm:grid-cols-6'>
            {STATS.map((s) => (
              <div key={s.label} className='flex flex-col items-center gap-1 text-center'>
                <p className='text-2xl font-bold text-foreground md:text-3xl'>{s.value}</p>
                <p className='text-xs text-muted-foreground'>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Module Grid ── */}
      <section className='py-16 md:py-20'>
        <div className='mx-auto max-w-6xl px-4 md:px-6'>
          <div className='mb-10 text-center'>
            <h2 className='text-2xl font-bold tracking-tight md:text-3xl'>Everything you need</h2>
            <p className='mt-2 text-muted-foreground'>
              7 modules covering the full AI Agent workflow.
            </p>
          </div>

          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {dynamicModules.map((mod) => {
              const ModIcon = mod.icon;
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className={`group relative flex flex-col rounded-2xl border bg-gradient-to-br ${mod.gradient} p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30`}
                >
                  <span
                    className={`absolute right-4 top-4 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${mod.badgeColor}`}
                  >
                    {mod.badge}
                  </span>

                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${mod.iconBg}`}
                  >
                    <ModIcon className={`h-5 w-5 ${mod.iconColor}`} />
                  </div>

                  <h3 className='mb-2 text-sm font-bold group-hover:text-primary transition-colors'>
                    {mod.title}
                  </h3>
                  <p className='flex-1 text-xs leading-relaxed text-muted-foreground'>
                    {mod.description}
                  </p>

                  <div className='mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5'>
                    Enter <Icons.chevronRight className='h-3.5 w-3.5' />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline Preview ── */}
      <section className='border-t border-b bg-muted/20 py-14 md:py-16'>
        <div className='mx-auto max-w-6xl px-4 md:px-6'>
          <div className='mb-8 flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-bold tracking-tight md:text-2xl'>
                Major AI Agent events
              </h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                Industry milestones from 2024 to today
              </p>
            </div>
            <Link
              href='/en/news'
              className='flex items-center gap-1 text-xs text-primary hover:underline'
            >
              View all <Icons.chevronRight className='h-3.5 w-3.5' />
            </Link>
          </div>

          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            {TIMELINE_PREVIEW.map((event) => (
              <div
                key={event.date}
                className='flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm'
              >
                <span className='text-[11px] font-mono text-primary/80'>{event.date}</span>
                <p className='text-sm font-semibold'>{event.title}</p>
                <p className='text-xs text-muted-foreground'>{event.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Tutorials ── */}
      {featured.length > 0 && (
        <section className='py-14 md:py-16'>
          <div className='mx-auto max-w-6xl px-4 md:px-6'>
            <div className='mb-8 flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold tracking-tight md:text-2xl'>Featured tutorials</h2>
                <p className='mt-1 text-sm text-muted-foreground'>
                  From first steps to shipping — hands-on guides for every AI tool
                </p>
              </div>
              <Link
                href='/en/tutorials'
                className='flex items-center gap-1 text-xs text-primary hover:underline'
              >
                View all <Icons.chevronRight className='h-3.5 w-3.5' />
              </Link>
            </div>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {featured.map((t) => (
                <Link
                  key={t.slug}
                  href={`/en/tutorials/${t.slug}`}
                  className='group flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
                >
                  <h3 className='text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2'>
                    {t.title_en}
                  </h3>
                  {t.summary_en && (
                    <p className='flex-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
                      {t.summary_en}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest News ── */}
      {latestNews.length > 0 && (
        <section className='border-t bg-muted/20 py-14 md:py-16'>
          <div className='mx-auto max-w-6xl px-4 md:px-6'>
            <div className='mb-8 flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold tracking-tight md:text-2xl'>Latest news</h2>
                <p className='mt-1 text-sm text-muted-foreground'>
                  The latest developments and analysis across the AI Agent landscape
                </p>
              </div>
              <Link
                href='/en/news'
                className='flex items-center gap-1 text-xs text-primary hover:underline'
              >
                View all <Icons.chevronRight className='h-3.5 w-3.5' />
              </Link>
            </div>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {latestNews.map((n) => (
                <Link
                  key={n.slug}
                  href={`/en/news/${n.slug}`}
                  className='group flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30'
                >
                  <h3 className='text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2'>
                    {n.title_en}
                  </h3>
                  <div className='flex items-center justify-between'>
                    <span className='text-[11px] text-muted-foreground'>
                      {enNewsCategory(n.category)}
                    </span>
                    <span className='text-[11px] text-muted-foreground'>
                      {new Date(n.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className='py-16 md:py-20'>
        <div className='mx-auto max-w-2xl px-4 text-center md:px-6'>
          <h2 className='mb-3 text-2xl font-bold tracking-tight md:text-3xl'>Start exploring now</h2>
          <p className='mb-8 text-muted-foreground'>
            From beginner tutorials to pro-grade Agent tools — find everything you need in one place
          </p>
          <div className='flex flex-wrap justify-center gap-3'>
            <Link
              href='/en/tutorials'
              className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0'
            >
              <Icons.post className='h-[18px] w-[18px]' />
              Getting started
            </Link>
            <Link
              href='/en/mcp'
              className='inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-5 py-3 text-sm font-semibold shadow-[0_1px_3px_0_rgba(0,0,0,0.08),0_1px_2px_0_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-border hover:bg-accent hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08)] active:translate-y-0'
            >
              <Icons.settings className='h-[18px] w-[18px]' />
              MCP Servers
            </Link>
            <Link
              href='/en/usecases'
              className='inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-5 py-3 text-sm font-semibold shadow-[0_1px_3px_0_rgba(0,0,0,0.08),0_1px_2px_0_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-border hover:bg-accent hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08)] active:translate-y-0'
            >
              <Icons.checks className='h-[18px] w-[18px]' />
              Use Cases
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
