import site from '../site.config.mjs';
import { cases } from './cases.mjs';

const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const arrow = '<span aria-hidden="true">↗</span>';
const brief = '我的业务场景：\n目前怎么处理：\n最想改善的问题：\n现有资料或工具：';
const mailLink = () => `mailto:${site.contact.email}?subject=${encodeURIComponent('想讨论一个AI落地需求')}&body=${encodeURIComponent(brief)}`;

function introduction() {
  return `<section class="v2-hero shell">
    <div class="v2-hero-copy">
      <div class="v2-person">
        <img src="${escape(site.avatar)}" alt="老鸽的头像" width="56" height="56">
        <div><p><strong>我是老鸽</strong><span>8年IT项目交付经验</span></p><a href="#about">需求沟通 · 项目推进 · 系统实施 <span aria-hidden="true">↓</span></a></div>
      </div>
      <h1>帮小团队做<br><span>AI知识库、客服和官网</span></h1>
      <p class="v2-hero-description">先选一个实际问题，<strong>跑通一个小场景，再决定是否扩展。</strong><br>范围、费用、周期和验收方式，在动手前一起说清楚。</p>
      <div class="v2-actions"><a class="button button-dark" href="#contact">微信聊一个需求 ${arrow}</a><a class="button v2-button-outline" href="#experiments">先看两个例子 <span aria-hidden="true">↓</span></a></div>
      <p class="v2-direct-email">也可以直接发邮件：<a href="${escape(mailLink())}">${escape(site.contact.email)}</a></p>
      <p class="v2-hero-note">适合已有业务资料、愿意先验证一个小环节的企业和个人。</p>
    </div>
    <aside id="services" class="v2-services" aria-labelledby="services-heading">
      <p class="v2-section-label">先看看，你有没有这些问题</p>
      <h2 id="services-heading">你现在卡在哪一步？</h2>
      <a class="v2-service-row" href="/experiments/ai-customer-service/"><span class="v2-service-icon" aria-hidden="true">问</span><div><h3>资料不少，回答总得找人</h3><p><strong>知识库问答</strong>：把常见问题和依据整理到一起。</p></div><span aria-hidden="true">↗</span></a>
      <a class="v2-service-row" href="/experiments/ai-customer-service/"><span class="v2-service-icon" aria-hidden="true">答</span><div><h3>重复咨询，占用了客服时间</h3><p><strong>基础AI客服</strong>：接常见问题，议价、投诉等交给人工。</p></div><span aria-hidden="true">↗</span></a>
      <a class="v2-service-row" href="/experiments/ai-website/"><span class="v2-service-icon" aria-hidden="true">展</span><div><h3>有业务和成果，缺少展示入口</h3><p><strong>官网与案例主页</strong>：讲清你做什么、做过什么、怎么联系。</p></div><span aria-hidden="true">↗</span></a>
      <p class="v2-services-foot">点击具体场景，看看已经做过的验证。</p>
    </aside>
  </section>`;
}

function experience() {
  return `<section id="about" class="v2-experience"><div class="shell v2-experience-grid">
    <div><p class="v2-section-label">交付背景与现在的实践</p><h2>把需求说清楚，<br>也把结果验清楚。</h2></div>
    <div class="v2-experience-copy"><p>过去，我做过通信等领域的系统项目交付，参与需求沟通、项目推进和系统实施。现在，我把这些交付方法用在AI知识库、客服和官网的小范围验证中。</p><p>这里能公开展示的AI成果，是下面的个人实验和本站自用案例。你可以据此判断：哪些能力已经验证，哪些需要结合你的业务再试。</p></div>
    <ul class="v2-strengths"><li><strong>需求沟通</strong><span>先明确要改善的具体问题</span></li><li><strong>实施推进</strong><span>把资料、工具和流程接起来</span></li><li><strong>结果验收</strong><span>检查实际操作与异常处理</span></li></ul>
  </div></section>`;
}

function serviceEvidence() {
  return `<div class="v2-example-visual v2-support-example"><div class="v2-example-label"><span>一个实际测过的问题</span><span>AI客服</span></div><div class="v2-customer-question"><span>模拟客户问</span><p>“我需要1000个65W的充电器，可以优惠吗？”</p></div><div class="v2-example-answer"><span class="v2-answer-icon" aria-hidden="true">↗</span><div><strong>把议价交给人工</strong><p>征得同意后，把联系方式和采购需求一起转交。人工的回复再返回原对话。</p></div></div><p class="v2-visual-caption">个人实验问答摘要，非真实客户对话截图。</p></div>`;
}

