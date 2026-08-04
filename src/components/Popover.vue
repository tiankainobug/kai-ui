<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 赛博朋克气泡卡片:标题 + 内容,click / hover 触发,四方向定位
interface Props {
  title?: string
  content?: string
  trigger?: 'hover' | 'click'
  placement?: 'top' | 'bottom' | 'left' | 'right'
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  width?: number | string
  show_arrow?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  content: '',
  trigger: 'click',
  placement: 'top',
  color: 'cyan',
  width: 220,
  show_arrow: true,
  disabled: false
})

const emit = defineEmits<{ 'visible-change': [value: boolean] }>()

const visible = ref(false)
const root_ref = ref<HTMLElement | null>(null)

const set_visible = (v: boolean) => {
  if (props.disabled) return
  visible.value = v
  emit('visible-change', v)
}
const toggle = () => set_visible(!visible.value)

const handle_doc_click = (e: MouseEvent) => {
  if (props.trigger !== 'click') return
  if (root_ref.value && !root_ref.value.contains(e.target as Node)) set_visible(false)
}
onMounted(() => document.addEventListener('mousedown', handle_doc_click))
onUnmounted(() => document.removeEventListener('mousedown', handle_doc_click))

const width_val = () => (typeof props.width === 'number' ? props.width + 'px' : props.width)
</script>

<template>
  <span
    ref="root_ref"
    class="kp-popover"
    @mouseenter="trigger === 'hover' && set_visible(true)"
    @mouseleave="trigger === 'hover' && set_visible(false)"
  >
    <span class="kp-popover__trigger" @click="trigger === 'click' && toggle()">
      <slot />
    </span>

    <transition name="kp-popover-pop">
      <span
        v-if="visible"
        class="kp-popover__panel"
        :class="[`kp-popover__panel--${placement}`, `kp-popover__panel--${color}`]"
        :style="{ width: width_val() }"
      >
        <div v-if="title || $slots.title" class="kp-popover__title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div class="kp-popover__content">
          <slot name="content">{{ content }}</slot>
        </div>
        <span v-if="show_arrow" class="kp-popover__arrow" />
      </span>
    </transition>
  </span>
</template>

<style scoped>
.kp-popover {
  position: relative;
  display: inline-flex;
}
.kp-popover__trigger {
  display: inline-flex;
}

/* 气泡面板 */
.kp-popover__panel {
  position: absolute;
  z-index: 100;
  display: block;
  border: 1px solid var(--kp-c);
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
  box-shadow: var(--kp-c-glow), 0 6px 20px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  overflow: hidden;
}

/* 颜色变量 */
.kp-popover__panel--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.08); }
.kp-popover__panel--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); --kp-c-fill: rgba(255, 46, 151, 0.08); }
.kp-popover__panel--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.08); }
.kp-popover__panel--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); --kp-c-fill: rgba(255, 247, 0, 0.08); }

/* 标题栏 */
.kp-popover__title {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color);
  background: var(--kp-c-fill);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--kp-c);
  text-shadow: 0 0 5px var(--kp-c);
}

/* 内容区 */
.kp-popover__content {
  padding: 10px 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* 方向定位:偏离触发器 10px */
.kp-popover__panel--top {
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
}
.kp-popover__panel--bottom {
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
}
.kp-popover__panel--left {
  right: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
}
.kp-popover__panel--right {
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
}

/* 箭头 */
.kp-popover__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--kp-c);
}
.kp-popover__panel--top .kp-popover__arrow {
  bottom: -5px; left: 50%;
  transform: translateX(-50%) rotate(45deg);
  border-top: none; border-left: none;
}
.kp-popover__panel--bottom .kp-popover__arrow {
  top: -5px; left: 50%;
  transform: translateX(-50%) rotate(45deg);
  border-bottom: none; border-right: none;
}
.kp-popover__panel--left .kp-popover__arrow {
  left: -5px; top: 50%;
  transform: translateY(-50%) rotate(45deg);
  border-left: none; border-bottom: none;
}
.kp-popover__panel--right .kp-popover__arrow {
  right: -5px; top: 50%;
  transform: translateY(-50%) rotate(45deg);
  border-right: none; border-top: none;
}

/* 出入动画 */
.kp-popover-pop-enter-active,
.kp-popover-pop-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-base);
}
.kp-popover-pop-enter-from,
.kp-popover-pop-leave-to {
  opacity: 0;
}
.kp-popover-pop-enter-from.kp-popover__panel--top,
.kp-popover-pop-leave-to.kp-popover__panel--top { transform: translateX(-50%) translateY(6px); }
.kp-popover-pop-enter-from.kp-popover__panel--bottom,
.kp-popover-pop-leave-to.kp-popover__panel--bottom { transform: translateX(-50%) translateY(-6px); }
.kp-popover-pop-enter-from.kp-popover__panel--left,
.kp-popover-pop-leave-to.kp-popover__panel--left { transform: translateY(-50%) translateX(6px); }
.kp-popover-pop-enter-from.kp-popover__panel--right,
.kp-popover-pop-leave-to.kp-popover__panel--right { transform: translateY(-50%) translateX(-6px); }
</style>
