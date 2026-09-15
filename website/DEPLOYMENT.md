# 本次上线记录

## 已确认的信息

- 公开仓库：<https://github.com/Laoge-AI/laoge-ai-lab>。
- 初始代码已提交推送，首次提交为 `dabb08a`。
- 首次部署为Workers静态站，随后根据目标用户访问反馈新建了Pages项目。
- Pages项目名称为 `laoge-ai-lab`，已连接同一GitHub仓库。
- 正式网站：<https://laoge-ai-lab.pages.dev/>。
- 用户反馈Pages地址可正常打开；当前执行环境关闭代理直连也返回HTTP 200。
- 头像、公众号二维码及案例图片都在项目内，构建不依赖原电脑素材路径。

## 当前部署约定

| 配置 | 值 |
| --- | --- |
| GitHub仓库 | `Laoge-AI/laoge-ai-lab` |
| 生产分支 | `main` |
| 根目录 | `website` |
| 构建命令 | `npm run build` |
| 构建输出目录 | `dist` |
| Node版本 | `22` |
| 正式URL | `https://laoge-ai-lab.pages.dev` |

Pages最初用 `npm run build:preview` 做访问对照。用户已确认在项目设置中将命令改为 `npm run build` 并保存。如果配置过 `SITE_URL`，应使用Pages地址；生产构建不要设置 `SITE_PREVIEW=1`。

当前正式目标为Pages项目。原Workers可以保留作历史部署，其存在不代表目标用户能直连。

## 正式网址与SEO

`site.config.mjs` 默认使用上述正式URL，支持通过 `SITE_URL` 环境变量覆盖。

生产构建应满足：

- 首页及两篇案例使用各自正确的canonical与 `og:url`。
- 正常页面为 `index, follow`；404页面继续 `noindex, nofollow`。
- `robots.txt` 允许抓取，并指向正式站点地图。
- `sitemap.xml` 只包含首页及两篇案例，不包括404。
- JSON-LD与 `llms.txt` 使用正式域名。

预览构建使用 `npm run build:preview` 或 `SITE_PREVIEW=1`，保留禁止索引行为。

## 推送后的核验入口

- 首页：<https://laoge-ai-lab.pages.dev/>
- AI客服：<https://laoge-ai-lab.pages.dev/experiments/ai-customer-service/>
- AI建站：<https://laoge-ai-lab.pages.dev/experiments/ai-website/>
- 抓取规则：<https://laoge-ai-lab.pages.dev/robots.txt>
- 网站地图：<https://laoge-ai-lab.pages.dev/sitemap.xml>

本地构建通过与Git推送成功不等于远程构建完成；以Cloudflare构建结果和公网响应为准。允许索引也不等于搜索引擎已经收录。
