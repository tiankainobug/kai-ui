<script setup lang="ts">
import { computed } from 'vue'

// 赛博朋克骨架屏:加载占位,text / circle / rect 形状,扫描线流光动画
interface Props {
  type?: 'text' | 'circle' | 'rect'
  width?: number | string
  height?: number | string
  rows?: number
  animated?: boolean
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  width: '100%',
  height: 14,
  rows: 1,
  animated: true,
  color: 'cyan'
})

// text 类型多行时最后一行宽度递减,模拟段落末尾
const row_list = computed(() => Array.from({ length: props.rows }, (_, i) => i))
const row_width = (i: number) => {
  if (i < props.rows - 1) return '100%'
  // 最后一行缩短,避免视觉过于齐整
  return '70%'
}

// 归一化尺寸
const size_val = (v: number | string) => (typeof v === 'number' ? v + 'px' : v)
// text 默认高度按字号推导,其余用传入值
const height_val = computed(() => {
  if (props.type === 'text') return props.height === 14 ? '14px' : size_val(props.height)
  return size_val(props.height)
})
const width_val = computed(() => {
  if (props.type === 'circle') {
    // circle 用 width 作为直径,height 留空
    return size_val(props.width)
  }
  return size_val(props.width)
})
</script>

<template>
  <div class="kp-skeleton" :class="[`kp-skeleton--${color}`, { 'is-animated': animated }]" :style="{ '--sk-w': width_val, '--sk-h': height_val }">
    <!-- text:多行段落占位 -->
    <template v-if="type === 'text'">
      <span
        v-for="i in row_list"
        :key="i"
        class="kp-skeleton__item kp-skeleton__item--text"
        :style="{ width: row_width(i), height: 'var(--sk-h)' }"
      />
    </template>

    <!-- circle:圆形头像占位 -->
    <span
      v-else-if="type === 'circle'"
      class="kp-skeleton__item kp-skeleton__item--circle"
      :style="{ width: 'var(--sk-w)', height: 'var(--sk-w)' }"
    />

    <!-- rect:矩形块占位 -->
    <span
      v-else
      class="kp-skeleton__item kp-skeleton__item--rect"
      :style="{ width: 'var(--sk-w)', height: 'var(--sk-h)' }"
    />
  </div>
</template>

<style scoped>
.kp-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 100%;
  font-family: var(--font-mono);
}

/* 颜色变量:基础色 + 流光高亮色 */
.kp-skeleton--cyan    { --kp-c: rgba(0, 240, 255, 0.18); --kp-c-hi: rgba(0, 240, 255, 0.45); }
.kp-skeleton--magenta { --kp-c: rgba(255, 46, 151, 0.18); --kp-c-hi: rgba(255, 46, 151, 0.45); }
.kp-skeleton--green   { --kp-c: rgba(0, 255, 159, 0.18); --kp-c-hi: rgba(0, 255, 159, 0.45); }
.kp-skeleton--yellow  { --kp-c: rgba(255, 247, 0, 0.18); --kp-c-hi: rgba(255, 247, 0, 0.45); }

/* 占位块本体 */
.kp-skeleton__item {
  display: block;
  background: var(--kp-c);
  position: relative;
  overflow: hidden;
}

.kp-skeleton__item--text {
  border-radius: var(--radius-sm);
}
.kp-skeleton__item--rect {
  border-radius: var(--radius-sm);
}
.kp-skeleton__item--circle {
  border-radius: 50%;
}

/* 扫描线流光:从左滑到右,模拟数据加载中 */
.kp-skeleton.is-animated .kp-skeleton__item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--kp-c-hi) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: kp-skeleton-scan 1.6s ease-in-out infinite;
}
@keyframes kp-skeleton-scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
