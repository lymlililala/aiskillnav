import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for AI Skill Navigation (aiskillnav.com): content use, intellectual property, disclaimers and scope.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/terms',
    languages: { 'zh-CN': 'https://aiskillnav.com/terms', en: 'https://aiskillnav.com/en/terms' }
  }
};

export default function EnTermsPage() {
  return (
    <div className='px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl space-y-8'>
        <Link href='/en' className='inline-block text-sm text-muted-foreground transition-colors hover:text-foreground'>
          ← Back to home
        </Link>
        <h1 className='text-3xl font-bold'>Terms of Service</h1>
        <p className='text-base leading-relaxed text-muted-foreground'>
          Welcome to AI Skill Navigation (aiskillnav.com, the &quot;Site&quot;). By accessing or using
          the Site, you agree to these terms.
        </p>
        <section>
          <h2 className='mb-3 text-xl font-semibold'>Service</h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            The Site is an AI tooling navigation and learning platform providing tool listings, model
            comparisons, tutorials and news for reference and learning. Content is for general
            informational purposes and does not constitute professional advice.
          </p>
        </section>
        <section>
          <h2 className='mb-3 text-xl font-semibold'>Intellectual property</h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            Original content created by the Site (tutorials, articles, use cases) is owned by the Site;
            large-scale copying, reposting or mirroring for commercial purposes without permission is
            prohibited. Third-party information, trademarks and names belong to their respective owners.
            If you believe content infringes your rights, contact us and we will address it promptly.
          </p>
        </section>
        <section>
          <h2 className='mb-3 text-xl font-semibold'>Acceptable use</h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            Use the Site lawfully and reasonably. Do not use it for illegal activity, and do not
            perform excessive automated scraping, attacks or actions that disrupt normal operation.
          </p>
        </section>
        <section>
          <h2 className='mb-3 text-xl font-semibold'>Third-party links &amp; disclaimer</h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            The Site links to third-party tools and websites for convenience and makes no warranty
            about their accuracy, availability or safety. Content is provided &quot;as is&quot;; while
            we strive for accuracy, we do not guarantee completeness, timeliness or fitness for a
            particular purpose. Decisions you make based on it are your own responsibility.
          </p>
        </section>
        <section>
          <h2 className='mb-3 text-xl font-semibold'>Changes</h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            We may revise these terms from time to time; updates are posted on this page. Continued use
            constitutes acceptance of the revised terms.
          </p>
        </section>
        <section>
          <h2 className='mb-3 text-xl font-semibold'>Contact</h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            Questions about these terms? Email{' '}
            <a href='mailto:contact@aiskillnav.com' className='font-medium text-primary hover:underline'>
              contact@aiskillnav.com
            </a>
            .
          </p>
        </section>
        <div className='border-t border-border pt-4'>
          <p className='text-sm text-muted-foreground'>Last updated: June 2026</p>
        </div>
      </div>
    </div>
  );
}
