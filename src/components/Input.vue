<script setup lang="ts">
import { computed } from 'vue'

// 赛博朋克输入框组件:支持变体、尺寸、禁用、错误态、前后缀插槽、一键清空
interface Props {
  modelValue?: string
  variant?: 'default' | 'glow'
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
  disabled?: boolean
  // error 支持字符串(显示提示文字)或布尔(仅红边框)
  error?: string | boolean
  clearable?: boolean
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  variant: 'default',
  size: 'md',
  placeholder: '',
  disabled: false,
  error: false,
  clearable: false,
  type: 'text'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
}>()

const error_state = computed(() => !!props.error)
const error_msg = computed(() => (typeof props.error === 'string' ? props.error : ''))

const handle_input = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const handle_clear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div
    class="kp-input-wrap"
    :class="{ 'is-error': error_state, 'is-disabled': disabled }"
  >
    <div
      class="kp-input"
      :class="[`kp-input--${variant}`, `kp-input--${size}`]"
    >
      <span v-if="$slots.prefix" class="kp-input__prefix">
        <slot name="prefix" />
      </span>

      <input
        class="kp-input__field"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handle_input"
      />

      <span
        v-if="clearable && modelValue && !disabled"
        class="kp-input__clear"
        role="button"
        tabindex="0"
        @click="handle_clear"
        @keydown.enter.prevent="handle_clear"
      >×</span>

      <span v-if="$slots.suffix" class="kp-input__suffix">
        <slot name="suffix" />
      </span>

      <!-- 底部霓虹动画线:聚焦时从中间向两侧展开 -->
      <span class="kp-input__bar" />
    </div>

    <p v-if="error_msg" class="kp-input__error">{{ error_msg }}</p>
  </div>
</template>

<style scoped>
.kp-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

/* ========== 输入框容器 ========== */
.kp-input {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  background: var(--bg-input);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
}

/* 聚焦:边框变色 + 内外发光 */
.kp-input:focus-within {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 6px rgba(0, 240, 255, 0.2), inset 0 0 6px rgba(0, 240, 255, 0.05);
}

/* glow 变体:常态即发光 */
.kp-input--glow {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 6px rgba(0, 240, 255, 0.25), inset 0 0 6px rgba(0, 240, 255, 0.05);
}
.kp-input--glow:focus-within {
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.4), inset 0 0 8px rgba(0, 240, 255, 0.08);
}

/* ========== 输入框本体 ========== */
.kp-input__field {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: inherit;
  caret-color: var(--neon-cyan);
}
.kp-input__field::placeholder {
  color: var(--text-dim);
  font-family: var(--font-mono);
}

/* ========== 底部霓虹动画线 ========== */
.kp-input__bar {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
  border-radius: 1px;
  transform: translateX(-50%);
  transition: width var(--transition-slow);
  pointer-events: none;
}
.kp-input:focus-within .kp-input__bar { width: 100%; }
.kp-input--glow .kp-input__bar { width: 100%; opacity: 0.8; }

/* ========== 前后缀 / 清空 ========== */
.kp-input__prefix,
.kp-input__suffix {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  flex-shrink: 0;
}
.kp-input__prefix { margin-right: var(--space-sm); }
.kp-input__suffix { margin-left: var(--space-sm); }

.kp-input__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-left: var(--space-sm);
  border-radius: 50%;
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
  transition: color var(--transition-fast), background var(--transition-fast);
}
.kp-input__clear:hover {
  color: var(--neon-red);
  background: rgba(255, 0, 60, 0.15);
}

/* ========== 错误态 ========== */
.kp-input-wrap.is-error .kp-input {
  border-color: var(--neon-red);
  box-shadow: 0 0 6px rgba(255, 0, 60, 0.2), inset 0 0 6px rgba(255, 0, 60, 0.05);
}
.kp-input-wrap.is-error .kp-input__bar {
  width: 100%;
  background: linear-gradient(90deg, transparent, var(--neon-red), transparent);
}
.kp-input__error {
  font-size: var(--font-size-xs);
  color: var(--neon-red);
  text-shadow: 0 0 6px rgba(255, 0, 60, 0.5);
}

/* ========== 禁用态 ========== */
.kp-input-wrap.is-disabled {
  opacity: 0.4;
  pointer-events: none;
}

/* ========== 尺寸 ========== */
.kp-input--sm { padding: 0 10px; height: 32px; font-size: var(--font-size-xs); }
.kp-input--md { padding: 0 14px; height: 40px; font-size: var(--font-size-sm); }
.kp-input--lg { padding: 0 18px; height: 48px; font-size: var(--font-size-md); }
</style>
