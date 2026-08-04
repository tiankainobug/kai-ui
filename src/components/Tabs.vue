<script setup lang="ts">
import { ref, watch, onMounted, nextTick, onUnmounted } from 'vue'

// 赛博朋克标签页:线条 / 卡片两种风格,滑动指示条
interface TabItem {
  label: string
  name: string
  disabled?: boolean
}

interface Props {
  modelValue?: string
  tabs?: TabItem[]
  type?: 'line' | 'card'
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  tabs: () => [],
  type: 'line',
  color: 'cyan'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const nav_ref = ref<HTMLElement | null>(null)
// 线条风格的滑动指示条位置
const indicator_left = ref(0)
const indicator_width = ref(0)

const select_tab = (tab: TabItem) => {
  if (tab.disabled) return
  if (tab.name === props.modelValue) return
  emit('update:modelValue', tab.name)
  emit('change', tab.name)
}

// 根据当前激活项计算指示条 left/width
const update_indicator = () => {
  if (props.type !== 'line' || !nav_ref.value) return
  const idx = props.tabs.findIndex(t => t.name === props.modelValue)
  if (idx < 0) return
  const el = nav_ref.value.querySelectorAll<HTMLElement>('.kp-tabs__tab')[idx]
  if (el) {
    indicator_left.value = el.offsetLeft
    indicator_width.value = el.offsetWidth
  }
}

watch(() => props.modelValue, () => nextTick(update_indicator))
watch(() => props.type, () => nextTick(update_indicator))
watch(() => props.tabs, () => nextTick(update_indicator), { deep: true })
onMounted(() => nextTick(update_indicator))

// 窗口尺寸变化时重算指示条
const on_resize = () => update_indicator()
onMounted(() => window.addEventListener('resize', on_resize))
onUnmounted(() => window.removeEventListener('resize', on_resize))
</script>

<template>
  <div class="kp-tabs" :class="[`kp-tabs--${type}`, `kp-tabs--${color}`]">
    <!-- 标签头 -->
    <div ref="nav_ref" class="kp-tabs__nav">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        class="kp-tabs__tab"
        :class="{ 'is-active': tab.name === modelValue, 'is-disabled': tab.disabled }"
        :disabled="tab.disabled"
        @click="select_tab(tab)"
      >
        {{ tab.label }}
      </button>

      <!-- 线条风格:滑动指示条 -->
      <span
        v-if="type === 'line'"
        class="kp-tabs__indicator"
        :style="{ left: indicator_left + 'px', width: indicator_width + 'px' }"
      />
    </div>

    <!-- 内容区:按激活项渲染对应具名插槽 panel-{name} -->
    <div class="kp-tabs__content">
      <slot :name="`panel-${modelValue}`">
        <slot />
      </slot>
    </div>
  </div>
</template>

<style scoped>
.kp-tabs {
  font-family: var(--font-mono);
}

/* 颜色变量 */
.kp-tabs--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.1); }
.kp-tabs--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); --kp-c-fill: rgba(255, 46, 151, 0.1); }
.kp-tabs--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.1); }
.kp-tabs--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); --kp-c-fill: rgba(255, 247, 0, 0.1); }

/* 标签头 */
.kp-tabs__nav {
  position: relative;
  display: flex;
  gap: 2px;
}

.kp-tabs__tab {
  position: relative;
  padding: 10px 18px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: color var(--transition-fast);
}
.kp-tabs__tab:hover:not(.is-disabled):not(.is-active) {
  color: var(--text-secondary);
}
.kp-tabs__tab.is-active {
  color: var(--kp-c);
  text-shadow: 0 0 6px var(--kp-c);
}
.kp-tabs__tab.is-disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

/* ========== 线条风格 ========== */
.kp-tabs--line .kp-tabs__nav {
  border-bottom: 1px solid var(--border-color);
}
.kp-tabs--line .kp-tabs__tab {
  margin-bottom: 1px;
}
/* 滑动指示条:绝对定位,沿底边滑动 */
.kp-tabs--line .kp-tabs__indicator {
  position: absolute;
  bottom: -1px;
  height: 2px;
  background: var(--kp-c);
  box-shadow: var(--kp-c-glow);
  transition: left var(--transition-base), width var(--transition-base);
}

/* ========== 卡片风格 ========== */
.kp-tabs--card .kp-tabs__tab {
  border: 1px solid var(--border-color);
  border-bottom: none;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  background: var(--bg-panel);
}
.kp-tabs--card .kp-tabs__tab.is-active {
  border-color: var(--kp-c);
  background: var(--bg-elevated);
  box-shadow: var(--kp-c-glow);
}
/* 卡片风格激活项底边与内容区衔接 */
.kp-tabs--card .kp-tabs__tab.is-active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--bg-elevated);
}

/* 内容区 */
.kp-tabs__content {
  padding: var(--space-md) 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.7;
}
.kp-tabs--card .kp-tabs__content {
  padding: var(--space-md);
  border: 1px solid var(--border-color);
  border-top: none;
  background: var(--bg-elevated);
}
.kp-tabs--card .kp-tabs__tab.is-active ~ .kp-tabs__content {
  border-color: var(--kp-c);
}
</style>
