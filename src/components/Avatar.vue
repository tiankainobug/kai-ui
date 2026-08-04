<script setup lang="ts">
import { ref, computed } from 'vue'

// 赛博朋克头像:图片 / 文字 / 图标,圆形 / 方形,可叠加徽标
interface Props {
  src?: string
  text?: string
  icon?: string
  size?: 'sm' | 'md' | 'lg'
  shape?: 'circle' | 'square'
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  text: '',
  icon: '',
  size: 'md',
  shape: 'circle',
  color: 'cyan',
  bordered: true
})

// 图片加载失败时回退到文字/图标
const img_error = ref(false)
const show_img = computed(() => props.src && !img_error.value)

// 文字取首字符(最多2字符),便于多字昵称展示
const display_text = computed(() => {
  if (props.text) return props.text.slice(0, 2)
  return ''
})

const on_error = () => { img_error.value = true }
</script>

<template>
  <span
    class="kp-avatar"
    :class="[
      `kp-avatar--${size}`,
      `kp-avatar--${shape}`,
      `kp-avatar--${color}`,
      { 'is-bordered': bordered }
    ]"
  >
    <!-- 图片头像 -->
    <img
      v-if="show_img"
      class="kp-avatar__img"
      :src="src"
      alt="avatar"
      @error="on_error"
    />
    <!-- 文字头像 -->
    <span v-else-if="display_text" class="kp-avatar__text">{{ display_text }}</span>
    <!-- 图标头像 -->
    <span v-else class="kp-avatar__icon">{{ icon || '?' }}</span>

    <!-- 叠加徽标(默认插槽用于 Badge 等组件包裹) -->
    <slot name="badge" />
  </span>
</template>

<style scoped>
.kp-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--kp-c-fill);
  border: 1px solid var(--kp-c);
  font-family: var(--font-mono);
  user-select: none;
}

/* 颜色变量 */
.kp-avatar--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.12); }
.kp-avatar--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); --kp-c-fill: rgba(255, 46, 151, 0.12); }
.kp-avatar--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.12); }
.kp-avatar--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); --kp-c-fill: rgba(255, 247, 0, 0.12); }

/* 形状 */
.kp-avatar--circle { border-radius: 50%; }
.kp-avatar--square { border-radius: var(--radius-md); }

/* 尺寸 */
.kp-avatar--sm { width: 32px; height: 32px; font-size: 12px; }
.kp-avatar--md { width: 40px; height: 40px; font-size: 14px; }
.kp-avatar--lg { width: 56px; height: 56px; font-size: 18px; }

/* 边框发光 */
.kp-avatar.is-bordered {
  box-shadow: var(--kp-c-glow);
}

/* 图片 */
.kp-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 文字 */
.kp-avatar__text {
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--kp-c);
  text-shadow: 0 0 4px var(--kp-c);
}

/* 图标 */
.kp-avatar__icon {
  color: var(--kp-c);
  text-shadow: 0 0 4px var(--kp-c);
}
</style>
