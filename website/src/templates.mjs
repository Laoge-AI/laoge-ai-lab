import site from '../site.config.mjs';
import { cases } from './cases.mjs';

export const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const arrow = '<span aria-hidden="true">↗</span>';
const external = (url, text) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(text)} ${arrow}</a>`;
const contactBrief = '我的业务场景：\n目前怎么处理：\n最想改善的问题：\n现有资料或工具：';

function header() {
  return `<a class="skip-link" href="#main">跳到主要内容</a>
  <header class="site-header"><div class="shell header-inner">
    <a class="brand" href="/" aria-label="老鸽的AI落地实验室首页"><span class="brand-mark" aria-hidden="true">鸽<span>·</span></span><span>老鸽的AI落地实验室<small>LAOGE / AI FIELD NOTES</small></span></a>
    <nav aria-label="主导航"><a href="/#experiments">落地实验</a><a href="/#approach">怎么做事</a><a href="/#about">关于老鸽</a><a class="nav-contact" href="/#contact">聊聊你的需求 ${arrow}</a></nav>
  </div></header>`;
}

function footer() {
  return `<footer class="site-footer shell"><a class="footer-brand" href="/">老鸽的AI落地实验室<span>把想法做出来，把结果讲清楚。</span></a><div><span>陕西西安 · 持续创业摸索中</span><span>© ${new Date().getFullYear()} 老鸽 · 记录真实过程</span></div><a href="#top">回到顶部 ↑</a></footer>`;
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
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
<script type="module" src="/assets/site.js"></script>
</head><body>${header()}<main id="main">${body}</main>${footer()}</body></html>`;
}

function sectionHeading(kicker, title, extra = '') {
  return `<div class="section-heading"><div><p class="eyebrow">${kicker}</p><h2>${title}</h2></div>${extra}</div>`;
}

function heroVisual() {
  return `<div class="hero-visual" aria-label="从业务问题到验收记录的实验笔记示意">
    <div class="visual-caption"><span class="status-dot"></span> WORK IN PROGRESS <span>持续实验中</span></div>
    <div class="field-note"><div class="note-heading"><span>老鸽的工作台</span><span>FIELD NOTE / 002</span></div>
      <h2>从一个重复问题开始。</h2><p class="note-subtitle">这次，试试让AI接住简单咨询。</p>
      <div class="note-flow"><div><span>01 / QUESTION</span><strong>客户的问题</strong><p>“1000个充电器，能优惠吗？”</p></div><span class="flow-arrow" aria-hidden="true">↓</span><div><span>02 / DECISION</span><strong>AI找到边界</strong><p>批量议价交给人工处理。</p></div><span class="flow-arrow" aria-hidden="true">↓</span><div class="flow-last"><span>03 / HANDOFF</span><strong>把需求带给人</strong><p>经同意，转交联系方式和需求。</p></div></div>
      <div class="note-foot"><span class="check-mark" aria-hidden="true">✓</span> 测试流程已跑通 <span>个人实验摘要</span></div>
    </div><div class="margin-note">AI负责执行，<br>人负责判断与验收。<svg viewBox="0 0 124 27" aria-hidden="true"><path d="M3 13 Q50 1 118 10 M15 22 Q62 11 107 18"/></svg></div>
  </div>`;
}

function serviceVisual() {
  return `<div class="case-art support-art" aria-label="客服人工接手流程示意"><div class="art-topline"><span>实验记录 / 002</span><span class="tiny-pill">个人实验</span></div><div class="chat-question"><span>客户问</span><p>我需要1000个65W的充电器，<br>可以优惠吗？</p></div><div class="handoff-line"><span></span><small>征得同意后转交</small><span></span></div><div class="handoff-ticket"><span class="ticket-icon" aria-hidden="true">↗</span><div><strong>交给人工，带上上下文</strong><p>联系方式 + 采购需求</p></div><span class="ticket-check" aria-hidden="true">✓</span></div><p class="art-disclaimer">测试问答摘要 · 非真实客户对话截图</p></div>`;
}

