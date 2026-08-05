<script setup lang="ts">
import { ref, watch, onMounted, nextTick, onUnmounted } from 'vue'

// 赛博朋克分段控制器:类 iOS 分段,滑动指示条
interface SegOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue?: string | number
  options?: SegOption[]
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  color: 'cyan',
  size: 'md',
  block: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const nav_ref = ref<HTMLElement | null>(null)
const indicator_left = ref(0)
const indicator_width = ref(0)

const select = (opt: SegOption) => {
  if (opt.disabled) return
  if (opt.value === props.modelValue) return
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
}

// 根据当前激活项计算指示条位置
const update_indicator = () => {
  if (!nav_ref.value) return
  const idx = props.options.findIndex(o => o.value === props.modelValue)
  if (idx < 0) return
  const el = nav_ref.value.querySelectorAll<HTMLElement>('.kp-segmented__item')[idx]
  if (el) {
    indicator_left.value = el.offsetLeft
    indicator_width.value = el.offsetWidth
  }
}

watch(() => props.modelValue, () => nextTick(update_indicator))
watch(() => props.options, () => nextTick(update_indicator), { deep: true })
onMounted(() => nextTick(update_indicator))

const on_resize = () => update_indicator()
onMounted(() => window.addEventListener('resize', on_resize))
onUnmounted(() => window.removeEventListener('resize', on_resize))
</script>

<template>
  <div
    class="kp-segmented"
    :class="[`kp-segmented--${color}`, `kp-segmented--${size}`, { 'is-block': block }]"
  >
    <div ref="nav_ref" class="kp-segmented__nav">
      <button
        v-for="opt in options"
        :key="opt.value"
        class="kp-segmented__item"
        :class="{ 'is-active': opt.value === modelValue, 'is-disabled': opt.disabled }"
        :disabled="opt.disabled"
        @click="select(opt)"
      >
        {{ opt.label }}
      </button>
      <!-- 滑动指示条 -->
      <span
        class="kp-segmented__indicator"
        :style="{ left: indicator_left + 'px', width: indicator_width + 'px' }"
      />
    </div>
  </div>
</template>

<style scoped>
.kp-segmented {
  display: inline-flex;
  font-family: var(--font-mono);
}
.kp-segmented.is-block { display: flex; width: 100%; }

/* 颜色变量 */
.kp-segmented--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.12); }
.kp-segmented--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); --kp-c-fill: rgba(255, 46, 151, 0.12); }
.kp-segmented--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.12); }
.kp-segmented--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); --kp-c-fill: rgba(255, 247, 0, 0.12); }

/* 导航容器:相对定位承载指示条 */
.kp-segmented__nav {
  position: relative;
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-input);
}
.is-block .kp-segmented__nav { display: flex; width: 100%; }

/* 每项 */
.kp-segmented__item {
  position: relative;
  z-index: 1;
  padding: 6px 16px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 1px;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}
.is-block .kp-segmented__item { flex: 1; }

.kp-segmented__item:hover:not(.is-active):not(.is-disabled) {
  color: var(--text-secondary);
}
.kp-segmented__item.is-active {
  color: var(--kp-c);
  text-shadow: 0 0 5px var(--kp-c);
}
.kp-segmented__item.is-disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

/* 尺寸 */
.kp-segmented--sm .kp-segmented__item { padding: 4px 12px; font-size: 12px; }
.kp-segmented--lg .kp-segmented__item { padding: 8px 20px; font-size: 14px; }

/* 滑动指示条:绝对定位,在项下方滑动 */
.kp-segmented__indicator {
  position: absolute;
  z-index: 0;
  top: 3px;
  bottom: 3px;
  border-radius: var(--radius-sm);
  background: var(--kp-c-fill);
  border: 1px solid var(--kp-c);
  box-shadow: var(--kp-c-glow);
  transition: left var(--transition-base), width var(--transition-base);
}
</style>
