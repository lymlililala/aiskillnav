import type { MetadataRoute } from 'next';

const BASE_URL = 'https://aiskillnav.com';

// 旧 /dashboard/* 内容路径已 308 永久重定向到 (main) 下的公开路由。
// 这些路径必须保持「可被抓取」，Googlebot 才能看到 308 跳转，并把旧 URL 的
// 收录权重合并到规范页面；否则它们会一直停留在「被 noindex 标记排除了」状态
// （之前因 `Disallow: /dashboard/` 屏蔽，爬虫无法重新抓取以更新状态）。
//
// 利用 Google 的「最长匹配优先」规则：下面的 Allow 路径比 `Disallow: /dashboard/`
// 更具体，因此对这些内容路径放行，而 dashboard 下的后台演示页仍被屏蔽。
const LEGACY_REDIRECT_PATHS = [
  '/dashboard/news',
  '/dashboard/tutorials',
  '/dashboard/agents',
  '/dashboard/mcp',
  '/dashboard/models',
  '/dashboard/skills',
  '/dashboard/usecases'
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // 公开内容 + 显式放行旧内容重定向路径（覆盖下方 /dashboard/ 禁令）
        allow: ['/', ...LEGACY_REDIRECT_PATHS],
        disallow: [
          // 仍屏蔽 dashboard 下纯后台演示页（billing/users/kanban 等，不在上面的放行列表内）
          '/dashboard/',
          // 无斜杠前缀，连后台首页 /admin（会 307 跳到 /admin/login）一并屏蔽，避免浪费抓取预算
          '/admin',
          '/api/',
          '/auth/',
          '/monitoring',
          // 分页/筛选 URL（避免 Google 把 ?page=N 等当成独立页面收录）
          '/*?page=',
          '/*?search=',
          '/*?filter=',
          '/*?sort='
        ]
      }
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL
  };
}
