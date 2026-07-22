import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact AI Skill Navigation (aiskillnav.com): partnerships, content corrections, tool submissions and feedback — reach us at contact@aiskillnav.com.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/contact',
    languages: {
      'zh-CN': 'https://aiskillnav.com/contact',
      en: 'https://aiskillnav.com/en/contact'
    }
  }
};

const REASONS = [
  {
    title: 'Corrections',
    desc: 'Found an error in a tutorial, news item or listing? Include the page URL, where the problem is, and a pointer to the correct information (official docs, announcements). Correction emails are prioritized and fixed once verified.'
  },
  {
    title: 'Listing requests',
    desc: 'Suggest an AI tool, agent or MCP server: send the official site, a one-line description and the category it fits. Listing is free but subject to review — actively maintained, real functionality, clear docs. Review takes about 1–2 weeks and inclusion is not guaranteed.'
  },
  {
    title: 'Partnerships',
    desc: 'Content collaboration, promotion or joint projects: tell us the format, rough budget and timeline. The more specific the email, the faster we can evaluate and reply.'
  },
  {
    title: 'Feedback',
    desc: 'Ideas about features, categories or the reading experience — just write to us, no special format needed.'
  }
];

export default function EnContactPage() {
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
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>Contact Us</h1>
          <p className='mt-4 text-lg text-muted-foreground'>
            Questions, suggestions or partnership ideas — we&apos;d love to hear from you
          </p>
        </div>
        <section className='rounded-2xl border bg-card p-8 text-center shadow-sm'>
          <p className='text-sm text-muted-foreground'>Email</p>
          <a
            href='mailto:contact@aiskillnav.com'
            className='mt-2 inline-block text-2xl font-semibold text-primary hover:underline'
          >
            contact@aiskillnav.com
          </a>
          <p className='mt-4 text-sm leading-relaxed text-muted-foreground'>
            We typically reply within 1–3 business days; corrections are prioritized.
            <br />
            Listing requests go through a full review and take about 1–2 weeks.
          </p>
        </section>
        <p className='mt-10 mb-4 text-center text-sm text-muted-foreground'>
          Before you write: each request type needs different details — including them helps us
          respond faster.
        </p>
        <div className='grid gap-4 sm:grid-cols-2'>
          {REASONS.map((r) => (
            <div key={r.title} className='rounded-2xl border bg-card p-6 shadow-sm'>
              <h2 className='mb-2 text-base font-semibold'>{r.title}</h2>
              <p className='text-sm leading-relaxed text-muted-foreground'>{r.desc}</p>
            </div>
          ))}
        </div>
        <p className='mt-10 text-center text-sm text-muted-foreground'>
          You can also read:{' '}
          <Link href='/en/about' className='text-primary hover:underline'>
            About us
          </Link>
          {' · '}
          <Link href='/en/privacy-policy' className='text-primary hover:underline'>
            Privacy policy
          </Link>
          {' · '}
          <Link href='/en/terms' className='text-primary hover:underline'>
            Terms of service
          </Link>
        </p>
      </div>
    </div>
  );
}
