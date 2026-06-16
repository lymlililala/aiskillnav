import { permanentRedirect } from 'next/navigation';

// 旧路径 /terms-of-service 与 /terms 内容重复（且曾被 noindex）。
// 301 永久重定向到规范的 /terms，消除重复页、归并权重。GSC「重复网页 / noindex」自愈。
export default function TermsOfServiceRedirect() {
  permanentRedirect('/terms');
}
