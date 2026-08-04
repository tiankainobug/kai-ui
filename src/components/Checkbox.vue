<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

// 赛博朋克多选框组件:支持布尔开关 / 数组多选两种模式,半选态,霓虹色变体
interface Props {
  modelValue?: boolean | (string | number)[]
  value?: string | number
  label?: string
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  indeterminate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  value: undefined,
  label: '',
  color: 'cyan',
  size: 'md',
  disabled: false,
  indeterminate: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | (string | number)[]]
  change: [value: boolean | (string | number)[]]
}>()

// 数组模式:传了 value 即视为多选组成员
const is_array_mode = computed(() => props.value !== undefined)

// 当前是否勾选:数组模式判断包含关系,布尔模式直接取值
const is_checked = computed(() => {
  if (is_array_mode.value) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(props.value as string | number)
  }
  return !!props.modelValue
})

const input_ref = ref<HTMLInputElement | null>(null)
// indeterminate 是原生 input 的属性,需命令式同步到 DOM
watchEffect(() => {
  if (input_ref.value) input_ref.value.indeterminate = props.indeterminate
})

const handle_toggle = () => {
  if (props.disabled) return

  let next: boolean | (string | number)[]

  if (is_array_mode.value) {
    const arr = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const v = props.value as string | number
    // 已勾选则移除,未勾选则追加
    next = arr.includes(v) ? arr.filter(item => item !== v) : [...arr, v]
  } else {
    next = !props.modelValue
  }

  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <label
    class="kp-checkbox"
    :class="[
      `kp-checkbox--${color}`,
      `kp-checkbox--${size}`,
      { 'is-checked': is_checked, 'is-indeterminate': indeterminate, 'is-disabled': disabled }
    ]"
  >
    <!-- 隐藏原生 input:承担聚焦 / 键盘操作,click.prevent 阻止浏览器默认 toggle,由 handle_toggle 统一驱动 -->
    <input
      ref="input_ref"
      type="checkbox"
      class="kp-checkbox__input"
      :checked="is_checked"
      :disabled="disabled"
      @click.prevent="handle_toggle"
    />

    <span class="kp-checkbox__box">
      <!-- 半选:居中横线 -->
      <span v-if="indeterminate" class="kp-checkbox__dash" />
      <!-- 勾选:SVG 对勾,stroke-dasharray 绘制动画 -->
      <svg
        v-else-if="is_checked"
        class="kp-checkbox__check"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>

    <span v-if="label || $slots.default" class="kp-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.kp-checkbox {
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
.kp-checkbox--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.15); }
.kp-checkbox--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); --kp-c-fill: rgba(255, 46, 151, 0.15); }
.kp-checkbox--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.15); }
.kp-checkbox--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4), 0 0 28px rgba(255, 247, 0, 0.2); --kp-c-fill: rgba(255, 247, 0, 0.15); }

/* ========== 尺寸 ========== */
.kp-checkbox--sm { font-size: var(--font-size-xs); }
.kp-checkbox--md { font-size: var(--font-size-sm); }
.kp-checkbox--lg { font-size: var(--font-size-md); }

/* ========== 方框 ========== */
.kp-checkbox__box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-bright);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  flex-shrink: 0;
  transition: border-color var(--transition-normal), background var(--transition-normal), box-shadow var(--transition-normal);
}
.kp-checkbox--sm .kp-checkbox__box { width: 16px; height: 16px; }
.kp-checkbox--md .kp-checkbox__box { width: 20px; height: 20px; }
.kp-checkbox--lg .kp-checkbox__box { width: 24px; height: 24px; }

/* hover 未选中:边框亮 + 内发光 */
.kp-checkbox:hover:not(.is-disabled):not(.is-checked):not(.is-indeterminate) .kp-checkbox__box {
  border-color: var(--kp-c);
  box-shadow: inset 0 0 6px var(--kp-c-fill);
}

/* 选中 / 半选:填充 + 外发光 */
.kp-checkbox.is-checked .kp-checkbox__box,
.kp-checkbox.is-indeterminate .kp-checkbox__box {
  border-color: var(--kp-c);
  background: var(--kp-c-fill);
  box-shadow: var(--kp-c-glow);
}

/* ========== 对勾 ========== */
.kp-checkbox__check {
  width: 72%;
  height: 72%;
  color: var(--kp-c);
  filter: drop-shadow(0 0 3px var(--kp-c));
}
.kp-checkbox__check path {
  stroke-dasharray: 18;
  stroke-dashoffset: 18;
  animation: kp-check-draw 0.25s ease forwards;
}
@keyframes kp-check-draw {
  to { stroke-dashoffset: 0; }
}

/* ========== 半选横线 ========== */
.kp-checkbox__dash {
  width: 60%;
  height: 2px;
  background: var(--kp-c);
  border-radius: 1px;
  box-shadow: 0 0 6px var(--kp-c);
}

/* ========== 标签 ========== */
.kp-checkbox__label {
  letter-spacing: 0.5px;
  line-height: 1.4;
}

/* 键盘聚焦:方框外侧霓虹描边 */
.kp-checkbox__input:focus-visible ~ .kp-checkbox__box {
  outline: 1px solid var(--kp-c);
  outline-offset: 2px;
}

/* ========== 禁用 ========== */
.kp-checkbox.is-disabled {
  cursor: not-allowed;
  opacity: 0.4;
  filter: grayscale(0.6);
}
.kp-checkbox.is-disabled .kp-checkbox__box {
  box-shadow: none;
}

/* ========== 隐藏原生 input:保留可聚焦,视觉不可见 ========== */
.kp-checkbox__input {
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
