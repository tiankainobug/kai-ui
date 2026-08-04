<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 赛博朋克文字提示:hover / click 触发,四方向定位,带箭头
interface Props {
  content?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  trigger?: 'hover' | 'click'
  show_arrow?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  placement: 'top',
  color: 'cyan',
  trigger: 'hover',
  show_arrow: true,
  disabled: false
})

const visible = ref(false)
const root_ref = ref<HTMLElement | null>(null)

const show = () => {
  if (props.disabled) return
  visible.value = true
}
const hide = () => { visible.value = false }
const toggle = () => {
  if (props.disabled) return
  visible.value = !visible.value
}

// click 触发时,点击外部关闭
const handle_doc_click = (e: MouseEvent) => {
  if (props.trigger !== 'click') return
  if (root_ref.value && !root_ref.value.contains(e.target as Node)) hide()
}
onMounted(() => document.addEventListener('mousedown', handle_doc_click))
onUnmounted(() => document.removeEventListener('mousedown', handle_doc_click))
</script>

<template>
  <span
    ref="root_ref"
    class="kp-tooltip"
    @mouseenter="trigger === 'hover' && show()"
    @mouseleave="trigger === 'hover' && hide()"
  >
    <span class="kp-tooltip__trigger" @click="trigger === 'click' && toggle()">
      <slot />
    </span>

    <transition name="kp-tooltip-pop">
      <span
        v-if="visible"
        class="kp-tooltip__pop"
        :class="[`kp-tooltip__pop--${placement}`, `kp-tooltip__pop--${color}`]"
      >
        <slot name="content">{{ content }}</slot>
        <span v-if="show_arrow" class="kp-tooltip__arrow" />
      </span>
    </transition>
  </span>
</template>

<style scoped>
.kp-tooltip {
  position: relative;
  display: inline-flex;
}
.kp-tooltip__trigger {
  display: inline-flex;
}

/* 气泡 */
.kp-tooltip__pop {
  position: absolute;
  z-index: 100;
  padding: 6px 10px;
  border: 1px solid var(--kp-c);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.5px;
  white-space: nowrap;
  box-shadow: var(--kp-c-glow), 0 4px 16px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

/* 颜色变量 */
.kp-tooltip__pop--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-tooltip__pop--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-tooltip__pop--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-tooltip__pop--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }

/* 方向定位:气泡偏离触发器 8px */
.kp-tooltip__pop--top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}
.kp-tooltip__pop--bottom {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}
.kp-tooltip__pop--left {
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}
.kp-tooltip__pop--right {
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

/* 箭头:旋转 45° 的小方块,贴在气泡朝向触发器的一侧 */
.kp-tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--kp-c);
}
.kp-tooltip__pop--top .kp-tooltip__arrow {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  border-top: none;
  border-left: none;
}
.kp-tooltip__pop--bottom .kp-tooltip__arrow {
  top: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  border-bottom: none;
  border-right: none;
}
.kp-tooltip__pop--left .kp-tooltip__arrow {
  left: -5px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  border-left: none;
  border-bottom: none;
}
.kp-tooltip__pop--right .kp-tooltip__arrow {
  right: -5px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  border-right: none;
  border-top: none;
}

/* 出入动画:配合方向位移 */
.kp-tooltip-pop-enter-active,
.kp-tooltip-pop-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-base);
}
.kp-tooltip-pop-enter-from,
.kp-tooltip-pop-leave-to {
  opacity: 0;
}
.kp-tooltip-pop-enter-from.kp-tooltip__pop--top,
.kp-tooltip-pop-leave-to.kp-tooltip__pop--top {
  transform: translateX(-50%) translateY(6px);
}
.kp-tooltip-pop-enter-from.kp-tooltip__pop--bottom,
.kp-tooltip-pop-leave-to.kp-tooltip__pop--bottom {
  transform: translateX(-50%) translateY(-6px);
}
.kp-tooltip-pop-enter-from.kp-tooltip__pop--left,
.kp-tooltip-pop-leave-to.kp-tooltip__pop--left {
  transform: translateY(-50%) translateX(6px);
}
.kp-tooltip-pop-enter-from.kp-tooltip__pop--right,
.kp-tooltip-pop-leave-to.kp-tooltip__pop--right {
  transform: translateY(-50%) translateX(-6px);
}
</style>
