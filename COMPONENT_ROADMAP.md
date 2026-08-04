# Kai UI · 组件实现路线图

> 本文件是 **执行规范 + 进度看板**。AI 读取本文件后，找到第一个未完成 `[ ]` 的组件，按「单组件实现 SOP」执行一遍，完成后勾选 `[x]` 并提交，然后继续下一个，直到清单清空。

---

## 一、执行协议

1. 读取本文件「组件清单」，自上而下找到第一个状态为 `[ ]` 的组件。
2. 严格按「单组件实现 SOP」完成全部步骤（创建组件 → 预览页 → 路由 → 菜单 → 构建验证 → 提交推送 → 勾选）。
3. **每次只做一个组件**，做完再进下一个，不批量并行。
4. 每个组件必须独立成一个 git commit 并 push。
5. 全部完成后在本文件底部「执行日志」追加一行收尾记录。

---

## 二、项目约定（必读，避免每次重新摸索）

### 技术栈
- Vue 3 `<script setup lang="ts">` + Vite + vue-router
- TypeScript 严格模式，**变量命名 `snake_case`**（含 ref、函数、常量）
- 无 UI 依赖，全部手写 CSS

### 主题变量（复用，禁止自造颜色）
所有颜色/间距/圆角/动画/发光都从 `src/styles/theme.css` 取 CSS 变量：

| 类别 | 变量 |
| --- | --- |
| 霓虹色 | `--neon-cyan` `--neon-magenta` `--neon-yellow` `--neon-green` `--neon-purple` `--neon-red` |
| 背景 | `--bg-base` `--bg-panel` `--bg-elevated` `--bg-input` |
| 文字 | `--text-primary` `--text-secondary` `--text-muted` |
| 边框 | `--border-color` `--border-bright` |
| 圆角 | `--radius-sm` `--radius-md` `--radius-lg` |
| 间距 | `--space-xs` `--space-sm` `--space-md` `--space-lg` `--space-xl` |
| 发光 | `--glow-cyan` `--glow-magenta` `--glow-red` `--glow-green` `--glow-sm/md/lg` |
| 动画 | `--transition-fast/base/normal/slow` |
| 字号 | `--font-size-xs/sm/md/lg`；字体 `--font-mono` |
| 关键帧 | `kp-flicker` `kp-scan` `kp-pulse` `kp-spin` `kp-glitch`（已在 theme.css 定义） |

### 文件结构
- 组件本体：`src/components/Xxx.vue`（Xxx 为 PascalCase 英文名）
- 预览页面：`src/components/XxxShowcase.vue`
- 统一前缀：CSS 类名用 `kp-xxx`（如 `kp-switch`、`kp-switch--sm`）

### 预览页标准结构（照此骨架写）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import Xxx from '@/components/Xxx.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 演示用响应式状态 + 选项数据（snake_case）
// 代码示例字符串
const xxx_code = `...`
// API 表数据
const xxx_props: Record<string, string>[] = [...]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">中文名 / ENGLISH</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">分组名</span>
        <div class="kp-row"> ...各变体演示... </div>
      </div>
      <!-- 更多分组：尺寸 / 状态 / 颜色 等 -->
    </div>

    <CodeBlock :code="xxx_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="xxx_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="xxx_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="xxx_events" />
    </div>
  </section>
