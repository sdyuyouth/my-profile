# 个人作品集 · 页面布局与交互设计草稿

> **状态**：v0.4 · 2026-06-22  
> **定稿来源**：用户指定 Hero / 四屏结构 / 口号 / 项目规则  
> **原则**：先设计后写码；`data/site.ts` 待本稿确认后同步。

---

## 0. 整体结构（四屏单页）

```
┌─────────────────────────────────────────┐
│  第一屏  #hero     Hero + 工具横条 + 个人信息条   │  100vh
├─────────────────────────────────────────┤
│  第二屏  #work     我都做过什么项目（滚动切项目）  │  100vh × N 或 pin 切页
├─────────────────────────────────────────┤
│  第三屏  #journey  个人经历（月级时间线）         │  min-height 100vh
├─────────────────────────────────────────┤
│  第四屏  #contact  口号 + 联系方式 + 页脚        │  100vh
└─────────────────────────────────────────┘
```

**废弃（v0.4 移除）**：About 三能力卡 · Vibe Lab 独立屏 · Stack Marquee 独立屏 · GEO/SEO 审计套件项目

**导航**：极简 —— 右侧圆点指示 4 屏，或顶部仅 `Mail`；不做多锚文字菜单。

---

## 1. 第一屏 Hero `#hero`

### 1.1 线框

```
┌──────────────────────────────────────────────────────────────┐
│                                                      [Mail]  │
│                                                              │
│                                                              │
│              Built Everything by Vibe Coding                 │
│                                                              │
│           全栈工程师 鲁越森  Powered by AI                      │
│                        ↑ 居中                                 │
│                                                              │
│  ◀ ── Cursor · Claude Code · Antigravity · Trae · OpenClaw · Hermes · Codex · … ── ▶
│                        ↑ 无限滚动横条（marquee）                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 21 岁 · 大三在读 · 山东青年政治学院 · 大数据与财务管理 · 山东临沂 · 中共党员 │  │
│  │ 15153945240 · 2629133574@qq.com · GitHub ↗            │  │
│  └────────────────────────────────────────────────────────┘  │
│                        ↑ 个人信息条（见 §1.4）                 │
│                          ↓                                   │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 主文案（定稿）

| 元素 | 文案 | 大小写规则 |
|------|------|-----------|
| 主标题 EN | **Built Everything by Vibe Coding** | 句首大写；`Vibe Coding` 作为固定品牌写法 |
| 副标题 CN+EN | **全栈工程师 鲁越森** · **Powered by AI** | 中文正常；`Powered by AI` 两词首字母大写 |

**排版**

- 两行主文案 **水平垂直居中**（flex center）
- 主标题：`clamp(2rem, 5vw, 3.5rem)`，字重 600–700，英文字体偏 grotesk
- 副标题：比主标题小一档，「鲁越森」可略加重

### 1.3 工具滚动横条（Marquee）

**位置**：主文案正下方，间距 `2rem` 左右  
**方向**：自右向左无限循环；hover 可选暂停（`animation-play-state: paused`）  
**视觉**：单行 pill / 分隔符 `·`；半透明底或纯文字链式滚动

**内容清单**（尽量多，可持续追加）

```
Cursor · Claude Code · Codex · Antigravity · Trae · OpenClaw · Hermes
· Windsurf · GitHub Copilot · Cline · Aider · Continue · Replit Agent
· v0 · Bolt · Lovable · Devin · Gemini Code Assist · Amazon Q Developer
· Sourcegraph Cody · Tabnine · Zed · MCP · OpenCode · Roo Code · Kiro
· Augment Code · Supermaven · PearAI · Void · Melty · OpenInterpreter
· LangGraph · Microsoft Agent Framework · n8n · Dify · Coze
```

> 注：用户原文「tare」按 **Trae**（字节跳动 AI IDE）收录；「Hermes」保留（Agent/工具生态常用名）。

### 1.4 个人信息条

**位置**：Marquee **下方**，仍属第一屏内（不单独占屏）  
**原因**：首屏即完成「是谁 + 用什么 + 怎么联系」三件事。

| 字段 | 内容 | 备注 |
|------|------|------|
| 年龄 | 21 岁 | |
| 学籍 | 大三在读 | |
| 学校 | 山东青年政治学院 | |
| 专业 | 大数据与财务管理 | |
| 籍贯 | 山东临沂 | |
| 政治面貌 | 中共党员 | |
| 电话 | 15153945240 | `tel:` |
| 邮箱 | 2629133574@qq.com | `mailto:` |
| GitHub | github.com/sdyuyouth | 外链 |

**布局**：桌面一行 / 两行 grid；移动换行，字段间 `·` 分隔。

### 1.5 交互

| 行为 | 说明 |
|------|------|
| 进入页 | 主文案 fade-up；marquee 立即滚动 |
| 向下滚 | 自然进入第二屏；可选 scroll-snap |
| 动效降级 | `prefers-reduced-motion` → marquee 改为静态换行展示 |

---

## 2. 第二屏 项目 `#work`