function websiteVisual() {
  return `<div class="case-art website-art" aria-label="模拟官网实验的三角色分工示意"><div class="art-topline"><span>实验记录 / 001</span><span class="tiny-pill">模拟需求</span></div><div class="mini-browser"><div class="browser-bar"><i></i><i></i><i></i><span>本地官网实验</span></div><div class="mini-page"><span>从需求，到可以运行的页面</span><strong>AI做完了，<br>我再验收一遍。</strong><div class="mini-rule"></div><div class="mini-cols"><span>需求说明</span><span>UI方案</span><span>代码实现</span></div></div></div><p class="art-disclaimer">实验流程示意 · 非原项目界面截图</p></div>`;
}

function caseCard(item) {
  return `<article class="case-card">${item.number === '002' ? serviceVisual() : websiteVisual()}<div class="case-copy"><div class="case-index"><span>EXPERIMENT ${item.number}</span><span>${escape(item.status)}</span></div><h3><a href="/experiments/${item.slug}/">${item.title}</a></h3><p>${item.summary}</p><div class="tags">${item.tags.map(tag => `<span>${tag}</span>`).join('')}</div><a class="text-link" href="/experiments/${item.slug}/">看过程、结果和限制 ${arrow}</a></div></article>`;
}

function contact() {
  const { wechat, email, qrImage, xiaohongshu, xiaohongshuLabel, officialAccount, officialAccountQr, github } = site.contact;
  const available = Boolean(wechat || email || qrImage);
  return `<section id="contact" class="contact-section"><div class="shell contact-grid"><div><p class="eyebrow">LET’S TALK / 从具体问题聊起</p><h2>你有一个重复在做、<br>想试着交给AI的事吗？</h2><p class="contact-intro">告诉我业务场景、现在的做法，以及最想改善的问题。<br class="desktop-break">我们先看看，能不能从一个小环节开始。</p>
    <div class="contact-methods">${wechat ? `<p>微信：<strong>${escape(wechat)}</strong> <button class="text-button" data-copy="${escape(wechat)}">复制微信号</button></p>` : ''}${email ? `<p>邮箱：<a href="mailto:${escape(email)}">${escape(email)}</a></p>` : ''}${qrImage ? `<img class="qr-image" src="${escape(qrImage)}" width="148" height="148" alt="老鸽的个人微信二维码" loading="lazy">` : ''}${!available ? `<p class="contact-pending">讨论具体需求，可以先在我的小红书笔记留言。</p>` : ''}
    <div class="social-links">${external(xiaohongshu, xiaohongshuLabel)}${github ? external(github, 'GitHub') : ''}</div>
    ${officialAccountQr ? `<div class="official-account"><a class="official-account-code" href="${escape(officialAccountQr)}" target="_blank" rel="noopener" aria-label="打开老鸽的AI落地实验室公众号二维码大图"><img src="${escape(officialAccountQr)}" width="430" height="430" alt="老鸽的AI落地实验室公众号关注二维码" loading="lazy"></a><div><p class="official-account-label">关注实验更新</p><h3>${escape(officialAccount)}</h3><p>记录过程、结果与踩坑。</p><a href="${escape(officialAccountQr)}" target="_blank" rel="noopener">打开公众号二维码 ${arrow}</a><p class="official-account-help">微信扫一扫关注 · 手机可打开原图识别</p></div></div>` : `<p class="account-note">公众号：${escape(officialAccount)} <span>（微信内搜索名称）</span></p>`}</div>
    </div><div class="brief-paper"><div class="paper-heading"><span>不用先写一份完整需求书</span><span aria-hidden="true">↙</span></div><h3>从这几个问题开始就好。</h3><label for="contact-brief">可以填写后复制，再通过联系方式发给我。</label><textarea id="contact-brief" rows="6" spellcheck="false">${contactBrief}</textarea><button class="button button-dark" data-copy-from="contact-brief">复制需求描述 <span aria-hidden="true">↗</span></button><p class="local-note">内容仅停留在当前页面，不会自动提交或保存。</p></div>
  </div><p id="copy-status" class="copy-status" role="status" aria-live="polite"></p></section>`;
}

