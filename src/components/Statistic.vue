<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 赛博朋克统计数值:数字展示 + 前后缀 + 倒计时扩展
interface Props {
  value?: number
  title?: string
  prefix?: string
  suffix?: string
  precision?: number
  color?: 'cyan' | 'magenta' | 'green' | 'yellow' | 'red'
  // 倒计时:传入目标时间戳(ms),组件自动倒数
  countdown?: number
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  title: '',
  prefix: '',
  suffix: '',
  precision: 0,
  color: 'cyan',
  countdown: 0
})

// 倒计时剩余(ms)
const remain = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

// 是否倒计时模式
const is_countdown = computed(() => props.countdown > 0)

// 格式化数字:千分位 + 小数精度
const format_num = (n: number) => {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: props.precision,
    maximumFractionDigits: props.precision
  })
}

// 倒计时展示:DD HH:MM:SS
const countdown_text = computed(() => {
  const total = Math.max(0, remain.value)
  const days = Math.floor(total / 86400000)
  const hours = Math.floor((total % 86400000) / 3600000)
  const mins = Math.floor((total % 3600000) / 60000)
  const secs = Math.floor((total % 60000) / 1000)
  const pad = (v: number) => String(v).padStart(2, '0')
  return days > 0
    ? `${days}d ${pad(hours)}:${pad(mins)}:${pad(secs)}`
    : `${pad(hours)}:${pad(mins)}:${pad(secs)}`
})

// 展示值:倒计时模式用 countdown_text,否则格式化数值
const display = computed(() => is_countdown.value ? countdown_text.value : format_num(props.value))

onMounted(() => {
  if (is_countdown.value) {
    remain.value = props.countdown - Date.now()
    timer = setInterval(() => {
      remain.value = props.countdown - Date.now()
      if (remain.value <= 0 && timer) {
        clearInterval(timer)
        timer = null
      }
    }, 1000)
  }
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="kp-statistic" :class="`kp-statistic--${color}`">
    <div v-if="title" class="kp-statistic__title">{{ title }}</div>
    <div class="kp-statistic__value">
      <span v-if="prefix" class="kp-statistic__prefix">{{ prefix }}</span>
      <span class="kp-statistic__num">{{ display }}</span>
      <span v-if="suffix" class="kp-statistic__suffix">{{ suffix }}</span>
    </div>
  </div>
</template>

<style scoped>
.kp-statistic {
  display: inline-flex;
  flex-direction: column;
  gap: var(--space-xs);
  font-family: var(--font-mono);
}

/* 颜色变量 */
.kp-statistic--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-statistic--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-statistic--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-statistic--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }
.kp-statistic--red     { --kp-c: var(--neon-red);     --kp-c-glow: var(--glow-red); }

/* 标题 */
.kp-statistic__title {
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* 数值行 */
.kp-statistic__value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

/* 数字本体 */
.kp-statistic__num {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--kp-c);
  text-shadow: 0 0 8px var(--kp-c);
  font-variant-numeric: tabular-nums;
}

/* 前缀 */
.kp-statistic__prefix {
  font-size: 16px;
  color: var(--kp-c);
  opacity: 0.8;
}

/* 后缀 */
.kp-statistic__suffix {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
