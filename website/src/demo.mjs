const videoPath = '/media/customer-service-demo.mp4';
const posterPath = '/images/customer-service-demo-poster.jpg';

export function demoPlayer(id) {
  return `<div class="demo-player">
    <div class="demo-video-shell"><video id="${id}" controls playsinline preload="none" poster="${posterPath}" width="1408" height="966" aria-label="AI客服商品问答测试录屏" aria-describedby="${id}-caption">
        <source src="${videoPath}" type="video/mp4">
        你的浏览器不支持内嵌视频，可通过下方链接单独打开。
      </video><button class="demo-play-button" type="button" aria-controls="${id}" hidden><span class="demo-play-icon" aria-hidden="true">▶</span><span>播放AI客服测试录屏</span></button></div>
    <p class="demo-error" aria-live="polite" hidden></p>
    <p class="demo-caption" id="${id}-caption">约57秒 · 个人实验录屏 · 无解说，建议全屏查看对话。</p>
    <a class="demo-file-link" href="${videoPath}" target="_blank" rel="noopener">单独打开视频 <span aria-hidden="true">↗</span></a>
  </div>`;
}

export function demoNotes() {
  return `<details class="demo-notes"><summary>文字版流程与本段验证范围<span aria-hidden="true">+</span></summary>
    <ol><li><strong>开头：</strong>画面中已有测试订单与人工工单提示。本段没有重新录制人工回复回传的完整操作。</li><li><strong>约7—23秒：</strong>提问“拓展坞有哪些接口”，查看机器人回答。</li><li><strong>约24—42秒：</strong>继续追问“它自带充电器吗”，机器人回复产品供电信息。</li><li><strong>约42秒至结尾：</strong>切换到键盘USB-C连接问题，查看回复。</li></ol>
    <p>这是测试过程记录，不是线上准确率证明。接口列表的回答存在重复与数量表述不一致，仍需与业务资料核对和修正。</p>
  </details>`;
}
