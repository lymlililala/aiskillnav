import type { MetadataRoute } from 'next';

const BASE_URL = 'https://aiskillnav.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // 主爬虫：允许所有公开内容，禁止后台/API/私有路径
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/auth/',
          // 分页 URL（避免 Google 把 ?page=N 当独立页面）
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
