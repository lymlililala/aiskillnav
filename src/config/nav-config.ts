import { NavGroup } from '@/types';

export const navGroups: NavGroup[] = [
  {
    label: 'AI Skill Navigation',
    items: [
      {
        title: 'Skills 浏览',
        titleEn: 'Skills',
        url: '/skills',
        icon: 'skillsHub',
        shortcut: ['s', 'h'],
        isActive: false,
        items: []
      },
      {
        title: 'Agent Hub',
        titleEn: 'Agents',
        url: '/agents',
        icon: 'sparkles',
        shortcut: ['a', 'h'],
        isActive: false,
        items: []
      },
      {
        title: 'MCP 专区',
        titleEn: 'MCP',
        url: '/mcp',
        icon: 'settings',
        shortcut: ['m', 'c'],
        isActive: false,
        items: []
      },
      {
        title: '模型对比',
        titleEn: 'Models',
        url: '/models',
        icon: 'trendingUp',
        shortcut: ['m', 'o'],
        isActive: false,
        items: []
      },
      {
        title: '教程中心',
        titleEn: 'Tutorials',
        url: '/tutorials',
        icon: 'post',
        shortcut: ['t', 'u'],
        isActive: false,
        items: []
      },
      {
        title: '场景库',
        titleEn: 'Use Cases',
        url: '/usecases',
        icon: 'checks',
        shortcut: ['u', 'c'],
        isActive: false,
        items: []
      },
      {
        title: 'AI News',
        titleEn: 'News',
        url: '/news',
        icon: 'trendingUp',
        shortcut: ['n', 'w'],
        isActive: false,
        items: []
      }
    ]
  }
];
