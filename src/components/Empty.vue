<script setup lang="ts">
import { computed } from 'vue'

// 赛博朋克空状态:无数据占位,内置 SVG 插图预设,支持自定义图文
interface Props {
  description?: string
  image?: 'default' | 'network' | 'search' | 'lock'
  size?: 'sm' | 'md' | 'lg'
  color?: 'cyan' | 'magenta' | 'green' | 'yellow' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  description: '暂无数据',
  image: 'default',
  size: 'md',
  color: 'cyan'
})

// 各预设的 SVG 路径(统一 64x64 视口,stroke 描边风格)
const svg_paths: Record<string, string> = {
  // 空盒子
  default: 'M10 22 L32 12 L54 22 L32 32 Z M10 22 V44 L32 54 L32 32 M54 22 V44 L32 54',
  // 断网:信号塔 + 斜线
  network: 'M32 52 V36 M22 40 A14 14 0 0 1 42 40 M16 34 A22 22 0 0 1 48 34 M10 50 L54 14',
  // 搜索无结果:放大镜 + 横线
  search: 'M24 26 A12 12 0 1 1 48 26 A12 12 0 1 1 24 26 Z M46 30 L56 40 M28 26 H44',
  // 锁定:挂锁
  lock: 'M18 30 H46 V52 H18 Z M24 30 V22 A8 8 0 0 1 40 22 V30 M32 38 V44'
}
const path = computed(() => svg_paths[props.image])
</script>

<template>
  <div class="kp-empty" :class="[`kp-empty--${color}`, `kp-empty--${size}`]">
    <!-- 插图:可被 image 插槽覆盖 -->
    <div class="kp-empty__image">
      <slot name="image">
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path
            :d="path"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </slot>
    </div>

    <!-- 描述文字:可被默认插槽覆盖 -->
    <p v-if="description || $slots.default" class="kp-empty__desc">
      <slot>{{ description }}</slot>
    </p>

    <!-- 额外操作区 -->
    <div v-if="$slots.action" class="kp-empty__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.kp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl) var(--space-lg);
  font-family: var(--font-mono);
  color: var(--text-muted);
}

/* 颜色变量 */
.kp-empty--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-empty--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-empty--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-empty--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }
.kp-empty--red     { --kp-c: var(--neon-red);     --kp-c-glow: var(--glow-red); }

/* 插图 */
.kp-empty__image {
  color: var(--kp-c);
  filter: drop-shadow(0 0 6px var(--kp-c));
  opacity: 0.85;
  /* 轻微呼吸动画,营造"待机"感 */
  animation: kp-pulse 2.4s ease-in-out infinite;
}
.kp-empty__image svg {
  display: block;
}
.kp-empty--sm .kp-empty__image svg { width: 48px; height: 48px; }
.kp-empty--md .kp-empty__image svg { width: 64px; height: 64px; }
.kp-empty--lg .kp-empty__image svg { width: 88px; height: 88px; }

/* 描述文字 */
.kp-empty__desc {
  font-size: 13px;
  letter-spacing: 1px;
  text-align: center;
  line-height: 1.6;
}
.kp-empty--sm .kp-empty__desc { font-size: 12px; }
.kp-empty--lg .kp-empty__desc { font-size: 15px; }

/* 操作区 */
.kp-empty__action {
  margin-top: var(--space-xs);
}
</style>