export function home(origin) {
  return layout({ title: '把AI用在具体的事情上', description: `${site.tagline} 面向小微企业，探索知识库、AI客服、官网创建与工作流优化。查看真实实验过程，联系老鸽讨论具体需求。`, origin, body: `
    <section class="hero shell"><div class="hero-copy"><p class="eyebrow"><span class="little-line"></span> 8年IT项目交付经验 / 现在，动手做AI</p><h1>把AI用在<br><span class="highlight-word">具体的事情</span>上<span class="title-dot">。</span></h1><p class="hero-description">我是老鸽。帮助小团队从一个实际问题出发，<br class="desktop-break">把知识库、客服和工作流的想法做出来，再验证。</p><div class="hero-actions"><a class="button button-dark" href="#contact">聊聊你的需求 ${arrow}</a><a class="button button-plain" href="#experiments">先看看我做过什么 <span aria-hidden="true">↓</span></a></div><p class="hero-footnote"><span class="status-dot"></span> 陕西西安 · 持续创业摸索中 <span class="footnote-divider">/</span> 记录过程，也记录踩坑</p></div>${heroVisual()}</section>
    <div class="scope-strip"><div class="shell"><span>从需求沟通到落地验收</span><p>知识库 <b>·</b> AI客服 <b>·</b> 官网创建 <b>·</b> 代码部署与CI/CD</p><span>小步验证，持续改进 <span aria-hidden="true">↗</span></span></div></div>
    <section id="experiments" class="section shell">${sectionHeading('SELECTED EXPERIMENTS / 落地实验', '做过什么，摊开来看看。', '<p>有过程、有结果，也有尚未验证的部分。<br>以下均为个人实验，非客户商业交付案例。</p>')}<div class="case-grid">${cases.map(caseCard).join('')}</div></section>
    <section id="approach" class="approach-section"><div class="shell section">${sectionHeading('HOW I WORK / 怎么做事', '先把问题说清楚，<br>再让AI动手。', '<p>多年的项目交付让我习惯：<br>明确目标，检查结果，再进入下一步。</p>')}<ol class="steps"><li><span class="step-number">01</span><h3>先看现在怎么做</h3><p>谁在做？重复在哪？信息放在哪里？先了解业务，再决定要不要用AI。</p></li><li><span class="step-number">02</span><h3>只跑通一个小环节</h3><p>选一个边界清楚的场景，做出能实际操作的版本，让问题尽早出现。</p></li><li><span class="step-number">03</span><h3>用真实问题验收</h3><p>核对回答依据、异常处理和人工接手。把做得到和还没验证的分别记录。</p></li></ol><div class="scope-note"><span>可以先从这里聊</span><p>知识库、AI客服、官网与部署落地；工作流优化、小程序和n8n等方向，先做小范围试验。</p></div></div></section>
    <section id="about" class="section shell about-section"><div class="about-identity">${site.avatar ? `<img class="avatar" src="${escape(site.avatar)}" width="104" height="104" alt="老鸽的头像" loading="lazy">` : '<div class="avatar-text" aria-hidden="true">鸽<span>。</span></div>'}<p class="eyebrow">BEHIND THE LAB</p><h2>你好，我是老鸽。</h2><p class="about-location">陕西 · 西安 / 持续创业摸索中</p></div><div class="about-copy"><p class="about-lead">有8年IT项目交付经验，<br>现在想把AI带来的进步，<span>变成能帮上忙的具体事情。</span></p><p>过去，我主要做需求沟通、项目推进与系统实施，接触过通信、互联网和政企业务。这段经历让我在意的，一直是“最后能不能真正用起来”。</p><p>AI让一个人也能尝试更多事情。我想尽一份力，帮助一些人一起进步。所以有了这个实验室：把做过的项目、遇到的问题，以及自己的判断留下来。</p><div class="about-signoff"><span>真的去做，再来分享。</span><span class="signature">老鸽 ↗</span></div></div></section>
    <section class="faq-section shell"><div><p class="eyebrow">BEFORE WE TALK</p><h2>你可能还想知道</h2></div><div class="faq-list"><details><summary>我还没有完整需求，可以先聊吗？<span aria-hidden="true">+</span></summary><p>可以。先描述你的业务场景、目前怎么处理，以及最想改善的问题。我们再一起判断，有没有适合小范围验证的环节。</p></details><details><summary>这些实验可以直接用到我的业务里吗？<span aria-hidden="true">+</span></summary><p>需要先检查你的实际资料、业务规则、系统接口和使用规模。这里展示的是个人实验，跑通测试流程不等于已经满足生产使用条件。</p></details><details><summary>哪些方向目前更适合找你？<span aria-hidden="true">+</span></summary><p>知识库、官网创建、AI客服、代码落地运行和CI/CD可以先交流。工作流优化、小程序、n8n、RAGFlow与前线落地实践（FDE）先做小范围探索；目前不承接PLC和硬件内核方向。</p></details></div></section>
    ${contact()}` });
}

