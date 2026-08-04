<script setup lang="ts">
import { computed } from 'vue'

// 赛博朋克单选框组件:组内共享 v-model 实现互斥单选,圆形外框 + 中心霓虹圆点
interface Props {
  modelValue?: string | number
  value?: string | number
  label?: string
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  value: undefined,
  label: '',
  color: 'cyan',
  size: 'md',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

// 当前是否选中:modelValue 与 value 相等即选中
const is_checked = computed(() => props.modelValue === props.value)

const handle_toggle = () => {
  // 已选中或禁用都不处理:Radio 选中后不可点击取消,符合单选语义
  if (props.disabled || is_checked.value) return
  emit('update:modelValue', props.value as string | number)
  emit('change', props.value as string | number)
}
</script>

<template>
  <label
    class="kp-radio"
    :class="[
      `kp-radio--${color}`,
      `kp-radio--${size}`,
      { 'is-checked': is_checked, 'is-disabled': disabled }
    ]"
  >
    <!-- 隐藏原生 input:承担聚焦 / 键盘操作,click.prevent 阻止浏览器默认 toggle,由 handle_toggle 统一驱动 -->
    <input
      type="radio"
      class="kp-radio__input"
      :checked="is_checked"
      :disabled="disabled"
      @click.prevent="handle_toggle"
    />

    <span class="kp-radio__box">
      <!-- 选中:中心实心圆点,scale 弹出动画 -->
      <span v-if="is_checked" class="kp-radio__dot" />
    </span>

    <span v-if="label || $slots.default" class="kp-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.kp-radio {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  user-select: none;
  font-family: var(--font-mono);
  color: var(--text-primary);
  transition: opacity var(--transition-fast);
}

/* 颜色变量:每种变体定义当前霓虹色 / 发光 / 填充,后续规则统一引用 */
.kp-radio--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.15); }
.kp-radio--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); --kp-c-fill: rgba(255, 46, 151, 0.15); }
.kp-radio--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.15); }
.kp-radio--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4), 0 0 28px rgba(255, 247, 0, 0.2); --kp-c-fill: rgba(255, 247, 0, 0.15); }

/* ========== 尺寸 ========== */
.kp-radio--sm { font-size: var(--font-size-xs); }
.kp-radio--md { font-size: var(--font-size-sm); }
.kp-radio--lg { font-size: var(--font-size-md); }

/* ========== 圆形外框 ========== */
.kp-radio__box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-bright);
  border-radius: 50%;
  background: var(--bg-input);
  flex-shrink: 0;
  transition: border-color var(--transition-normal), background var(--transition-normal), box-shadow var(--transition-normal);
}
.kp-radio--sm .kp-radio__box { width: 16px; height: 16px; }
.kp-radio--md .kp-radio__box { width: 20px; height: 20px; }
.kp-radio--lg .kp-radio__box { width: 24px; height: 24px; }

/* hover 未选中:边框亮 + 内发光 */
.kp-radio:hover:not(.is-disabled):not(.is-checked) .kp-radio__box {
  border-color: var(--kp-c);
  box-shadow: inset 0 0 6px var(--kp-c-fill);
}

/* 选中:边框亮 + 外发光 */
.kp-radio.is-checked .kp-radio__box {
  border-color: var(--kp-c);
  background: var(--kp-c-fill);
  box-shadow: var(--kp-c-glow);
}

/* ========== 中心圆点 ========== */
.kp-radio__dot {
  width: 50%;
  height: 50%;
  border-radius: 50%;
  background: var(--kp-c);
  box-shadow: 0 0 6px var(--kp-c);
  animation: kp-radio-pop 0.2s ease forwards;
}
@keyframes kp-radio-pop {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* ========== 标签 ========== */
.kp-radio__label {
  letter-spacing: 0.5px;
  line-height: 1.4;
}

/* 键盘聚焦:外框外侧霓虹描边 */
.kp-radio__input:focus-visible ~ .kp-radio__box {
  outline: 1px solid var(--kp-c);
  outline-offset: 2px;
}

/* ========== 禁用 ========== */
.kp-radio.is-disabled {
  cursor: not-allowed;
  opacity: 0.4;
  filter: grayscale(0.6);
}
.kp-radio.is-disabled .kp-radio__box {
  box-shadow: none;
}

/* ========== 隐藏原生 input:保留可聚焦,视觉不可见 ========== */
.kp-radio__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
