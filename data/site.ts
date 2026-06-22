export type ProjectStatus = "local-dev" | "closed" | "open"

export type StackLayer = {
  layer: string
  items: string[]
}

export type ProjectFeature = {
  title: string
  desc: string
}

export type Project = {
  id: string
  title: string
  category: string
  status: ProjectStatus
  summary: string
  details: string[]
  features: ProjectFeature[]
  stackLayers: StackLayer[]
  demo?: string
  repo?: string
}

export type ExperienceLink = {
  label: string
  url: string
}

export type Experience = {
  id: string
  start: string
  end: string
  company: string
  role: string
  summary: string
  highlights: string[]
  stack?: string[]
  links?: ExperienceLink[]
}

export const site = {
  name: "鲁越森",
  hero: {
    title: "Built Everything by Vibe Coding",
    subtitle: "全栈工程师 鲁越森",
    poweredBy: "Powered by AI",
  },
  contactSlogan: "让我和你一起，用 AI 赋能每个行业",
  phone: "15153945240",
  email: "2629133574@qq.com",
  github: "https://github.com/sdyuyouth",
  githubLabel: "github.com/sdyuyouth",
} as const

export const profile = {
  age: 21,
  grade: "大三在读",
  school: "山东青年政治学院",
  major: "大数据与财务管理",
  hometown: "山东临沂",
  politicalStatus: "中共党员",
} as const

export const marqueeTools = [
  "Cursor",
  "Claude Code",
  "Codex",
  "Antigravity",
  "Trae",
  "OpenClaw",
  "Hermes",
  "Windsurf",
  "GitHub Copilot",
  "Cline",
  "Aider",
  "Continue",
  "Replit Agent",
  "v0",
  "Bolt",
  "Lovable",
  "Devin",
  "Gemini Code Assist",
  "Amazon Q Developer",
  "Sourcegraph Cody",
  "Tabnine",
  "Zed",
  "MCP",
  "OpenCode",
  "Roo Code",
  "Kiro",
  "Augment Code",
  "Supermaven",
  "PearAI",
  "Void",
  "Melty",
  "OpenInterpreter",
  "LangGraph",
  "Microsoft Agent Framework",
  "n8n",
  "Dify",
  "Coze",
] as const

