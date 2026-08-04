<script setup lang="ts">
// 赛博朋克按钮组件:支持变体、尺寸、加载态、禁用、图标插槽
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const handle_click = (event: MouseEvent) => {
  // 加载或禁用状态下拦截点击
  if (props.loading || props.disabled) return
  emit('click', event)
}
</script>

<template>
  <button
    class="kp-btn"
    :class="[
      `kp-btn--${variant}`,
      `kp-btn--${size}`,
      { 'is-loading': loading, 'is-disabled': disabled, 'is-block': block }
    ]"
    :disabled="disabled || loading"
    @click="handle_click"
  >
    <!-- loading:三圆点跳动,文字隐藏 -->
    <span v-if="loading" class="kp-btn__spinner" aria-label="加载中">
      <span class="kp-btn__dot" />
      <span class="kp-btn__dot" />
      <span class="kp-btn__dot" />
    </span>
    <span class="kp-btn__text" :class="{ 'is-hidden': loading }">
      <slot name="icon" />
      <slot />
    </span>
  </button>
</template>

<style scoped>
.kp-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  text-transform: uppercase;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  transition: all var(--transition-normal), box-shadow var(--transition-fast);
}

/* 扫描线叠加层:hover 时浮现 CRT 质感 */
.kp-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-normal);
}
.kp-btn:hover:not(:disabled)::before { opacity: 1; }

/* ========== 尺寸 ========== */
.kp-btn--sm { padding: 6px 14px; font-size: var(--font-size-xs); height: 32px; }
.kp-btn--md { padding: 10px 22px; font-size: var(--font-size-sm); height: 40px; }
.kp-btn--lg { padding: 14px 32px; font-size: var(--font-size-md); height: 52px; }

/* ========== Primary · 青色渐变 ========== */
.kp-btn--primary {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(0, 240, 255, 0.05));
  border-color: var(--neon-cyan);
  color: var(--neon-cyan);
  text-shadow: 0 0 8px var(--neon-cyan);
}
.kp-btn--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.25), rgba(0, 240, 255, 0.1));
  box-shadow: var(--glow-cyan);
  transform: translateY(-1px);
}
.kp-btn--primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 0 4px var(--neon-cyan);
}

/* ========== Secondary · 品红渐变 ========== */
.kp-btn--secondary {
  background: linear-gradient(135deg, rgba(255, 46, 151, 0.15), rgba(255, 46, 151, 0.05));
  border-color: var(--neon-magenta);
  color: var(--neon-magenta);
  text-shadow: 0 0 8px var(--neon-magenta);
}
.kp-btn--secondary:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(255, 46, 151, 0.25), rgba(255, 46, 151, 0.1));
  box-shadow: var(--glow-magenta);
  transform: translateY(-1px);
}
.kp-btn--secondary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 0 4px var(--neon-magenta);
}

/* ========== Danger · 红色渐变 ========== */
.kp-btn--danger {
  background: linear-gradient(135deg, rgba(255, 0, 60, 0.15), rgba(255, 0, 60, 0.05));
  border-color: var(--neon-red);
  color: var(--neon-red);
  text-shadow: 0 0 8px var(--neon-red);
}
.kp-btn--danger:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(255, 0, 60, 0.25), rgba(255, 0, 60, 0.1));
  box-shadow: var(--glow-red);
  transform: translateY(-1px);
}
.kp-btn--danger:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 0 4px var(--neon-red);
}

/* ========== Ghost · 透明 ========== */
.kp-btn--ghost {
  color: var(--text-secondary);
  background: transparent;
  border-color: transparent;
}
.kp-btn--ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
}
.kp-btn--ghost:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
}

/* ========== Disabled · 灰度置灰 ========== */
.kp-btn.is-disabled {
  opacity: 0.35;
  cursor: not-allowed;
  filter: grayscale(0.6);
}

/* ========== Loading ========== */
.kp-btn.is-loading { cursor: wait; }

.kp-btn__text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: opacity var(--transition-fast);
}
.kp-btn__text.is-hidden { opacity: 0; }

.kp-btn__spinner {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 4px;
}

.kp-btn__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  animation: kp-dot-bounce 1.2s ease-in-out infinite;
}
.kp-btn__dot:nth-child(2) { animation-delay: 0.2s; }
.kp-btn__dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes kp-dot-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1.2); opacity: 1; }
}

/* ========== 块级宽度 ========== */
.is-block { display: flex; width: 100%; }
</style>
