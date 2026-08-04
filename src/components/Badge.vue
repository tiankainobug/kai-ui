<script setup lang="ts">
import { computed, useSlots } from 'vue'

// 赛博朋克徽标:数字 / 点状角标,支持溢出省略(99+),可包裹内容
interface Props {
  value?: number | string
  max?: number
  is_dot?: boolean
  hidden?: boolean
  color?: 'cyan' | 'magenta' | 'green' | 'yellow' | 'red'
  offset?: [number, number]
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  max: 99,
  is_dot: false,
  hidden: false,
  color: 'red',
  offset: () => [0, 0]
})

const slots = useSlots()
// 是否包裹内容:有默认插槽时徽标定位在右上角,否则内联展示
const has_content = computed(() => !!slots.default)

// 展示文本:点状为空;数字超 max 显示 "max+"
const display = computed(() => {
  if (props.is_dot) return ''
  if (typeof props.value === 'number' && props.value > props.max) {
    return `${props.max}+`
  }
  return props.value === undefined || props.value === '' ? '' : String(props.value)
})
</script>

<template>
  <div class="kp-badge" :class="{ 'kp-badge--inline': !has_content }">
    <slot />
    <span
      v-if="!hidden"
      class="kp-badge__dot"
      :class="[`kp-badge__dot--${color}`, { 'is-dot': is_dot }]"
      :style="{ '--kp-offset-x': offset[0] + 'px', '--kp-offset-y': offset[1] + 'px' }"
    >
      {{ display }}
    </span>
  </div>
</template>

<style scoped>
.kp-badge {
  position: relative;
  display: inline-block;
}
.kp-badge--inline {
  display: inline-flex;
  align-items: center;
}

/* 徽标本体 */
.kp-badge__dot {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%) translate(var(--kp-offset-x), var(--kp-offset-y));
  z-index: 1;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  color: var(--bg-base);
  white-space: nowrap;
  transition: transform var(--transition-base);
}
/* 内联模式:不绝对定位 */
.kp-badge--inline .kp-badge__dot {
  position: static;
  transform: translate(var(--kp-offset-x), var(--kp-offset-y));
}

/* 点状:仅小圆点,无文字 */
.kp-badge__dot.is-dot {
  width: 8px;
  height: 8px;
  min-width: 0;
  padding: 0;
}

/* 颜色 */
.kp-badge__dot--cyan    { background: var(--neon-cyan);    box-shadow: var(--glow-cyan); }
.kp-badge__dot--magenta { background: var(--neon-magenta); box-shadow: var(--glow-magenta); }
.kp-badge__dot--green   { background: var(--neon-green);   box-shadow: var(--glow-green); }
.kp-badge__dot--yellow  { background: var(--neon-yellow);  box-shadow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); color: var(--bg-base); }
.kp-badge__dot--red     { background: var(--neon-red);     box-shadow: var(--glow-red); }

/* 内联模式去除发光过强,文字用霓虹色 */
.kp-badge--inline .kp-badge__dot {
  color: var(--bg-base);
}
</style>
