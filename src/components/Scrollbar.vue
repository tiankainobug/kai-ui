<script setup lang="ts">
// 赛博朋克自定义滚动条容器:隐藏原生滚动条,自绘发光 thumb
// 支持:纵向/横向、自动隐藏、拖拽 thumb、触底事件、scrollTo 方法暴露
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

interface Props {
  // 容器固定高度,默认自适应(配合 max_height 限定)
  height?: string | number
  // 最大高度,内容超出即出现滚动
  max_height?: string | number
  // 滚动条常驻显示(否则 hover/滚动时淡入,停止后淡出)
  always_visible?: boolean
  // 滚动条霓虹色
  thumb_color?: 'cyan' | 'magenta' | 'green' | 'yellow' | 'purple'
  // 启用横向滚动
  horizontal?: boolean
  // 平滑滚动(scrollTo 行为)
  smooth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 'auto',
  max_height: 300,
  always_visible: false,
  thumb_color: 'cyan',
  horizontal: false,
  smooth: true
})

const emit = defineEmits<{
  scroll: [payload: { scrollTop: number; scrollLeft: number; ratioY: number; ratioX: number }]
  reach_bottom: [scrollTop: number]
}>()

// 视口(真实滚动元素)与纵向/横向 thumb 引用
const viewport_ref = ref<HTMLElement | null>(null)
const thumb_y_ref = ref<HTMLElement | null>(null)
const thumb_x_ref = ref<HTMLElement | null>(null)

// thumb 可见性状态(驱动淡入淡出)
const show_thumb = ref(false)
const is_dragging = ref(false)

// 触底去重标记,避免连续 scroll 事件重复派发
let reached_bottom = false
// 延迟自动隐藏计时器
let hide_timer: ReturnType<typeof setTimeout> | null = null

// number 高度规范化为 px 字符串
const normalize_size = (val: string | number): string =>
  typeof val === 'number' ? `${val}px` : val

// 显示 thumb(hover/滚动),并在停止后延迟自动隐藏
const flash_thumb = () => {
  show_thumb.value = true
  if (hide_timer) clearTimeout(hide_timer)
  // 常驻或拖拽中不隐藏
  if (!props.always_visible && !is_dragging.value) {
    hide_timer = setTimeout(() => {
      show_thumb.value = false
    }, 800)
  }
}

// 重新计算纵向 thumb 高度与位置
const update_y = () => {
  const vp = viewport_ref.value
  const thumb = thumb_y_ref.value
  if (!vp || !thumb) return

  const { clientHeight, scrollHeight, scrollTop } = vp
  // 内容未溢出则隐藏 thumb
  if (scrollHeight <= clientHeight) {
    thumb.style.display = 'none'
    return
  }
  thumb.style.display = ''

  // thumb 高度按可视占比缩放,最小 24px 保证可拖拽
  const ratio = clientHeight / scrollHeight
  const thumb_h = Math.max(clientHeight * ratio, 24)
  const max_translate = clientHeight - thumb_h
  // 滚动进度映射为 thumb 位移
  const move_ratio = scrollTop / (scrollHeight - clientHeight)
  thumb.style.height = `${thumb_h}px`
  thumb.style.transform = `translateY(${max_translate * move_ratio}px)`

  // 触底检测:预留 2px 容差抵消小数误差
  if (scrollTop + clientHeight >= scrollHeight - 2) {
    if (!reached_bottom) {
      reached_bottom = true
      emit('reach_bottom', scrollTop)
    }
  } else {
    reached_bottom = false
  }
}

// 重新计算横向 thumb 宽度与位置
const update_x = () => {
  const vp = viewport_ref.value
  const thumb = thumb_x_ref.value
  if (!vp || !thumb) return

  const { clientWidth, scrollWidth, scrollLeft } = vp
  if (scrollWidth <= clientWidth) {
    thumb.style.display = 'none'
    return
  }
  thumb.style.display = ''

  const ratio = clientWidth / scrollWidth
  const thumb_w = Math.max(clientWidth * ratio, 24)
  const max_translate = clientWidth - thumb_w
  const move_ratio = scrollLeft / (scrollWidth - clientWidth)
  thumb.style.width = `${thumb_w}px`
  thumb.style.transform = `translateX(${max_translate * move_ratio}px)`
}

// viewport 滚动:更新 thumb + 派发事件
const handle_scroll = () => {
  update_y()
  if (props.horizontal) update_x()
  flash_thumb()

  const vp = viewport_ref.value
  if (!vp) return
  const { scrollTop, scrollLeft, clientHeight, scrollHeight, clientWidth, scrollWidth } = vp
  emit('scroll', {
    scrollTop,
    scrollLeft,
    ratioY: scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0,
    ratioX: scrollWidth > clientWidth ? scrollLeft / (scrollWidth - clientWidth) : 0
  })
}

