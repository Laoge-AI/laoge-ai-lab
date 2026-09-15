# 老鸽的AI落地实验室

暖白、墨黑与少量黄色强调的静态个人服务与案例站。第二版根据读者反馈重排首页：先讲身份与能解决的问题，再展示验证记录、合作步骤及直接联系方式。页面在构建时生成完整HTML，无运行时框架、第三方字体或数据库依赖。

## 本地预览

需要 Node.js 22 或更新版本，在 `website` 目录运行：

```sh
npm run build:preview
npm run check
npm run preview
```

打开 `http://127.0.0.1:4173`。`Ctrl+C` 停止预览。

### 浏览器检查与截图

```sh
npm ci
npm run test:browser
```

Windows默认使用系统Edge，其他环境使用Playwright Chromium（必要时先执行 `npx playwright install chromium`）。可通过 `PLAYWRIGHT_CHANNEL` 覆盖浏览器通道。测试覆盖320/390/768/1440px布局、案例导航、复制需求和邮箱、打开个人微信二维码、FAQ键盘操作及404。第二版截图保存到 `artifacts/v2/`，第一版截图保留用于对比。Playwright仅为开发依赖，不会进入公开网站。

## 发布前补充

在 `site.config.mjs` 修改：

- `contact.wechat`：公开微信号；和二维码可二选一。
- `contact.qrImage`：已接入个人微信二维码 `/images/wechat-qr.jpg`。
- `contact.officialAccountQr`：已接入公众号关注二维码，与个人微信二维码分开维护。
- `avatar`：已接入小红书头像 `/images/avatar.jpg`。
- `contact.email`：用户确认公开的联系邮箱。
- `contact.xiaohongshu`：目前是实验001笔记；有个人主页链接后替换，并修改对应标签。
- `contact.github`：已链接本网站的公开GitHub仓库。

当前直接展示个人微信二维码与联系邮箱。公众号收纳在可展开的“关注实验更新”区域，作为内容订阅入口。需求描述框仅在浏览器内填写和复制，不提交、不保存。

`src/home.mjs` 存放第二版首页，`src/cases.mjs` 存放案例概况，`src/templates.mjs` 存放共享页面骨架和案例详情。`public/assets/home-v2.css` 为第二版布局，原 `styles.css` 继续提供通用与文章样式。

## 公开素材

以下文件已导入 `public/images/`，构建完全使用项目内素材：

- `avatar.jpg`：用户提供的小红书头像。
- `official-account-qr.jpg`：用户提供的公众号关注二维码，保留原图。
- `wechat-qr.jpg`：用户提供的个人微信二维码，保留原图，可点击打开。
- `homepage-v1.png`：本站第一版实际首屏截图，作为自用案例的证据。
- `customer-service-setup.png`：已审阅的实验搭建记录摘要。
- `customer-service-test.png`：已审阅的退款测试记录摘要。

不需要上传原始账号资料目录或 `deliverables`。`scripts/import-assets.mjs` 是本地一次性导入工具，部署时不运行，也不依赖原始电脑路径。

## Cloudflare Pages：静态站部署

公开仓库：<https://github.com/Laoge-AI/laoge-ai-lab>。

正式网站：<https://laoge-ai-lab.pages.dev/>。

首次部署在Workers上，后来发现部分目标用户无法直连。对照测试中，旧Pages站点可以直连，随后将同一份代码部署到 `laoge-ai-lab` Pages项目，用户反馈可正常打开。本次选择Pages作为正式分享入口；这不代表所有地区和运营商都已验证。

- 生产分支：`main`。
- 根目录：`website`。
- 构建命令：`npm run build`。
- 构建输出目录：`dist`。
- Node版本：22（可设置 `NODE_VERSION=22`）。

正式地址已写在 `site.config.mjs`，可用 `SITE_URL` 环境变量覆盖。生产构建会输出canonical、sitemap、允许索引的robots及带正式地址的结构化数据。

Pages初次对照测试使用 `npm run build:preview`。转为正式入口时，在Pages项目的构建设置中将命令改为 `npm run build`，保存后通过Git推送触发新部署。如果配置过 `SITE_URL`，应更新为上述Pages地址。

本地或远程预览使用 `npm run build:preview`，或设置构建变量 `SITE_PREVIEW=1`。预览构建禁止索引，并移除上一次生产构建的网站地图；不要在生产构建中开启该变量。

如果以后绑定自有域名，先在Pages项目的自定义域名设置中添加并验证域名，再更新 `SITE_URL` 并重新部署。Git推送后应查看Cloudflare Pages构建结果，并检查公网内容是否已经更新。

同一仓库仍可能触发原Workers部署。默认canonical统一指向Pages正式地址，不将Workers地址继续作为主要分享入口。

### SEO与AI检索可读性

- 完整HTML正文、中文语言标记、独立标题与描述。
- 独立案例地址、语义化层级与内部链接。
- 真实人物和文章JSON-LD，无虚构评分、客户证言或收入。
- 正式地址确定后生成canonical、robots和sitemap。
- `llms.txt` 提供页面索引与实验边界，属于辅助性文本，不保证AI平台采用。
- 在搜索引擎站长工具中提交站点地图可作为后续动作，不保证收录、排名或引用。

### 预算

当前版本不调用收费API，不要求购买域名或新增服务器。是否采用托管免费额度及其当前限制，以Cloudflare账号实际显示为准。域名首年和续费价另行核对，不为20元预算承诺具体域名。

## 内容事实与待确认

- 本站采用用户填写的资料，以及工作区已有AI客服发布文案和实验图。
- AI客服案例展示测试环境流程；不宣称真实店铺接入、生产准确率或人工成本降低。
- GLM只按用户说明列为提示词辅助，没有推断其是生产推理模型。
- 客服逻辑流按资料整理为：飞书入口 → FastAPI → Dify知识库/工作流 → 回复或人工处理 → 原对话回传。发布前请确认与现有架构一致。
- 退款补充材料与批量采购联系信息是不同业务场景，详情页分开叙述。
- 官网案例仅确认本地运行和图片上传状态问题修复，不使用早期图文里未经再次核对的速度、费用和Bug数量。
- 小红书头像、公众号及个人微信二维码、邮箱已接入。模拟企业官网的原始截图、客服笔记URL与对应源码链接仍可补充。
- 工作经历只做通信等领域系统项目交付的概括，不能把以往IT交付经历写成AI客户商业成果。
- 合作方式采用用户确认的“按范围评估后报价”，金额、周期、验收、维护及未达标处理方式在具体项目启动前约定。

## 这次实验的记录

请使用 `CONTENT-NOTES.md` 记录第一版截图、改动理由、读者反馈和实际耗时。终稿与封面应在确认结果后制作。

本轮改版决策与后续验证问题见 `REVISION-02.md`。
