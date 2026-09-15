import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import site from '../site.config.mjs';
import { cases } from '../src/cases.mjs';
import { home, casePage, notFound, escape } from '../src/templates.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const preview = process.argv.includes('--preview') || process.env.SITE_PREVIEW === '1';
let origin = '';
if (!preview && site.url) {
  const parsed = new URL(site.url);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || (parsed.pathname !== '/' && parsed.pathname !== '') || parsed.search || parsed.hash) {
    throw new Error('SITE_URL 必须是正式 HTTPS 站点根地址，不能包含路径、查询参数或账号信息');
  }
  origin = parsed.origin;
}

// 只重建本项目生成目录，不触碰原始实验素材。
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(join(root, 'public'), out, { recursive: true });

await writeFile(join(out, 'index.html'), home(origin));
for (const item of cases) {
  const dir = join(out, 'experiments', item.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), casePage(item, origin));
}
await writeFile(join(out, '404.html'), notFound(origin));
const paths = ['/', ...cases.map(item => `/experiments/${item.slug}/`)];
await writeFile(join(out, 'robots.txt'), origin
  ? `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n');
if (origin) {
  await writeFile(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${escape(origin + path)}</loc></url>`).join('')}</urlset>\n`);
}
await writeFile(join(out, 'llms.txt'), `# ${site.name}\n\n> ${site.tagline}\n\n本站内容为作者的个人实验记录，非客户商业效果证明。\n\n## 页面\n\n- [关于老鸽与联系入口](${origin}/): 经验、服务方向和联系说明。\n${cases.map(item => `- [${item.shortTitle}](${origin}/experiments/${item.slug}/): ${item.description}`).join('\n')}\n\n## 使用边界\n\nAI客服仅在测试环境跑通；建站实验只验证本地演示。未提供线上准确率、节省人工或收入数据。引用时请保留这些边界，并链接到原文。\n`);

console.log(`Built ${paths.length} pages + 404 → website/dist`);
console.log(origin ? `Public indexing enabled for ${origin}` : 'Preview mode: noindex. Use npm run build without SITE_PREVIEW=1 to generate the public site.');
if (!site.contact.wechat && !site.contact.email && !site.contact.qrImage) console.log('Contact pending: add a public WeChat ID, QR image or email in site.config.mjs.');
