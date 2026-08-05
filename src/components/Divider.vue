<script setup lang="ts">
// 赛博朋克分割线:横/竖,支持文字居中,霓虹渐变发光
interface Props {
  direction?: 'horizontal' | 'vertical'
  align?: 'left' | 'center' | 'right'
  text?: string
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  dashed?: boolean
}

withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  align: 'center',
  text: '',
  color: 'cyan',
  dashed: false
})
</script>

<template>
  <!-- 横向 -->
  <div
    v-if="direction === 'horizontal'"
    class="kp-divider kp-divider--horizontal"
    :class="[`kp-divider--${color}`, { 'is-dashed': dashed }]"
  >
    <span v-if="text || $slots.default" class="kp-divider__text" :class="`kp-divider__text--${align}`">
      <slot>{{ text }}</slot>
    </span>
  </div>

  <!-- 纵向 -->
  <span
    v-else
    class="kp-divider kp-divider--vertical"
    :class="[`kp-divider--${color}`, { 'is-dashed': dashed }]"
  />
</template>

<style scoped>
.kp-divider {
  font-family: var(--font-mono);
  border: 0;
}

/* 颜色变量 */
.kp-divider--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-divider--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); }
.kp-divider--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-divider--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }

/* ========== 横向 ========== */
.kp-divider--horizontal {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin: var(--space-md) 0;
}
/* 线条:用 ::before 做渐变发光底,::after 不需要 */
.kp-divider--horizontal::before {
  content: '';
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--kp-c), transparent);
  box-shadow: var(--kp-c-glow);
}
/* 虚线:改用 background 重复图案 */
.kp-divider--horizontal.is-dashed::before {
  background: repeating-linear-gradient(
    90deg,
    var(--kp-c) 0,
    var(--kp-c) 6px,
    transparent 6px,
    transparent 12px
  );
  box-shadow: none;
}

/* 文字 */
.kp-divider__text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 var(--space-md);
  background: var(--bg-base);
  color: var(--kp-c);
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow: 0 0 5px var(--kp-c);
}
.kp-divider__text--left { left: var(--space-md); }
.kp-divider__text--center { left: 50%; transform: translate(-50%, -50%); }
.kp-divider__text--right { right: var(--space-md); }

/* ========== 纵向 ========== */
.kp-divider--vertical {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin: 0 var(--space-sm);
  vertical-align: middle;
  background: linear-gradient(180deg, transparent, var(--kp-c), transparent);
  box-shadow: var(--kp-c-glow);
}
.kp-divider--vertical.is-dashed {
  background: repeating-linear-gradient(
    180deg,
    var(--kp-c) 0,
    var(--kp-c) 4px,
    transparent 4px,
    transparent 8px
  );
  box-shadow: none;
}
</style>
