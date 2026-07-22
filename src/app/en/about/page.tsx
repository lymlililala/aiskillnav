import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'AI Skill Navigation (aiskillnav.com) is a navigation and learning platform for AI Agent tools, MCP servers, model comparisons, hands-on tutorials and use cases for developers and teams.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/about',
    languages: { 'zh-CN': 'https://aiskillnav.com/about', en: 'https://aiskillnav.com/en/about' }
  }
};

export default function EnAboutPage() {
  return (
    <div className='px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl'>
        <Link
          href='/en'
          className='mb-8 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground'
        >
          ← Back to home
        </Link>
        <div className='mb-12 text-center'>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>About Us</h1>
          <p className='mt-4 text-lg text-muted-foreground'>
            A navigation and learning platform for AI builders
          </p>
        </div>
        <div className='space-y-8'>
          <section className='rounded-2xl border bg-card p-8 shadow-sm'>
            <h2 className='mb-4 text-xl font-semibold'>Who we are</h2>
            <p className='text-lg leading-relaxed text-muted-foreground'>
              AI Skill Navigation (
              <span className='font-medium text-foreground'>aiskillnav.com</span>) helps developers
              and teams keep up with the fast-moving AI ecosystem. We curate quality tools and write
              practical, in-depth tutorials so you can find the right tool, understand model
              trade-offs, and ship AI features with confidence.
            </p>
          </section>
          <section className='rounded-2xl border bg-card p-8 shadow-sm'>
            <h2 className='mb-4 text-xl font-semibold'>What we offer</h2>
            <ul className='space-y-3 text-lg leading-relaxed text-muted-foreground'>
              <li>
                <Link href='/en/tutorials' className='text-primary hover:underline'>
                  Tutorials
                </Link>
                : hands-on guides on RAG, agents, fine-tuning, deployment, prompt engineering and
                more.
              </li>
              <li>
                <Link href='/en/mcp' className='text-primary hover:underline'>
                  MCP directory
                </Link>
                ,{' '}
                <Link href='/en/agents' className='text-primary hover:underline'>
                  Agent Hub
                </Link>{' '}
                and{' '}
                <Link href='/en/skills' className='text-primary hover:underline'>
                  Skills
                </Link>
                : curated listings organized by capability.
              </li>
              <li>
                <Link href='/en/models' className='text-primary hover:underline'>
                  Model comparisons
                </Link>{' '}
                and tool reviews to support real engineering decisions.
              </li>
              <li>
                <Link href='/en/news' className='text-primary hover:underline'>
                  AI news
                </Link>{' '}
                covering the releases and events that actually matter.
              </li>
            </ul>
          </section>
          <section className='rounded-2xl border bg-card p-8 shadow-sm'>
            <h2 className='mb-4 text-xl font-semibold'>How our content is made</h2>
            <p className='text-lg leading-relaxed text-muted-foreground'>
              Topics are chosen by our editorial team from official releases, community discussion
              and hands-on experience — whatever is genuinely useful to developers. Drafts are
              written with AI assistance for speed and coverage, then every piece is reviewed by a
              human editor before publication: facts are checked, code examples are verified, and
              filler is cut. News items are compiled from public reports and official announcements,
              with sources credited on the page. We state this process openly, and we keep investing
              in deeper review. If you spot something we missed, please tell us.
            </p>
          </section>
          <section className='rounded-2xl border bg-card p-8 shadow-sm'>
            <h2 className='mb-4 text-xl font-semibold'>Listing criteria</h2>
            <p className='text-lg leading-relaxed text-muted-foreground'>
              To be listed, a tool, agent or MCP server must be actively maintained, offer real
              working functionality rather than a demo shell, have clear documentation, and make no
              misleading claims. Listing is free and cannot be bought, and being listed does not
              mean we endorse the product. If a listed project becomes unmaintained or no longer
              meets these standards, let us know and we will update or remove it.
            </p>
          </section>
          <section className='rounded-2xl border bg-card p-8 shadow-sm'>
            <h2 className='mb-4 text-xl font-semibold'>Corrections &amp; updates</h2>
            <p className='text-lg leading-relaxed text-muted-foreground'>
              AI moves fast and some content will lag behind. If you find an error or outdated
              information, email{' '}
              <a href='mailto:contact@aiskillnav.com' className='text-primary hover:underline'>
                contact@aiskillnav.com
              </a>{' '}
              with the page URL and a pointer to the correct information (official docs, for
              example). We verify and fix as quickly as we can.
            </p>
          </section>
          <section className='rounded-2xl border bg-card p-8 shadow-sm'>
            <h2 className='mb-4 text-xl font-semibold'>Contact</h2>
            <p className='text-lg leading-relaxed text-muted-foreground'>
              For partnerships, feedback or corrections, email{' '}
              <a
                href='mailto:contact@aiskillnav.com'
                className='font-medium text-primary hover:underline'
              >
                contact@aiskillnav.com
              </a>
              , or see our{' '}
              <Link href='/en/contact' className='text-primary hover:underline'>
                contact page
              </Link>{' '}
              for what to include for each type of request.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
