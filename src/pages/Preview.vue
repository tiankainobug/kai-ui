<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

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
  { path: '/preview/select', label: '下拉选择', en: 'Select' }
]
</script>

<template>
  <div class="preview-layout">
    <!-- 左侧组件菜单 -->
    <aside class="preview-menu">
      <div class="preview-menu__title">// 组件 COMPONENTS</div>
      <nav class="preview-menu__list">
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
