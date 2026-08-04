<script setup lang="ts">
import { computed } from 'vue'

// 赛博朋克标签:多色 / 可勾选 / 可关闭 / 多种风格
interface Props {
  modelValue?: boolean
  label?: string
  color?: 'cyan' | 'magenta' | 'green' | 'yellow' | 'purple' | 'red'
  size?: 'sm' | 'md' | 'lg'
  type?: 'default' | 'outline' | 'solid'
  checkable?: boolean
  closable?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
  color: 'cyan',
  size: 'md',
  type: 'default',
  checkable: false,
  closable: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
  close: []
}>()

// 勾选态:checkable 时取 modelValue,否则视为常态展示
const is_checked = computed(() => props.checkable && !!props.modelValue)

const handle_click = () => {
  if (props.disabled || !props.checkable) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}

const handle_close = (e: MouseEvent) => {
  e.stopPropagation()
  if (props.disabled) return
  emit('close')
}
</script>

<template>
  <span
    class="kp-tag"
    :class="[
      `kp-tag--${color}`,
      `kp-tag--${size}`,
      `kp-tag--${type}`,
      { 'is-checked': is_checked, 'is-disabled': disabled, 'is-checkable': checkable }
    ]"
    :role="checkable ? 'switch' : undefined"
    :aria-checked="checkable ? is_checked : undefined"
    @click="handle_click"
  >
    <span class="kp-tag__label">
      <slot>{{ label }}</slot>
    </span>
    <i v-if="closable" class="kp-tag__close" @click="handle_close">×</i>
  </span>
</template>

<style scoped>
.kp-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  border: 1px solid var(--kp-c);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

/* 颜色变量 */
.kp-tag--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.12); }
.kp-tag--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); --kp-c-fill: rgba(255, 46, 151, 0.12); }
.kp-tag--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.12); }
.kp-tag--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4), 0 0 28px rgba(255, 247, 0, 0.2); --kp-c-fill: rgba(255, 247, 0, 0.12); }
.kp-tag--purple  { --kp-c: var(--neon-purple);  --kp-c-glow: 0 0 7px #b026ff, 0 0 14px rgba(176, 38, 255, 0.4), 0 0 28px rgba(176, 38, 255, 0.2); --kp-c-fill: rgba(176, 38, 255, 0.12); }
.kp-tag--red     { --kp-c: var(--neon-red);     --kp-c-glow: var(--glow-red);     --kp-c-fill: rgba(255, 0, 60, 0.12); }

/* 尺寸 */
.kp-tag--sm { font-size: 11px; height: 20px; }
.kp-tag--md { font-size: 12px; height: 24px; }
.kp-tag--lg { font-size: 14px; height: 28px; }

/* 风格:default 淡填充 + 霓虹文字 */
.kp-tag--default {
  background: var(--kp-c-fill);
  color: var(--kp-c);
}

/* 风格:outline 透明底 + 霓虹描边文字 */
.kp-tag--outline {
  background: transparent;
  color: var(--kp-c);
}

/* 风格:solid 实色填充 + 深色文字 */
.kp-tag--solid {
  background: var(--kp-c);
  color: var(--bg-base);
  border-color: var(--kp-c);
  box-shadow: var(--kp-c-glow);
}

/* 勾选态:加亮 + 发光 */
.kp-tag.is-checkable { cursor: pointer; }
.kp-tag.is-checkable:hover:not(.is-disabled) {
  box-shadow: var(--kp-c-glow);
}
.kp-tag.is-checked {
  background: var(--kp-c);
  color: var(--bg-base);
  border-color: var(--kp-c);
  box-shadow: var(--kp-c-glow);
}
/* solid 风格勾选时反转为描边,区分态 */
.kp-tag--solid.is-checked {
  background: var(--bg-elevated);
  color: var(--kp-c);
}

/* 关闭按钮 */
.kp-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-right: -2px;
  border-radius: 50%;
  font-style: normal;
  font-size: 12px;
  line-height: 1;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity var(--transition-fast), background var(--transition-fast);
}
.kp-tag__close:hover {
  opacity: 1;
  background: rgba(255, 0, 60, 0.25);
}

/* 禁用 */
.kp-tag.is-disabled {
  cursor: not-allowed;
  opacity: 0.4;
  filter: grayscale(0.6);
}
.kp-tag.is-disabled .kp-tag__close { cursor: not-allowed; }
</style>
