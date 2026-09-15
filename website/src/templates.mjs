import site from '../site.config.mjs';
import { homeContent } from './home.mjs';

export const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const arrow = '<span aria-hidden="true">↗</span>';

function header() {
  return `<a class="skip-link" href="#main">跳到主要内容</a>
    <header class="site-header"><div class="shell header-inner">
      <a class="brand" href="/" aria-label="老鸽的AI落地实验室首页"><span class="brand-mark" aria-hidden="true">鸽<span>·</span></span><span>老鸽的AI落地实验室<small>AI知识库 · 客服 · 官网</small></span></a>
      <nav aria-label="主导航"><a href="/#services">能帮什么</a><a href="/#experiments">做过什么</a><a href="/#approach">怎么合作</a><a class="nav-contact" href="/#contact">联系老鸽 ${arrow}</a></nav>
    </div></header>`;
}

function footer() {
  return `<footer class="site-footer shell"><a class="footer-brand" href="/">老鸽的AI落地实验室<span>AI知识库、客服和官网的小范围验证。</span></a><div><span>陕西西安 · 持续创业摸索中</span><span>© ${new Date().getFullYear()} 老鸽 · 记录真实过程</span></div><a href="#top">回到顶部 ↑</a></footer>`;
}

export function layout({ title, description, path = '/', body, origin = '', article = false, noindex = false }) {
  const url = origin ? `${origin}${path}` : '';
  const person = { '@type': 'Person', name: site.author, description: site.tagline, ...(origin ? { url: origin } : {}) };
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [person, article
      ? { '@type': 'Article', headline: title, description, inLanguage: 'zh-CN', author: person, ...(url ? { url, mainEntityOfPage: url } : {}) }
      : { '@type': 'WebSite', name: site.name, description, inLanguage: 'zh-CN', ...(url ? { url } : {}), publisher: person }],
  };
  return `<!doctype html>
<html lang="zh-CN" id="top"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}｜${escape(site.name)}</title><meta name="description" content="${escape(description)}">
<meta name="author" content="老鸽"><meta name="theme-color" content="#f6f5ef">
<meta name="robots" content="${noindex || !origin ? 'noindex, nofollow' : 'index, follow'}">
${url ? `<link rel="canonical" href="${escape(url)}"><meta property="og:url" content="${escape(url)}">` : ''}
<meta property="og:type" content="${article ? 'article' : 'website'}"><meta property="og:locale" content="zh_CN">
<meta property="og:site_name" content="${escape(site.name)}"><meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/styles.css">
<link rel="stylesheet" href="/assets/home-v2.css">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
<script type="module" src="/assets/site.js"></script>
</head><body>${header()}<main id="main">${body}</main>${footer()}</body></html>`;
}

export function home(origin) {
  return layout({
    title: '帮小团队做AI知识库、客服和官网',
    description: '老鸽，有8年IT项目交付经验。提供AI知识库、基础客服和官网的小范围验证，按需求评估范围、费用与周期。查看个人实验与自用案例，通过微信或邮件直接交流。',
    origin,
    body: homeContent(),
  });
}

