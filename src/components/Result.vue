<script setup lang="ts">
import { computed } from 'vue'

// 赛博朋克结果页:success/error/info/warning 四态,SVG 图标,带操作区
interface Props {
  status?: 'success' | 'error' | 'info' | 'warning'
  title?: string
  description?: string
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
}

const props = withDefaults(defineProps<Props>(), {
  status: 'info',
  title: '',
  description: '',
  color: 'cyan'
})

// 状态 -> 颜色映射(优先于 color prop)
const color_map = {
  success: 'green',
  error: 'red',
  info: 'cyan',
  warning: 'yellow'
} as const
const active_color = computed(() => color_map[props.status])

// 各状态 SVG 图标路径
const icon_paths = {
  success: 'M14 8 L7 15 L4 12',
  error: 'M6 6 L18 18 M18 6 L6 18',
  info: 'M10 7 H14 M12 7 V17 M10 17 H14',
  warning: 'M12 4 L20 19 H4 Z M12 9 V13 M12 16 H12.01'
} as const
const icon_path = computed(() => icon_paths[props.status])
</script>

<template>
  <div class="kp-result" :class="`kp-result--${active_color}`">
    <!-- 图标:可被 image 插槽覆盖 -->
    <div class="kp-result__icon">
      <slot name="icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="1.5" opacity="0.3" />
          <path :d="icon_path" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </slot>
    </div>

    <!-- 标题 -->
    <h2 v-if="title || $slots.title" class="kp-result__title">
      <slot name="title">{{ title }}</slot>
    </h2>

    <!-- 描述 -->
    <p v-if="description || $slots.default" class="kp-result__desc">
      <slot>{{ description }}</slot>
    </p>

    <!-- 操作区 -->
    <div v-if="$slots.action" class="kp-result__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.kp-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-xl) var(--space-lg);
  font-family: var(--font-mono);
}

/* 颜色变量 */
.kp-result--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-result--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-result--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-result--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }
.kp-result--red     { --kp-c: var(--neon-red);     --kp-c-glow: var(--glow-red); }

/* 图标 */
.kp-result__icon {
  color: var(--kp-c);
  filter: drop-shadow(0 0 8px var(--kp-c));
  margin-bottom: var(--space-md);
  animation: kp-pulse 2.4s ease-in-out infinite;
}
.kp-result__icon svg {
  width: 72px;
  height: 72px;
}

/* 标题 */
.kp-result__title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--kp-c);
  text-shadow: 0 0 8px var(--kp-c);
  margin-bottom: var(--space-xs);
}

/* 描述 */
.kp-result__desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 420px;
  margin-bottom: var(--space-lg);
}

/* 操作区 */
.kp-result__action {
  display: flex;
  gap: var(--space-sm);
}
</style>
