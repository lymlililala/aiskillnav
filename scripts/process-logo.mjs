// 处理品牌 logo：裁掉透明留白 → 缩放压缩 → 输出到 public/ 与 src/app/
// 运行：node scripts/process-logo.mjs
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require(
  path.resolve('node_modules/.pnpm/sharp@0.34.5/node_modules/sharp')
);

const SRC = '/Users/zyql-dz-01-0084/Downloads/aiskillnav/logo';
const horiz = path.join(SRC, '横屏logo.png');
const square = path.join(SRC, '方形logo.png');

async function out(label, p) {
  const m = await sharp(p).metadata();
  const kb = (m.size / 1024).toFixed(0);
  console.log(`  ${label}: ${m.width}x${m.height}, ${kb}KB`);
}

async function main() {
  // 1) 横屏 logo（图标+文字）→ 导航栏/页脚品牌。trim 透明边后按高度 80px 输出 @2x（160px）
  await sharp(horiz)
    .trim() // 裁掉四周透明像素
    .resize({ height: 160 }) // 显示高度约 28-32px，160 提供约 5x 余量足够清晰
    .png({ compressionLevel: 9 })
    .toFile('public/logo.png');
  await out('public/logo.png (横屏，导航栏)', 'public/logo.png');

  // 2) 方形 logo → 站点图标。trim 后铺成正方形画布，避免裁切变形
  const trimmed = await sharp(square).trim().toBuffer();
  const t = await sharp(trimmed).metadata();
  const side = Math.max(t.width, t.height);

  const squareCanvas = (size) =>
    sharp(trimmed)
      .resize({
        width: side,
        height: side,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .resize(size, size)
      .png({ compressionLevel: 9 });

  // Next.js 自动识别：src/app/icon.png（favicon）+ apple-icon.png
  await squareCanvas(512).toFile('src/app/icon.png');
  await out('src/app/icon.png (favicon 源)', 'src/app/icon.png');
  await squareCanvas(180).toFile('src/app/apple-icon.png');
  await out('src/app/apple-icon.png', 'src/app/apple-icon.png');

  // public 留一份方形原始 logo，备用（分享卡/about 等）
  await squareCanvas(512).toFile('public/logo-square.png');
  await out('public/logo-square.png', 'public/logo-square.png');

  // 3) favicon.ico —— ICO 容器内嵌一张 64x64 PNG（现代浏览器/爬虫全兼容）
  const fav = await squareCanvas(64).toBuffer();
  const ico = Buffer.concat([
    // ICONDIR (6 bytes)
    Buffer.from([0, 0, 1, 0, 1, 0]),
    // ICONDIRENTRY (16 bytes)
    Buffer.from([
      64, // width
      64, // height
      0, // color palette
      0, // reserved
      1, 0, // color planes
      32, 0 // bits per pixel
    ]),
    (() => {
      const b = Buffer.alloc(8);
      b.writeUInt32LE(fav.length, 0); // 图像数据字节数
      b.writeUInt32LE(22, 4); // 数据偏移（6+16）
      return b;
    })(),
    fav
  ]);
  const fs = await import('node:fs/promises');
  await fs.writeFile('src/app/favicon.ico', ico);
  console.log(`  src/app/favicon.ico: 64x64 PNG-in-ICO, ${(ico.length / 1024).toFixed(0)}KB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