function websiteEvidence() {
  return `<div class="v2-example-visual v2-website-example"><div class="v2-example-label"><span>一个可以打开的自用案例</span><span>官网搭建</span></div><a class="v2-site-screenshot" href="/images/homepage-v1.png" target="_blank" rel="noopener"><img src="/images/homepage-v1.png" alt="老鸽个人网站第一版的实际首屏截图" width="1440" height="1000" loading="lazy"></a><p class="v2-visual-caption">你正在访问的就是本站。图为第一版截图，点击可放大。</p></div>`;
}

function examples() {
  return `<section id="experiments" class="v2-section shell">
    <div class="v2-heading"><div><p class="v2-section-label">先看已经做出来的东西</p><h2>这两类问题，我做过验证。</h2></div><p>个人实验与自用案例。<br>真实业务需要一起评估。</p></div>
    <div class="v2-examples-grid">${cases.map(item => `<article class="v2-example">
      ${item.number === '002' ? serviceEvidence() : websiteEvidence()}
      <div class="v2-example-copy"><p class="v2-example-kind">${item.number === '002' ? '个人实验 · 已验证问答与人工接手' : '模拟项目 + 本站自用 · 已完成验证'}</p>
      <h3><a href="/experiments/${item.slug}/">${item.homeTitle}</a></h3><p class="v2-example-problem">${item.homeProblem}</p>
      <dl class="v2-example-facts"><div><dt>已经做到</dt><dd>${item.homeResult}</dd></div><div><dt>如果找我</dt><dd>${item.homeNext}</dd></div></dl>
      <a class="text-link" href="/experiments/${item.slug}/">${item.number === '002' ? '看问答、人工接手与测试记录' : '看搭建过程与验收记录'} ${arrow}</a></div>
    </article>`).join('')}</div>
  </section>`;
}

function cooperation() {
  return `<section id="approach" class="v2-cooperation"><div class="v2-section shell">
    <div class="v2-heading"><div><p class="v2-section-label">如果你想一起做</p><h2>从一个小试点开始，<br>先说清楚，再动手。</h2></div><p>按范围评估后报价。<br>每一步，都有需要确认的事情。</p></div>
    <ol class="v2-cooperation-steps">
      <li><span>01</span><h3>发来一个具体问题</h3><p>说说你的业务、当前怎么处理，以及最想改善的环节。初步沟通用去标识化的资料样例即可。</p></li>
      <li><span>02</span><h3>确定范围、费用和周期</h3><p>评估资料与接入条件，把本轮交付物、实施周期、报价和验收方式写清，双方确认后启动。</p></li>
      <li><span>03</span><h3>做出版本，一起验收</h3><p>用约定的问题和操作流程测试，记录通过项、未通过项，以及哪些情况需要人工处理。</p></li>
      <li><span>04</span><h3>再决定扩展与维护</h3><p>根据本轮结果决定是否继续。交接内容、后续维护和未达标处理方式，按事先约定执行。</p></li>
    </ol>
    <div class="v2-commercial-note"><div><h3>怎么收费？多久能完成？</h3><p>按试点范围报价，主要看资料整理量、系统接入和异常处理的复杂度。先评估，再给出金额与周期；第三方模型、平台等费用是否另计，会在报价中说明。</p></div><a class="button button-dark" href="#contact">说说你的场景 ${arrow}</a></div>
  </div></section>`;
}

