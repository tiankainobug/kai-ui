<script setup lang="ts">
import { computed } from 'vue'

// 赛博朋克折叠面板:手风琴 / 多面板展开,grid 0fr->1fr 平滑高度动画
interface CollapseItem {
  title: string
  name: string
  disabled?: boolean
}

interface Props {
  modelValue?: string[]
  items?: CollapseItem[]
  accordion?: boolean
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  items: () => [],
  accordion: false,
  color: 'cyan'
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
}>()

const is_open = (name: string) => props.modelValue.includes(name)

const toggle = (item: CollapseItem) => {
  if (item.disabled) return
  // 手风琴:仅保留当前项(已开则全关);多面板:增删当前项
  let next: string[]
  if (props.accordion) {
    next = is_open(item.name) ? [] : [item.name]
  } else {
    next = is_open(item.name)
      ? props.modelValue.filter(n => n !== item.name)
      : [...props.modelValue, item.name]
  }
  emit('update:modelValue', next)
  emit('change', next)
}

// 当前激活项回显
const active_text = computed(() => props.modelValue.length ? props.modelValue.join(', ') : '(无)')
</script>

<template>
  <div class="kp-collapse" :class="`kp-collapse--${color}`">
    <div
      v-for="item in items"
      :key="item.name"
      class="kp-collapse__item"
      :class="{ 'is-open': is_open(item.name), 'is-disabled': item.disabled }"
    >
      <!-- 标题栏:点击展开/收起 -->
      <button
        class="kp-collapse__header"
        :disabled="item.disabled"
        @click="toggle(item)"
      >
        <span class="kp-collapse__arrow">›</span>
        <span class="kp-collapse__title">{{ item.title }}</span>
      </button>

      <!-- 内容区:grid 0fr/1fr 实现无需固定高度的平滑展开 -->
      <div class="kp-collapse__content-wrap" :class="{ 'is-open': is_open(item.name) }">
        <div class="kp-collapse__content">
          <slot :name="`panel-${item.name}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kp-collapse {
  font-family: var(--font-mono);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

/* 颜色变量 */
.kp-collapse--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.08); }
.kp-collapse--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); --kp-c-fill: rgba(255, 46, 151, 0.08); }
.kp-collapse--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.08); }
.kp-collapse--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); --kp-c-fill: rgba(255, 247, 0, 0.08); }

/* 每项之间分隔线 */
.kp-collapse__item + .kp-collapse__item {
  border-top: 1px solid var(--border-color);
}

/* 标题栏 */
.kp-collapse__header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: none;
  background: var(--bg-panel);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 1px;
  text-align: left;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}
.kp-collapse__header:hover:not(:disabled) {
  background: var(--kp-c-fill);
  color: var(--text-primary);
}

/* 展开项标题高亮 */
.kp-collapse__item.is-open .kp-collapse__header {
  color: var(--kp-c);
  text-shadow: 0 0 5px var(--kp-c);
}

/* 箭头:展开时旋转 90° */
.kp-collapse__arrow {
  display: inline-block;
  transition: transform var(--transition-base);
  color: var(--kp-c);
}
.kp-collapse__item.is-open .kp-collapse__arrow {
  transform: rotate(90deg);
}

/* 内容容器:grid 行高 0fr -> 1fr 平滑过渡 */
.kp-collapse__content-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--transition-slow);
}
.kp-collapse__content-wrap.is-open {
  grid-template-rows: 1fr;
}
.kp-collapse__content {
  overflow: hidden;
  padding: 0 var(--space-md);
}
/* 展开时给内容加内边距 */
.kp-collapse__content-wrap.is-open .kp-collapse__content {
  padding: var(--space-md);
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.7;
}

/* 禁用 */
.kp-collapse__item.is-disabled .kp-collapse__header {
  cursor: not-allowed;
  opacity: 0.4;
}
</style>
