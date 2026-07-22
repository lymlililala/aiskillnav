import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '联系我们',
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
  {
    title: '内容纠错',
    desc: '发现教程、资讯或收录信息有误：请附上页面链接、出错位置，以及正确信息的依据（官方文档、公告链接等）。纠错类邮件会优先处理，核实后尽快修正。'
  },
  {
    title: '收录申请',
    desc: '推荐 AI 工具 / Agent / MCP 服务：请附官网链接、一句话简介和所属类别。收录免费，但需通过质量审核（仍在维护、功能真实、文档清晰），审核周期约 1–2 周，不保证收录。'
  },
  {
    title: '商务合作',
    desc: '内容合作、推广或联合运营：请在邮件中说明合作形式、大致预算和时间安排。信息越具体，我们评估和回复越快。'
  },
  {
    title: '建议与反馈',
    desc: '对网站功能、分类或阅读体验的任何想法，直接写信告诉我们就好，无需特定格式。'
  }
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
            我们通常会在 1–3 个工作日内回复；内容纠错优先处理。
            <br />
            收录申请需走完审核流程，周期约 1–2 周，请耐心等待。
          </p>
        </section>

        {/* 联系前必读 */}
        <p className='text-muted-foreground mt-10 mb-4 text-center text-sm'>
          联系前必读：不同事项需要的信息不同，按说明提供能帮我们更快处理。
        </p>
        <div className='grid gap-4 sm:grid-cols-2'>
          {REASONS.map((r) => (
            <div key={r.title} className='bg-card rounded-2xl border p-6 shadow-sm'>
              <h2 className='text-foreground mb-2 text-base font-semibold'>{r.title}</h2>
              <p className='text-muted-foreground text-sm leading-relaxed'>{r.desc}</p>
            </div>
          ))}
        </div>

        <p className='text-muted-foreground mt-10 text-center text-sm'>
          也可以先了解：
          <Link href='/about' className='text-primary hover:underline'>
            关于我们
          </Link>
          {' · '}
          <Link href='/privacy-policy' className='text-primary hover:underline'>
            隐私政策
          </Link>
          {' · '}
          <Link href='/terms' className='text-primary hover:underline'>
            服务条款
          </Link>
        </p>
      </div>
    </div>
  );
}