function serviceBody() {
  return `<section class="article-section"><h2>先回答常见问题，再把需要判断的事交给人</h2><p>我选择虚拟数码店铺作为实验场景，整理商品、物流、售后政策和常见问题资料。目的很具体：验证自动问答和人工处理能不能接成一条完整流程。</p><p>这个实验面向电商和小微企业里重复处理简单咨询的场景，但目前没有接入真实电商客服渠道。</p><div class="article-flow"><span>用户在飞书提问</span><b aria-hidden="true">↓</b><span>FastAPI连接Dify工作流</span><b aria-hidden="true">↓</b><span>查询知识库 / 判断处理路径</span><b aria-hidden="true">↓</b><span>有依据地回答，或带上下文转人工</span><b aria-hidden="true">↓</b><span>通过机器人向用户回传回复</span></div><p class="caption">根据现有实验记录整理的逻辑流程，不是部署架构图。GLM用于提示词辅助，Dify负责知识库和工作流编排。</p></section>
  <section class="article-section"><h2>一个跑通的测试：批量采购怎么处理？</h2><blockquote><p>“我需要1000个65W的充电器，可以优惠吗？”</p><cite>实验测试输入</cite></blockquote><p>系统先征求用户是否同意提供联系方式。同意后，将联系方式和采购需求转给人工客服，而不是由AI自行决定折扣。</p><div class="finding"><span>测试结果</span><p>符合本次预期。人工介入后，用户不必重新描述问题；人工的回复也能正常反馈给用户。</p></div></section>
  <section class="article-section"><h2>一次踩坑：回复像客服，却加了不存在的规则</h2><p>退款赔偿测试中，机器人虽然识别出了需要人工处理，却向客户额外索要知识库没有规定的发票材料。收紧提示词后再测，又出现了额外要求联系方式的情况。</p><p>这两次测试让我意识到：语气合理，不代表符合这家店的业务规则。根据已整理的实验记录，后来将这类回复改为程序规则处理，使用固定话术、创建工单并通知人工支持群。人工接手期间暂停AI自动回复，人工回复再回传原对话。</p><div class="finding finding-yellow"><span>我的判断</span><p>需要确定性的业务环节，不能只依赖模型临场发挥。把规则、工单和人工接管接起来，才能检查整条处理流程。</p></div><figure class="evidence"><a href="/images/customer-service-test.png" target="_blank" rel="noopener"><img src="/images/customer-service-test.png" alt="退款测试记录摘要：AI首次额外要求发票，收紧提示词后又增加联系方式，均需核对店铺规则" width="1080" height="1440" loading="lazy"></a><figcaption>已有实验图文中的测试记录摘要，非原始聊天截图。点击可看大图。</figcaption></figure></section>
  <section class="article-section"><h2>这次验证到哪里？</h2><div class="result-columns"><div><h3>已验证</h3><ul><li>飞书机器人根据知识库回答测试问题。</li><li>需要人工处理时转交问题上下文。</li><li>人工回复返回用户原对话。</li><li>已对上述新增材料要求的问题调试处理。</li></ul></div><div><h3>尚未验证</h3><ul><li>真实店铺客服渠道与实际业务量。</li><li>持续运行稳定性和更广泛问题覆盖。</li><li>真实人工节省、客户满意度与商业效果。</li></ul></div></div><p>修复一个已知问题，不代表回答从此不会出错。后续需要结合具体业务资料、规则和更多测试继续验收。</p></section>
  <section class="article-section"><h2>现有材料</h2><p>以下为已经整理的实验内容。工作流和源码尚未整理成公开仓库，因此当前没有提供下载或开源链接。</p><a class="text-link" href="/images/customer-service-setup.png" target="_blank" rel="noopener">查看实验搭建记录 ${arrow}</a></section>
  <section class="article-section"><h2>如果你有类似需求，第一步做什么？</h2><p>先提供几条常见咨询、对应答案资料和目前的客服渠道。我们一起确认哪些问题可以依据资料回答，哪些必须转人工，再确定本轮接入范围、费用、周期和验收样例。</p><a class="text-link" href="/#approach">了解合作步骤与报价方式 ${arrow}</a></section>`;
}

