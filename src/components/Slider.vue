<script setup lang="ts">
import { ref, computed } from 'vue'

// 赛博朋克滑块:单值 / 双滑块范围,支持步进 / 禁用 / 尺寸 / 霓虹色
interface Props {
  modelValue?: number | [number, number]
  min?: number
  max?: number
  step?: number
  range?: boolean
  disabled?: boolean
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
  show_tooltip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  range: false,
  disabled: false,
  color: 'cyan',
  size: 'md',
  show_tooltip: true
})

const emit = defineEmits<{
  'update:modelValue': [value: number | [number, number]]
  change: [value: number | [number, number]]
}>()

const track_ref = ref<HTMLElement | null>(null)
// 当前拖动的拇指:single / start / end
const dragging = ref<null | 'single' | 'start' | 'end'>(null)

// 单值模式:取数值;范围模式:取二元组
const single_val = computed(() => (typeof props.modelValue === 'number' ? props.modelValue : props.min))
const range_vals = computed<[number, number]>(() => {
  if (Array.isArray(props.modelValue)) return [props.modelValue[0], props.modelValue[1]]
  return [props.min, props.max]
})

// 数值转百分比
const to_pct = (v: number) => {
  const span = props.max - props.min
  return span === 0 ? 0 : ((v - props.min) / span) * 100
}

// 按步进对齐并钳制到 [min, max]
const snap = (v: number) => {
  const stepped = Math.round((v - props.min) / props.step) * props.step + props.min
  const clamped = Math.max(props.min, Math.min(props.max, stepped))
  // 修正浮点累计误差
  return parseFloat(clamped.toFixed(10))
}

// 指针横坐标 -> 数值
const x_to_value = (client_x: number) => {
  const rect = track_ref.value!.getBoundingClientRect()
  let ratio = (client_x - rect.left) / rect.width
  ratio = Math.max(0, Math.min(1, ratio))
  return snap(props.min + ratio * (props.max - props.min))
}

const emit_value = (val: number | [number, number]) => {
  emit('update:modelValue', val)
  emit('change', val)
}

// 拇指按下:开启拖动并捕获指针
const on_thumb_down = (e: PointerEvent, which: 'single' | 'start' | 'end') => {
  if (props.disabled) return
  e.preventDefault()
  dragging.value = which
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

// 拖动中:按当前拇指更新值
const on_pointer_move = (e: PointerEvent) => {
  if (!dragging.value) return
  const val = x_to_value(e.clientX)
  if (dragging.value === 'single') {
    emit_value(val)
  } else {
    const [s, en] = range_vals.value
    // 范围模式:start 不超过 end,end 不低于 start
    if (dragging.value === 'start') emit_value([Math.min(val, en), en])
    else emit_value([s, Math.max(val, s)])
  }
}

const on_pointer_up = (e: PointerEvent) => {
  if (!dragging.value) return
  dragging.value = null
  ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
}

// 点击轨道:单值直接定位;范围模式移动到较近的那一端
const on_track_down = (e: PointerEvent) => {
  if (props.disabled) return
  // 点击落到拇指上时不处理(由拇指自身捕获)
  if ((e.target as HTMLElement).classList.contains('kp-slider__thumb')) return
  const val = x_to_value(e.clientX)
  if (props.range) {
    const [s, en] = range_vals.value
    const dist_s = Math.abs(val - s)
    const dist_en = Math.abs(val - en)
    emit_value(dist_s <= dist_en ? [val, en] : [s, val])
  } else {
    emit_value(val)
  }
}
</script>

<template>
  <div
    class="kp-slider"
    :class="[
      `kp-slider--${color}`,
      `kp-slider--${size}`,
      { 'is-disabled': disabled, 'is-dragging': dragging }
    ]"
  >
    <div class="kp-slider__track" ref="track_ref" @pointerdown="on_track_down">
      <!-- 已填充段:单值从左到拇指;范围在两端拇指之间 -->
      <div
        class="kp-slider__fill"
        :style="range
          ? { left: to_pct(range_vals[0]) + '%', width: (to_pct(range_vals[1]) - to_pct(range_vals[0])) + '%' }
          : { width: to_pct(single_val) + '%' }"
      />

      <!-- 单值拇指 -->
      <div
        v-if="!range"
        class="kp-slider__thumb"
        :style="{ left: to_pct(single_val) + '%' }"
        @pointerdown="on_thumb_down($event, 'single')"
        @pointermove="on_pointer_move"
        @pointerup="on_pointer_up"
      >
        <span v-if="show_tooltip" class="kp-slider__tooltip">{{ single_val }}</span>
      </div>

      <!-- 范围模式:起止双拇指 -->
      <template v-else>
        <div
          class="kp-slider__thumb"
          :style="{ left: to_pct(range_vals[0]) + '%' }"
          @pointerdown="on_thumb_down($event, 'start')"
          @pointermove="on_pointer_move"
          @pointerup="on_pointer_up"
        >
          <span v-if="show_tooltip" class="kp-slider__tooltip">{{ range_vals[0] }}</span>
        </div>
        <div
          class="kp-slider__thumb"
          :style="{ left: to_pct(range_vals[1]) + '%' }"
          @pointerdown="on_thumb_down($event, 'end')"
          @pointermove="on_pointer_move"
          @pointerup="on_pointer_up"
        >
          <span v-if="show_tooltip" class="kp-slider__tooltip">{{ range_vals[1] }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.kp-slider {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 14px 0;
  font-family: var(--font-mono);
}

/* 颜色变量 */
.kp-slider--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.35); }
.kp-slider--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); --kp-c-fill: rgba(255, 46, 151, 0.35); }
.kp-slider--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.35); }
.kp-slider--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4), 0 0 28px rgba(255, 247, 0, 0.2); --kp-c-fill: rgba(255, 247, 0, 0.35); }

