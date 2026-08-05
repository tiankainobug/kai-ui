<script setup lang="ts">
// 赛博朋克时间线:时间轴记录,自定义节点颜色 / 图标
interface TimelineItem {
  time: string
  title: string
  description?: string
  color?: 'cyan' | 'magenta' | 'green' | 'yellow' | 'red'
  icon?: string
}

interface Props {
  items?: TimelineItem[]
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
}

withDefaults(defineProps<Props>(), {
  items: () => [],
  color: 'cyan'
})
</script>

<template>
  <div class="kp-timeline" :class="`kp-timeline--${color}`">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="kp-timeline__item"
      :class="`kp-timeline__item--${item.color || color}`"
    >
      <!-- 轴线 + 节点 -->
      <div class="kp-timeline__rail">
        <span class="kp-timeline__node">
          <span v-if="item.icon">{{ item.icon }}</span>
        </span>
        <!-- 连接线:最后一项不显示 -->
        <span v-if="i < items.length - 1" class="kp-timeline__line" />
      </div>

      <!-- 内容 -->
      <div class="kp-timeline__content">
        <div class="kp-timeline__time">{{ item.time }}</div>
        <div class="kp-timeline__title">{{ item.title }}</div>
        <div v-if="item.description" class="kp-timeline__desc">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kp-timeline {
  font-family: var(--font-mono);
}

/* 默认颜色变量(整体回退) */
.kp-timeline--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-timeline--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-timeline--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-timeline--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }

/* 每项:节点颜色覆盖 */
.kp-timeline__item {
  display: flex;
  gap: var(--space-md);
  padding-bottom: var(--space-lg);
}
.kp-timeline__item:last-child { padding-bottom: 0; }

/* 单项颜色:优先用 item 自身颜色 */
.kp-timeline__item--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-timeline__item--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-timeline__item--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-timeline__item--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }
.kp-timeline__item--red     { --kp-c: var(--neon-red);     --kp-c-glow: var(--glow-red); }

/* 轴线列 */
.kp-timeline__rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

/* 节点圆 */
.kp-timeline__node {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--kp-c);
  box-shadow: var(--kp-c-glow);
  font-size: 9px;
  color: var(--bg-base);
  font-weight: 700;
}

/* 连接线 */
.kp-timeline__line {
  flex: 1;
  width: 2px;
  min-height: 24px;
  margin-top: var(--space-xs);
  background: linear-gradient(180deg, var(--kp-c), var(--border-color));
  opacity: 0.6;
}

/* 内容 */
.kp-timeline__content {
  flex: 1;
  padding-bottom: var(--space-xs);
  margin-top: -2px;
}
.kp-timeline__time {
  font-size: 12px;
  color: var(--kp-c);
  letter-spacing: 1px;
  text-shadow: 0 0 4px var(--kp-c);
  margin-bottom: 2px;
}
.kp-timeline__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}
.kp-timeline__desc {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
