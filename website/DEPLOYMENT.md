# 本次上线记录

## 已确认的信息

- 公开仓库：<https://github.com/Laoge-AI/laoge-ai-lab>。
- 初始代码已提交推送，首次提交为 `dabb08a`。
- Cloudflare实际创建的是Workers静态站，Worker名称为 `laoge-ai-lab`。
- 用户已将账号级子域名改为 `laoge-lab`。
- 正式网站：<https://laoge-ai-lab.laoge-lab.workers.dev/>。
- 新域名下的首页与两个案例已经可以访问。
- 头像、公众号二维码及案例图片都在项目内，构建不依赖原电脑素材路径。

## 当前部署约定

| 配置 | 值 |
| --- | --- |
| GitHub仓库 | `Laoge-AI/laoge-ai-lab` |
| 生产分支 | `main` |
| 根目录 | `website` |
| 构建命令 | `npm run build` |
| 静态资源目录 | `dist` |
| Node版本 | `22` |
| 正式URL | `https://laoge-ai-lab.laoge-lab.workers.dev` |

沿用已成功发布的Workers部署设置。此前规划的Pages配置不作为当前Worker的部署配置。

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

- 首页：<https://laoge-ai-lab.laoge-lab.workers.dev/>
- AI客服：<https://laoge-ai-lab.laoge-lab.workers.dev/experiments/ai-customer-service/>
- AI建站：<https://laoge-ai-lab.laoge-lab.workers.dev/experiments/ai-website/>
- 抓取规则：<https://laoge-ai-lab.laoge-lab.workers.dev/robots.txt>
- 网站地图：<https://laoge-ai-lab.laoge-lab.workers.dev/sitemap.xml>

本地构建通过与Git推送成功不等于远程构建完成；以Cloudflare构建结果和公网响应为准。允许索引也不等于搜索引擎已经收录。