### 2.1 标题

```
我都做过什么项目
```

### 2.2 布局

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  我都做过什么项目          │  01 / 05                        │
│  （左侧固定）              │  B2B 外贸智能体平台               │
│                            │  [仅本地开发环节可见]               │
│                            │                                  │
│                            │  多 Agent 外贸获客工作流…          │
│                            │  （正文 bullets）                 │
│                            │                                  │
│                            │  Microsoft Agent Framework       │
│                            │  FastAPI · React · Neo4j · …     │
│                            │  ↑ 技术栈 tags                    │
│                            │                                  │
│                            │  （无外链按钮）                   │
│                            │                                  │
│              ↓ 滚动切换下一个项目 ↓                            │
└──────────────────────────────────────────────────────────────┘
     左 ~35%                    右 ~65%
```

### 2.3 交互逻辑

| 规则 | 说明 |
|------|------|
| 滚动驱动 | 用户在第二屏区域内 **继续滚动** → 右侧内容切换到下一项目（ScrollTrigger pin + scrub，或 scroll-snap 子页） |
| 左侧标题 | 「我都做过什么项目」+ 当前序号 `01/05` **sticky 固定** |
| 右侧 | 单次只展示 **一个** 项目详情；切换时 crossfade 或 slide |
| 项目数 | **5 个**（已删除 GEO/SEO 审计套件） |
| 指示 | 右侧边缘小圆点或进度条 1–5 |

### 2.4 项目数据与状态规则

| # | 项目 | 分类 | 状态徽章 | 外链 |
|---|------|------|---------|------|
| 01 | B2B 外贸智能体平台 | 核心项目 · 2026 | **仅本地开发环节可见** | 无 |
| 02 | CANMAX 企业官网 | 全栈建站 / SEO · 2026 | 已上线 | **Live ↗** · **Repo ↗** |
| 03 | Page Agent CLI | 自动化工具 · 2026 | 已开源 | **Live ↗** · **Repo ↗** |
| 04 | 外贸报价单 Agent 工具 | Agent Skill · 2026 | **未开源** | 无 |
| 05 | B2B 建站模板 | 产品化模板 · 2026 | **未开源** | 无 |

**外链地址（仅 02、03）**

| 项目 | Live | Repo |
|------|------|------|
| CANMAX | https://canmax-corporate-site.pages.dev/en/ | https://github.com/sdyuyouth/canmax-corporate-site |
| Page Agent CLI | https://alibaba.github.io/page-agent/ | https://github.com/sdyuyouth/page-agent-cli |

**状态徽章样式**

| 徽章 | 色建议 | 文案 |
|------|--------|------|
| 仅本地开发环节可见 | gray / 虚线边框 | 仅本地开发环节可见 |
| 未开源 |  gray outline | 未开源 |
| 有链接 |  无徽章，直接显示按钮 | Live ↗ · Repo ↗ |

### 2.5 各项目正文 + 技术栈

#### 01 · B2B 外贸智能体平台 · 仅本地开发环节可见

**正文**

- 多 Agent 外贸获客：搜索/地图发现 → 网页深掘 → 画像生成 → 触达
- Console Agent + HITL 审批 + SSE 流式 + Neo4j 记忆
- tool_catalog 按需激活工具，审计日志追踪调用链

**技术栈**

`Microsoft Agent Framework` · `FastAPI` · `React` · `Neo4j` · `Serper` · `SSE` · `HITL`

---

#### 02 · CANMAX 企业官网 · Live / Repo

**正文**

- 生产级多语言 B2B 站：产品、新闻、询盘、Deploy Hook
- Astro 静态前端，6 语言 + RTL
- 站点迁移、产品导入、图片修复批量脚本

**技术栈**

`Payload CMS` · `Astro` · `Next.js` · `Cloudflare Workers` · `D1` · `R2`

---

#### 03 · Page Agent CLI · Live / Repo

**正文**

- CDP 浏览器自动化 CLI，供 OpenClaw / 自研 Agent 子进程调用
- state / click / input / run / teach，支持经验复用
- Fork 自 Alibaba page-agent，持续同步 upstream

**技术栈**

`TypeScript` · `CDP` · `WebSocket` · `ReAct` · `LLM`

---

#### 04 · 外贸报价单 Agent 工具 · 未开源

**正文**

- JSON → Excel / Word / PDF 报价单与形式发票
- 内置 Claude Skill，Agent 对话内直接出单证
- 贴近外贸业务员日常报价场景

**技术栈**

`Python` · `openpyxl` · `docxtpl` · `LibreOffice` · `Claude Skill`

---

#### 05 · B2B 建站模板 · 未开源

**正文**

- 从 CANMAX 实例抽象：6 语言 i18n + 询盘 + 翻译辅助
- Cloudflare 一键部署，降低 B2B 站迁移成本
- 产品化模板，可复用到下一客户

**技术栈**

`Payload CMS` · `Astro` · `Cloudflare Pages` · `i18n`

---

## 3. 第三屏 经历 `#journey`

