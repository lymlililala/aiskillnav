import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'admin_session';
const LOGIN_PATH = '/admin/login';
const ADMIN_ROOT = '/admin';

/**
 * 验证 session token（时间恒定比较，防止时序攻击）
 */
function verifyToken(token: string | undefined, secret: string): boolean {
  if (!token || !secret) return false;
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const [payload, sig] = decoded.split('|');
    if (!payload || !sig) return false;
    const expected = Buffer.from(secret + payload)
      .toString('base64url')
      .slice(0, 16);
    if (sig.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < sig.length; i++) {
      diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin 鉴权（登录页与认证 API 除外）
  if (
    pathname.startsWith(ADMIN_ROOT) &&
    !(pathname === LOGIN_PATH || pathname.startsWith(LOGIN_PATH + '/') || pathname.startsWith('/api/admin/auth'))
  ) {
    const secret = process.env.ADMIN_SESSION_SECRET ?? '';
    const sessionCookie = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!verifyToken(sessionCookie, secret)) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 把当前路径写入请求头，供根布局据此设置 <html lang>（/en/* → en）。
  // 注意：必须设在 request headers 上，headers() 才能在 Server Component 读到。
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/admin/:path*',
    // 公开页（排除 api、静态资源、带扩展名的文件），用于注入 x-pathname
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ]
};