function websiteBody() {
  return `<section class="article-section"><h2>最初的问题：AI能不能做一个像模像样的官网？</h2><p>第一期实验里，我让AI模拟客户需求，再按需求、设计、开发和验收的顺序推进。客户与业务需求属于模拟场景，不是真实付费委托。</p><p>我想先验证，多个AI工具能否配合做出一个可以在本地运行、看得到效果的企业官网。</p><div class="roles"><div><span>需求说明</span><strong>DeepSeek</strong></div><div><span>UI设计方案</span><strong>Kimi</strong></div><div><span>代码实现</span><strong>Codex</strong></div><div><span>项目指挥与验收</span><strong>老鸽</strong></div></div></section>
  <section class="article-section"><h2>验收时，发现了一个没有清理的上传状态</h2><p>模拟客户提交资料时有图片上传环节。上传并提交后，再进入表单，页面仍然显示之前已选择的一张图片。</p><div class="issue-log"><div><span>发现</span><p>上一次操作的图片选择状态仍残留在页面里。</p></div><div><span>判断</span><p>这是需要修复的界面状态问题，不能以“网站已经能打开”作为验收终点。</p></div><div><span>处理</span><p>把具体问题反馈给Codex修改，再次检查，问题解决。</p></div></div><div class="finding finding-yellow"><span>这次留下的结论</span><p>AI做完，不等于项目完成。人仍然要判断结果是否符合需求，并对关键操作进行验收。</p></div></section>
  <section class="article-section"><h2>模拟官网的结果与边界</h2><p>模拟官网已经在本地运行，可以查看效果。这个模拟项目目前没有公开在线演示；源码可以公开，但还没有上传到公开仓库。</p><p>本次只陈述已确认的本地运行与问题修复情况，不将模拟实验视为真实客户交付，也不提供未经核实的耗时、加载速度或商业收益数字。</p><a class="text-link" href="${escape(site.contact.xiaohongshu)}" target="_blank" rel="noopener noreferrer">查看当时的小红书记录 ${arrow}</a><p class="caption">历史笔记保留了早期表达；本页按当前确认的项目状态说明验证范围。</p></section>
  <section class="article-section"><h2>自用续篇：现在这个主页已经上线</h2><p>你正在访问的网站，是从实验001延伸出的自用案例。它用于展示我的经历、项目记录和联系方式，已完成公开部署，并将主要分享入口迁移到经过实际访问验证的Pages地址。</p><figure class="evidence evidence--website"><a href="/images/homepage-v1.png" target="_blank" rel="noopener"><img src="/images/homepage-v1.png" alt="本站第一版首页的实际截图" width="1440" height="1000" loading="lazy"></a><figcaption>本站第一版的实际首屏截图，点击查看大图。当前页面正在根据读者反馈迭代。</figcaption></figure><p>上线之后，我也在检查读者能否快速看懂服务、判断能力和找到联系入口。网站是否能带来有效咨询，仍需要后续实际反馈。</p><a class="text-link" href="/">查看当前个人主页 ${arrow}</a></section>
  <section class="article-section"><h2>如果你想做类似主页</h2><p>先确定访客是谁、需要看到哪些证据、最后应该如何联系你。再根据页面数量、素材准备情况、功能和部署要求评估范围、费用与周期。</p><a class="text-link" href="/#approach">了解合作步骤与报价方式 ${arrow}</a></section>`;
}

export function casePage(item, origin) {
  return layout({
    title: item.shortTitle, description: item.description, path: `/experiments/${item.slug}/`, origin, article: true,
    body: `<article class="case-article shell"><nav class="breadcrumbs" aria-label="面包屑"><a href="/">首页</a><span aria-hidden="true">/</span><a href="/#experiments">已做过的验证</a><span aria-hidden="true">/</span><span aria-current="page">实验${item.number}</span></nav><header class="article-header"><p class="eyebrow">实验${item.number} · 过程与结果</p><h1>${item.title}</h1><p class="article-deck">${item.summary}</p><div class="article-meta"><span class="status-dot"></span><span>${item.status}</span><span>记录 / 老鸽</span></div></header><div class="article-layout"><aside class="case-sidebar" aria-label="实验概况"><span class="sidebar-label">这个实验在回答</span><p>${item.question}</p><dl><dt>已经做到</dt><dd>${item.verified}</dd><dt>使用工具</dt><dd>${item.tools.join(' / ')}</dd><dt>适用前提</dt><dd>${item.boundary}</dd></dl><a class="text-link" href="/#contact">讨论类似需求 ${arrow}</a></aside><div class="article-content">${item.number === '002' ? serviceBody() : websiteBody()}</div></div><div class="article-end"><span>从你的一个具体问题开始，先评估，再约定范围。</span><a class="button button-dark" href="/#contact">聊聊你的具体场景 ${arrow}</a></div><a class="next-case text-link" href="/experiments/${item.number === '002' ? 'ai-website' : 'ai-customer-service'}/">继续阅读：${item.number === '002' ? 'AI建站实验' : 'AI客服实验'} ${arrow}</a></article>`,
  });
}

export function notFound(origin) {
  return layout({ title: '没有找到这个页面', description: '页面可能已移动，请返回老鸽的AI落地实验室首页。', origin, path: '/404.html', noindex: true, body: '<section class="shell not-found"><p class="eyebrow">404 / 暂时没找到</p><h1>这条路还没铺好。</h1><p>可能是链接有误，也可能是内容已经移动。先回工作台看看。</p><a class="button button-dark" href="/">返回首页 ↗</a></section>' });
}
