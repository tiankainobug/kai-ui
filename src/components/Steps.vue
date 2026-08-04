<script setup lang="ts">
import { computed } from 'vue'

// 赛博朋克步骤条:横/纵向,完成/进行/等待/错误四态
interface StepItem {
  title: string
  description?: string
  icon?: string
}

interface Props {
  modelValue?: number
  steps?: StepItem[]
  direction?: 'horizontal' | 'vertical'
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  status?: 'process' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  steps: () => [],
  direction: 'horizontal',
  color: 'cyan',
  status: 'process'
})

// 单步状态:当前步按 status prop,其前为 finish,其后为 wait
const step_status = (index: number): 'finish' | 'process' | 'error' | 'wait' => {
  if (index < props.modelValue) return 'finish'
  if (index === props.modelValue) return props.status === 'error' ? 'error' : 'process'
  return 'wait'
}

// 是否最后一个
const is_last = (index: number) => index === props.steps.length - 1
</script>

<template>
  <div class="kp-steps" :class="[`kp-steps--${color}`, `kp-steps--${direction}`]">
    <div
      v-for="(step, i) in steps"
      :key="i"
      class="kp-steps__item"
      :class="[`is-${step_status(i)}`, { 'is-last': is_last(i) }]"
    >
      <!-- 节点圆 + 连接线 -->
      <div class="kp-steps__head">
        <span class="kp-steps__node">
          <!-- 完成态:对勾 -->
          <svg v-if="step_status(i) === 'finish'" class="kp-steps__check" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <!-- 进行/错误态:序号或自定义图标 -->
          <span v-else>{{ step.icon || i + 1 }}</span>
        </span>
        <!-- 连接线(最后一步不显示) -->
        <span v-if="!is_last(i)" class="kp-steps__line" />
      </div>

      <!-- 文案 -->
      <div class="kp-steps__main">
        <div class="kp-steps__title">{{ step.title }}</div>
        <div v-if="step.description" class="kp-steps__desc">{{ step.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kp-steps {
  font-family: var(--font-mono);
}

/* 颜色变量 */
.kp-steps--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.12); }
.kp-steps--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); --kp-c-fill: rgba(255, 46, 151, 0.12); }
.kp-steps--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.12); }
.kp-steps--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); --kp-c-fill: rgba(255, 247, 0, 0.12); }

/* ========== 横向 ========== */
.kp-steps--horizontal {
  display: flex;
}
.kp-steps--horizontal .kp-steps__item {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.kp-steps--horizontal .kp-steps__head {
  display: flex;
  align-items: center;
  height: 32px;
}
/* 横向连接线:从节点右侧延伸 */
.kp-steps--horizontal .kp-steps__line {
  flex: 1;
  height: 2px;
  margin-left: var(--space-sm);
  background: var(--border-color);
}
.kp-steps--horizontal .kp-steps__main {
  margin-top: var(--space-sm);
  padding-right: var(--space-md);
}

/* ========== 纵向 ========== */
.kp-steps--vertical {
  display: flex;
  flex-direction: column;
}
.kp-steps--vertical .kp-steps__item {
  display: flex;
  min-height: 80px;
}
.kp-steps--vertical .kp-steps__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: var(--space-md);
}
/* 纵向连接线:从节点底部延伸 */
.kp-steps--vertical .kp-steps__line {
  flex: 1;
  width: 2px;
  min-height: 24px;
  margin: var(--space-xs) 0;
  background: var(--border-color);
}
.kp-steps--vertical .kp-steps__main {
  padding-bottom: var(--space-lg);
}

/* ========== 节点圆 ========== */
.kp-steps__node {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid var(--border-bright);
  background: var(--bg-input);
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 700;
  transition: all var(--transition-base);
}
.kp-steps__check {
  width: 14px;
  height: 14px;
  color: var(--bg-base);
}

/* 完成态:填充霓虹色 */
.kp-steps__item.is-finish .kp-steps__node {
  border-color: var(--kp-c);
  background: var(--kp-c);
  box-shadow: var(--kp-c-glow);
}
/* 完成态连接线:变霓虹色 */
.kp-steps__item.is-finish .kp-steps__line {
  background: var(--kp-c);
  box-shadow: var(--kp-c-glow);
}

/* 进行态:霓虹描边 + 脉冲 */
.kp-steps__item.is-process .kp-steps__node {
  border-color: var(--kp-c);
  color: var(--kp-c);
  background: var(--kp-c-fill);
  box-shadow: var(--kp-c-glow);
  animation: kp-pulse 1.6s ease-in-out infinite;
}

/* 错误态:红色 */
.kp-steps__item.is-error .kp-steps__node {
  border-color: var(--neon-red);
  color: var(--neon-red);
  background: rgba(255, 0, 60, 0.12);
  box-shadow: var(--glow-red);
}

/* 标题 */
.kp-steps__title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-muted);
  transition: color var(--transition-base);
}
.kp-steps__item.is-finish .kp-steps__title,
.kp-steps__item.is-process .kp-steps__title {
  color: var(--text-primary);
}
.kp-steps__item.is-process .kp-steps__title {
  text-shadow: 0 0 5px var(--kp-c);
  color: var(--kp-c);
}
.kp-steps__item.is-error .kp-steps__title {
  color: var(--neon-red);
}

/* 描述 */
.kp-steps__desc {
  margin-top: 2px;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
}
</style>
