import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '隐私政策 | AI Skill Navigation',
  description:
    'AI Skill Navigation（aiskillnav.com）隐私政策：说明我们如何收集、使用与保护访问者信息，以及关于 Cookie、第三方服务与联系方式的相关条款。',
  alternates: { canonical: 'https://aiskillnav.com/privacy-policy' }
};

export default function PrivacyPolicyPage() {
  return (
    <div className='min-h-screen px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl space-y-8'>
        <Link
          href='/'
          className='text-muted-foreground hover:text-foreground inline-block text-sm transition-colors'
        >
          ← 返回首页
        </Link>

        <h1 className='text-foreground text-3xl font-bold'>隐私政策</h1>
        <p className='text-muted-foreground text-base leading-relaxed'>
          本隐私政策说明 AI Skill Navigation（aiskillnav.com，以下简称“本站”）如何收集、使用和保护您在访问本站时的相关信息。使用本站即表示您同意本政策所述的处理方式。
        </p>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>我们收集的信息</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            本站以内容浏览为主，不要求注册即可访问。我们可能收集匿名的访问统计信息（如页面浏览量、来源、设备与浏览器类型、大致地理区域），用于了解内容受欢迎程度并改进体验。当您通过电子邮件联系我们时，我们会收到您主动提供的邮箱地址及邮件内容。
          </p>
        </section>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>信息的使用</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            我们仅将上述信息用于：提供与优化网站内容、分析访问趋势、回应您的咨询与反馈、以及维护网站安全。我们不会出售、出租您的个人信息，也不会将其用于与上述目的无关的用途。
          </p>
        </section>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>Cookie 与分析工具</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            本站可能使用 Cookie 及第三方分析服务（如网站访问统计）来记录匿名的使用情况。您可以通过浏览器设置拒绝或清除 Cookie，但这可能影响部分功能的正常使用。
          </p>
        </section>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>第三方链接与内容</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            本站包含指向第三方网站、工具与资源的链接，并对公开信息进行聚合与整理。这些第三方拥有各自独立的隐私政策，本站不对其内容或数据处理行为负责，建议您在使用前查阅对应方的政策。
          </p>
        </section>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>数据安全</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            我们采取合理的技术与管理措施保护所掌握的信息，防止未经授权的访问、泄露或篡改。但请理解，互联网传输无法保证绝对安全。
          </p>
        </section>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>政策更新</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            我们可能不时更新本隐私政策。更新后将在本页面发布，并更新下方的“最后更新”日期。重大变更会以适当方式提示。
          </p>
        </section>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>联系我们</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            如对本隐私政策有任何疑问或请求，请通过{' '}
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
