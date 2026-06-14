import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '服务条款 | AI Skill Navigation',
  description:
    'AI Skill Navigation（aiskillnav.com）服务条款：网站内容使用、知识产权、免责声明与适用范围等相关约定。',
  alternates: { canonical: 'https://aiskillnav.com/terms' }
};

export default function TermsPage() {
  return (
    <div className='min-h-screen px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl space-y-8'>
        <Link
          href='/'
          className='text-muted-foreground hover:text-foreground inline-block text-sm transition-colors'
        >
          ← 返回首页
        </Link>

        <h1 className='text-foreground text-3xl font-bold'>服务条款</h1>
        <p className='text-muted-foreground text-base leading-relaxed'>
          欢迎使用 AI Skill Navigation（aiskillnav.com，以下简称“本站”）。访问或使用本站，即表示您已阅读、理解并同意遵守以下条款。
        </p>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>服务说明</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            本站是一个 AI 工具导航与学习信息平台，提供工具收录、模型对比、教程与资讯等内容，供用户参考与学习。本站内容仅供一般信息用途，不构成专业建议。
          </p>
        </section>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>知识产权</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            本站原创内容（包括编辑撰写的教程、资讯、应用场景等）的著作权归本站所有，未经许可，禁止以商业目的大规模复制、转载或镜像。本站引用或聚合的第三方信息、商标与名称，其权利归原权利人所有。如您认为本站内容侵犯了您的权益，请通过下方邮箱联系我们，我们会及时处理。
          </p>
        </section>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>用户行为</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            您应合法、合理地使用本站，不得利用本站从事任何违法活动，不得通过自动化手段对本站进行过度抓取、攻击或干扰其正常运行。
          </p>
        </section>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>第三方链接与免责声明</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            本站包含指向第三方工具与网站的链接，仅为方便用户。本站不对第三方内容、服务的准确性、可用性或安全性作任何保证，亦不承担由此产生的责任。本站内容按“现状”提供，我们会尽力保证信息准确，但不对其完整性、时效性或适用性作出担保；您据此作出的任何决策由您自行负责。
          </p>
        </section>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>条款变更</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            我们可能不时修订本服务条款，更新后将在本页面发布。继续使用本站即视为接受修订后的条款。
          </p>
        </section>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>联系我们</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            如对本服务条款有任何疑问，请通过{' '}
            <a
              href='mailto:contact@aiskillnav.com'
              className='text-primary font-medium hover:underline'
            >
              contact@aiskillnav.com
            </a>{' '}
            与我们联系。
          </p>
        </section>

        <div className='border-border border-t pt-4'>
          <p className='text-muted-foreground text-sm'>最后更新：2026 年 6 月</p>
        </div>
      </div>
    </div>
  );
}
