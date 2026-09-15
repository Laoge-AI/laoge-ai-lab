# 老鸽的AI落地实验室

暖白、墨黑与少量黄色强调的静态个人案例站。第一版包含首页、AI客服案例、AI建站案例和404页。页面在构建时生成完整HTML，无运行时框架、第三方字体或数据库依赖。

## 本地预览

需要 Node.js 22 或更新版本，在 `website` 目录运行：

```sh
npm run build
npm run check
npm run preview
```

打开 `http://127.0.0.1:4173`。`Ctrl+C` 停止预览。

### 浏览器检查与截图

```sh
npm ci
npm run test:browser
```

Windows默认使用系统Edge，其他环境使用Playwright Chromium（必要时先执行 `npx playwright install chromium`）。可通过 `PLAYWRIGHT_CHANNEL` 覆盖浏览器通道。测试覆盖320/390/768/1440px布局、案例导航、复制需求、FAQ键盘操作和404，并在 `artifacts/` 保存桌面与手机截图。Playwright仅为开发依赖，不会进入公开网站。

## 发布前补充

在 `site.config.mjs` 修改：

- `contact.wechat`：公开微信号；和二维码可二选一。
- `contact.qrImage`：例如 `/images/wechat-qr.png`，文件放在 `public/images/`。
- `contact.officialAccountQr`：已接入公众号关注二维码，与个人微信二维码分开维护。
- `avatar`：已接入小红书头像 `/images/avatar.jpg`。
- `contact.email`：公开邮箱，可选。
- `contact.xiaohongshu`：目前是实验001笔记；有个人主页链接后替换，并修改对应标签。
- `contact.github`：已链接本网站的公开GitHub仓库。

当前以已知小红书笔记作为需求交流入口；公众号二维码用于关注更新，不冒充个人微信联系入口。需求描述框仅在浏览器内填写和复制，不提交、不保存。

`src/cases.mjs` 存放案例概况，`src/templates.mjs` 存放页面文案和结构，`public/assets/styles.css` 控制设计。

## 公开素材

以下文件已导入 `public/images/`，构建完全使用项目内素材：

- `avatar.jpg`：用户提供的小红书头像。
- `official-account-qr.jpg`：用户提供的公众号关注二维码，保留原图。
- `customer-service-setup.png`：已审阅的实验搭建记录摘要。
- `customer-service-test.png`：已审阅的退款测试记录摘要。

不需要上传原始账号资料目录或 `deliverables`。`scripts/import-assets.mjs` 是本地一次性导入工具，部署时不运行，也不依赖原始电脑路径。

## Cloudflare Pages：Git部署

公开仓库已创建：<https://github.com/Laoge-AI/laoge-ai-lab>。GitHub账号已授权；Cloudflare Pages的Git连接仍需在账号页面完成。

1. 使用公开仓库 `Laoge-AI/laoge-ai-lab`，网站代码和公开素材统一由Git管理。
2. 在Cloudflare中进入 Workers & Pages，创建Pages项目并连接该仓库。
3. 整个工作区作为仓库时：
   - 框架预设：无。
   - 根目录：`website`。
   - 构建命令：`npm run build`。
   - 输出目录：`dist`。
   - Node版本：22（可设置 `NODE_VERSION=22`）。
4. 若 `website` 自身就是仓库根目录，则根目录留空，其余配置不变。
5. 首次部署会获得 `https://项目名.pages.dev`，不必先买域名。
6. 在生产环境添加 `SITE_URL=https://项目名.pages.dev`，重新部署。这样才会生成正式canonical和sitemap，并允许索引。预览分支不要设置这个生产变量。
7. 若以后换域名，先在Pages绑定并验证域名，再更新 `SITE_URL`、重新部署，同时把旧生产域名重定向到新域名。

正式部署仍需用户账号授权。本地构建成功不等于已经公网发布。

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
- 小红书头像和公众号二维码已接入。个人微信号或二维码、客服笔记URL、建站截图和公开源码链接仍可补充。

## 这次实验的记录

请使用 `CONTENT-NOTES.md` 记录第一版截图、改动理由、读者反馈和实际耗时。终稿与封面应在确认结果后制作。
