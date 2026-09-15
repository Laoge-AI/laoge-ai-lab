# 老鸽的AI落地实验室

有8年IT项目交付经验，记录AI参与真实业务任务的过程、结果与踩坑。

这是老鸽的个人案例网站源码。面向小微企业和需要AI流程改造的业务负责人，展示已经完成的个人实验，以及实际验证的范围。

**网站：<https://laoge-ai-lab.laoge-lab.workers.dev/>**

## 网站内容

- 个人主页：关于老鸽、案例、工作方式与交流入口。
- 实验002：AI客服的知识问答、人工接手及回复回传。
- 实验001：模拟企业官网的需求、设计、开发与验收。

案例均明确标注为个人实验，不将测试流程等同于真实客户商业交付。

## 本地运行

在 `website` 目录使用Node.js 22或更新版本：

```sh
npm run build:preview
npm run check
npm run preview
```

打开 `http://127.0.0.1:4173`。

## Cloudflare Workers静态站部署

| 配置 | 值 |
| --- | --- |
| 生产分支 | `main` |
| 根目录 | `website` |
| 构建命令 | `npm run build` |
| 静态资源目录 | `dist` |
| Node版本 | `22` |

`npm run build` 默认使用已确认的正式地址，生成canonical、robots和sitemap，允许搜索索引。预览使用 `npm run build:preview` 或设置 `SITE_PREVIEW=1`，不生成网站地图并禁止索引。

以后换域名时可通过 `SITE_URL` 覆盖正式地址，再重新构建、部署。Cloudflare上的部署目标是现有 `laoge-ai-lab` Worker。

## 维护说明

- [网站文档](website/README.md)
- [部署记录](website/DEPLOYMENT.md)
- [这次实验的内容记录](website/CONTENT-NOTES.md)

所有公开图片已在 `website/public/images/` 中，构建不依赖本地账号资料目录。公众号：**老鸽的AI落地实验室**。
