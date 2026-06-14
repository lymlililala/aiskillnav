import { NextResponse, type NextRequest } from 'next/server';

// 仅注入当前路径到响应头，供根布局判断 locale 设置 <html lang>。无鉴权、无重定向。
export function middleware(request: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('x-pathname', request.nextUrl.pathname);
  return res;
}

export const config = {
  // 排除静态资源与 API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
