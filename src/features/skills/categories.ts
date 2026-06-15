// skills 站点的平台分类，用于生成可索引的分类聚合页 /skills/category/{slug}。
// sites 字段太薄不适合一站一详情页，改为按 platform 聚合成分类着陆页。

export type SkillCategory = {
  slug: string;
  label: string;
  description: string;
  labelEn: string;
  descriptionEn: string;
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    slug: 'official',
    label: '官方市场',
    description: '官方发布的 AI Skill 市场与文档站，最权威可靠的资源来源，更新及时、质量有保障。',
    labelEn: 'Official market',
    descriptionEn:
      'Officially published AI Skill marketplaces and docs — the most authoritative sources, updated promptly with assured quality.'
  },
  {
    slug: 'mirror',
    label: '中文镜像站',
    description: '国内可直接访问的中文镜像与文档站，无需网络代理即可浏览与下载 AI Skill 资源。',
    labelEn: 'Chinese mirrors',
    descriptionEn:
      'Chinese mirror and docs sites accessible without a proxy — browse and download AI Skill resources directly.'
  },
  {
    slug: 'github',
    label: 'GitHub 仓库',
    description: '开源的 AI Skill 仓库与项目，可自由查看源码、提交反馈并二次开发。',
    labelEn: 'GitHub repos',
    descriptionEn:
      'Open-source AI Skill repos and projects — read the source, file feedback and build on top freely.'
  },
  {
    slug: 'aggregator',
    label: '聚合导航站',
    description: '第三方聚合导航站，一站集中浏览大量 AI Skill 与工具资源，适合快速发现新工具。',
    labelEn: 'Aggregators',
    descriptionEn:
      'Third-party aggregators that gather many AI Skills and tools in one place — great for discovering new tools fast.'
  },
  {
    slug: 'community',
    label: '社区论坛',
    description: 'AI Skill 相关的社区与论坛，交流使用经验、分享技巧、获取最新资源动态。',
    labelEn: 'Communities',
    descriptionEn:
      'AI Skill communities and forums — share experience and tips, and keep up with the latest resources.'
  },
  {
    slug: 'tool',
    label: '工具网站',
    description: '辅助创建、调试与管理 AI Skill 的实用工具网站，提升开发与使用效率。',
    labelEn: 'Tool sites',
    descriptionEn:
      'Utility sites for building, debugging and managing AI Skills — boost your development and usage efficiency.'
  }
];

export function getSkillCategory(slug: string): SkillCategory | undefined {
  return SKILL_CATEGORIES.find((c) => c.slug === slug);
}
