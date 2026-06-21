import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for AI Skill Navigation (aiskillnav.com): how we collect, use and protect visitor information, plus cookies, third-party services and contact details.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/privacy-policy',
    languages: { 'zh-CN': 'https://aiskillnav.com/privacy-policy', en: 'https://aiskillnav.com/en/privacy-policy' }
  }
};

export default function EnPrivacyPage() {
  return (
    <div className='px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl space-y-8'>
        <Link href='/en' className='inline-block text-sm text-muted-foreground transition-colors hover:text-foreground'>
          ← Back to home
        </Link>
        <h1 className='text-3xl font-bold'>Privacy Policy</h1>
        <p className='text-base leading-relaxed text-muted-foreground'>
          This Privacy Policy explains how AI Skill Navigation (aiskillnav.com, the &quot;Site&quot;)
          collects, uses and protects information when you visit. By using the Site you agree to the
          practices described here.
        </p>

        <section>
          <h2 className='mb-3 text-xl font-semibold'>Information we collect</h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            The Site is primarily for browsing content and does not require registration. We may
            collect anonymous usage statistics (page views, referrers, device and browser type,
            approximate region) to understand what content is useful and to improve the experience.
            If you email us, we receive the address and message you choose to send.
          </p>
        </section>
        <section>
          <h2 className='mb-3 text-xl font-semibold'>How we use information</h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            We use this information only to provide and improve the Site, analyze traffic trends,
            respond to your inquiries, and maintain security. We do not sell or rent your personal
            information.
          </p>
        </section>
        <section>
          <h2 className='mb-3 text-xl font-semibold'>Cookies &amp; analytics</h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            The Site may use cookies and third-party analytics to record anonymous usage. We may also
            display ads from third-party providers (e.g. Google AdSense), which may use cookies to
            serve content based on your visits to this and other sites. You can disable cookies in
            your browser settings, though some features may be affected.
          </p>
        </section>
        <section>
          <h2 className='mb-3 text-xl font-semibold'>Third-party links</h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            The Site links to and aggregates information about third-party websites and tools. Those
            parties have their own privacy policies; we are not responsible for their content or data
            practices.
          </p>
        </section>
        <section>
          <h2 className='mb-3 text-xl font-semibold'>Data security</h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            We take reasonable technical and organizational measures to protect information, but no
            internet transmission can be guaranteed fully secure.
          </p>
        </section>
        <section>
          <h2 className='mb-3 text-xl font-semibold'>Updates</h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            We may update this policy from time to time. Changes will be posted on this page with an
            updated date below.
          </p>
        </section>
        <section>
          <h2 className='mb-3 text-xl font-semibold'>Contact</h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            Questions about this policy? Email{' '}
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
