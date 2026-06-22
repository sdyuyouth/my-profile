# 鲁越森 · 个人简历站

3D 暗色风格单页简历网站，面向小满科技三岗（Vibe Coding > 产品经理 > 建站）。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build    # 静态产物输出 out/
npm run start    # 需先 build，本地预览生产构建（next start 不适用于 static export）
```

静态导出后可用任意静态服务器预览 `out/` 目录，例如 `npx serve out`。

## Cloudflare Pages 部署

1. 推送代码到 GitHub
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 构建设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Node.js version**: `20` 或 `22`（Environment variables）
4. 每次 push `main` 自动触发部署

SPA 路由兜底已配置：`public/_redirects`

## 内容维护

所有文案集中在三个数据文件，改内容无需动组件：

| 文件 | 用途 |
|------|------|
| `src/data/resume.ts` | 基本信息、经历、技能、荣誉 |
| `src/data/idealPositions.ts` | 理想职位（改 `priority` 调优先级，`active: false` 隐藏） |
| `src/data/projects.ts` | 精选项目（改 `order` 调排序，改 `relevance` 关联理想职位） |

### 理想职位优先级

```typescript
// idealPositions.ts
{ id: 'vibe-coding', priority: 1, ... }  // 最高
{ id: 'pm-ai',       priority: 2, ... }
{ id: 'site',        priority: 3, ... }
```

### 项目与理想职位联动

滚动「能力」区块时，`projects.ts` 中 `relevance` 包含对应 id 的项目卡片会高亮。

## 技术栈

- Next.js 15（App Router，静态导出 `output: 'export'`）
- React + TypeScript
- Three.js / React Three Fiber（Hero 3D 背景）
- GSAP + ScrollTrigger（滚动动画）
- Lenis（平滑滚动）
- Tailwind CSS v4

## 头像替换

将照片放入 `public/avatar.jpg`，并在 `About.tsx` 中替换 LYS 占位块。
