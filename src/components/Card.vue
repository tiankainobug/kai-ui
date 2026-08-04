<script setup lang="ts">
// 赛博朋克卡片:标题 / 操作区 / 阴影 / 悬浮效果 / 四角准星
interface Props {
  title?: string
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  bordered?: boolean
  shadow?: boolean
  hoverable?: boolean
  padding?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  color: 'cyan',
  bordered: true,
  shadow: false,
  hoverable: false,
  padding: 16
})

const padding_val = () => (typeof props.padding === 'number' ? props.padding + 'px' : props.padding)
</script>

<template>
  <div
    class="kp-card"
    :class="[
      `kp-card--${color}`,
      { 'is-bordered': bordered, 'is-shadow': shadow, 'is-hoverable': hoverable }
    ]"
  >
    <!-- 四角准星装饰 -->
    <span class="kp-card__corner kp-card__corner--tl" />
    <span class="kp-card__corner kp-card__corner--tr" />
    <span class="kp-card__corner kp-card__corner--bl" />
    <span class="kp-card__corner kp-card__corner--br" />

    <!-- 标题栏:标题 + 右侧操作区 -->
    <div v-if="title || $slots.title || $slots.extra" class="kp-card__header">
      <div class="kp-card__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="$slots.extra" class="kp-card__extra">
        <slot name="extra" />
      </div>
    </div>

    <!-- 内容区 -->
    <div class="kp-card__body" :style="{ padding: padding_val() }">
      <slot />
    </div>

    <!-- 底部 -->
    <div v-if="$slots.footer" class="kp-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.kp-card {
  position: relative;
  background: var(--bg-panel);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

/* 颜色变量 */
.kp-card--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-card--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-card--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-card--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }

/* 边框 */
.kp-card.is-bordered {
  border: 1px solid var(--border-color);
}

/* 发光阴影 */
.kp-card.is-shadow {
  border-color: var(--kp-c);
  box-shadow: var(--kp-c-glow), 0 8px 24px rgba(0, 0, 0, 0.4);
}

/* 悬浮效果 */
.kp-card.is-hoverable {
  cursor: pointer;
}
.kp-card.is-hoverable:hover {
  transform: translateY(-4px);
  border-color: var(--kp-c);
  box-shadow: var(--kp-c-glow), 0 12px 32px rgba(0, 0, 0, 0.5);
}

/* 四角准星 */
.kp-card__corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid var(--kp-c);
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}
.kp-card.is-shadow .kp-card__corner,
.kp-card.is-hoverable:hover .kp-card__corner {
  opacity: 0.8;
}
.kp-card__corner--tl { top: 4px; left: 4px; border-right: none; border-bottom: none; }
.kp-card__corner--tr { top: 4px; right: 4px; border-left: none; border-bottom: none; }
.kp-card__corner--bl { bottom: 4px; left: 4px; border-right: none; border-top: none; }
.kp-card__corner--br { bottom: 4px; right: 4px; border-left: none; border-top: none; }

/* 标题栏 */
.kp-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-md);
  border-bottom: 1px solid var(--border-color);
}
.kp-card__title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--kp-c);
  text-shadow: 0 0 5px var(--kp-c);
}
.kp-card__extra {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

/* 内容区 */
.kp-card__body {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

/* 底部 */
.kp-card__footer {
  padding: var(--space-md);
  border-top: 1px solid var(--border-color);
}
</style>
