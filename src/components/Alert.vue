<script setup lang="ts">
import { ref, computed } from 'vue'

// 赛博朋克警告提示:info/success/warning/error,可关闭,标题 + 描述
interface Props {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  description?: string
  closable?: boolean
  show_icon?: boolean
  banner?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: '',
  description: '',
  closable: false,
  show_icon: true,
  banner: false
})

const emit = defineEmits<{ close: [] }>()

const visible = ref(true)

// 类型 -> 霓虹色 / 图标
const color_map = {
  info: 'cyan',
  success: 'green',
  warning: 'yellow',
  error: 'red'
} as const
const active_color = computed(() => color_map[props.type])

const icon_map = {
  info: 'i',
  success: '✓',
  warning: '!',
  error: '✕'
} as const
const icon = computed(() => icon_map[props.type])

const handle_close = () => {
  visible.value = false
  emit('close')
}
</script>

<template>
  <transition name="kp-alert">
    <div
      v-if="visible"
      class="kp-alert"
      :class="[`kp-alert--${active_color}`, { 'is-banner': banner }]"
    >
      <!-- 左侧色条 -->
      <span class="kp-alert__bar" />

      <!-- 图标 -->
      <span v-if="show_icon" class="kp-alert__icon">{{ icon }}</span>

      <!-- 文案:标题 + 描述 -->
      <div class="kp-alert__content">
        <div v-if="title || $slots.title" class="kp-alert__title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="description || $slots.default" class="kp-alert__desc">
          <slot>{{ description }}</slot>
        </div>
      </div>

      <!-- 关闭按钮 -->
      <button v-if="closable" class="kp-alert__close" @click="handle_close">×</button>
    </div>
  </transition>
</template>

<style scoped>
.kp-alert {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  padding-left: calc(var(--space-md) + 3px);
  border: 1px solid var(--kp-c);
  border-radius: var(--radius-sm);
  background: var(--kp-c-fill);
  font-family: var(--font-mono);
  overflow: hidden;
}
.kp-alert.is-banner {
  border: none;
  border-radius: 0;
  border-left: 3px solid var(--kp-c);
}

/* 颜色变量 */
.kp-alert--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.08); }
.kp-alert--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.08); }
.kp-alert--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); --kp-c-fill: rgba(255, 247, 0, 0.08); }
.kp-alert--red     { --kp-c: var(--neon-red);     --kp-c-glow: var(--glow-red);     --kp-c-fill: rgba(255, 0, 60, 0.08); }

/* 左侧色条 */
.kp-alert__bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--kp-c);
  box-shadow: var(--kp-c-glow);
}
.kp-alert.is-banner .kp-alert__bar { display: none; }

/* 图标 */
.kp-alert__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 1px;
  border-radius: 50%;
  background: var(--kp-c);
  color: var(--bg-base);
  font-size: 12px;
  font-weight: 700;
  font-style: italic;
  box-shadow: var(--kp-c-glow);
}

/* 内容 */
.kp-alert__content {
  flex: 1;
  min-width: 0;
}
.kp-alert__title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--kp-c);
  text-shadow: 0 0 5px var(--kp-c);
}
.kp-alert__desc {
  margin-top: 2px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 关闭按钮 */
.kp-alert__close {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: color var(--transition-fast);
}
.kp-alert__close:hover { color: var(--text-primary); }

/* 关闭动画 */
.kp-alert-enter-active,
.kp-alert-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base), max-height var(--transition-base);
  max-height: 200px;
}
.kp-alert-enter-from,
.kp-alert-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}
</style>
