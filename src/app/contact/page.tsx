import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '联系我们 | AI Skill Navigation',
  description:
    '联系 AI Skill Navigation（aiskillnav.com）：合作洽谈、内容纠错、工具收录、建议反馈，请通过 contact@aiskillnav.com 与我们联系。',
  alternates: { canonical: 'https://aiskillnav.com/contact' },
  openGraph: {
    title: '联系我们 | AI Skill Navigation',
    description: '合作、内容纠错、工具收录、建议反馈，请通过 contact@aiskillnav.com 联系我们。',
    url: 'https://aiskillnav.com/contact',
    type: 'website'
  }
};

const REASONS = [
  { title: '商务合作', desc: '内容合作、推广、工具收录与联合运营。' },
  { title: '内容纠错', desc: '发现教程、资讯或数据有误，欢迎指正，我们会及时核实更新。' },
  { title: '产品建议', desc: '对网站功能、分类或体验有任何想法，欢迎反馈。' },
  { title: '工具提交', desc: '推荐优质的 AI 工具 / Agent / MCP 服务，请附上链接与简介。' }
];

export default function ContactPage() {
  return (
    <div className='min-h-screen px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl'>
        <Link
          href='/'
          className='text-muted-foreground hover:text-foreground mb-8 inline-block text-sm transition-colors'
        >
          ← 返回首页
        </Link>

        <div className='mb-12 text-center'>
          <h1 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
            联系我们
          </h1>
          <p className='text-muted-foreground mt-4 text-lg'>
            有任何问题、建议或合作意向，欢迎与我们联系
          </p>
        </div>

        {/* 邮箱卡片 */}
        <section className='bg-card rounded-2xl border p-8 text-center shadow-sm'>
          <p className='text-muted-foreground text-sm'>电子邮箱</p>
          <a
            href='mailto:contact@aiskillnav.com'
            className='text-primary mt-2 inline-block text-2xl font-semibold hover:underline'
          >
            contact@aiskillnav.com
          </a>
          <p className='text-muted-foreground mt-4 text-sm leading-relaxed'>
            我们通常会在 1–3 个工作日内回复。
          </p>
        </section>

        {/* 可联系的事项 */}
        <div className='mt-8 grid gap-4 sm:grid-cols-2'>
          {REASONS.map((r) => (
            <div key={r.title} className='bg-card rounded-2xl border p-6 shadow-sm'>
              <h2 className='text-foreground mb-2 text-base font-semibold'>{r.title}</h2>
              <p className='text-muted-foreground text-sm leading-relaxed'>{r.desc}</p>
            </div>
          ))}
        </div>

        <p className='text-muted-foreground mt-10 text-center text-sm'>
          也可以先看看{' '}
          <Link href='/about' className='text-primary hover:underline'>
            关于我们
          </Link>{' '}
          了解平台。
        </p>
      </div>
    </div>
  );
}
