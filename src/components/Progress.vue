<script setup lang="ts">
import { computed } from 'vue'

// 赛博朋克进度条:线形 / 环形,渐变发光,百分比内显,可选条纹动画
interface Props {
  modelValue?: number
  type?: 'line' | 'circle'
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
  show_text?: boolean
  striped?: boolean
  status?: 'normal' | 'success' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  type: 'line',
  color: 'cyan',
  size: 'md',
  show_text: true,
  striped: false,
  status: 'normal'
})

// 实际百分比:钳制 0-100
const pct = computed(() => Math.max(0, Math.min(100, Math.round(props.modelValue))))

// 状态优先:success 强制绿,error 强制红,否则用 color
const active_color = computed(() => {
  if (props.status === 'success') return 'green'
  if (props.status === 'error') return 'red'
  return props.color
})

// 环形参数:半径随尺寸变化,周长 = 2πr
const circle_r = computed(() => (props.size === 'sm' ? 26 : props.size === 'md' ? 32 : 40))
const circumference = computed(() => 2 * Math.PI * circle_r.value)
// dashoffset 随百分比递减
const dash_offset = computed(() => circumference.value * (1 - pct.value / 100))
</script>

<template>
  <!-- 线形 -->
  <div
    v-if="type === 'line'"
    class="kp-progress kp-progress--line"
    :class="[`kp-progress--${active_color}`, `kp-progress--${size}`]"
  >
    <div class="kp-progress__track">
      <div
        class="kp-progress__fill"
        :class="{ 'is-striped': striped, 'is-success': status === 'success', 'is-error': status === 'error' }"
        :style="{ width: pct + '%' }"
      >
        <!-- 百分比内显:填充够宽时显示在条内右侧 -->
        <span v-if="show_text && pct >= 10" class="kp-progress__text is-in">{{ pct }}%</span>
      </div>
      <!-- 填充过窄时百分比外显在右侧 -->
      <span v-if="show_text && pct < 10" class="kp-progress__text is-out">{{ pct }}%</span>
    </div>
  </div>

  <!-- 环形 -->
  <div
    v-else
    class="kp-progress kp-progress--circle"
    :class="[`kp-progress--${active_color}`, `kp-progress--${size}`]"
  >
    <svg :width="circle_r * 2 + 8" :height="circle_r * 2 + 8" viewBox="0 0 58 58">
      <!-- 背景轨道圆 -->
      <circle
        class="kp-progress__ring-track"
        cx="29" cy="29" :r="circle_r"
        fill="none" stroke-width="4"
      />
      <!-- 进度圆:旋转 -90° 使起点位于顶部 -->
      <circle
        class="kp-progress__ring-fill"
        cx="29" cy="29" :r="circle_r"
        fill="none" stroke-width="4"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dash_offset"
        transform="rotate(-90 29 29)"
      />
    </svg>
    <!-- 中心百分比 -->
    <span v-if="show_text" class="kp-progress__circle-text">{{ pct }}%</span>
  </div>
</template>

<style scoped>
.kp-progress {
  font-family: var(--font-mono);
}

/* 颜色变量 */
.kp-progress--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-progress--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-progress--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-progress--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4), 0 0 28px rgba(255, 247, 0, 0.2); }
.kp-progress--red     { --kp-c: var(--neon-red);     --kp-c-glow: var(--glow-red); }

/* ========== 线形 ========== */
.kp-progress--line {
  width: 100%;
}

.kp-progress__track {
  position: relative;
  width: 100%;
  border-radius: 999px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  overflow: hidden;
}
.kp-progress--sm .kp-progress__track { height: 8px; }
.kp-progress--md .kp-progress__track { height: 12px; }
.kp-progress--lg .kp-progress__track { height: 16px; }

.kp-progress__fill {
  position: relative;
  height: 100%;
  border-radius: 999px;
  /* 渐变填充:霓虹色由亮到透,营造能量流动感 */
  background: linear-gradient(90deg, var(--kp-c), color-mix(in srgb, var(--kp-c) 40%, transparent));
  box-shadow: var(--kp-c-glow);
  transition: width var(--transition-slow);
}

/* 条纹动画:斜向高光循环移动 */
.kp-progress__fill.is-striped::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.25) 0,
    rgba(255, 255, 255, 0.25) 6px,
    transparent 6px,
    transparent 12px
  );
  background-size: 200% 100%;
  animation: kp-progress-stripes 1s linear infinite;
}
@keyframes kp-progress-stripes {
  from { background-position: 0 0; }
  to { background-position: 24px 0; }
}

/* 百分比文字 */
.kp-progress__text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
.kp-progress__text.is-in {
  right: 6px;
  color: var(--bg-base);
}
.kp-progress__text.is-out {
  left: calc(100% + 6px);
  color: var(--text-secondary);
}
.kp-progress--lg .kp-progress__text { font-size: 12px; }

/* ========== 环形 ========== */
.kp-progress--circle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.kp-progress__ring-track {
  stroke: var(--bg-input);
}
.kp-progress__ring-fill {
  stroke: var(--kp-c);
  filter: drop-shadow(0 0 4px var(--kp-c));
  transition: stroke-dashoffset var(--transition-slow);
}

.kp-progress__circle-text {
  position: absolute;
  font-size: 13px;
  font-weight: 700;
  color: var(--kp-c);
  text-shadow: 0 0 6px var(--kp-c);
}
.kp-progress--sm .kp-progress__circle-text { font-size: 11px; }
.kp-progress--lg .kp-progress__circle-text { font-size: 16px; }
</style>
