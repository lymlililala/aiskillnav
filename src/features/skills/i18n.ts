// Skills 栏目共享文案 i18n —— 中英两套，组件用 useIsEn() 选择。
// 注意：CATEGORY/分类的「值」是 DB 中的中文（作查询键，不可变），这里只翻「显示标签」。

export function skillsStrings(isEn: boolean) {
  return isEn
    ? {
        // 页面外壳（/en/skills page）
        pageTitle: 'AI Skill Navigation',
        pageDesc: 'Discover, save and use community-curated AI Skills & Agent resources',
        browseByPlatform: 'Browse by platform',
        // tab-content
        marketLabel: 'Skills Market',
        marketHint: '— Install atomic AI skills to your local Agent',
        sitesLabel: 'Listed platforms',
        sitesHint: '— Grouped by official / community / workflow; click a card to open',
        allListedSites: 'All listed sites',
        // tab-switcher
        chooseChannel: 'Choose a channel',
        hubTitle: '🌐 Hub Directory',
        hubDesc: 'Discover quality AI Skill platforms — one click away',
        hubTags: ['Aggregators', 'Directory', 'Ready to use'],
        marketTitle: '🧩 Skills Market',
        marketDesc: 'Atomic skill library — copy the command to install locally',
        marketTags: ['Install', 'Dev tools', 'clawhub.ai'],
        installTip: 'Copy the install command for your local AI Agent — this is “install & use”',
        // stats
        statHubSites: 'Hub Sites',
        statFeatured: 'Featured',
        statEditorPicks: 'Editor picks',
        statCategories: 'Categories',
        statScenarioCoverage: 'Scenario coverage',
        cnUnit: 'CN',
        intlUnit: 'Intl',
        featuredSuffix: 'featured',
        // card / filters
        platform: { official: 'Official', mirror: 'Mirror', github: 'GitHub', aggregator: 'Aggregator', community: 'Community', tool: 'Tool', other: 'Other' } as Record<string, string>,
        region: { global: 'Intl', cn: 'CN' } as Record<string, string>,
        allRegions: 'All regions',
        regionIntl: '🌐 Intl',
        regionCn: '🇨🇳 CN',
        allTypes: 'All types',
        platformOptions: { official: 'Official', aggregator: 'Aggregator', mirror: 'Mirror', community: 'Community', tool: 'Tool' } as Record<string, string>,
        reset: 'Reset',
        siteSearchPlaceholder: 'Search hubs, e.g. “Coze”, “Dify”, “FlowGPT”…',
        noSites: 'No matching sites',
        noSitesHint: 'Try adjusting your search or filters',
        sitesCount: (n: number) => `${n} sites`,
        filtered: '(filtered)',
        // featured zones
        zones: {
          official: { title: 'Official ecosystem', desc: 'Native · Standard', tagline: 'Maintained by major AI platforms' },
          community: { title: 'Community developers', desc: 'Vast · Inspiring', tagline: 'Community-contributed, endless ideas' },
          deploy: { title: 'Self-hosted & workflow', desc: 'Productivity · Workflow', tagline: 'Deep integration, self-hosted for teams' }
        } as Record<string, { title: string; desc: string; tagline: string }>,
        // tool filters
        catAll: 'All',
        quickTags: [
          { label: '📖 Novel', query: '小说' },
          { label: '📄 Resume', query: '简历' },
          { label: '📊 Weekly report', query: '周报' },
          { label: '🎬 Short video', query: '短视频' },
          { label: '🎨 Comic', query: '漫画' },
          { label: '📝 Code review', query: '代码' },
          { label: '🖼️ Image gen', query: '图像' },
          { label: '📧 Email automation', query: '邮件' }
        ],
        searchExamples: [
          'Write a novel sequel',
          'Generate a polished resume',
          'Auto weekly report',
          'Comic storyboard',
          'Short-video script',
          'A Skill that sends email',
          'Review my code with AI',
          'Generate an image',
          'WeChat automation',
          'Share memory across Agents',
          'Douyin content production',
          'Security vulnerability scan'
        ],
        toolSearchTry: (ex: string) => `Try: “${ex}”`,
        // tool category display labels（值仍为中文）
        cat: {
          小说生成: '📖 Novel', 简历生成: '📄 Resume', 周报生成: '📊 Weekly report', 漫剧生成: '🎨 Comic',
          短视频生成: '🎬 Short video', 内容生成: '✍️ Content', 开发工具: '🛠️ Dev tools', 效率与协作: '📋 Productivity',
          中文平台: '🇨🇳 Chinese platforms', 'AI Agent': '🤖 AI Agent', 网页与浏览器: '🌐 Web & browser',
          邮件与通信: '📧 Email & comms', 安全与审计: '🔒 Security & audit', 工具与运维: '🔧 Tools & ops'
        } as Record<string, string>,
        // tool grid
        recommended: 'Featured',
        verified: 'Verified',
        community: 'Community',
        copyInstall: 'Copy install command',
        copied: 'Copied',
        copy: 'Copy',
        viewDetails: 'View details',
        noTools: 'No matching Skill',
        noToolsHint: 'Describe your need, e.g. “analyze my code”',
        toolsCount: (n: number) => `${n} Skills`,
        toolsClickHint: '— click “View details” or copy the install command'
      }
    : {
        pageTitle: 'AI Skill Navigation',
        pageDesc: '汇聚 AI Skills & Agent 资源，发现、收藏并使用社区精选工具',
        browseByPlatform: '按平台浏览',
        marketLabel: 'Skills 市场',
        marketHint: '— 安装原子化 AI 能力到你的本地 Agent',
        sitesLabel: '收录平台',
        sitesHint: '— 按官方 / 社区 / 工作流分区展示，点击卡片直达平台',
        allListedSites: '全部收录站点',
        chooseChannel: '选择内容频道',
        hubTitle: '🌐 Hub 导航站',
        hubDesc: '发现优质 AI Skill 资源平台，一键直达',
        hubTags: ['聚合平台', '跳转导航', '开箱即用'],
        marketTitle: '🧩 Skills 市场',
        marketDesc: '原子化能力库，复制命令即可安装到本地 Agent',
        marketTags: ['安装部署', '极客工具', 'clawhub.ai'],
        installTip: '复制安装命令，配置到本地 AI Agent — 你是在「安装和使用」',
        statHubSites: '收录 Hub 站点',
        statFeatured: '精选推荐',
        statEditorPicks: '编辑精选站点',
        statCategories: 'Skill 分类',
        statScenarioCoverage: '覆盖场景分类',
        cnUnit: '中文',
        intlUnit: '国际',
        featuredSuffix: '个推荐',
        platform: { official: '官方', mirror: '镜像', github: 'GitHub', aggregator: '聚合', community: '社区', tool: '工具', other: '其他' } as Record<string, string>,
        region: { global: '国际', cn: '中文' } as Record<string, string>,
        allRegions: '全部地区',
        regionIntl: '🌐 国际',
        regionCn: '🇨🇳 中文',
        allTypes: '全部类型',
        platformOptions: { official: '官方', aggregator: '聚合导航', mirror: '镜像站', community: '社区', tool: '工具' } as Record<string, string>,
        reset: '重置',
        siteSearchPlaceholder: '搜索 Hub 名称，如「Coze」「Dify」「FlowGPT」…',
        noSites: '未找到相关站点',
        noSitesHint: '尝试调整搜索词或筛选条件',
        sitesCount: (n: number) => `共 ${n} 个站点`,
        filtered: '（已过滤）',
        zones: {
          official: { title: '官方生态', desc: '原生 · 标准', tagline: '由各大 AI 平台官方维护' },
          community: { title: '社区开发者', desc: '海量 · 灵感', tagline: '社区贡献，创意无限' },
          deploy: { title: '私有化 & 工作流', desc: '生产力 · 工作流', tagline: '深度集成，企业自部署' }
        } as Record<string, { title: string; desc: string; tagline: string }>,
        catAll: '全部',
        quickTags: [
          { label: '📖 小说续写', query: '小说' },
          { label: '📄 简历', query: '简历' },
          { label: '📊 周报', query: '周报' },
          { label: '🎬 短视频', query: '短视频' },
          { label: '🎨 漫画', query: '漫画' },
          { label: '📝 代码审查', query: '代码' },
          { label: '🖼️ 图像生成', query: '图像' },
          { label: '📧 邮件自动化', query: '邮件' }
        ],
        searchExamples: [
          '帮我写小说续集', '一键生成漂亮简历', '周报自动生成', '漫画分镜生成', '短视频脚本创作',
          '能发邮件的 Skill', '我想让 AI 帮我审查代码', '帮我生成图片', '微信自动化', '跨 Agent 共享记忆',
          '抖音内容生产', '安全漏洞检测'
        ],
        toolSearchTry: (ex: string) => `试试：「${ex}」`,
        cat: {
          小说生成: '📖 小说生成', 简历生成: '📄 简历生成', 周报生成: '📊 周报生成', 漫剧生成: '🎨 漫剧生成',
          短视频生成: '🎬 短视频生成', 内容生成: '✍️ 内容生成', 开发工具: '🛠️ 开发工具', 效率与协作: '📋 效率与协作',
          中文平台: '🇨🇳 中文平台', 'AI Agent': '🤖 AI Agent', 网页与浏览器: '🌐 网页与浏览器',
          邮件与通信: '📧 邮件与通信', 安全与审计: '🔒 安全与审计', 工具与运维: '🔧 工具与运维'
        } as Record<string, string>,
        recommended: '推荐',
        verified: '已验证',
        community: '社区',
        copyInstall: '复制安装命令',
        copied: '已复制',
        copy: '复制',
        viewDetails: '查看详情',
        noTools: '未找到相关 Skill',
        noToolsHint: '尝试描述你的需求，比如"帮我分析代码"',
        toolsCount: (n: number) => `共 ${n} 个 Skills`,
        toolsClickHint: '— 点击"查看详情"或复制安装命令'
      };
}

export type SkillsStrings = ReturnType<typeof skillsStrings>;
