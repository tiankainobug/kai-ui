<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

// 左侧组件菜单(新增组件时在此追加一项即可)
const menu_items = [
  { path: '/preview/button', label: '按钮', en: 'Button' },
  { path: '/preview/input', label: '输入框', en: 'Input' },
  { path: '/preview/scrollbar', label: '滚动条', en: 'Scrollbar' },
  { path: '/preview/checkbox', label: '多选框', en: 'Checkbox' },
  { path: '/preview/radio', label: '单选框', en: 'Radio' },
  { path: '/preview/date-picker', label: '日期选择器', en: 'DatePicker' },
  { path: '/preview/date-time-picker', label: '日期时间选择器', en: 'DateTimePicker' },
  { path: '/preview/switch', label: '开关', en: 'Switch' },
  { path: '/preview/select', label: '下拉选择', en: 'Select' },
  { path: '/preview/slider', label: '滑块', en: 'Slider' },
  { path: '/preview/progress', label: '进度条', en: 'Progress' },
  { path: '/preview/tag', label: '标签', en: 'Tag' },
  { path: '/preview/badge', label: '徽标', en: 'Badge' },
  { path: '/preview/tooltip', label: '文字提示', en: 'Tooltip' },
  { path: '/preview/modal', label: '对话框', en: 'Modal' },
  { path: '/preview/message', label: '消息提示', en: 'Message' },
  { path: '/preview/tabs', label: '标签页', en: 'Tabs' },
  { path: '/preview/drawer', label: '抽屉', en: 'Drawer' },
  { path: '/preview/popover', label: '气泡卡片', en: 'Popover' },
  { path: '/preview/card', label: '卡片', en: 'Card' },
  { path: '/preview/alert', label: '警告提示', en: 'Alert' },
  { path: '/preview/collapse', label: '折叠面板', en: 'Collapse' },
  { path: '/preview/loading', label: '加载', en: 'Loading' },
  { path: '/preview/empty', label: '空状态', en: 'Empty' },
  { path: '/preview/skeleton', label: '骨架屏', en: 'Skeleton' },
  { path: '/preview/avatar', label: '头像', en: 'Avatar' },
  { path: '/preview/rate', label: '评分', en: 'Rate' },
  { path: '/preview/pagination', label: '分页', en: 'Pagination' },
  { path: '/preview/steps', label: '步骤条', en: 'Steps' },
  { path: '/preview/breadcrumb', label: '面包屑', en: 'Breadcrumb' },
  { path: '/preview/divider', label: '分割线', en: 'Divider' },
  { path: '/preview/statistic', label: '统计数值', en: 'Statistic' },
  { path: '/preview/notification', label: '通知', en: 'Notification' },
  { path: '/preview/carousel', label: '轮播', en: 'Carousel' },
  { path: '/preview/timeline', label: '时间线', en: 'Timeline' },
  { path: '/preview/result', label: '结果页', en: 'Result' },
  { path: '/preview/segmented', label: '分段控制器', en: 'Segmented' }
]

const menu_list_ref = ref<HTMLElement>()
const route = useRoute()

// 路由切换后把当前选中菜单项滚入视野,避免菜单内部滚动后选中项停在可视区外(刷新/直链进入同样生效)
watch(
  () => route.path,
  async () => {
    await nextTick()
    menu_list_ref.value
      ?.querySelector('.router-link-active')
      ?.scrollIntoView({ block: 'nearest' })
  },
  { immediate: true }
)
</script>

<template>
  <div class="preview-layout">
    <!-- 左侧组件菜单 -->
    <aside class="preview-menu">
      <div class="preview-menu__title">// 组件 COMPONENTS</div>
      <nav class="preview-menu__list" ref="menu_list_ref">
        <RouterLink
          v-for="item in menu_items"
          :key="item.path"
          :to="item.path"
          class="preview-menu__item"
        >
          <span class="preview-menu__label">{{ item.label }}</span>
          <span class="preview-menu__en">{{ item.en }}</span>
        </RouterLink>
      </nav>
    </aside>

    <!-- 右侧内容区:子路由出口 -->
    <div class="preview-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.preview-layout {
  display: flex;
  gap: var(--space-lg);
  align-items: flex-start;
}

/* ---- 左侧菜单 ---- */
.preview-menu {
  position: sticky;
  top: 84px;
  width: 220px;
  flex-shrink: 0;
  /* 限制菜单最大高度=视口-header(84px)-底部留白,防止菜单高出视口导致 sticky 失效、底部菜单项看不到 */
  max-height: calc(100vh - 84px - var(--space-xl));
  display: flex;
  flex-direction: column;
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.preview-menu__title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-color);
}

.preview-menu__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-height: 0; /* 配合 flex 子项,让 overflow 在固定高度容器内生效 */
  overflow-y: auto;
  overscroll-behavior: none; /* 菜单滚到顶/底立即停止,不回弹、也不带动外层滚动 */
  /* 赛博朋克风格自定义滚动条 */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 240, 255, 0.3) transparent;
}
.preview-menu__list::-webkit-scrollbar {
  width: 6px;
}
.preview-menu__list::-webkit-scrollbar-track {
  background: transparent;
}
.preview-menu__list::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.3);
  border-radius: 3px;
}
.preview-menu__list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.5);
}

.preview-menu__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: all var(--transition-fast);
  overflow: hidden;
  flex-shrink: 0; /* 防止 flex 列容器空间不足时压缩每项高度,导致内容底部被裁切 */
}

/* 选中项左侧发光指示条 */
.preview-menu__item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: var(--neon-cyan);
  box-shadow: 0 0 8px var(--neon-cyan);
  border-radius: 2px;
  transition: height var(--transition-base);
}

.preview-menu__item:hover {
  color: var(--text-primary);
  background: rgba(0, 240, 255, 0.05);
}

.preview-menu__item.router-link-active {
  color: var(--neon-cyan);
  background: rgba(0, 240, 255, 0.08);
  text-shadow: 0 0 6px var(--neon-cyan);
}
.preview-menu__item.router-link-active::before {
  height: 60%;
}

.preview-menu__label {
  white-space: nowrap;
  line-height: 1.2;
}

.preview-menu__en {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 1px;
  line-height: 1.2;
}
.preview-menu__item.router-link-active .preview-menu__en {
  color: var(--neon-cyan);
  opacity: 0.7;
}

/* ---- 右侧内容 ---- */
.preview-content {
  flex: 1;
  min-width: 0;
}

/* ---- 窄屏:菜单转顶部横向条 ---- */
@media (max-width: 768px) {
  .preview-layout {
    flex-direction: column;
  }
  .preview-menu {
    position: static;
    width: 100%;
  }
  .preview-menu__list {
    flex-direction: row;
    overflow-x: auto;
    gap: var(--space-sm);
  }
  .preview-menu__item {
    white-space: nowrap;
    flex-shrink: 0;
  }
}
</style>
