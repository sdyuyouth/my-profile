# 鲁越森 · 个人简历站

暗色风格单页简历网站：Hero · 项目 · 经历 · 方法 · 联系 五屏结构，GSAP 滚动动效，Next.js 静态导出部署到 Cloudflare Pages。

交互：Hero 标题打字机轮播、跟手平滑光标（SmoothCursor）、联系方式点击复制并弹出通知（Animated List）、Method 区块沿路径流动的工作流连接器；全部 `prefers-reduced-motion` 降级。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build    # 静态产物输出 out/
```

项目使用 `output: 'export'` 静态导出，`next start` 不适用。本地预览生产构建请用任意静态服务器：

```bash
npx serve out
```

## Cloudflare Pages 部署

1. 推送代码到 GitHub
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 构建设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Node.js version**: `20` 或 `22`（Environment variables）
4. 每次 push `main` 自动触发部署

## 内容维护

所有文案与数据集中在 `data/site.ts`，改内容无需动组件：

| 导出 | 用途 | 对应区块 |
|------|------|---------|
| `site` | 姓名、Hero 文案、口号、联系方式 | Hero / Contact |
| `profile` | 年龄、学历、学校、专业、籍贯、政治面貌 | Hero 信息条 |
| `marqueeTools` | 工具滚动横条名称列表 | Hero marquee |
| `projects` | 精选项目（标题、分类、状态、技术栈、亮点、链接） | Work |
| `experience` | 个人经历时间线（月级，由远到近） | Journey |
| `method` | Vibe Coding 工作流（工具分工、数据指标、SDD 流程步骤） | Method |
| `statusLabels` | 项目状态 → 徽章文案映射 | Work |

### 项目状态

`projects[].status` 决定徽章与外链显示：

| status | 徽章文案 | 链接 |
|--------|---------|------|
| `local-dev` | 仅本地开发环节可见 | 无 |
| `closed` | 未开源 | 无 |
| `open` | 已上线 | `demo` / `repo` 渲染为 Live ↗ / Repo ↗ |

## 技术栈

- Next.js 15（App Router，静态导出 `output: 'export'`）
- React 19 + TypeScript（strict）
- GSAP + ScrollTrigger + @gsap/react（滚动动效，统一从 `lib/gsap.ts` 引入）
- 原生滚动（无 Lenis）；`prefers-reduced-motion` 全量降级
- Tailwind CSS v4
- next/font（DM Sans · Noto Sans SC · DM Mono）

样式集中在 `app/globals.css`，BEM 式类名 + `:root` CSS 变量，无 CSS Module。
