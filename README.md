# AI Pulse

AI Pulse 是一个面向全球用户的 AI 新闻聚合平台，聚合 Twitter/X、waytoagi、OpenAI 和 Anthropic 的更新，支持订阅与定时抓取。

## 功能

- 多来源新闻聚合
- PostgreSQL 持久化
- 邮箱订阅（每 5 分钟发送新文章提醒）
- Vercel Cron 定时抓取与推送
- Python 抓取器

## 本地运行

1. 复制 `.env.example` 为 `.env.local`
2. 安装依赖：`npm install`
3. 初始化数据库：`npm run db:migrate`
4. 启动开发环境：`npm run dev`

Python 抓取器：

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r crawler/requirements.txt
python3 crawler/main.py
```

## 关键路由

- `/` 首页
- `/articles/[id]` 文章详情
- `/api/articles` 文章列表 API
- `/api/subscribe` 订阅 API
- `/api/cron/fetch` 抓取任务
- `/api/cron/send` 邮件任务

## 部署

- 平台：Vercel
- 数据库：Neon PostgreSQL
- 定时任务：`vercel.json`

部署前需要配置环境变量并执行一次数据库迁移。

## 来源兼容性

- OpenAI：官方 RSS
- Anthropic：官方 `/news` 页面抓取
- waytoagi：首页新闻链接抓取
- Twitter/X：镜像 RSS 多实例回退，建议自定义 `TWITTER_RSS_URLS`
