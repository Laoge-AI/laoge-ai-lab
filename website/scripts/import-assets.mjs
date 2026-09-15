// 一次性把选定的二进制素材导入网站。公开构建不运行此脚本，也不依赖原始路径。
// 使用方式：node scripts/import-assets.mjs --avatar "...jpg" --official-account-qr "...jpg" --evidence
// 可追加 --wechat-qr "...jpg" 与 --homepage-screenshot "...png" 导入个人联系码和本站截图。
import { cp, mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const { values } = parseArgs({ options: {
  avatar: { type: 'string' },
  'official-account-qr': { type: 'string' },
  'wechat-qr': { type: 'string' },
  'homepage-screenshot': { type: 'string' },
  evidence: { type: 'boolean', default: false },
} });
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assets = [];
if (values.avatar) assets.push([resolve(values.avatar), 'avatar.jpg', 'jpeg']);
if (values['official-account-qr']) assets.push([resolve(values['official-account-qr']), 'official-account-qr.jpg', 'jpeg']);
if (values['wechat-qr']) assets.push([resolve(values['wechat-qr']), 'wechat-qr.jpg', 'jpeg']);
if (values['homepage-screenshot']) assets.push([resolve(values['homepage-screenshot']), 'homepage-v1.png', 'png']);
if (values.evidence) {
  const source = resolve(root, '../deliverables/experiment-002/首次实验版');
  assets.push([join(source, '02_这次搭了什么.png'), 'customer-service-setup.png', 'png']);
  assets.push([join(source, '03_测试中出现的问题.png'), 'customer-service-test.png', 'png']);
}
if (!assets.length) throw new Error('请指定需要导入的素材路径。');
// 先确认所有来源存在且格式正确，再导入；不改变图片编码或二维码内容。
for (const [source, name, type] of assets) {
  const bytes = await readFile(source);
  const valid = type === 'jpeg'
    ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    : bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (!valid) throw new Error(`${name}: 图片实际格式不符`);
}
const destination = join(root, 'public', 'images');
await mkdir(destination, { recursive: true });
for (const [source, name] of assets) {
  const target = join(destination, name);
  await cp(source, target);
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  if (hash(await readFile(source)) !== hash(await readFile(target))) throw new Error(`${name}: 素材复制校验失败`);
  console.log(`Imported and verified: public/images/${name}`);
}