export const projects: Project[] = [
  {
    id: "b2b-agent",
    title: "B2B 外贸智能体平台",
    category: "核心项目 · 2026",
    status: "local-dev",
    summary:
      "部署在客户服务器上的外贸 CRM 式 Agent 系统——活动驱动获客、双池管理线索生命周期；对外发信/WhatsApp 一律 Human-in-the-Loop，审批链本身是产品核心。",
    details: [
      "典型路径：工作台建活动 → Serper 跑批进开发池 → AI 评分认定进客户池 → enrich 补全 → 触达草稿 → 审批中心审阅并锁定 sendPayload → 外发。",
      "基于 MAF 的产品工程：React shadcn 管理台 + FastAPI，文档 00–34 与 system-requirements；Console、双池、审批、Serper 跑批已在本地联调。",
      "MAF Workflow 编排层与 PostgreSQL 全量迁移进行中；未对外部署。",
    ],
    features: [
      {
        title: "四 Agent 协作",
        desc: "Console 对话入口，MAF as_tool 委派客户管理 / 触达 / 企业模型；子 Agent headless 跑批，对外副作用不进自动通道。",
      },
      {
        title: "企业 ⊕ 个人模型",
        desc: "公司层 ICP、规则、模板、知识库；业务员私有话术/市场/人设；Agent 按操作人 runtime 合成，写权分级。",
      },
      {
        title: "双池 + 动态画像",
        desc: "开发池（搜索/import/AI 评分认定）→ 客户池（补全/跟进）；dynamic_profile JSONB + 画像设计器，字段 provenance 可追溯。",
      },
      {
        title: "审批风控",
        desc: "交互问答、内嵌 HITL、审批中心三条通道；外发前锁定 sendPayload（SHA256 防篡改），支持 auto 规则引擎。",
      },
      {
        title: "分域记忆",
        desc: "公司 know-how / 个人打法 / 客户私密事实分 scope 注入 Neo4j，Recall 随 focus_lead 切换，防跨业务员泄密。",
      },
      {
        title: "每日自治迭代",
        desc: "整理 → 复盘 → Console 汇报（默认关）；安全字段自动写，改画像/规则/企业文档存疑项走 lead_change_request 审批。",
      },
    ],
    stackLayers: [
      { layer: "Agent", items: ["Microsoft Agent Framework", "Multi-Agent"] },
      { layer: "后端", items: ["FastAPI", "PostgreSQL", "SSE"] },
      { layer: "前端", items: ["React", "shadcn", "TypeScript"] },
      { layer: "数据", items: ["Neo4j", "Serper API"] },
    ],
  },
  {
    id: "b2b-crawl",
    title: "B2B 客户背调流水线",
    category: "获客自动化 · 2026",
    status: "local-dev",
    summary:
      "Excel 批量 URL 输入，crawl4ai 抓站 + DeepSeek 两阶段分析，输出结构化销售情报 JSON——B2B 智能体「网页深掘」能力的离线批处理版，对接 Email 搜索与数据合并链路。",
    details: [
      "流水线：首页抓取 → 快模型门禁（是否目标客户、选 3～5 子页）→ 并发补抓 → Reasoner 生成 SalesIntelligence（公司画像、破冰证据、痛点推断等英文 JSON），结果合并回 Excel。",
      "爬取层 crawl4ai + Playwright 分批跑数（默认 50 条/批），失败自动 Selenium Edge 二轮、代理回退；支持断点续跑与部分结果保存，适合千级 URL 长时间任务。",
      "行业边界由 prompts/industry_criteria.md 配置，换行业只改 Prompt 不改代码；爬前可选 url_clean_ai 域名级 AI 预清洗，配合 data_combine 接入 Email 搜索导出表。",
      "目前运行在本地开发环境，尚未对外部署公开访问。",
    ],
    features: [
      {
        title: "两阶段 AI 门禁",
        desc: "deepseek-chat 导航筛选 + deepseek-reasoner 深度分析，非目标客户直接过滤，避免 Reasoner 全量消耗。",
      },
      {
        title: "规模化爬取",
        desc: "Batch 分批重启浏览器、并发子页抓取、失败 Selenium 重试与断点续跑，专为大批量背调设计。",
      },
      {
        title: "结构化情报",
        desc: "Pydantic 约束 SalesIntelligence 输出，含破冰证据与痛点假设，可直接供外联/CRM 使用。",
      },
    ],
    stackLayers: [
      { layer: "爬取", items: ["crawl4ai", "Playwright", "Selenium"] },
      { layer: "AI", items: ["DeepSeek API", "Pydantic"] },
      { layer: "运行时", items: ["Python", "asyncio"] },
      { layer: "数据", items: ["pandas", "openpyxl"] },
    ],
  },
  {
    id: "canmax",
    title: "CANMAX 企业官网",
    category: "全栈建站 / SEO · 2026",
    status: "open",
    summary:
      "CANMAX 机械设备品牌的多语言 B2B 官网：内容可自助维护、询盘闭环、Deploy Hook 自动发布，已生产上线。",
    details: [
      "Payload CMS 管理产品、新闻、分类与媒体资源；Astro 生成 SEO 友好的静态页面，兼顾首屏速度与爬虫可读性。",
      "支持 6 种语言及 RTL 布局，Cloudflare Workers + D1 + R2 承担边缘计算与对象存储，全球访问延迟可控。",
      "编写迁移脚本完成旧站数据导入、图片批量修复、产品 CSV 导入；Push 到 main 后 Deploy Hook 触发 Cloudflare Pages 自动构建。",
      "Vibe Coding 首次使用 Payload + Astro 组合，从 Spec 到上线完整走通 SDD 流程。",
    ],
    features: [
      {
        title: "内容管理",
        desc: "产品矩阵、新闻稿、多语言字段、媒体库，运营无需改代码即可更新。",
      },
      {
        title: "国际化",
        desc: "6 语言 + RTL，Astro i18n 路由与 hreflang，面向中东与欧美市场。",
      },
      {
        title: "交付自动化",
        desc: "Deploy Hook、批量导入脚本、图片 CDN 迁移，降低后续运维成本。",
      },
    ],
    stackLayers: [
      { layer: "CMS", items: ["Payload CMS", "TypeScript"] },
      { layer: "前端", items: ["Astro", "TypeScript"] },
      { layer: "边缘", items: ["Cloudflare Workers", "D1", "R2"] },
      { layer: "部署", items: ["Cloudflare Pages"] },
    ],
    demo: "https://canmax-corporate-site.pages.dev/en/",
    repo: "https://github.com/sdyuyouth/canmax-corporate-site",
  },
  {
    id: "page-agent",
    title: "Page Agent CLI",
    category: "自动化工具 · 2026",
    status: "open",
    summary:
      "基于 CDP 的浏览器自动化 CLI：安全接管用户现有 Chrome 实例，支持 teach/replay 经验复用——解决「重开浏览器丢登录态」与「每次新对话从零说明、无经验记忆、沟通成本极高」两大痛点。",
    details: [
      "通过 WebSocket 连接用户已打开的 Chrome，而非 Playwright 另起无头实例——保留登录态、Cookie 与人工操作上下文，Agent 可在真实浏览环境中安全执行 click / input / scroll 等操作。",
      "原项目每次新开都是新对话，没有经验记忆，同类操作得反复讲流程、讲页面结构。teach 录制一次人工演示，replay 直接回放，操作序列沉淀为可复用脚本，下次无需再从零沟通。",
      "TypeScript 实现，提供 state、click、input、run、teach 等命令；标准 stdin/stdout 接口，任意 Agent 均可 spawn 调用。",
      "Fork 自 Alibaba page-agent，持续跟进 upstream，已开源维护独立仓库。",
    ],
    features: [
      {
        title: "复用现有浏览器",
        desc: "CDP 接管用户已打开的 Chrome，保留登录态与 Cookie，无需另起无头浏览器、不丢人工操作上下文。",
      },
      {
        title: "经验复用",
        desc: "teach 录制 + replay 回放，操作序列沉淀为可复用脚本——不用每次新对话都从零讲流程、讲页面，沟通成本大幅下降。",
      },
      {
        title: "任意 Agent 可接入",
        desc: "标准 stdin/stdout 子进程接口，OpenClaw、Claude Code 等任意 Agent 均可直接 spawn 调用。",
      },
    ],
    stackLayers: [
      { layer: "运行时", items: ["TypeScript", "Node.js"] },
      { layer: "协议", items: ["Chrome CDP", "WebSocket"] },
      { layer: "Agent", items: ["ReAct", "LLM"] },
      { layer: "集成", items: ["任意 Agent"] },
    ],
    demo: "https://alibaba.github.io/page-agent/",
    repo: "https://github.com/sdyuyouth/page-agent-cli",
  },
  {
    id: "agent-doc",
    title: "外贸报价单 Agent 工具",
    category: "Agent Skill · 2026",
    status: "closed",
    summary:
      "外贸报价场景 Agent Skill：按企业现有模板定制，对话收集字段后一键生成 PI（Word）与报价单（Excel），无需每次手工套表。",
    details: [
      "核心不是通用填空表，而是适配企业手头在用的 Word PI 模板与 Excel 报价单——docxtpl 渲染 .docx、openpyxl 写入 .xlsx，版式、字段、公式与客户现有单证保持一致。",
      "定制流程：拿客户模板 → 梳理字段映射（品名、MOQ、Incoterms、交期、付款方式等）→ Skill 内结构化收集 → 直接输出可发给客户的文件。",
      "封装为 Claude Skill，Agent 在对话中补全缺失字段后生成文件路径；未开源，仅本地与 Skill 环境可用。",
    ],
    features: [
      {
        title: "企业模板定制",
        desc: "基于客户现有 Word PI / Excel 报价单做适配，版式与字段对齐真实业务，不是千篇一律的通用模板。",
      },
      {
        title: "双单证输出",
        desc: "目前已支持 PI（.docx）与报价单（.xlsx）两种格式，覆盖业务员日常最常出的两类单证。",
      },
      {
        title: "Skill 集成",
        desc: "Claude Code / Agent 对话内调用，收集品名、数量、单价、贸易术语后直接出文件。",
      },
    ],
    stackLayers: [
      { layer: "核心", items: ["Python", "Claude Skill"] },
      { layer: "Excel", items: ["openpyxl", "报价单模板"] },
      { layer: "Word", items: ["docxtpl", "PI 模板"] },
      { layer: "定制", items: ["企业现有模板", "字段映射"] },
    ],
  },
  {
    id: "ai-survey",
    title: "AI 调查问卷",
    category: "AI 产品 · 2026",
    status: "open",
    summary:
      "Cloudflare 全栈问卷平台：一句话 AI 生成问卷，「结论先行」反推概率分布并批量生成模拟填写数据，配套可视化分析与控制台，已生产上线。",
    details: [
      "React + Hono 部署于 Cloudflare Pages Functions，D1 存问卷元数据、R2 存填写记录与 CSV 导出；DeepSeek API 驱动问卷生成与分布模型推理。",
      "核心差异化是结论先行模拟数据：用户描述期望统计结果（如「80% 选非常满意」），AI 逆向生成 Persona 画像、地理分布与各题概率模型，经可视化编辑器微调后批量生成 100–10000 条带 IP/地域/耗时元数据的填写记录。",
      "Cloudflare Workflows 异步执行 AI 分析与批量生成；Dashboard 集成 Chart.js 做饼图/柱状图/环形图，并支持 NPS、相关、交叉、聚类等分析页。",
      "含问卷发布分享、填写收集、订单核销与 EmailJS 通知，生产环境运行于 data.imatrix.tech。",
    ],
    features: [
      {
        title: "一句话生成问卷",
        desc: "自然语言描述需求，DeepSeek 输出可编辑的问卷结构，支持拖拽排序、自动保存与发布分享链接。",
      },
      {
        title: "结论先行模拟数据",
        desc: "输入期望统计结论，AI 反推概率分布与 Persona 画像，可视化编辑后批量生成千级模拟填写，含地理与 IP 元数据。",
      },
      {
        title: "数据分析控制台",
        desc: "Dashboard 图表可视化 + NPS/相关/交叉/聚类分析，支持 CSV 导出与 AI 报告生成。",
      },
    ],
    stackLayers: [
      { layer: "前端", items: ["React", "Vite", "Chart.js"] },
      { layer: "后端", items: ["Hono", "TypeScript"] },
      { layer: "边缘", items: ["Cloudflare D1", "R2", "Workflows"] },
      { layer: "AI", items: ["DeepSeek API"] },
    ],
    demo: "https://data.imatrix.tech",
  },
  {
    id: "starter",
    title: "B2B 建站模板",
    category: "产品化模板 · 2026",
    status: "open",
    summary:
      "从 CANMAX 生产实例抽象的可复用 B2B 企业站脚手架：6 语言 i18n、询盘表单、翻译辅助，Cloudflare 一键部署。",
    details: [
      "Payload + Astro + Cloudflare Pages 三板斧，新客户建站从数周缩短到数天；Collections 与页面结构预设 B2B 常见模块。",
      "内置询盘表单、产品列表、关于我们、新闻等页面模板；i18n 路由与翻译辅助脚本降低多语言维护成本。",
      "产品化思维：第一单定制，第二单起复用模板调配置即可；已开源为 GitHub Template，可直接 fork 部署。",
    ],
    features: [
      {
        title: "可复用架构",
        desc: "CANMAX 验证过的目录结构与 CMS Schema，直接 fork 改品牌。",
      },
      {
        title: "多语言开箱",
        desc: "6 语言 i18n + 询盘 + 翻译工作流，面向出海 B2B。",
      },
      {
        title: "边缘部署",
        desc: "Cloudflare Pages 一键发布，无服务器运维负担。",
      },
    ],
    stackLayers: [
      { layer: "CMS", items: ["Payload CMS", "TypeScript"] },
      { layer: "前端", items: ["Astro", "Astro i18n"] },
      { layer: "边缘", items: ["Cloudflare Workers", "D1", "R2"] },
      { layer: "部署", items: ["Cloudflare Pages"] },
    ],
    repo: "https://github.com/sdyuyouth/payload-astro-cloudflare-starter",
  },
]