function serviceBody() {
  return `<section class="article-section"><h2>先回答常见问题，再把需要判断的事交给人</h2><p>我选择虚拟数码店铺作为实验场景，整理商品、物流、售后政策和常见问题资料。目的很具体：验证自动问答和人工处理能不能接成一条完整流程。</p><p>这个实验面向电商和小微企业里重复处理简单咨询的场景，但目前没有接入真实电商客服渠道。</p><div class="article-flow"><span>用户在飞书提问</span><b aria-hidden="true">↓</b><span>FastAPI连接Dify工作流</span><b aria-hidden="true">↓</b><span>查询知识库 / 判断处理路径</span><b aria-hidden="true">↓</b><span>有依据地回答，或带上下文转人工</span><b aria-hidden="true">↓</b><span>通过机器人向用户回传回复</span></div><p class="caption">根据现有实验记录整理的逻辑流程，不是部署架构图。GLM用于提示词辅助，Dify负责知识库和工作流编排。</p></section>
  <section class="article-section"><h2>一个跑通的测试：批量采购怎么处理？</h2><blockquote><p>“我需要1000个65W的充电器，可以优惠吗？”</p><cite>实验测试输入</cite></blockquote><p>系统先征求用户是否同意提供联系方式。同意后，将联系方式和采购需求转给人工客服，而不是由AI自行决定折扣。</p><div class="finding"><span>测试结果</span><p>符合本次预期。人工介入后，用户不必重新描述问题；人工的回复也能正常反馈给用户。</p></div></section>
  <section class="article-section"><h2>一次踩坑：回复像客服，却加了不存在的规则</h2><p>退款赔偿测试中，机器人虽然识别出了需要人工处理，却向客户额外索要知识库没有规定的发票材料。收紧提示词后再测，又出现了额外要求联系方式的情况。</p><p>这两次测试让我意识到：语气合理，不代表符合这家店的业务规则。根据已整理的实验记录，后来将这类回复改为程序规则处理，使用固定话术、创建工单并通知人工支持群。人工接手期间暂停AI自动回复，人工回复再回传原对话。</p><div class="finding finding-yellow"><span>我的判断</span><p>需要确定性的业务环节，不能只依赖模型临场发挥。把规则、工单和人工接管接起来，才能检查整条处理流程。</p></div><figure class="evidence"><a href="/images/customer-service-test.png" target="_blank" rel="noopener"><img src="/images/customer-service-test.png" alt="退款测试记录摘要：AI首次额外要求发票，收紧提示词后又增加联系方式，均需核对店铺规则" width="1080" height="1440" loading="lazy"></a><figcaption>已有实验图文中的测试记录摘要，非原始聊天截图。点击可看大图。</figcaption></figure></section>
  <section class="article-section"><h2>这次验证到哪里？</h2><div class="result-columns"><div><h3>已验证</h3><ul><li>飞书机器人根据知识库回答测试问题。</li><li>需要人工处理时转交问题上下文。</li><li>人工回复返回用户原对话。</li><li>已对上述新增材料要求的问题调试处理。</li></ul></div><div><h3>尚未验证</h3><ul><li>真实店铺客服渠道与实际业务量。</li><li>持续运行稳定性和更广泛问题覆盖。</li><li>真实人工节省、客户满意度与商业效果。</li></ul></div></div><p>修复一个已知问题，不代表回答从此不会出错。后续需要结合具体业务资料、规则和更多测试继续验收。</p></section>
  <section class="article-section"><h2>现有材料</h2><p>以下为已经整理的实验内容。工作流和源码尚未整理成公开仓库，因此当前没有提供下载或开源链接。</p><a class="text-link" href="/images/customer-service-setup.png" target="_blank" rel="noopener">查看实验搭建记录 ${arrow}</a></section>`;
}

