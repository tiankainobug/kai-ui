<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// 赛博朋克轮播:内容切换,指示器/箭头/自动播放
interface Props {
  count?: number
  autoplay?: boolean
  interval?: number
  loop?: boolean
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  height?: number | string
  arrow?: 'always' | 'hover' | 'never'
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  autoplay: true,
  interval: 4000,
  loop: true,
  color: 'cyan',
  height: 280,
  arrow: 'hover'
})

const emit = defineEmits<{ change: [index: number] }>()

const current = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const height_val = computed(() => (typeof props.height === 'number' ? props.height + 'px' : props.height))

const go = (index: number) => {
  if (index < 0) index = props.loop ? props.count - 1 : 0
  if (index >= props.count) index = props.loop ? 0 : props.count - 1
  if (index === current.value) return
  current.value = index
  emit('change', index)
}

const next = () => go(current.value + 1)
const prev = () => go(current.value - 1)

// 自动播放
const start = () => {
  if (!props.autoplay || props.count <= 1) return
  stop()
  timer = setInterval(next, props.interval)
}
const stop = () => {
  if (timer) { clearInterval(timer); timer = null }
}

onMounted(start)
onUnmounted(stop)
watch(() => [props.autoplay, props.interval, props.count], start)

// hover 暂停
const on_enter = stop
const on_leave = start
</script>

<template>
  <div
    class="kp-carousel"
    :class="[`kp-carousel--${color}`, `kp-carousel--arrow-${arrow}`]"
    :style="{ height: height_val }"
    @mouseenter="on_enter"
    @mouseleave="on_leave"
  >
    <!-- 轨道:整体平移 -->
    <div class="kp-carousel__track" :style="{ transform: `translateX(-${current * 100}%)` }">
      <slot />
    </div>

    <!-- 左箭头 -->
    <button v-if="arrow !== 'never' && count > 1" class="kp-carousel__arrow kp-carousel__arrow--left" @click="prev">‹</button>
    <!-- 右箭头 -->
    <button v-if="arrow !== 'never' && count > 1" class="kp-carousel__arrow kp-carousel__arrow--right" @click="next">›</button>

    <!-- 指示器 -->
    <div v-if="count > 1" class="kp-carousel__indicators">
      <button
        v-for="i in count"
        :key="i"
        class="kp-carousel__dot"
        :class="{ 'is-active': i - 1 === current }"
        @click="go(i - 1)"
      />
    </div>
  </div>
</template>

<style scoped>
.kp-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-input);
  font-family: var(--font-mono);
}

/* 颜色变量 */
.kp-carousel--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-carousel--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-carousel--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-carousel--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }

/* 轨道:横向排列所有幻灯片,整体平移切换 */
.kp-carousel__track {
  display: flex;
  height: 100%;
  transition: transform var(--transition-slow);
}

/* 箭头 */
.kp-carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--kp-c);
  border-radius: 50%;
  background: rgba(7, 7, 13, 0.6);
  color: var(--kp-c);
  font-size: 20px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all var(--transition-fast);
}
.kp-carousel__arrow:hover {
  background: var(--kp-c);
  color: var(--bg-base);
  box-shadow: var(--kp-c-glow);
}
.kp-carousel__arrow--left { left: var(--space-sm); }
.kp-carousel__arrow--right { right: var(--space-sm); }

/* arrow=hover:默认隐藏,容器 hover 时显示 */
.kp-carousel--arrow-hover .kp-carousel__arrow { opacity: 0; }
.kp-carousel--arrow-hover:hover .kp-carousel__arrow { opacity: 1; }
.kp-carousel--arrow-hover .kp-carousel__arrow { transition: opacity var(--transition-base), background var(--transition-fast), color var(--transition-fast); }

/* 指示器 */
.kp-carousel__indicators {
  position: absolute;
  bottom: var(--space-sm);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  gap: 6px;
}
.kp-carousel__dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: 1px solid var(--kp-c);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.kp-carousel__dot.is-active {
  background: var(--kp-c);
  box-shadow: var(--kp-c-glow);
  width: 20px;
  border-radius: 999px;
}
</style>