export const experience: Experience[] = [
  {
    id: "shanqing",
    start: "2024.03",
    end: "至今",
    company: "山青院跨境电商运营项目",
    role: "技术总监",
    summary:
      "负责学院跨境电商运营项目的技术方向与交付，从 0 到 1 搭建多套 B2B 企业官网、SEO 优化体系与自动化获客流程，直接对接 CANMAX、XCMG、Wiseman 等外贸客户，独立承担架构选型、开发上线与后续迭代。",
    highlights: [
      "独立交付 CANMAX、XCMG Used、Wiseman Loader、Keilips、Hailongyuan 等生产级 B2B 官网，覆盖产品矩阵、询盘表单、多语言与 Deploy Hook 自动发布",
      "一个月内将 wisemanloader.com 优化至 Google「hofrac loader」关键词首页，完成关键词调研、页面结构与外链策略落地",
      "定制 RPA 爬虫累计抓取潜客信息 10 万+ 条，支撑业务团队冷启动、线索筛选与 CRM 导入",
      "熟悉 Facebook、LinkedIn、YouTube、TikTok 等海外社媒 API 与运营节奏，将社媒数据接入获客与内容分发流程",
      "推动 Payload + Astro + Cloudflare 技术栈在项目内标准化，第二单起复用模板缩短交付周期",
      "编写批量迁移、产品 CSV 导入、图片 CDN 修复等脚本，降低运营与运维的手工成本",
    ],
    stack: [
      "Payload CMS",
      "Astro",
      "Cloudflare",
      "SEO",
      "RPA",
      "Selenium",
      "多语言 i18n",
    ],
    links: [
      { label: "CANMAX", url: "https://canmax-corporate-site.pages.dev/en/" },
      { label: "XCMG Used", url: "https://www.xcmgusedmachinery.com/" },
      { label: "Wiseman", url: "https://www.wisemanloader.com" },
      { label: "Keilips", url: "https://www.keilips.com" },
      { label: "Hailongyuan", url: "https://en.hailongyuan.com" },
    ],
  },
  {
    id: "qidongli",
    start: "2025.02",
    end: "2025.04",
    company: "企动力",
    role: "全栈开发工程师",
    summary:
      "参与外贸客户管理 SaaS 研发，负责多源获客模块集成与后端异步任务架构。将 Facebook、Google Maps、广交会等数据源统一接入，支撑销售团队批量采集、清洗与跟进潜客。",
    highlights: [
      "集成 Facebook Graph API、Google Maps Places、广交会展商数据，构建一站式外贸潜客采集与清洗 pipeline",
      "Vue 3 前端 + Django REST 后端，Redis 分布式队列 + Celery Worker 集群处理异步爬取与任务分发",
      "设计 Selenium 浏览器池化方案，Docker 容器化部署，支持多租户鉴权、任务隔离与失败重试",
      "实现线索去重、字段标准化与批量导出，两个月内完成核心模块交付并投入内测",
      "参与 API 文档与前端表单联调，保障销售侧「选源 → 跑任务 → 导出 Excel」闭环可用",
    ],
    stack: ["Vue 3", "Django", "Redis", "Celery", "Selenium", "Docker", "PostgreSQL"],
  },
  {
    id: "shanghai",
    start: "2026.01",
    end: "2026.06",
    company: "上海康麦斯机电设备有限公司",
    role: "数智化工程师",
    summary:
      "实习期间聚焦外贸数智化：搭建 AI Agent 工作流、SEO/GEO 自动化与多品牌官网迭代，把 Vibe Coding 与 Spec-Driven Development 落到 CANMAX 等真实生产场景。",
    highlights: [
      "搭建外贸 AI Agent 与 SEO/GEO 自动化流程闭环，覆盖内容生成、站点审计、结构化数据与发布链路",
      "参与 CANMAX 企业官网持续迭代：6 语言 i18n、询盘闭环、Deploy Hook 与 Cloudflare 边缘部署",
      "维护跨境链式代理网络与多品牌站点矩阵，统一 CMS Schema 与部署规范",
      "将 Claude Skill、报价单生成、浏览器自动化等能力整合为可复用 AI 工作流，降低运营重复劳动",
      "从 Spec 文档到上线交付完整走通 SDD 流程，与业务方对齐需求并追踪每次 Deploy 结果",
    ],
    stack: [
      "AI Agent",
      "Microsoft Agent Framework",
      "Payload CMS",
      "Astro",
      "Cloudflare",
      "SEO / GEO",
      "Claude Skill",
    ],
    links: [{ label: "CANMAX", url: "https://canmax-corporate-site.pages.dev/en/" }],
  },
]

export const statusLabels: Record<ProjectStatus, string> = {
  "local-dev": "仅本地开发环节可见",
  closed: "未开源",
  open: "已上线",
}