function websiteBody() {
  return `<section class="article-section"><h2>最初的问题：AI能不能做一个像模像样的官网？</h2><p>第一期实验里，我让AI模拟客户需求，再按需求、设计、开发和验收的顺序推进。客户与业务需求属于模拟场景，不是真实付费委托。</p><p>我想先验证，多个AI工具能否配合做出一个可以在本地运行、看得到效果的企业官网。</p><div class="roles"><div><span>需求说明</span><strong>DeepSeek</strong></div><div><span>UI设计方案</span><strong>Kimi</strong></div><div><span>代码实现</span><strong>Codex</strong></div><div><span>项目指挥与验收</span><strong>老鸽</strong></div></div></section>
  <section class="article-section"><h2>验收时，发现了一个没有清理的上传状态</h2><p>模拟客户提交资料时有图片上传环节。上传并提交后，再进入表单，页面仍然显示之前已选择的一张图片。</p><div class="issue-log"><div><span>发现</span><p>上一次操作的图片选择状态仍残留在页面里。</p></div><div><span>判断</span><p>这是需要修复的界面状态问题，不能以“网站已经能打开”作为验收终点。</p></div><div><span>处理</span><p>把具体问题反馈给Codex修改，再次检查，问题解决。</p></div></div><div class="finding finding-yellow"><span>这次留下的结论</span><p>AI做完，不等于项目完成。人仍然要判断结果是否符合需求，并对关键操作进行验收。</p></div></section>
  <section class="article-section"><h2>结果与边界</h2><p>模拟官网已经在本地运行，可以查看效果。当前没有公开在线演示；源码可以公开，但还没有上传到公开仓库。</p><p>本次只陈述已确认的本地运行与问题修复情况，不将模拟实验视为真实客户交付，也不提供未经核实的耗时、加载速度或商业收益数字。</p><a class="text-link" href="${escape(site.contact.xiaohongshu)}" target="_blank" rel="noopener noreferrer">查看当时的小红书记录 ${arrow}</a><p class="caption">历史笔记保留了早期表达；本页按当前确认的项目状态说明验证范围。</p></section>
  <section class="article-section"><h2>续篇：为自己做一个真正会用的案例主页</h2><p>现在这个网站，就是从实验001延伸出的下一步。用途从“证明能生成网站”，变成“把自己的经历、成果和能帮上的忙讲清楚”。</p><p>接下来会邀请读者实际浏览，看看他们能否判断我做过什么、适合讨论哪些问题。网站是否带来有效咨询，仍需要上线后的真实反馈。</p><a class="text-link" href="/">看看这次的个人主页 ${arrow}</a></section>`;
}

export function casePage(item, origin) {
  return layout({ title: item.shortTitle, description: item.description, path: `/experiments/${item.slug}/`, origin, article: true, body: `<article class="case-article shell"><nav class="breadcrumbs" aria-label="面包屑"><a href="/">首页</a><span aria-hidden="true">/</span><a href="/#experiments">落地实验</a><span aria-hidden="true">/</span><span aria-current="page">实验${item.number}</span></nav><header class="article-header"><p class="eyebrow">EXPERIMENT ${item.number} / 实验记录</p><h1>${item.title}</h1><p class="article-deck">${item.summary}</p><div class="article-meta"><span class="status-dot"></span><span>${item.status}</span><span>记录 / 老鸽</span></div></header><div class="article-layout"><aside class="case-sidebar" aria-label="实验概况"><span class="sidebar-label">这个实验在回答</span><p>${item.question}</p><dl><dt>已经做到</dt><dd>${item.verified}</dd><dt>使用工具</dt><dd>${item.tools.join(' / ')}</dd><dt>阅读边界</dt><dd>${item.boundary}</dd></dl><a class="text-link" href="/#contact">讨论类似需求 ${arrow}</a></aside><div class="article-content">${item.number === '002' ? serviceBody() : websiteBody()}</div></div><div class="article-end"><span>每完成一个实验，再补上一份真实记录。</span><a class="button button-dark" href="/#contact">聊聊你的具体场景 ${arrow}</a></div><a class="next-case text-link" href="/experiments/${item.number === '002' ? 'ai-website' : 'ai-customer-service'}/">继续阅读：${item.number === '002' ? 'AI建站实验' : 'AI客服实验'} ${arrow}</a></article>` });
}

export function notFound(origin) {
  return layout({ title: '没有找到这个页面', description: '页面可能已移动，请返回老鸽的AI落地实验室首页。', origin, path: '/404.html', noindex: true, body: '<section class="shell not-found"><p class="eyebrow">404 / 暂时没找到</p><h1>这条路还没铺好。</h1><p>可能是链接有误，也可能是内容已经移动。先回工作台看看。</p><a class="button button-dark" href="/">返回首页 ↗</a></section>' });
}
