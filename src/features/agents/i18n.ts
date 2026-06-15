// Agents 栏目共享文案 i18n —— 中英两套，组件用 useIsEn() 选择。
// agent_type 的「值」是固定 key（general/research…），这里翻显示标签。

export function agentsStrings(isEn: boolean) {
  return isEn
    ? {
        pageTitle: 'Agent Hub',
        pageDesc:
          'Top AI agents worldwide — general autonomy, deep research, build platforms, computer control, vertical creativity, proactive sensing',
        allListed: 'All listed',
        // stats
        statTotal: 'Agents',
        statFeatured: 'Featured',
        statOpenSource: 'Open source',
        statCategories: '6 categories',
        // card
        typeLabel: { general: 'General', research: 'Research', builder: 'Builder', computer: 'Computer', creative: 'Creative', proactive: 'Proactive', other: 'Other' } as Record<string, string>,
        inBeta: 'In beta',
        featuredBadge: 'Featured',
        viewDetails: 'View details',
        // filters
        typeTabs: [
          { value: 'all', label: 'All' },
          { value: 'general', label: '🤖 General' },
          { value: 'research', label: '🔍 Research' },
          { value: 'builder', label: '🏗️ Builder' },
          { value: 'computer', label: '🖥️ Computer' },
          { value: 'creative', label: '🎨 Creative' },
          { value: 'proactive', label: '🔮 Proactive' }
        ],
        sceneTags: [
          { label: 'Novel', query: '小说' },
          { label: 'Resume', query: '简历' },
          { label: 'Weekly report', query: '周报' },
          { label: 'Comic', query: '漫剧' },
          { label: 'Short video', query: '短视频' }
        ],
        sourceTabs: [
          { value: 'all', label: 'All' },
          { value: 'app', label: 'Apps' },
          { value: 'github', label: 'Open source' }
        ],
        searchPlaceholder: 'Search agents by name, description, tags...',
        popularNeeds: 'Popular:',
        resetFilters: 'Reset',
        // grid
        noAgents: 'No matching agents',
        noAgentsHint: 'Try adjusting your search or filters',
        agentsCount: (n: number) => `${n} agents`,
        filtered: '(filtered)',
        // featured
        featuredTitle: 'Featured Agents',
        countUnit: (n: number) => `${n}`
      }
    : {
        pageTitle: 'Agent Hub',
        pageDesc: '汇聚全球优秀 AI Agent — 通用自主、深度研究、构建平台、电脑操控、垂直创意、主动感知',
        allListed: '全部收录',
        statTotal: '收录 Agent',
        statFeatured: '精选推荐',
        statOpenSource: '开源项目',
        statCategories: '6 大分类',
        typeLabel: { general: '通用自主', research: '深度研究', builder: '构建平台', computer: '电脑操控', creative: '垂直创意', proactive: '主动感知', other: '其他' } as Record<string, string>,
        inBeta: '内测中',
        featuredBadge: '精选',
        viewDetails: '查看详情',
        typeTabs: [
          { value: 'all', label: '全部' },
          { value: 'general', label: '🤖 通用自主' },
          { value: 'research', label: '🔍 深度研究' },
          { value: 'builder', label: '🏗️ 构建平台' },
          { value: 'computer', label: '🖥️ 电脑操控' },
          { value: 'creative', label: '🎨 创意生成' },
          { value: 'proactive', label: '🔮 主动感知' }
        ],
        sceneTags: [
          { label: '小说生成', query: '小说' },
          { label: '简历生成', query: '简历' },
          { label: '周报生成', query: '周报' },
          { label: '漫剧生成', query: '漫剧' },
          { label: '短视频生成', query: '短视频' }
        ],
        sourceTabs: [
          { value: 'all', label: '全部' },
          { value: 'app', label: '应用产品' },
          { value: 'github', label: '开源项目' }
        ],
        searchPlaceholder: '搜索 Agent 名称、描述、标签...',
        popularNeeds: '热门需求：',
        resetFilters: '重置筛选',
        noAgents: '未找到相关 Agent',
        noAgentsHint: '尝试调整搜索词或分类筛选',
        agentsCount: (n: number) => `共 ${n} 个 Agent`,
        filtered: '（已过滤）',
        featuredTitle: '精选 Agents',
        countUnit: (n: number) => `${n} 个`
      };
}

export type AgentsStrings = ReturnType<typeof agentsStrings>;
