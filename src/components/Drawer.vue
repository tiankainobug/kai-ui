<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

// 赛博朋克抽屉:左/右/上/下方向滑出,遮罩 / ESC / 滚动锁
interface Props {
  modelValue?: boolean
  title?: string
  placement?: 'left' | 'right' | 'top' | 'bottom'
  width?: number | string
  height?: number | string
  show_close?: boolean
  mask_closable?: boolean
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  placement: 'right',
  width: 380,
  height: 300,
  show_close: true,
  mask_closable: true,
  color: 'cyan'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handle_mask = () => {
  if (props.mask_closable) close()
}

const handle_keydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) close()
}

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handle_keydown)
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handle_keydown)
    }
  }
)
onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handle_keydown)
})

// 横向抽屉用 width,纵向用 height
const is_horizontal = () => props.placement === 'left' || props.placement === 'right'
const size_val = () => {
  const v = is_horizontal() ? props.width : props.height
  return typeof v === 'number' ? v + 'px' : v
}
</script>

<template>
  <Teleport to="body">
    <transition name="kp-drawer-fade">
      <div v-if="modelValue" class="kp-drawer" :class="`kp-drawer--${color}`" @click.self="handle_mask">
        <transition :name="`kp-drawer-panel-${placement}`" appear>
          <div
            v-if="modelValue"
            class="kp-drawer__panel"
            :class="[`kp-drawer__panel--${placement}`]"
            :style="is_horizontal() ? { width: size_val() } : { height: size_val() }"
          >
            <!-- 标题栏 -->
            <div v-if="title || $slots.title || show_close" class="kp-drawer__header">
              <div class="kp-drawer__title">
                <slot name="title">{{ title }}</slot>
              </div>
              <button v-if="show_close" class="kp-drawer__close" @click="close">×</button>
            </div>

            <!-- 内容区 -->
            <div class="kp-drawer__body">
              <slot />
            </div>

            <!-- 底部 -->
            <div v-if="$slots.footer" class="kp-drawer__footer">
              <slot name="footer" />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.kp-drawer {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(7, 7, 13, 0.75);
  backdrop-filter: blur(4px);
}

/* 颜色变量 */
.kp-drawer--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-drawer--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-drawer--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-drawer--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }

/* 面板主体 */
.kp-drawer__panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: var(--bg-panel);
  border: 1px solid var(--kp-c);
  box-shadow: var(--kp-c-glow), 0 16px 48px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}
/* 顶部扫描线装饰 */
.kp-drawer__panel::before {
  content: '';
  position: absolute;
  z-index: 1;
  background: linear-gradient(90deg, transparent, var(--kp-c), transparent);
  box-shadow: var(--kp-c-glow);
}

/* 方向定位 + 扫描线位置 */
.kp-drawer__panel--left {
  top: 0; bottom: 0; left: 0;
  border-left: none;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}
.kp-drawer__panel--left::before { top: 0; right: 0; width: 2px; height: 100%; }

.kp-drawer__panel--right {
  top: 0; bottom: 0; right: 0;
  border-right: none;
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}
.kp-drawer__panel--right::before { top: 0; left: 0; width: 2px; height: 100%; }

.kp-drawer__panel--top {
  left: 0; right: 0; top: 0;
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}
.kp-drawer__panel--top::before { bottom: 0; left: 0; width: 100%; height: 2px; }

.kp-drawer__panel--bottom {
  left: 0; right: 0; bottom: 0;
  border-bottom: none;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}
.kp-drawer__panel--bottom::before { top: 0; left: 0; width: 100%; height: 2px; }

/* 标题栏 */
.kp-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--border-color);
}
.kp-drawer__title {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--kp-c);
  text-shadow: 0 0 6px var(--kp-c);
}
.kp-drawer__close {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: color var(--transition-fast);
}
.kp-drawer__close:hover { color: var(--neon-red); }

/* 内容区 */
.kp-drawer__body {
  flex: 1;
  padding: var(--space-lg);
  overflow-y: auto;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
}

/* 底部 */
.kp-drawer__footer {
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--border-color);
}

/* 遮罩淡入淡出 */
.kp-drawer-fade-enter-active,
.kp-drawer-fade-leave-active {
  transition: opacity var(--transition-base);
}
.kp-drawer-fade-enter-from,
.kp-drawer-fade-leave-to {
  opacity: 0;
}

/* 各方向面板滑入滑出动画 */
.kp-drawer-panel-left-enter-active,
.kp-drawer-panel-left-leave-active,
.kp-drawer-panel-right-enter-active,
.kp-drawer-panel-right-leave-active,
.kp-drawer-panel-top-enter-active,
.kp-drawer-panel-top-leave-active,
.kp-drawer-panel-bottom-enter-active,
.kp-drawer-panel-bottom-leave-active {
  transition: transform var(--transition-slow);
}
.kp-drawer-panel-left-enter-from,
.kp-drawer-panel-left-leave-to { transform: translateX(-100%); }
.kp-drawer-panel-right-enter-from,
.kp-drawer-panel-right-leave-to { transform: translateX(100%); }
.kp-drawer-panel-top-enter-from,
.kp-drawer-panel-top-leave-to { transform: translateY(-100%); }
.kp-drawer-panel-bottom-enter-from,
.kp-drawer-panel-bottom-leave-to { transform: translateY(100%); }
</style>