</template>
```
- 演示区至少覆盖：基础用法、尺寸、颜色/变体、状态（禁用/加载等）、与用户交互的回显（如 `> 当前值：xxx`）。
- `CodeBlock` 给出真实可复制的用法片段。
- `ApiTable` 三张表（Props / Slots / Events）必须齐全；无某类则省略该表。

### 注册（两处都要改）
1. **路由** `src/router/index.ts`：
   - 顶部 `import XxxShowcase from '@/components/XxxShowcase.vue'`
   - `children` 数组追加 `{ path: 'xxx', name: 'preview-xxx', component: XxxShowcase, meta: { title: '中文名' } }`
2. **菜单** `src/pages/Preview.vue` 的 `menu_items` 追加：
   `{ path: '/preview/xxx', label: '中文名', en: 'English' }`

### Git 提交规范
- 中文，格式：`feat(xxx): 添加赛博朋克风格中文名组件及预览页面`
  - `xxx` = 组件英文小写，如 `switch`、`date-picker`
- 每个组件一个独立 commit，含组件本体 + 预览页 + 路由 + 菜单改动。
- commit 后 `git push`（首次执行前先 `git remote -v` 确认远程已配置）。

---

## 三、单组件实现 SOP（7 步，逐步执行）

1. **创建组件** `src/components/Xxx.vue`
   - `interface Props` 定义属性，`withDefaults(defineProps<Props>(), {...})`
   - `defineEmits<{ ... }>()` 定义事件
   - `<style scoped>`，全部复用主题变量，霓虹发光 + 扫描线/CRT 质感贴合赛博朋克
   - 逻辑复杂处加单行注释

2. **创建预览页** `src/components/XxxShowcase.vue`
   - 按上方标准结构：演示 + CodeBlock + ApiTable(Props/Slots/Events)

3. **注册路由** `src/router/index.ts`（import + children）

4. **加菜单项** `src/pages/Preview.vue`（`menu_items` 追加）

5. **构建验证**：运行 `npm run build`
   - 必须无 TypeScript 类型错误、无构建报错才继续
   - 若报错先修复，不带着错误提交

6. **提交推送**：
   ```bash
   git add -A
   git commit -m "feat(xxx): 添加赛博朋克风格中文名组件及预览页面"
   git push
   ```

7. **勾选进度**：回到本文件，将该组件状态改为 `[x]`，单独提交本文件：
   ```bash
   git add COMPONENT_ROADMAP.md
   git commit -m "docs: 更新组件路线图进度（中文名 已完成）"
   git push
   ```

---

## 四、组件清单

> 状态：`[x]` 已完成 / `[ ]` 待实现。AI 自上而下取第一个 `[ ]` 执行。

### 已完成

| 状态 | 组件 | 英文 | 路由 | 说明 |
| --- | --- | --- | --- | --- |
| [x] | 按钮 | Button | button | 变体/尺寸/加载/禁用/图标插槽 |
| [x] | 输入框 | Input | input | 文本输入，支持前后缀/清空/禁用 |
| [x] | 滚动条 | Scrollbar | scrollbar | 自定义滚动条样式 |
| [x] | 多选框 | Checkbox | checkbox | 多选组，支持全选/禁用/颜色 |
| [x] | 单选框 | Radio | radio | 单选组互斥，颜色/尺寸/禁用 |
| [x] | 日期选择器 | DatePicker | date-picker | 日期选择面板 |
| [x] | 日期时间选择器 | DateTimePicker | date-time-picker | 日期 + 时间选择 |

### P0 · 核心高频

| 状态 | 组件 | 英文 | 路由 | 说明 |
| --- | --- | --- | --- | --- |
| [x] | 开关 | Switch | switch | 开/关切换，支持加载/禁用/尺寸/颜色 |
| [x] | 下拉选择 | Select | select | 单选/多选/可搜索/可清空 |
| [x] | 滑块 | Slider | slider | 数值区间滑动，支持步进/范围 |
| [x] | 进度条 | Progress | progress | 线形/环形，渐变发光，支持百分比内显 |
| [x] | 标签 | Tag | tag | 多色，可选中/可关闭/可勾选 |
| [x] | 徽标 | Badge | badge | 数字/点状角标，支持溢出省略 |
| [ ] | 文字提示 | Tooltip | tooltip | hover 气泡，多方向定位 |
| [ ] | 对话框 | Modal | modal | 模态弹窗，自定义内容/确认取消/遮罩 |
| [ ] | 消息提示 | Message | message | 顶部全局消息，info/success/warning/error |
| [ ] | 标签页 | Tabs | tabs | 可切换页签，线条/卡片两种风格 |

### P1 · 常用

| 状态 | 组件 | 英文 | 路由 | 说明 |
| --- | --- | --- | --- | --- |
| [ ] | 抽屉 | Drawer | drawer | 侧边滑出，左/右/上/下方向 |
| [ ] | 气泡卡片 | Popover | popover | 承载内容的气泡，click/hover 触发 |
| [ ] | 卡片 | Card | card | 内容容器，标题/操作区/阴影 |
| [ ] | 警告提示 | Alert | alert | info/success/warning/error，可关闭 |
| [ ] | 折叠面板 | Collapse | collapse | 手风琴/可展开多面板 |
| [ ] | 加载 | Loading | loading | 指示器，全屏/局部/指令式 |
| [ ] | 空状态 | Empty | empty | 无数据占位，自定义图文 |
| [ ] | 骨架屏 | Skeleton | skeleton | 加载占位，多形状组合 |
| [ ] | 头像 | Avatar | avatar | 图片/文字，形状/尺寸/叠加 |
| [ ] | 评分 | Rate | rate | 星级评分，支持半选/只读 |

### P2 · 进阶

| 状态 | 组件 | 英文 | 路由 | 说明 |
| --- | --- | --- | --- | --- |
| [ ] | 分页 | Pagination | pagination | 页码分页器，快速跳转 |
| [ ] | 步骤条 | Steps | steps | 横/纵向步骤流程 |
| [ ] | 面包屑 | Breadcrumb | breadcrumb | 导航路径，支持图标 |
| [ ] | 分割线 | Divider | divider | 横/竖，支持文字居中 |
| [ ] | 统计数值 | Statistic | statistic | 数字统计，倒计时扩展 |
| [ ] | 通知 | Notification | notification | 右上角通知卡片，自动关闭 |
| [ ] | 轮播 | Carousel | carousel | 图片/内容轮播，指示器/箭头 |
| [ ] | 时间线 | Timeline | timeline | 时间轴记录，自定义节点 |
| [ ] | 结果页 | Result | result | success/error/进行中，带操作 |
| [ ] | 分段控制器 | Segmented | segmented | 分段选择，类 iOS 分段 |

---

## 五、执行日志

<!-- 每完成一个组件在此追加一行：日期 | 组件 | commit | 备注 -->
<!-- 示例：2026-08-04 | Switch | feat(switch): ... | 首个按路线图实现的组件 -->
2026-08-04 | Switch | feat(switch): 添加赛博朋克风格开关组件及预览页面 | 首个按路线图实现的组件
2026-08-04 | Select | feat(select): 添加赛博朋克风格下拉选择组件及预览页面 | 单选/多选/可搜索/可清空
2026-08-04 | Slider | feat(slider): 添加赛博朋克风格滑块组件及预览页面 | 单值/范围双滑块/步进
2026-08-04 | Progress | feat(progress): 添加赛博朋克风格进度条组件及预览页面 | 线形/环形/条纹/状态
2026-08-04 | Tag | feat(tag): 添加赛博朋克风格标签组件及预览页面 | 多色/可勾选/可关闭/三风格
2026-08-04 | Badge | feat(badge): 添加赛博朋克风格徽标组件及预览页面 | 数字/点状/溢出省略/偏移

