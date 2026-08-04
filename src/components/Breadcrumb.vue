<script setup lang="ts">
// 赛博朋克面包屑:导航路径,支持图标 / 自定义分隔符
interface BreadcrumbItem {
  title: string
  to?: string
  icon?: string
}

interface Props {
  items?: BreadcrumbItem[]
  separator?: string
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
}

withDefaults(defineProps<Props>(), {
  items: () => [],
  separator: '/',
  color: 'cyan'
})
</script>

<template>
  <nav class="kp-breadcrumb" :class="`kp-breadcrumb--${color}`">
    <template v-for="(item, i) in items" :key="i">
      <!-- 末项不可点击,高亮显示 -->
      <span
        class="kp-breadcrumb__item"
        :class="{ 'is-active': i === items.length - 1 }"
      >
        <span v-if="item.icon" class="kp-breadcrumb__icon">{{ item.icon }}</span>
        <a v-if="item.to && i < items.length - 1" class="kp-breadcrumb__link" :href="item.to">
          {{ item.title }}
        </a>
        <span v-else class="kp-breadcrumb__text">{{ item.title }}</span>
      </span>

      <!-- 分隔符:末项后不显示 -->
      <span v-if="i < items.length - 1" class="kp-breadcrumb__separator">{{ separator }}</span>
    </template>
  </nav>
</template>

<style scoped>
.kp-breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-xs);
  font-family: var(--font-mono);
  font-size: 13px;
}

/* 颜色变量 */
.kp-breadcrumb--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-breadcrumb--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-breadcrumb--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-breadcrumb--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }

/* 每项 */
.kp-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

/* 链接:hover 变霓虹色 */
.kp-breadcrumb__link {
  color: inherit;
  text-decoration: none;
}
.kp-breadcrumb__item:hover .kp-breadcrumb__link {
  color: var(--kp-c);
  text-shadow: 0 0 5px var(--kp-c);
}

/* 末项:高亮霓虹色 */
.kp-breadcrumb__item.is-active {
  color: var(--kp-c);
  text-shadow: 0 0 5px var(--kp-c);
}

/* 图标 */
.kp-breadcrumb__icon {
  font-size: 12px;
  opacity: 0.8;
}

/* 分隔符 */
.kp-breadcrumb__separator {
  color: var(--text-muted);
  opacity: 0.5;
  user-select: none;
}
</style>