// ---- 纵向 thumb 拖拽:鼠标位移映射为 scrollTop ----
const on_thumb_y_down = (e: MouseEvent) => {
  e.preventDefault()
  is_dragging.value = true
  const vp = viewport_ref.value
  const thumb = thumb_y_ref.value
  if (!vp || !thumb) return

  const start_y = e.clientY
  const start_scroll = vp.scrollTop
  const thumb_h = thumb.offsetHeight
  const max_translate = vp.clientHeight - thumb_h
  const scroll_range = vp.scrollHeight - vp.clientHeight
  if (max_translate <= 0 || scroll_range <= 0) return

  const on_move = (ev: MouseEvent) => {
    const dy = ev.clientY - start_y
    // 起始位移 + 拖拽位移,夹紧到 [0, max_translate]
    const translate = Math.max(0, Math.min(max_translate, max_translate * (start_scroll / scroll_range) + dy))
    // 反推 scrollTop,通过改 scrollTop 间接移动 thumb(单一数据源)
    vp.scrollTop = (translate / max_translate) * scroll_range
  }
  const on_up = () => {
    is_dragging.value = false
    document.removeEventListener('mousemove', on_move)
    document.removeEventListener('mouseup', on_up)
    flash_thumb()
  }
  document.addEventListener('mousemove', on_move)
  document.addEventListener('mouseup', on_up)
}

// ---- 横向 thumb 拖拽:鼠标位移映射为 scrollLeft ----
const on_thumb_x_down = (e: MouseEvent) => {
  e.preventDefault()
  is_dragging.value = true
  const vp = viewport_ref.value
  const thumb = thumb_x_ref.value
  if (!vp || !thumb) return

  const start_x = e.clientX
  const start_scroll = vp.scrollLeft
  const thumb_w = thumb.offsetWidth
  const max_translate = vp.clientWidth - thumb_w
  const scroll_range = vp.scrollWidth - vp.clientWidth
  if (max_translate <= 0 || scroll_range <= 0) return

  const on_move = (ev: MouseEvent) => {
    const dx = ev.clientX - start_x
    const translate = Math.max(0, Math.min(max_translate, max_translate * (start_scroll / scroll_range) + dx))
    vp.scrollLeft = (translate / max_translate) * scroll_range
  }
  const on_up = () => {
    is_dragging.value = false
    document.removeEventListener('mousemove', on_move)
    document.removeEventListener('mouseup', on_up)
    flash_thumb()
  }
  document.addEventListener('mousemove', on_move)
  document.addEventListener('mouseup', on_up)
}

// 内容尺寸观测:内容/容器变化时实时重算 thumb
let resize_observer: ResizeObserver | null = null

// 暴露给父组件的滚动控制方法
const scroll_to = (options: ScrollToOptions) => {
  viewport_ref.value?.scrollTo({ behavior: props.smooth ? 'smooth' : 'auto', ...options })
}
const scroll_to_top = () => {
  viewport_ref.value?.scrollTo({ top: 0, behavior: props.smooth ? 'smooth' : 'auto' })
}
const scroll_to_bottom = () => {
  const vp = viewport_ref.value
  if (!vp) return
  vp.scrollTo({ top: vp.scrollHeight, behavior: props.smooth ? 'smooth' : 'auto' })
}

defineExpose({ scroll_to, scroll_to_top, scroll_to_bottom })

onMounted(() => {
  nextTick(() => {
    update_y()
    if (props.horizontal) update_x()
    if (props.always_visible) show_thumb.value = true

    // 观测视口与内容尺寸变化,重算 thumb
    if (viewport_ref.value) {
      resize_observer = new ResizeObserver(() => {
        update_y()
        if (props.horizontal) update_x()
      })
      resize_observer.observe(viewport_ref.value)
      Array.from(viewport_ref.value.children).forEach(child => {
        resize_observer!.observe(child as Element)
      })
    }
  })
})

onBeforeUnmount(() => {
  if (hide_timer) clearTimeout(hide_timer)
  resize_observer?.disconnect()
})

// 切换常驻模式时同步可见性
watch(() => props.always_visible, (v) => {
  show_thumb.value = v || show_thumb.value
})
</script>