function fitAndQuestions() {
  return `<section class="v2-section shell v2-fit-faq">
    <div class="v2-fit"><p class="v2-section-label">先判断是否适合</p><h2>什么情况，可以先聊？</h2><ul><li>手里已有常见问题、产品资料或业务介绍。</li><li>能选出一个重复、边界较清楚的小环节。</li><li>愿意提供测试样例，并参与结果验收。</li></ul><div class="v2-not-fit"><h3>目前不适合直接承诺的需求</h3><p>没有资料就要求AI准确回答所有问题，或一开始就要求完全无人值守、高风险决策自动化。目前也不承接PLC及硬件内核方向。</p></div></div>
    <div class="v2-faq"><p class="v2-section-label">合作前说清楚</p><h2>你可能还想确认</h2>
      <details><summary>你有真实的客户交付案例吗？<span aria-hidden="true">+</span></summary><p>我过去有通信等领域的系统项目交付经历。这里公开展示的AI内容，目前是个人实验与本站自用案例，还不能等同于真实客户的商业效果。可以先用你的具体场景评估一个小试点。</p></details>
      <details><summary>最开始需要准备什么？<span aria-hidden="true">+</span></summary><p>先准备业务场景、当前处理方式、几条常见问题及对应资料，以及现有工具或渠道。初步沟通使用去标识化的样例；具体账号和接入条件在确认方案时再列清。</p></details>
      <details><summary>数据会发到哪里？用谁的账号和API？<span aria-hidden="true">+</span></summary><p>取决于实际选用的模型和平台。实施前会列明资料流向、账号归属、所需权限与费用承担方式，再一起确认。初步沟通不要直接发送密码、API Key或完整敏感资料。</p></details>
      <details><summary>效果不符合预期，怎么处理？<span aria-hidden="true">+</span></summary><p>开始前约定验收样例、通过标准、修正范围与暂停条件。验收时记录未达项，按约定处理；是否扩大范围，以本轮结果为依据。退款等具体安排也应在启动前说清。</p></details>
      <details><summary>上线后谁维护？答错或宕机怎么办？<span aria-hidden="true">+</span></summary><p>报价与交付说明中明确维护范围、异常反馈方式和人工接手安排。对回答错误、服务中断等情况，提前约定处理流程；持续维护是否包含在费用内，需要单独确认。</p></details>
    </div>
  </section>`;
}

function contact() {
  const { qrImage, email, officialAccountQr, officialAccount, xiaohongshu, github } = site.contact;
  return `<section id="contact" class="v2-contact"><div class="shell v2-contact-grid">
    <div class="v2-contact-direct"><p class="v2-section-label">直接联系老鸽</p><h2>带一个具体问题来，<br>我们先把范围聊清楚。</h2><p class="v2-contact-intro">不用先写完整方案。告诉我你做什么、目前怎么处理、最想改善什么就好。</p>
      <div class="v2-wechat"><a href="${escape(qrImage)}" target="_blank" rel="noopener" aria-label="打开老鸽的个人微信二维码原图"><img src="${escape(qrImage)}" alt="老鸽的个人微信二维码" width="820" height="1219" loading="lazy"></a><div><h3>微信直接交流</h3><p>电脑上用微信扫码。<br>手机上可打开原图识别。</p><a class="text-link" href="${escape(qrImage)}" target="_blank" rel="noopener">打开个人微信二维码 ${arrow}</a></div></div>
      <div class="v2-email"><span>更习惯邮件？</span><a href="${escape(mailLink())}">${escape(email)}</a><button class="text-button" data-copy="${escape(email)}" data-copy-success="邮箱已复制，可以在邮件应用中联系老鸽。">复制邮箱</button></div>
    </div>
    <div class="v2-brief"><p class="v2-section-label">可以参考这个开场</p><h3>把你的问题写在这里</h3><label for="contact-brief">复制后，通过微信或邮件发给我。</label><textarea id="contact-brief" rows="6" spellcheck="false">${brief}</textarea><button class="button button-dark" data-copy-from="contact-brief">复制需求描述 ${arrow}</button><p>文字仅留在当前页面，不会自动提交或保存。</p><div class="v2-brief-next"><strong>接下来怎么走？</strong><span>先了解场景，再确认能否试点；范围、周期和费用约定后开始实施。</span></div></div>
    <div class="v2-updates"><details><summary>只想看后续实验？关注公众号更新<span aria-hidden="true">+</span></summary><div class="v2-updates-inner"><a href="${escape(officialAccountQr)}" target="_blank" rel="noopener"><img src="${escape(officialAccountQr)}" alt="老鸽的AI落地实验室公众号关注二维码" width="430" height="430" loading="lazy"></a><div><strong>${escape(officialAccount)}</strong><p>这里继续记录实验过程、结果与踩坑。</p><a href="${escape(xiaohongshu)}" target="_blank" rel="noopener noreferrer">小红书实验记录 ${arrow}</a><a href="${escape(github)}" target="_blank" rel="noopener noreferrer">本站源码 ${arrow}</a></div></div></details></div>
  </div><p id="copy-status" class="copy-status" role="status" aria-live="polite"></p></section>`;
}

export function homeContent() {
  return `<div class="home-v2">${introduction()}${experience()}${examples()}${cooperation()}${fitAndQuestions()}${contact()}</div>`;
}
