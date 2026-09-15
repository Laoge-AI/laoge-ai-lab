// 内容与公开联系方式集中在这里维护。不要放入密码、访问令牌或密钥。
export default {
  name: '老鸽的AI落地实验室',
  author: '老鸽',
  tagline: '有8年IT项目交付经验，记录AI参与真实业务任务的过程、结果与踩坑。',
  city: '陕西 · 西安',
  // 已确认的正式地址；以后绑定自有域名时可用 SITE_URL 环境变量覆盖。
  url: process.env.SITE_URL || 'https://laoge-ai-lab.pages.dev',
  contact: {
    wechat: '',
    // 图片放在 public/ 下，例如 /images/wechat-qr.png。
    qrImage: '/images/wechat-qr.jpg',
    email: 'Mrd_enge@163.com',
    // 目前只有已核实的实验001笔记链接；有个人主页链接后替换。
    xiaohongshu: 'https://www.xiaohongshu.com/explore/6a9e9e65000000002b01252c',
    xiaohongshuLabel: '小红书 · 实验001笔记',
    officialAccount: '老鸽的AI落地实验室',
    // 公众号关注码，与个人微信联系二维码分开维护。
    officialAccountQr: '/images/official-account-qr.jpg',
    github: 'https://github.com/Laoge-AI/laoge-ai-lab',
  },
  // 已提供的头像；更换时填写 public/ 中实际存在图片的站内路径。
  avatar: '/images/avatar.jpg',
};
