// 生成 OG 分享图 public/og-image.png（1200x630）
// 深色品牌底 + 横屏 logo（lineOnly 抠出线条/白字）+ 拉丁文案
// 运行：node scripts/process-og.mjs
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require(
  path.resolve('node_modules/.pnpm/sharp@0.34.5/node_modules/sharp')
);

const SRC = '/Users/zyql-dz-01-0084/Downloads/aiskillnav/logo';
const NAVY = { r: 17, g: 24, b: 39 };
const W = 1200, H = 630, LOGO_W = 640;

async function lineOnly(name) {
  const raw = await sharp(path.join(SRC, name)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const d = Buffer.from(raw.data);
  for (let i = 0; i < d.length; i += channels) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    if (sat >= 55 || luma >= 175) {
      // keep
    } else if (sat >= 30 || luma >= 140) {
      const k = Math.max((sat - 30) / 25, (luma - 140) / 35);
      d[i + 3] = Math.min(d[i + 3], Math.round(k * 255));
    } else {
      d[i + 3] = 0;
    }
  }
  return sharp(d, { raw: { width, height, channels } }).png();
}

async function main() {
  const logo = await (await lineOnly('横屏logo.png')).trim().resize({ width: LOGO_W }).png().toBuffer();
  const lm = await sharp(logo).metadata();
  const logoX = Math.round((W - lm.width) / 2);
  const logoY = Math.round(H * 0.24);

  // 装饰柔光（半透明实心圆，避免 url() 渐变在该 librsvg 失效）
  const decor = Buffer.from(`
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="150" cy="110" r="280" fill="#2DD4BF" fill-opacity="0.16"/>
  <circle cx="1070" cy="560" r="320" fill="#3B82F6" fill-opacity="0.16"/>
  <text x="${W / 2}" y="492" text-anchor="middle"
    font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="600" fill="#E2E8F0">
    Discover the best AI Agent tools, models &amp; tutorials
  </text>
  <text x="${W / 2}" y="552" text-anchor="middle"
    font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700"
    letter-spacing="1" fill="#2DD4BF">
    aiskillnav.com
  </text>
</svg>`);

  await sharp({ create: { width: W, height: H, channels: 4, background: { ...NAVY, alpha: 1 } } })
    .composite([
      { input: decor, left: 0, top: 0 },
      { input: logo, left: logoX, top: logoY }
    ])
    .flatten({ background: NAVY })
    .png({ compressionLevel: 9 })
    .toFile('public/og-image.png');

  const out = await sharp('public/og-image.png').metadata();
  console.log(`  public/og-image.png: ${out.width}x${out.height}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
