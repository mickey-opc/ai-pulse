# AI Pulse 技术方案

## 项目概述
- 项目名: AI Pulse (AI脉搏)
- 类型: Next.js 全栈应用 + Python 爬虫
- 目标: AI新闻聚合与订阅平台

## 技术栈

| 层级 | 技术选型 | 理由 |
|------|----------|------|
| 前端 | Next.js 14 (App Router) + React | 快速开发，SEO友好 |
| 后端 | Next.js API Routes | 统一代码库 |
| 爬虫 | Python + Playwright/BeautifulSoup | 灵活抓取各类网站 |
| 数据库 | PostgreSQL (Neon) | 免费、Serverless |
| 邮件 | Resend | 开发者友好的邮件API |
| 部署 | Vercel | 前端部署 |
| 定时任务 | Vercel Cron | 免费定时任务 |

## 功能模块

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 新闻爬取 | 定时从源站抓取AI新闻 | P0 |
| 新闻列表 | 展示最新AI热点新闻 | P0 |
| 新闻详情 | 查看新闻原文 | P0 |
| 邮箱订阅 | 用户注册邮箱订阅 | P1 |
| 每小时推送 | 定时发送邮件摘要 | P1 |
| 来源筛选 | 按来源筛选新闻 | P2 |

## 数据结构

### articles 表
- id: UUID, 主键
- title: VARCHAR(500) - 标题
- url: VARCHAR(1000) - 原文链接
- source: VARCHAR(50) - 来源
- summary: TEXT - 摘要
- published_at: TIMESTAMP - 发布时间
- created_at: TIMESTAMP

### subscribers 表
- id: UUID, 主键
- email: VARCHAR(255) - 邮箱
- verified: BOOLEAN - 是否验证
- created_at: TIMESTAMP

## 新闻来源

1. TechCrunch AI
2. The Verge AI
3. VentureBeat AI
4. 36kr AI
5. 机器之心
6. AI News

## API 设计

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/articles | 获取新闻列表 |
| GET | /api/articles/[id] | 获取新闻详情 |
| POST | /api/subscribe | 订阅邮箱 |
| DELETE | /api/subscribe | 取消订阅 |
| POST | /api/cron/fetch | 爬取新闻 (定时任务)| POST | /api/cron/send | 发送邮件 (定时任务) |

## 开发任务

1. 项目初始化 - Next.js + Python 环境
2. 数据库 Schema 设计
3. Python 爬虫开发
4. Next.js 前端页面
5. 邮箱订阅功能
6. 定时任务配置
7. 部署上线

## 目录结构

```
ai-pulse/
├── frontend/          # Next.js 前端
├── crawler/           # Python 爬虫
└── docs/             # 文档
```
