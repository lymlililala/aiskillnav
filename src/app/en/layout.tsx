import Link from 'next/link';
import { Icons } from '@/components/icons';
import { ThemeModeToggle } from '@/components/themes/theme-mode-toggle';

const NAV = [
  { label: 'Tutorials', href: '/en/tutorials' },
  { label: 'Use Cases', href: '/en/usecases' },
  { label: 'News', href: '/en/news' },
  { label: 'About', href: '/en/about' },
  { label: 'Contact', href: '/en/contact' }
];

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* Navbar */}
      <nav className='sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6'>
          <Link
            href='/en'
            className='flex items-center gap-2.5 font-semibold hover:opacity-80 transition-opacity'
          >
            <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
              <Icons.skillsHub className='h-4 w-4' />
            </div>
            <span className='text-sm font-semibold'>AI Skill Navigation</span>
          </Link>
          <div className='flex items-center gap-0.5'>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='hidden rounded-md px-3.5 py-1.5 text-sm font-medium text-muted-foreground/80 transition-all hover:bg-accent/60 hover:text-foreground sm:block'
              >
                {item.label}
              </Link>
            ))}
            {/* 语言切换：回中文站 */}
            <Link
              href='/'
              className='rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground/80 hover:text-foreground'
            >
              中文
            </Link>
            <div className='ml-2 flex items-center gap-1 border-l pl-2'>
              <ThemeModeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className='flex-1'>{children}</main>

      {/* Footer */}
      <footer className='border-t bg-muted/20 py-10'>
        <div className='mx-auto max-w-6xl px-4 md:px-6'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                  <Icons.skillsHub className='h-4 w-4' />
                </div>
                <span className='text-sm font-semibold'>AI Skill Navigation</span>
              </div>
              <p className='max-w-sm text-xs leading-relaxed text-muted-foreground'>
                A curated navigation hub for AI Agent tools, helping developers and teams discover
                the best AI tools, models, and tutorials.
              </p>
              <a
                href='mailto:contact@aiskillnav.com'
                className='block text-xs text-muted-foreground transition-colors hover:text-foreground'
              >
                contact@aiskillnav.com
              </a>
            </div>
            <ul className='space-y-2'>
              {[
                { label: 'Tutorials', href: '/en/tutorials' },
                { label: 'Use Cases', href: '/en/usecases' },
                { label: 'News', href: '/en/news' },
                { label: 'About', href: '/en/about' },
                { label: 'Contact', href: '/en/contact' },
                { label: 'Privacy Policy', href: '/en/privacy-policy' },
                { label: 'Terms', href: '/en/terms' }
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className='text-xs text-muted-foreground transition-colors hover:text-foreground'
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className='mt-8 flex items-center justify-between border-t pt-6 text-xs text-muted-foreground'>
            <p>© {new Date().getFullYear()} AI Skill Navigation · aiskillnav.com</p>
            <p>All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
