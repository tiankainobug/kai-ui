<script setup lang="ts">
import { ref, computed } from 'vue'

// 赛博朋克评分:星级,支持半选 / 只读 / 自定义图标 / 自定义数量
interface Props {
  modelValue?: number
  max?: number
  allow_half?: boolean
  readonly?: boolean
  disabled?: boolean
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  max: 5,
  allow_half: false,
  readonly: false,
  disabled: false,
  color: 'yellow',
  size: 'md',
  icon: '★'
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

// hover 预览值:鼠标移入时临时显示,移出恢复
const hover_val = ref<number | null>(null)

const is_locked = computed(() => props.readonly || props.disabled)
// 当前显示值:hover 优先,否则取 modelValue
const display_val = computed(() => hover_val.value ?? props.modelValue)

// 单颗星的填充比例:0 / 0.5 / 1
const star_fill = (index: number) => {
  const val = display_val.value
  if (val >= index) return 1
  if (props.allow_half && val >= index - 0.5) return 0.5
  return 0
}

// 鼠标移动到星上:计算半选/整选值
const on_move = (e: MouseEvent, index: number) => {
  if (is_locked.value) return
  if (!props.allow_half) {
    hover_val.value = index
    return
  }
  // 按光标在星内的横向位置判断半/整
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const is_left = e.clientX - rect.left < rect.width / 2
  hover_val.value = is_left ? index - 0.5 : index
}

const on_leave = () => {
  hover_val.value = null
}

const on_click = (index: number) => {
  if (is_locked.value) return
  const val = hover_val.value ?? index
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<template>
  <div
    class="kp-rate"
    :class="[`kp-rate--${color}`, `kp-rate--${size}`, { 'is-readonly': readonly, 'is-disabled': disabled }]"
    @mouseleave="on_leave"
  >
    <span
      v-for="i in max"
      :key="i"
      class="kp-rate__star"
      @mousemove="on_move($event, i)"
      @click="on_click(i)"
    >
      <!-- 半星:用两层叠加实现,上层宽度 50% 裁剪 -->
      <span class="kp-rate__icon kp-rate__icon--bg">{{ icon }}</span>
      <span class="kp-rate__icon kp-rate__icon--fg" :style="{ width: star_fill(i) * 100 + '%' }">{{ icon }}</span>
    </span>
  </div>
</template>

<style scoped>
.kp-rate {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: var(--font-mono);
}

/* 颜色变量 */
.kp-rate--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-rate--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-rate--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-rate--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }

/* 尺寸 */
.kp-rate--sm .kp-rate__icon { font-size: 16px; }
.kp-rate--md .kp-rate__icon { font-size: 20px; }
.kp-rate--lg .kp-rate__icon { font-size: 28px; }

/* 星容器 */
.kp-rate__star {
  position: relative;
  cursor: pointer;
  line-height: 1;
}

/* 图标底层(灰):铺底 */
.kp-rate__icon {
  display: inline-block;
  font-style: normal;
  user-select: none;
}
.kp-rate__icon--bg {
  color: var(--border-bright);
}

/* 图标前景(亮):按填充比例裁剪宽度 */
.kp-rate__icon--fg {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  white-space: nowrap;
  color: var(--kp-c);
  text-shadow: 0 0 6px var(--kp-c);
  transition: width var(--transition-fast);
}

/* 非锁定态 hover 整体放大 */
.kp-rate__star:hover {
  transform: scale(1.15);
}
.kp-rate__star {
  transition: transform var(--transition-fast);
}

/* 只读 / 禁用 */
.kp-rate.is-readonly .kp-rate__star,
.kp-rate.is-disabled .kp-rate__star {
  cursor: default;
}
.kp-rate.is-readonly .kp-rate__star:hover,
.kp-rate.is-disabled .kp-rate__star:hover {
  transform: none;
}
.kp-rate.is-disabled {
  opacity: 0.4;
  filter: grayscale(0.6);
}
</style>
