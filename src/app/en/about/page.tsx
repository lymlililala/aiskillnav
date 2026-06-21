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
        <Link href='/en' className='mb-8 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground'>
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
              AI Skill Navigation (<span className='font-medium text-foreground'>aiskillnav.com</span>)
              helps developers and teams keep up with the fast-moving AI ecosystem. We curate quality
              tools and write practical, in-depth tutorials so you can find the right tool, understand
              model trade-offs, and ship AI features with confidence.
            </p>
          </section>
          <section className='rounded-2xl border bg-card p-8 shadow-sm'>
            <h2 className='mb-4 text-xl font-semibold'>What we offer</h2>
            <ul className='space-y-3 text-lg leading-relaxed text-muted-foreground'>
              <li>
                <Link href='/en/tutorials' className='text-primary hover:underline'>Tutorials</Link>: hands-on
                guides on RAG, agents, fine-tuning, deployment, prompt engineering and more.
              </li>
              <li>Model comparisons and tool reviews to support real engineering decisions.</li>
              <li>Coverage of MCP (Model Context Protocol), agent frameworks and AI infrastructure.</li>
            </ul>
          </section>
          <section className='rounded-2xl border bg-card p-8 shadow-sm'>
            <h2 className='mb-4 text-xl font-semibold'>Content &amp; quality</h2>
            <p className='text-lg leading-relaxed text-muted-foreground'>
              Our tutorials are written and edited by our team and reviewed for accuracy and depth
              before publishing. Spotted an error or have a suggestion? Please{' '}
              <Link href='/en/contact' className='text-primary hover:underline'>contact us</Link>.
            </p>
          </section>
          <section className='rounded-2xl border bg-card p-8 shadow-sm'>
            <h2 className='mb-4 text-xl font-semibold'>Contact</h2>
            <p className='text-lg leading-relaxed text-muted-foreground'>
              For partnerships, feedback or corrections, email{' '}
              <a href='mailto:contact@aiskillnav.com' className='font-medium text-primary hover:underline'>
                contact@aiskillnav.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
