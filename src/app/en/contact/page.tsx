import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | AI Skill Navigation',
  description:
    'Contact AI Skill Navigation (aiskillnav.com): partnerships, content corrections, tool submissions and feedback — reach us at contact@aiskillnav.com.',
  alternates: {
    canonical: 'https://aiskillnav.com/en/contact',
    languages: { 'zh-CN': 'https://aiskillnav.com/contact', en: 'https://aiskillnav.com/en/contact' }
  }
};

const REASONS = [
  { title: 'Partnerships', desc: 'Content collaboration, promotion, tool listing and joint projects.' },
  { title: 'Corrections', desc: 'Found an error in a tutorial or data? Let us know and we will verify and update.' },
  { title: 'Product feedback', desc: 'Ideas about site features, categories or experience are welcome.' },
  { title: 'Tool submissions', desc: 'Recommend a quality AI tool / Agent / MCP server with a link and short description.' }
];

export default function EnContactPage() {
  return (
    <div className='px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl'>
        <Link href='/en' className='mb-8 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground'>
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
            We typically reply within 1–3 business days.
          </p>
        </section>
        <div className='mt-8 grid gap-4 sm:grid-cols-2'>
          {REASONS.map((r) => (
            <div key={r.title} className='rounded-2xl border bg-card p-6 shadow-sm'>
              <h2 className='mb-2 text-base font-semibold'>{r.title}</h2>
              <p className='text-sm leading-relaxed text-muted-foreground'>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