### 3.1 标题

```
个人经历
```

### 3.2 时间线规则

| 规则 | 说明 |
|------|------|
| 排序 | **由远到近**（过去 → 现在） |
| 精度 | **到月份**（如 `2024.03`、`2025.02 — 2025.04`） |
| 样式 | 竖向时间线：左侧（或中间）轴线 + 节点圆点 + 卡片 |

### 3.3 时间线数据

```
2024.03 ──●── 至今
          │   山青院跨境电商运营项目 · 技术总监
          │   · 独立交付 CANMAX、XCMG、Wiseman 等多套企业官网
          │   · wisemanloader.com 一个月内 hofrac loader 关键词首页
          │   · RPA 爬取潜客 10 万+；Facebook / LinkedIn / TikTok API
          │   [CANMAX ↗] [XCMG ↗] [Wiseman ↗] [Keilips ↗] [Hailongyuan ↗]
          │
2025.02 ──●── 2025.04
          │   企动力 · 全栈开发工程师
          │   · 外贸客户管理 SaaS：Facebook / Google Maps / 广交会获客
          │   · Vue + Django · Redis + Celery · Selenium 浏览器池 · Docker
          │
2026.01 ──●── 2026.06
              上海康麦斯机电设备有限公司 · 数智化工程师
              · 外贸 AI Agent 搭建与 SEO/GEO 自动化流程
              · 多品牌企业官网与跨境链式代理网络
              · AI 工作流产品化落地
```

**交互**：进入视口 stagger；节点 hover 高亮；站点 pill 可点击外链。

---

## 4. 第四屏 结尾 `#contact`

### 4.1 线框

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                                                              │
│         让我和你一起，用 AI 赋能每个行业                        │
│                    ↑ 口号（定稿）                              │
│                                                              │
│         2629133574@qq.com                                    │
│         15153945240                                          │
│         github.com/sdyuyouth ↗                               │
│                                                              │
│         © 2026 鲁越森                                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 文案（定稿）

| 元素 | 文案 |
|------|------|
| 口号 | **让我和你一起，用 AI 赋能每个行业** |
| 邮箱 | 2629133574@qq.com |
| 电话 | 15153945240 |
| GitHub | github.com/sdyuyouth |

**排版**：口号居中、最大字号；联系方式居中列；整屏垂直居中。

---

## 5. 全局规范

### 5.1 响应式

| 断点 | 调整 |
|------|------|
| Desktop | 四屏布局如 §0；项目屏左右分栏 |
| Mobile | 项目屏改为上下堆叠：标题在上，详情在下；滚动切项目保留 |
| 时间线 | 移动单栏，月份标签不省略 |

### 5.2 动效（克制）

- Hero：fade-in
- Marquee：CSS infinite scroll
- 项目屏：ScrollTrigger pin（桌面）或 scroll-snap
- 经历：节点 stagger
- 第四屏：静态

### 5.3 SEO meta（草案）

| 字段 | 内容 |
|------|------|
| title | 鲁越森 · 全栈工程师 · Built Everything by Vibe Coding |
| description | 全栈工程师鲁越森，Powered by AI。Vibe Coding 交付 Agent 平台、B2B 独立站与自动化工具。 |

---

## 6. 与旧代码的差异（重构备忘）

| 旧实现 | v0.4 |
|--------|------|
| 7 section 长页 | **4 屏** |
| ScrollHero pin 三支柱 | **居中双行文案 + marquee** |
| Work 列表 hover 切换 | **滚动切换项目详情** |
| Statement / VibeLab / StackMarquee | **删除** |
| 6 个项目含 GEO/SEO | **5 个，去掉 GEO/SEO** |
| `data/site.ts` capabilities | **改为 projects + timeline + profile** |

**建议 `data/` 结构**

```ts
site: { name, hero, slogan, contact, profile }
profile: { age, grade, school, hometown, politicalStatus, ... }
marqueeTools: string[]
projects: { id, title, category, status, stack[], highlights[], demo?, repo? }[]
experience: { start, end?, company, role, highlights[], links? }[]  // 月级
```

---

## 7. 待你补充

| # | 项 |
|---|-----|
| T2 | Marquee 里是否有要删/要加的工具名 |
| T3 | 第二屏滚动切换：pin  scrub（慢滚） vs  snap（一滚一个） |
| T4 | 确认后是否开始改代码 |

---

## 8. 迭代记录

| 版本 | 日期 | 变更 |
|------|------|------|
| v0.1–v0.3 | 2026-06-22 | IA / 术语版文案（已 supersede） |
| v0.4 | 2026-06-22 | 用户定稿：四屏 · Hero 文案 · 5 项目 · 月级时间线 · 新口号 |
| v0.4.1 | 2026-06-22 | 补学校/专业；项目 01 状态改为「仅本地开发环节可见」 |

---

*定稿入口：§1 Hero · §2 项目 · §3 经历 · §4 口号。学校/专业已补全，可进开发。*
