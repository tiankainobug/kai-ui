<script setup lang="ts">
import { computed } from 'vue'

// 赛博朋克开关组件:开/关滑动切换,支持霓虹色变体 / 尺寸 / 加载 / 禁用 / 开关文字
interface Props {
  modelValue?: boolean
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  active_text?: string
  inactive_text?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  color: 'cyan',
  size: 'md',
  disabled: false,
  loading: false,
  active_text: '',
  inactive_text: '',
  label: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const is_on = computed(() => !!props.modelValue)
// 加载或禁用时不可交互
const is_locked = computed(() => props.disabled || props.loading)

const handle_toggle = () => {
  if (is_locked.value) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <label
    class="kp-switch"
    :class="[
      `kp-switch--${color}`,
      `kp-switch--${size}`,
      { 'is-on': is_on, 'is-disabled': disabled, 'is-loading': loading }
    ]"
  >
    <!-- 隐藏原生 input:承担聚焦 / 键盘操作,click.prevent 阻止默认 toggle,由 handle_toggle 统一驱动 -->
    <input
      type="checkbox"
      class="kp-switch__input"
      :checked="is_on"
      :disabled="disabled"
      @click.prevent="handle_toggle"
    />

    <span class="kp-switch__track">
      <!-- 开关文字:开启时左侧显示 active_text,关闭时右侧显示 inactive_text -->
      <span v-if="active_text" class="kp-switch__text kp-switch__text--active">{{ active_text }}</span>
      <span v-if="inactive_text" class="kp-switch__text kp-switch__text--inactive">{{ inactive_text }}</span>

      <span class="kp-switch__thumb">
        <!-- 加载态:拇指内显示旋转指示器 -->
        <span v-if="loading" class="kp-switch__spinner" />
      </span>
    </span>

    <span v-if="label || $slots.default" class="kp-switch__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.kp-switch {
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
.kp-switch--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.22); }
.kp-switch--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); --kp-c-fill: rgba(255, 46, 151, 0.22); }
.kp-switch--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.22); }
.kp-switch--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4), 0 0 28px rgba(255, 247, 0, 0.2); --kp-c-fill: rgba(255, 247, 0, 0.22); }

/* ========== 轨道 ========== */
.kp-switch__track {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  border: 1px solid var(--border-bright);
  border-radius: 999px;
  background: var(--bg-input);
  transition: border-color var(--transition-normal), background var(--transition-normal), box-shadow var(--transition-normal);
}

/* 尺寸:轨道宽高 + 拇指位移量(checked 时 translateX) */
.kp-switch--sm .kp-switch__track { width: 36px; height: 20px; padding: 0 3px; }
.kp-switch--md .kp-switch__track { width: 46px; height: 24px; padding: 0 3px; }
.kp-switch--lg .kp-switch__track { width: 58px; height: 30px; padding: 0 4px; }

/* hover 未开启:边框微亮 */
.kp-switch:hover:not(.is-disabled):not(.is-on) .kp-switch__track {
  border-color: var(--kp-c);
  box-shadow: inset 0 0 6px var(--kp-c-fill);
}

/* 开启:轨道填充霓虹色 + 外发光 */
.kp-switch.is-on .kp-switch__track {
  border-color: var(--kp-c);
  background: var(--kp-c-fill);
  box-shadow: var(--kp-c-glow);
}

/* ========== 开关文字 ========== */
.kp-switch__text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--kp-c);
  text-shadow: 0 0 4px var(--kp-c);
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}
/* 开启显示左侧 active_text,留出拇指空间 */
.kp-switch__text--active { left: 6px; }
.kp-switch__text--inactive { right: 6px; color: var(--text-muted); text-shadow: none; }
.kp-switch.is-on .kp-switch__text--active { opacity: 1; }
.kp-switch:not(.is-on) .kp-switch__text--inactive { opacity: 1; }

/* ========== 拇指 ========== */
.kp-switch__thumb {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--text-muted);
  box-shadow: 0 0 0 1px var(--border-bright);
  transition: transform var(--transition-normal), background var(--transition-normal), box-shadow var(--transition-normal);
}

/* 拇指尺寸:略小于轨道高度 */
.kp-switch--sm .kp-switch__thumb { width: 14px; height: 14px; }
.kp-switch--md .kp-switch__thumb { width: 18px; height: 18px; }
.kp-switch--lg .kp-switch__thumb { width: 22px; height: 22px; }

/* 开启:拇指滑向右侧并点亮霓虹 */
.kp-switch--sm.is-on .kp-switch__thumb { transform: translateX(16px); }
.kp-switch--md.is-on .kp-switch__thumb { transform: translateX(22px); }
.kp-switch--lg.is-on .kp-switch__thumb { transform: translateX(28px); }

.kp-switch.is-on .kp-switch__thumb {
  background: var(--kp-c);
  box-shadow: 0 0 8px var(--kp-c), 0 0 16px var(--kp-c-fill);
}

/* ========== 加载指示器 ========== */
.kp-switch__spinner {
  width: 60%;
  height: 60%;
  border: 2px solid transparent;
  border-top-color: var(--bg-base);
  border-right-color: var(--bg-base);
  border-radius: 50%;
  animation: kp-spin 0.6s linear infinite;
}
/* 未开启时加载:指示器用霓虹色 */
.kp-switch:not(.is-on) .kp-switch__spinner {
  border-top-color: var(--kp-c);
  border-right-color: var(--kp-c);
}
/* 加载态:轨道轻微脉冲提示进行中 */
.kp-switch.is-loading .kp-switch__track {
  animation: kp-pulse 1s ease-in-out infinite;
}

/* ========== 标签 ========== */
.kp-switch__label {
  letter-spacing: 0.5px;
  line-height: 1.4;
}

/* 键盘聚焦:轨道外侧霓虹描边 */
.kp-switch__input:focus-visible ~ .kp-switch__track {
  outline: 1px solid var(--kp-c);
  outline-offset: 2px;
}

/* ========== 禁用 ========== */
.kp-switch.is-disabled {
  cursor: not-allowed;
  opacity: 0.4;
  filter: grayscale(0.6);
}
.kp-switch.is-disabled .kp-switch__track {
  box-shadow: none;
}

/* 加载态光标 */
.kp-switch.is-loading {
  cursor: progress;
}

/* ========== 隐藏原生 input:保留可聚焦,视觉不可见 ========== */
.kp-switch__input {
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
