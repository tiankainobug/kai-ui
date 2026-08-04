<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

// 赛博朋克模态弹窗:遮罩 / 标题 / 自定义内容 / 确认取消 / ESC 关闭 / 滚动锁
interface Props {
  modelValue?: boolean
  title?: string
  width?: number | string
  confirm_text?: string
  cancel_text?: string
  show_confirm?: boolean
  show_cancel?: boolean
  show_close?: boolean
  mask_closable?: boolean
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  width: 440,
  confirm_text: '确认',
  cancel_text: '取消',
  show_confirm: true,
  show_cancel: true,
  show_close: true,
  mask_closable: true,
  color: 'cyan'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
  close: []
}>()

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handle_confirm = () => {
  emit('confirm')
  close()
}
const handle_cancel = () => {
  emit('cancel')
  close()
}

// 点击遮罩关闭
const handle_mask = () => {
  if (props.mask_closable) close()
}

// ESC 关闭
const handle_keydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) close()
}

// 打开时锁定背景滚动并监听 ESC,关闭时还原
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

// 宽度归一化:数字转 px,字符串原样
const width_val = () => (typeof props.width === 'number' ? props.width + 'px' : props.width)
</script>

<template>
  <transition name="kp-modal">
    <div v-if="modelValue" class="kp-modal" :class="`kp-modal--${color}`" @click.self="handle_mask">
      <div class="kp-modal__dialog" :style="{ width: width_val() }">
        <!-- 四角准星装饰 -->
        <span class="kp-modal__corner kp-modal__corner--tl" />
        <span class="kp-modal__corner kp-modal__corner--tr" />
        <span class="kp-modal__corner kp-modal__corner--bl" />
        <span class="kp-modal__corner kp-modal__corner--br" />

        <!-- 标题栏 -->
        <div v-if="title || $slots.title || show_close" class="kp-modal__header">
          <div class="kp-modal__title">
            <slot name="title">{{ title }}</slot>
          </div>
          <button v-if="show_close" class="kp-modal__close" @click="close">×</button>
        </div>

        <!-- 内容区 -->
        <div class="kp-modal__body">
          <slot />
        </div>

        <!-- 底部操作区:无 footer 插槽时渲染默认按钮 -->
        <div v-if="$slots.footer || show_confirm || show_cancel" class="kp-modal__footer">
          <slot name="footer">
            <button v-if="show_cancel" class="kp-modal__btn kp-modal__btn--ghost" @click="handle_cancel">
              {{ cancel_text }}
            </button>
            <button v-if="show_confirm" class="kp-modal__btn kp-modal__btn--primary" @click="handle_confirm">
              {{ confirm_text }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.kp-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  background: rgba(7, 7, 13, 0.75);
  backdrop-filter: blur(4px);
}

/* 颜色变量 */
.kp-modal--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-modal--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-modal--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-modal--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }

/* 弹窗主体 */
.kp-modal__dialog {
  position: relative;
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-panel);
  border: 1px solid var(--kp-c);
  border-radius: var(--radius-md);
  box-shadow: var(--kp-c-glow), 0 16px 48px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

/* 顶部扫描线装饰 */
.kp-modal__dialog::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--kp-c), transparent);
  box-shadow: var(--kp-c-glow);
}

/* 四角准星 */
.kp-modal__corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid var(--kp-c);
  pointer-events: none;
}
.kp-modal__corner--tl { top: 6px; left: 6px; border-right: none; border-bottom: none; }
.kp-modal__corner--tr { top: 6px; right: 6px; border-left: none; border-bottom: none; }
.kp-modal__corner--bl { bottom: 6px; left: 6px; border-right: none; border-top: none; }
.kp-modal__corner--br { bottom: 6px; right: 6px; border-left: none; border-top: none; }

/* 标题栏 */
.kp-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--border-color);
}
.kp-modal__title {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--kp-c);
  text-shadow: 0 0 6px var(--kp-c);
}
.kp-modal__close {
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
.kp-modal__close:hover { color: var(--neon-red); }

/* 内容区 */
.kp-modal__body {
  padding: var(--space-lg);
  overflow-y: auto;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
}

/* 底部 */
.kp-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--border-color);
}

/* 按钮 */
.kp-modal__btn {
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.kp-modal__btn--ghost {
  border: 1px solid var(--border-bright);
  background: transparent;
  color: var(--text-secondary);
}
.kp-modal__btn--ghost:hover {
  border-color: var(--text-secondary);
  color: var(--text-primary);
}
.kp-modal__btn--primary {
  border: 1px solid var(--kp-c);
  background: var(--kp-c);
  color: var(--bg-base);
}
.kp-modal__btn--primary:hover {
  box-shadow: var(--kp-c-glow);
}

/* 出入动画 */
.kp-modal-enter-active,
.kp-modal-leave-active {
  transition: opacity var(--transition-base);
}
.kp-modal-enter-active .kp-modal__dialog,
.kp-modal-leave-active .kp-modal__dialog {
  transition: opacity var(--transition-normal), transform var(--transition-normal);
}
.kp-modal-enter-from,
.kp-modal-leave-to {
  opacity: 0;
}
.kp-modal-enter-from .kp-modal__dialog,
.kp-modal-leave-to .kp-modal__dialog {
  opacity: 0;
  transform: translateY(-20px) scale(0.96);
}
</style>
