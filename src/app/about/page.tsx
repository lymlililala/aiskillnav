import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '关于我们',
  description:
    'AI Skill Navigation（aiskillnav.com）是一站式 AI Agent 工具导航与学习平台，聚合优质 AI 工具、MCP 服务、模型对比、实战教程与应用场景，帮助开发者和团队高效发现并用好 AI。',
  alternates: { canonical: 'https://aiskillnav.com/about' },
  openGraph: {
    title: '关于我们 | AI Skill Navigation',
    description: '一站式 AI Agent 工具导航与学习平台，帮助开发者和团队高效发现并用好 AI。',
    url: 'https://aiskillnav.com/about',
    type: 'website'
  }
};

export default function AboutPage() {
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
            关于我们
          </h1>
          <p className='text-muted-foreground mt-4 text-lg'>一站式 AI Agent 工具导航与学习平台</p>
        </div>

        <div className='space-y-8'>
          <section className='bg-card rounded-2xl border p-8 shadow-sm'>
            <h2 className='text-foreground mb-4 text-xl font-semibold'>我们是谁</h2>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              AI Skill Navigation（
              <span className='text-foreground font-medium'>aiskillnav.com</span>
              ）是一个面向开发者与团队的 AI 工具导航与学习平台。AI 生态日新月异、工具层出不穷，
              我们致力于把分散的优质资源聚合到一起，帮你更快找到合适的工具、看懂模型差异、学会落地实践。
            </p>
          </section>

          <section className='bg-card rounded-2xl border p-8 shadow-sm'>
            <h2 className='text-foreground mb-4 text-xl font-semibold'>我们提供什么</h2>
            <ul className='text-muted-foreground space-y-3 text-lg leading-relaxed'>
              <li>
                <Link href='/skills' className='text-primary hover:underline'>
                  Skills 导航
                </Link>{' '}
                与{' '}
                <Link href='/agents' className='text-primary hover:underline'>
                  Agent Hub
                </Link>
                ：精选 AI 工具与智能体，按能力分类检索。
              </li>
              <li>
                <Link href='/mcp' className='text-primary hover:underline'>
                  MCP 专区
                </Link>
                ：Model Context Protocol 服务与接入实践。
              </li>
              <li>
                <Link href='/models' className='text-primary hover:underline'>
                  模型对比
                </Link>
                ：主流大模型能力、价格与适用场景横评。
              </li>
              <li>
                <Link href='/tutorials' className='text-primary hover:underline'>
                  教程中心
                </Link>{' '}
                与{' '}
                <Link href='/usecases' className='text-primary hover:underline'>
                  场景库
                </Link>
                ：从入门到生产的深度教程与可落地的应用场景。
              </li>
              <li>
                <Link href='/news' className='text-primary hover:underline'>
                  AI 资讯
                </Link>
                ：跟踪 AI 领域的重要进展与热点事件。
              </li>
            </ul>
          </section>

          <section className='bg-card rounded-2xl border p-8 shadow-sm'>
            <h2 className='text-foreground mb-4 text-xl font-semibold'>内容如何生产</h2>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              选题由编辑团队策划：从官方发布、技术社区和实际使用反馈中，筛选对开发者真正有价值的主题。
              初稿借助 AI
              工具完成以提高效率和覆盖面，每篇内容发布前都经过编辑团队逐篇审核——核对事实、
              检查代码示例、删减空洞内容——合格后才上线。资讯类内容综合自公开报道与官方公告，页面内均标注来源。
              我们如实说明这一流程，也持续投入提升审核深度；发现疏漏欢迎随时指出。
            </p>
          </section>

          <section className='bg-card rounded-2xl border p-8 shadow-sm'>
            <h2 className='text-foreground mb-4 text-xl font-semibold'>收录标准</h2>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              导航中收录的工具、Agent 与 MCP 服务需满足：仍在积极维护；有真实可用的核心功能，
              而非演示或空壳；有清晰的文档或使用说明；不存在仿冒、欺诈或夸大宣传。收录免费、不按付费排序，
              收录也不代表我们为其背书。若发现已收录项目停更、变质或不再符合标准，请告诉我们，我们会更新或下架。
            </p>
          </section>

          <section className='bg-card rounded-2xl border p-8 shadow-sm'>
            <h2 className='text-foreground mb-4 text-xl font-semibold'>纠错与更新</h2>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              AI 领域变化很快，内容难免滞后或出错。如果你发现教程、资讯或收录信息有误， 请发邮件至{' '}
              <a href='mailto:contact@aiskillnav.com' className='text-primary hover:underline'>
                contact@aiskillnav.com
              </a>
              ，附上页面地址和正确信息的依据（如官方文档链接），核实后我们会尽快修正。
            </p>
          </section>

          <section className='bg-card rounded-2xl border p-8 shadow-sm'>
            <h2 className='text-foreground mb-4 text-xl font-semibold'>联系我们</h2>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              合作、建议或问题反馈，请发邮件至{' '}
              <a
                href='mailto:contact@aiskillnav.com'
                className='text-primary font-medium hover:underline'
              >
                contact@aiskillnav.com
              </a>
              ，或查看
              <Link href='/contact' className='text-primary hover:underline'>
                联系页面
              </Link>
              了解不同类型事项的处理方式。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
