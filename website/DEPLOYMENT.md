# 本次上线记录

## 已准备

- GitHub用户名：`Laoge-AI`。
- 公开仓库：<https://github.com/Laoge-AI/laoge-ai-lab>，已创建。
- Cloudflare：用户已完成注册；本机Wrangler检查显示尚未授权登录。
- 网站已接入头像、公众号二维码与两张案例图，公开构建不依赖工作区外的素材。
- 本地预览：`http://127.0.0.1:4173`。

## 计划发布的范围

保留当前目录结构，仅提交根目录 `.gitignore` 与 `website/` 中的源代码、文档、锁文件及公开素材。`node_modules`、`dist`、`artifacts`、本机配置、原始账号资料和整个 `deliverables` 不作为本次上传内容。

## 仓库创建与授权

用户已明确授权创建公开仓库并提交、推送本次网站代码。GitHub CLI已通过浏览器设备流程登录，并核实为 `Laoge-AI` 账号。

本次提交使用用户名 `Laoge-AI` 和GitHub隐私邮箱署名。账号凭据不写入源代码。

## Cloudflare Pages连接Git

1. 在Cloudflare打开 Workers & Pages，创建Pages项目并导入上述GitHub仓库。
2. GitHub授权页面选择这个仓库。
3. 按本次目录结构配置：

| 项目 | 值 |
| --- | --- |
| 生产分支 | `main` |
| 框架预设 | 无 |
| 根目录 | `website` |
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |
| 环境变量 | `NODE_VERSION=22` |

4. 部署完成后获得实际 `pages.dev` 地址。项目名是否可用以平台为准。
5. 仅在生产环境设置 `SITE_URL=https://实际项目地址.pages.dev` 并重新部署，以生成canonical和sitemap、允许搜索索引。
6. 验证首页、两篇案例、二维码原图、手机访问及404。

Cloudflare项目和公网地址尚待建立。仓库中的第一笔提交为网站初始版本；推送与Cloudflare实际部署结果以后续记录为准。