<template>
  <div
    class="kp-scrollbar"
    :class="[
      `kp-scrollbar--${thumb_color}`,
      { 'is-horizontal': horizontal, 'is-visible': always_visible || show_thumb || is_dragging }
    ]"
    @mouseenter="flash_thumb"
    @mousemove="flash_thumb"
  >
    <!-- 真实滚动视口:高度限制作用于此处,原生滚动条被 CSS 隐藏 -->
    <div
      ref="viewport_ref"
      class="kp-scrollbar__viewport"
      :style="{
        height: normalize_size(height),
        maxHeight: normalize_size(max_height)
      }"
      @scroll="handle_scroll"
    >
      <slot />
    </div>

    <!-- 纵向滚动条 -->
    <div class="kp-scrollbar__track kp-scrollbar__track--y">
      <div
        ref="thumb_y_ref"
        class="kp-scrollbar__thumb kp-scrollbar__thumb--y"
        @mousedown="on_thumb_y_down"
      />
    </div>

    <!-- 横向滚动条 -->
    <div v-if="horizontal" class="kp-scrollbar__track kp-scrollbar__track--x">
      <div
        ref="thumb_x_ref"
        class="kp-scrollbar__thumb kp-scrollbar__thumb--x"
        @mousedown="on_thumb_x_down"
      />
    </div>
  </div>
</template>

<style scoped>
.kp-scrollbar {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
}

.kp-scrollbar__viewport {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  /* 隐藏原生滚动条(WebKit + Firefox) */
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.kp-scrollbar__viewport::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.is-horizontal .kp-scrollbar__viewport {
  overflow-x: auto;
  overflow-y: hidden;
}

/* ---- track 凹槽 ---- */
.kp-scrollbar__track {
  position: absolute;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity var(--transition-slow);
  z-index: 2;
  pointer-events: none;
}
.kp-scrollbar.is-visible .kp-scrollbar__track {
  opacity: 1;
}
.kp-scrollbar__track--y {
  top: 0;
  bottom: 0;
  right: 0;
  width: 8px;
}
.kp-scrollbar__track--x {
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
}

/* ---- thumb 发光滑块 ---- */
.kp-scrollbar__thumb {
  position: absolute;
  border-radius: var(--radius-sm);
  cursor: pointer;
  pointer-events: auto;
  transition: box-shadow var(--transition-base), opacity var(--transition-slow);
}

.kp-scrollbar__thumb--y {
  right: 1px;
  width: 6px;
  /* 切角:呼应组件库硬朗工业风 */
  clip-path: polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%);
}
.kp-scrollbar__thumb--x {
  bottom: 1px;
  height: 6px;
  clip-path: polygon(2px 0, 100% 0, 100% 100%, calc(100% - 2px) 100%, 0 calc(100% - 2px), 0 2px);
}

/* ---- 颜色变体:currentColor 驱动发光 ---- */
.kp-scrollbar--cyan .kp-scrollbar__thumb {
  background: var(--neon-cyan);
  box-shadow: 0 0 6px var(--neon-cyan);
}
.kp-scrollbar--cyan .kp-scrollbar__thumb:hover,
.kp-scrollbar--cyan .kp-scrollbar__thumb:active {
  box-shadow: var(--glow-cyan);
}

.kp-scrollbar--magenta .kp-scrollbar__thumb {
  background: var(--neon-magenta);
  box-shadow: 0 0 6px var(--neon-magenta);
}
.kp-scrollbar--magenta .kp-scrollbar__thumb:hover,
.kp-scrollbar--magenta .kp-scrollbar__thumb:active {
  box-shadow: var(--glow-magenta);
}

.kp-scrollbar--green .kp-scrollbar__thumb {
  background: var(--neon-green);
  box-shadow: 0 0 6px var(--neon-green);
}
.kp-scrollbar--green .kp-scrollbar__thumb:hover,
.kp-scrollbar--green .kp-scrollbar__thumb:active {
  box-shadow: var(--glow-green);
}

.kp-scrollbar--yellow .kp-scrollbar__thumb {
  background: var(--neon-yellow);
  box-shadow: 0 0 6px var(--neon-yellow);
}
.kp-scrollbar--yellow .kp-scrollbar__thumb:hover,
.kp-scrollbar--yellow .kp-scrollbar__thumb:active {
  box-shadow: 0 0 7px var(--neon-yellow), 0 0 14px rgba(255, 247, 0, 0.4);
}

.kp-scrollbar--purple .kp-scrollbar__thumb {
  background: var(--neon-purple);
  box-shadow: 0 0 6px var(--neon-purple);
}
.kp-scrollbar--purple .kp-scrollbar__thumb:hover,
.kp-scrollbar--purple .kp-scrollbar__thumb:active {
  box-shadow: 0 0 7px var(--neon-purple), 0 0 14px rgba(176, 38, 255, 0.4);
}
</style>
