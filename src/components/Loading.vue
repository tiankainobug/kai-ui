<script setup lang="ts">
// 赛博朋克加载指示器:ring / dots / bars 三种样式,全屏 / 局部模式
interface Props {
  type?: 'ring' | 'dots' | 'bars'
  size?: 'sm' | 'md' | 'lg'
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  fullscreen?: boolean
  text?: string
}

withDefaults(defineProps<Props>(), {
  type: 'ring',
  size: 'md',
  color: 'cyan',
  fullscreen: false,
  text: ''
})
</script>

<template>
  <Teleport v-if="fullscreen" to="body">
    <div class="kp-loading kp-loading--fullscreen" :class="[`kp-loading--${color}`, `kp-loading--${size}`]">
      <div class="kp-loading__inner">
        <!-- ring:边框旋转环 -->
        <span v-if="type === 'ring'" class="kp-loading__ring" />
        <!-- dots:三圆点脉冲 -->
        <span v-else-if="type === 'dots'" class="kp-loading__dots">
          <span v-for="i in 3" :key="i" class="kp-loading__dot" :style="{ animationDelay: (i - 1) * 0.15 + 's' }" />
        </span>
        <!-- bars:均衡器条 -->
        <span v-else class="kp-loading__bars">
          <span v-for="i in 4" :key="i" class="kp-loading__bar" :style="{ animationDelay: (i - 1) * 0.12 + 's' }" />
        </span>
        <span v-if="text" class="kp-loading__text">{{ text }}</span>
      </div>
    </div>
  </Teleport>

  <!-- 局部模式:绝对定位覆盖父容器(父级需 position: relative) -->
  <div v-else class="kp-loading kp-loading--inline" :class="[`kp-loading--${color}`, `kp-loading--${size}`]">
    <div class="kp-loading__inner">
      <span v-if="type === 'ring'" class="kp-loading__ring" />
      <span v-else-if="type === 'dots'" class="kp-loading__dots">
        <span v-for="i in 3" :key="i" class="kp-loading__dot" :style="{ animationDelay: (i - 1) * 0.15 + 's' }" />
      </span>
      <span v-else class="kp-loading__bars">
        <span v-for="i in 4" :key="i" class="kp-loading__bar" :style="{ animationDelay: (i - 1) * 0.12 + 's' }" />
      </span>
      <span v-if="text" class="kp-loading__text">{{ text }}</span>
    </div>
  </div>
</template>

<style scoped>
.kp-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
}

/* 颜色变量 */
.kp-loading--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-loading--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-loading--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-loading--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }

/* 全屏:固定覆盖视口 */
.kp-loading--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(7, 7, 13, 0.7);
  backdrop-filter: blur(3px);
}
/* 局部:绝对覆盖父容器 */
.kp-loading--inline {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(15, 15, 26, 0.65);
  border-radius: inherit;
}

.kp-loading__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

/* ========== ring ========== */
.kp-loading__ring {
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: var(--kp-c);
  border-right-color: var(--kp-c);
  box-shadow: var(--kp-c-glow);
  animation: kp-spin 0.7s linear infinite;
}
.kp-loading--sm .kp-loading__ring { width: 24px; height: 24px; }
.kp-loading--md .kp-loading__ring { width: 36px; height: 36px; }
.kp-loading--lg .kp-loading__ring { width: 52px; height: 52px; border-width: 3px; }

/* ========== dots ========== */
.kp-loading__dots {
  display: flex;
  gap: 6px;
}
.kp-loading__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--kp-c);
  box-shadow: var(--kp-c-glow);
  animation: kp-pulse 0.9s ease-in-out infinite;
}
.kp-loading--sm .kp-loading__dot { width: 6px; height: 6px; }
.kp-loading--lg .kp-loading__dot { width: 10px; height: 10px; }

/* ========== bars ========== */
.kp-loading__bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 28px;
}
.kp-loading__bar {
  width: 4px;
  background: var(--kp-c);
  box-shadow: var(--kp-c-glow);
  animation: kp-loading-bar 0.8s ease-in-out infinite;
}
.kp-loading--sm .kp-loading__bars { height: 20px; }
.kp-loading--sm .kp-loading__bar { width: 3px; }
.kp-loading--lg .kp-loading__bars { height: 40px; }
.kp-loading--lg .kp-loading__bar { width: 6px; }

@keyframes kp-loading-bar {
  0%, 100% { height: 30%; }
  50% { height: 100%; }
}

/* 文字 */
.kp-loading__text {
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--kp-c);
  text-shadow: 0 0 5px var(--kp-c);
}
.kp-loading--lg .kp-loading__text { font-size: 14px; }
</style>
