// 处理品牌 logo（源文件背景是烘焙的灰棋盘格、白字、为深色背景设计）
// 策略 lineOnly：只保留「高饱和彩色线条 + 高亮白字」，灰棋盘格/灰底板一律透明。
// 产物用于深色容器/深色实底，最干净。
// 运行：node scripts/process-logo.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs/promises';

const require = createRequire(import.meta.url);
const sharp = require(
  path.resolve('node_modules/.pnpm/sharp@0.34.5/node_modules/sharp')
);

const SRC = '/Users/zyql-dz-01-0084/Downloads/aiskillnav/logo';
const NAVY = { r: 17, g: 24, b: 39 }; // #111827 深色容器/实底

// 只保留线条像素：饱和度高(彩色) 或 很亮(白字) → 留；其余(灰底/棋盘格) → 透明，过渡羽化
async function lineOnly(name) {
  const raw = await sharp(path.join(SRC, name))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const d = Buffer.from(raw.data);
  for (let i = 0; i < d.length; i += channels) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    if (sat >= 55 || luma >= 175) {
      // 线条 / 白字 → 保留
    } else if (sat >= 30 || luma >= 140) {
      const k = Math.max((sat - 30) / 25, (luma - 140) / 35); // 边缘羽化
      d[i + 3] = Math.min(d[i + 3], Math.round(k * 255));
    } else {
      d[i + 3] = 0; // 灰底 / 棋盘格 → 透明
    }
  }
  return sharp(d, { raw: { width, height, channels } }).png();
}

async function size(label, p) {
  const m = await sharp(p).metadata();
  console.log(`  ${label}: ${m.width}x${m.height}`);
}

async function main() {
  // 1) 横屏 logo（透明）→ 导航栏/页脚，放进深色 CSS 容器
  await (await lineOnly('横屏logo.png'))
    .trim()
    .resize({ height: 160 })
    .png({ compressionLevel: 9 })
    .toFile('public/logo.png');
  await size('public/logo.png (横屏透明)', 'public/logo.png');

  // 2) 方形 logo → 取顶部 mark（不含文字），留备份透明 PNG
  const sqFull = await (await lineOnly('方形logo.png')).trim().toBuffer();
  const sfm = await sharp(sqFull).metadata();
  const mark = await sharp(sqFull)
    .extract({ left: 0, top: 0, width: sfm.width, height: Math.round(sfm.height * 0.56) })
    .trim()
    .toBuffer();
  await sharp(mark)
    .resize(512, 512, { fit: 'contain', background: { ...NAVY, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile('public/logo-mark.png');
  await size('public/logo-mark.png (纯图标透明)', 'public/logo-mark.png');

  // 3) favicon / 站点图标：mark 居中放深色实底方块
  const iconOnNavy = async (s, pad) => {
    const inner = await sharp(mark)
      .resize(s - pad * 2, s - pad * 2, { fit: 'contain', background: { ...NAVY, alpha: 0 } })
      .png()
      .toBuffer();
    return sharp({
      create: { width: s, height: s, channels: 4, background: { ...NAVY, alpha: 1 } }
    })
      .composite([{ input: inner, gravity: 'centre' }])
      .png({ compressionLevel: 9 });
  };
  await (await iconOnNavy(512, 60)).toFile('src/app/icon.png');
  await size('src/app/icon.png', 'src/app/icon.png');
  await (await iconOnNavy(180, 22)).toFile('src/app/apple-icon.png');
  await size('src/app/apple-icon.png', 'src/app/apple-icon.png');

  // favicon.ico —— 64x64 PNG-in-ICO
  const fav = await (await iconOnNavy(64, 7)).toBuffer();
  const ico = Buffer.concat([
    Buffer.from([0, 0, 1, 0, 1, 0]),
    Buffer.from([64, 64, 0, 0, 1, 0, 32, 0]),
    (() => { const b = Buffer.alloc(8); b.writeUInt32LE(fav.length, 0); b.writeUInt32LE(22, 4); return b; })(),
    fav
  ]);
  await fs.writeFile('src/app/favicon.ico', ico);
  console.log('  src/app/favicon.ico: 64x64 PNG-in-ICO');

  // 4) 导航栏药丸预览（真实尺寸，h-7≈28px → @2x 56px）
  const logoTrans = await (await lineOnly('横屏logo.png')).trim().resize({ height: 56 }).toBuffer();
  const lm = await sharp(logoTrans).metadata();
  const padX = 18, padY = 9;
  const pillW = lm.width + padX * 2, pillH = lm.height + padY * 2;
  const pill = await sharp({
    create: { width: pillW, height: pillH, channels: 4, background: { ...NAVY, alpha: 1 } }
  }).composite([{ input: logoTrans, gravity: 'centre' }]).png().toBuffer();
  await sharp({ create: { width: pillW + 80, height: pillH + 60, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
    .composite([{ input: pill, left: 40, top: 30 }])
    .png().toFile('output/_navbar-preview.png');
  console.log(`  预览 output/_navbar-preview.png（药丸实际约 ${Math.round(pillW / 2)}x${Math.round(pillH / 2)}px）`);
}

main().catch((e) => { console.error(e); process.exit(1); });