/* ========== 轨道 ========== */
.kp-slider__track {
  position: relative;
  flex: 1;
  height: 4px;
  border-radius: 999px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  cursor: pointer;
}
.kp-slider--sm .kp-slider__track { height: 4px; }
.kp-slider--md .kp-slider__track { height: 6px; }
.kp-slider--lg .kp-slider__track { height: 8px; }

/* 已填充段 */
.kp-slider__fill {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  background: var(--kp-c);
  box-shadow: var(--kp-c-glow);
  transition: width var(--transition-fast), left var(--transition-fast);
}
/* 拖动时取消过渡,跟随指针更跟手 */
.kp-slider.is-dragging .kp-slider__fill { transition: none; }

/* ========== 拇指 ========== */
.kp-slider__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: var(--bg-elevated);
  border: 2px solid var(--kp-c);
  box-shadow: 0 0 8px var(--kp-c), var(--kp-c-glow);
  cursor: grab;
  touch-action: none;
  transition: transform var(--transition-fast);
}
.kp-slider.is-dragging .kp-slider__thumb { transition: none; cursor: grabbing; }
.kp-slider__thumb:hover { transform: translate(-50%, -50%) scale(1.15); }
.kp-slider.is-dragging .kp-slider__thumb:hover { transform: translate(-50%, -50%) scale(1.15); }

/* 拇指尺寸 */
.kp-slider--sm .kp-slider__thumb { width: 12px; height: 12px; }
.kp-slider--md .kp-slider__thumb { width: 16px; height: 16px; }
.kp-slider--lg .kp-slider__thumb { width: 20px; height: 20px; }

/* 数值气泡:hover / 拖动时显示 */
.kp-slider__tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 6px;
  border: 1px solid var(--kp-c);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  color: var(--kp-c);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-fast);
}
.kp-slider__thumb:hover .kp-slider__tooltip,
.kp-slider.is-dragging .kp-slider__thumb .kp-slider__tooltip {
  opacity: 1;
}

/* ========== 禁用 ========== */
.kp-slider.is-disabled {
  cursor: not-allowed;
  opacity: 0.4;
  filter: grayscale(0.6);
}
.kp-slider.is-disabled .kp-slider__track,
.kp-slider.is-disabled .kp-slider__thumb { cursor: not-allowed; }
.kp-slider.is-disabled .kp-slider__thumb { box-shadow: none; }
</style>
