# 鲁越森

**AI Agent 开发 / GEO 增长自动化 · 实习生**

15153945240 · 2629133574@qq.com · [github.com/sdyuyouth](https://github.com/sdyuyouth) · [profile.imatrix.tech](https://profile.imatrix.tech/)

山东青年政治学院 · 大数据与财务管理 · 本科 27 届（2023.09–2027.06）

**可出勤：每周 5 天，可连续 6 个月以上，随时到岗。**

---

## 我是谁

外贸行业出来的开发者。先在一线做机械设备出口的获客和独立站运营，被重复劳动逼着开始写自动化，再用 Claude Code 把整条运营链路做成了 Agent 系统。

所以我看 GEO 不是「一个需要优化的技术指标」，而是「客户在 ChatGPT 里问哪款装载机好，我们的站能不能被抠出来引用」——这两年我一直在拿真实业务验证这件事。

近两个月的主力项目 **GEO Decision Engine** 是自研的 GEO 决策引擎（105 次提交、2.5 万行 TypeScript、8 个 AI 平台真联网采样），并已封装成 Claude Code Skill 供 Agent 调用。这份 JD 里的每一条职责，我都在这个项目里做过一遍。

---

## 项目经历

### 1. GEO Decision Engine · 自研 GEO 决策引擎 + Claude Code Skill

`2026.07 – 至今` · 独立开发 · TypeScript / Node 20 / SQLite / Postgres / Next.js 15

给任意通用 AI Agent 提供 GEO 专业能力的决策引擎。**分工是刻意设计的：Agent 负责执行（写、改、发布），引擎负责评审、评估、建议、记账**——因为让 LLM 同时当运动员和裁判，打分一定虚高。

**四引擎架构**

| 引擎 | 回答的问题 | 实现 |
|---|---|---|
| Review | 这篇内容写得怎么样、怎么改 | 约 20 项确定性检查 + 段落级可引用性打分 + LLM 评审 |
| Evaluation | GEO 到底有没有效果 | 8 平台每日采样，品牌提及率/引用率按站独立计算 + 缺口分析 |
| Recommend | 下一步该写什么 | 数据驱动的选题生成 + 按站点出内容发布计划 |
| Attribution | 哪次改动起了作用 | 改动日志 + 时间线对齐（当前只记账，未做归因） |

**几个我认为值得聊的技术判断**

- **评分底层认知：AI 引用的是段落，不是页面。** 所以打分按标题切块做段落级评估（答案块质量 30% / 自包含 25% / 可读性 20% / 事实密度 15% / 独特性 10%），页面分取最好 5 块的均分，而不是给整页一个笼统分数。研究依据是 AI 偏好 134–167 词的自包含段落。
- **SSR 一票否决。** AI 爬虫不执行 JS——一个客户端渲染的漂亮页面在 GEO 视角下约等于空白页，这条直接否决，不参与加权。
- **国产平台我砍掉了两家。** GLM 和混元实测只对时效新闻触发搜索，常青采购题（GEO 的主力题型）纯靠记忆回答——采出来是**假可见性**，比没有数据更危险。宁可少两个平台，不要污染数据。这个结论写进了 `docs/domestic-llm.md`。
- **中转站不能想当然。** 实测中转的 `/chat/completions` 四个模型全部无联网能力，所以采样按各平台原生协议分别打（ChatGPT 走 `/v1/responses`+web_search、Gemini 走 `/v1beta`+google_search、Claude 走 `/v1/messages`+官方搜索工具），评审生成才走 OpenAI 兼容。全部有实测记录。
- **采样按 RPM 持续派发，不等响应返回。** 整轮耗时 ≈ 单次最慢延迟而非「次数 × 延迟」，30 条豆包从串行 45 分钟压到 2 分钟。
- **花钱的地方全有护栏**：日预算熔断、平台开关、`--dry-run` 预估、每轮上限，本地账本按平台分账。

**闭环**：Agent 写内容 → `geo review`（<70 分继续改）→ 发布 → `geo action` 记账 → 每日采样 → `geo report / gaps / plan` 拿下一轮指导。

**Agent 接入**：`skills/geo-agent` —— Claude Code Skill 通过 shell 调 CLI，不在 Agent 侧复刻任何业务逻辑。多 Agent 协作走 Dashboard 签发的 API Key + CLI 远程模式。

**产品化**：双层 Web 后台（平台超管 / 租户 GEO 控制台）、积分账本、先扣费后执行失败退款、pg-boss 定时任务（每日采样、页面观测、告警、周报）、Docker 部署。

> 仅本地与私有部署，未公开；可在面试中现场演示完整链路。

---

### 2. B2B 外贸智能体平台 · 多 Agent 获客与触达系统

`2026.06 – 至今` · 独立开发 · Microsoft Agent Framework / FastAPI / React / PostgreSQL / Neo4j

部署在客户服务器上的外贸 CRM 式 Agent 系统。**对外发信/WhatsApp 一律 Human-in-the-Loop，审批链本身就是产品核心**——外贸触达一旦群发翻车，损失的是客户信任，不是几条 API 调用。

- **任务拆解**：工作台建活动 → Serper 跑批进开发池 → AI 评分认定进客户池 → enrich 补全 → 触达草稿 → 审批中心锁定 sendPayload（SHA256 防篡改）→ 外发。每一步都是 Agent 可独立执行、可重试、可断点续跑的原子步骤。
- **四 Agent 协作**：Console 作对话入口，MAF `as_tool` 委派客户管理 / 触达 / 企业模型；子 Agent headless 跑批，**对外副作用不进自动通道**。
- **分域记忆**：公司 know-how / 个人打法 / 客户私密事实按 scope 注入 Neo4j，防跨业务员泄密。
- **企业 ⊕ 个人双层模型**：公司层 ICP、规则、模板；业务员私有话术与人设，按操作人 runtime 合成。
- 按 34 篇 Spec 文档 SDD 驱动开发。

---

### 3. Agent Skill 体系 · 把重复劳动一条条封装掉

`2026.03 – 至今` · Python / Claude Code Skill

不是「学了 Skill 所以写几个 demo」，是每个 Skill 背后都有一件我自己烦够了的重复工作。

- **SEO 文章生成 Skill**：给定标题与帖子类型，一次性产出 1000+ 词 B2B 工程机械 SEO 英文文章。核心是**降 AI 率的工程化规则**——同轮内分五部分连续生成规避截断、简单词替换表、禁用过渡套话、口语化标题与 FAQ、五类模式化句式黑名单。**实测 AI 检测率降至 2% 以下**。配套自动出 Word 并投递邮箱。
- **GEO Agent Skill**：见项目 1，编排 GEO 引擎 CLI。
- **外贸报价单 Skill**：适配企业**现有**的 Word PI / Excel 报价单模板（不是通用填空表），对话收集品名、MOQ、Incoterms 后直接出可发客户的单证。docxtpl + openpyxl。
- **B2B 客户背调流水线**：Excel 批量 URL 输入 → crawl4ai 抓站 → **两阶段 AI 门禁**（快模型先判是否目标客户并选 3–5 个子页，非目标直接过滤，避免 Reasoner 全量消耗）→ 深度模型输出 Pydantic 约束的结构化销售情报。支持断点续跑、Selenium 二轮兜底、代理回退，适合千级 URL 长任务。换行业只改 `prompts/industry_criteria.md`，不改代码。

---

### 4. Page Agent CLI · 浏览器自动化

`2026.05 – 2026.06` · TypeScript / Chrome CDP · [开源](https://github.com/sdyuyouth/page-agent-cli)

基于 CDP 接管用户**已打开**的 Chrome，而非另起无头实例——保留登录态与人工操作上下文。`teach` 录制一次人工演示、`replay` 回放，把操作序列沉淀成可复用脚本，解决「每次新对话从零讲页面结构」的沟通成本。标准 stdin/stdout 接口，任意 Agent 可 spawn 调用。Fork 自 Alibaba page-agent 并持续同步 upstream。

---

### 5. 生产级 B2B 独立站交付

`2024.03 – 至今` · Astro / Payload CMS / Cloudflare Workers·D1·R2

独立交付 5+ 套上线的多语言 B2B 企业站，客户包括山东海龙元、山东榄程（徐工官方代理）、浙江凯利浦等。

- **[wisemanloader.com](https://www.wisemanloader.com)：一个月做到 Google「hofrac loader」关键词首页。**
- [CANMAX 官网](https://canmax-corporate-site.pages.dev/en/)：6 语言 + RTL，Payload CMS + Astro + Cloudflare 边缘部署，Push main 触发 Deploy Hook 自动发布（[开源](https://github.com/sdyuyouth/canmax-corporate-site)）。
- 推动模板标准化，第二单起交付周期从数周压到数天，已抽象为[开源脚手架](https://github.com/sdyuyouth/payload-astro-cloudflare-starter)。

---

## 实习与工作经历

**上海康麦斯机电设备有限公司 · 数智化工程师** `2026.01 – 2026.06`
外贸业务数智化落地：搭建 AI Agent 工作流与 SEO/GEO 自动化链路，覆盖内容生成、站点审计、结构化数据与发布；多品牌官网建设与跨境代理网络搭建；把 Claude Skill、报价单生成、浏览器自动化整合为可复用工作流。

**中企动力科技股份有限公司 · 全栈开发工程师** `2025.02 – 2025.04`
外贸客户管理 SaaS 的多源获客模块：Facebook Graph API、Google Maps Places、广交会数据统一接入与清洗 pipeline。Vue 3 + Django REST，Redis 分布式队列 + Celery Worker 异步爬取，Selenium 浏览器池化 + Docker 部署。两个月完成核心模块并投入内测。

**山东青年政治学院 · 跨境电商运营项目 · 技术总监** `2024.03 – 至今`
从 0 到 1 负责技术方向与交付，统筹「独立站 + 获客 + 触达 + 运营」全链路。定制 RPA 累计抓取潜客 **10 万+ 条**；基于背调结果用 LLM 批量生成针对性开发信；对接 Facebook、LinkedIn、YouTube、TikTok 社媒矩阵自动发布。

---

## 技能

**AI Agent / Skill**　Claude Code Skill 开发与迭代 · SubAgent 编排 · Microsoft Agent Framework · MCP · HITL 审批设计 · SSE 流式 · 工具按需激活（tool_catalog）· n8n / Dify / Coze

**提示词工程**　System Prompt 设计与迭代 · 多通道模型分工（深度分析 / 高吞吐评审 / 联网采样按成本难度分流）· prompt 库效果度量与规则化淘汰 · 结构化输出约束（Pydantic / JSON Schema）· 降 AI 率写作规则

**编程**　TypeScript / Node.js（主力）· Python · React / Next.js / Vue 3 · FastAPI / Hono / Django · SQLite / PostgreSQL / Neo4j / Redis · CLI 工具开发 · Git

**API 与自动化**　Serper · Perplexity · DeepSeek · Kimi · 豆包 · 千问 · Gemini · OpenAI 兼容中转 · Google Search Console / GA4 · Facebook Graph · Google Maps Places · crawl4ai / Playwright / Selenium / Chrome CDP · Docker

**SEO / GEO**　段落级可引用性 · Schema.org / sameAs · llms.txt · AI 爬虫权限 · SSR 与 AI 可读性 · hreflang / 多语言 i18n · Cloudflare Pages / Workers 部署

---

## 对照这份 JD

| 要求 | 我的证据 |
|---|---|
| 基于 Claude Code 开发 Agent Skill | `geo-agent`、SEO 文章生成、报价单等多个在用 Skill；Skill 只编排不复刻业务逻辑 |
| API 连接搜索与社媒工具 | Serper、8 个 AI 平台原生联网协议、GSC/GA4、Facebook Graph、Google Maps |
| GEO 流程拆解为原子步骤 | GEO 引擎四引擎 + CLI 原子命令；`geo next` 综合数据直接排序下一步 |
| 竞品分析 | prompt 库审计规则：竞品高频而我方 0 提及的题标记为「高价值战场」 |
| 多语言内容生成 | SEO 文章 Skill（低 AI 率）+ 6 语言站点交付 + 按市场本地化评审 |
| 获客线索挖掘 | Google/Bing 自动补全 + Serper「People Also Ask」+ 询盘文本提炼；背调流水线；RPA 10 万+ 条 |
| 提示词工程与稳定性 | 多通道分工、结构化输出约束、prompt 效果数据化淘汰 |
| 快速迭代与数据反馈 | 采样 → 报告 → 缺口 → 计划 → 记账的闭环；每日定时任务 |
| **加分：RAG / AI 搜索算法认知** | 段落级切块与可引用性打分、SSR 一票否决、AI 信任域名榜、各平台引用元数据解析差异 |
| **加分：实际 Agent 搭建经验** | GEO 引擎 + B2B 多 Agent 平台，均为纯代码构建；也用过 n8n / Dify |
| **加分：GitHub 活跃项目** | page-agent-cli、canmax-corporate-site、payload-astro-cloudflare-starter |
| **加分：机器人行业 / 出海营销 / B2B 获客** | 两年工程机械出口一线，客户含徐工官方代理；全部项目都长在这个场景里 |

---

## 其他

全球校园人工智能算法大赛 · 全国总决赛三等奖（乳腺超声 AI 辅助诊断，ViT + 多任务特征识别）
全国计算机等级二级 · CET-4 · 初级会计师 · 三年一等奖学金 · 中共党员
