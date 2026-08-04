<script setup lang="ts">
import { computed } from 'vue'

// 赛博朋克分页器:页码 / 省略号 / 快速跳转 / 每页条数
interface Props {
  modelValue?: number
  total?: number
  page_size?: number
  show_jumper?: boolean
  show_total?: boolean
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  total: 0,
  page_size: 10,
  show_jumper: true,
  show_total: true,
  color: 'cyan'
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [page: number, page_size: number]
}>()

// 总页数
const page_count = computed(() => Math.max(1, Math.ceil(props.total / props.page_size)))

// 跳转到指定页(钳制到有效范围)
const go = (p: number) => {
  const target = Math.max(1, Math.min(page_count.value, p))
  if (target === props.modelValue) return
  emit('update:modelValue', target)
  emit('change', target, props.page_size)
}

// 计算展示的页码列表:当前页附近 + 首尾 + 省略号
const page_list = computed<(number | string)[]>(() => {
  const cur = props.modelValue
  const total_pages = page_count.value
  // 总页数少时全部展示
  if (total_pages <= 7) {
    return Array.from({ length: total_pages }, (_, i) => i + 1)
  }
  const list: (number | string)[] = [1]
  // 当前页附近的页码窗口
  const start = Math.max(2, cur - 1)
  const end = Math.min(total_pages - 1, cur + 1)
  if (start > 2) list.push('...')
  for (let i = start; i <= end; i++) list.push(i)
  if (end < total_pages - 1) list.push('...')
  list.push(total_pages)
  return list
})
</script>

<template>
  <div class="kp-pagination" :class="`kp-pagination--${color}`">
    <!-- 总数 -->
    <span v-if="show_total" class="kp-pagination__total">
      共 {{ total }} 条 / {{ page_count }} 页
    </span>

    <!-- 上一页 -->
    <button
      class="kp-pagination__btn"
      :disabled="modelValue <= 1"
      @click="go(modelValue - 1)"
    >‹</button>

    <!-- 页码列表 -->
    <span
      v-for="(p, i) in page_list"
      :key="i"
      class="kp-pagination__item"
      :class="{ 'is-active': p === modelValue, 'is-ellipsis': p === '...' }"
      @click="typeof p === 'number' && go(p)"
    >{{ p }}</span>

    <!-- 下一页 -->
    <button
      class="kp-pagination__btn"
      :disabled="modelValue >= page_count"
      @click="go(modelValue + 1)"
    >›</button>

    <!-- 快速跳转 -->
    <span v-if="show_jumper" class="kp-pagination__jumper">
      跳至
      <input
        class="kp-pagination__input"
        type="number"
        min="1"
        :max="page_count"
        @keyup.enter="go(parseInt(($event.target as HTMLInputElement).value))"
      />
      页
    </span>
  </div>
</template>

<style scoped>
.kp-pagination {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-mono);
  font-size: 13px;
}

/* 颜色变量 */
.kp-pagination--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.12); }
.kp-pagination--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); --kp-c-fill: rgba(255, 46, 151, 0.12); }
.kp-pagination--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.12); }
.kp-pagination--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); --kp-c-fill: rgba(255, 247, 0, 0.12); }

/* 总数文字 */
.kp-pagination__total {
  margin-right: var(--space-sm);
  color: var(--text-muted);
  font-size: 12px;
  letter-spacing: 0.5px;
}

/* 按钮 / 页码项通用 */
.kp-pagination__btn,
.kp-pagination__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.kp-pagination__btn:hover:not(:disabled),
.kp-pagination__item:hover:not(.is-active):not(.is-ellipsis) {
  border-color: var(--kp-c);
  color: var(--kp-c);
}

/* 禁用按钮 */
.kp-pagination__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* 省略号 */
.kp-pagination__item.is-ellipsis {
  border: none;
  background: transparent;
  cursor: default;
  color: var(--text-muted);
}

/* 激活页 */
.kp-pagination__item.is-active {
  border-color: var(--kp-c);
  background: var(--kp-c-fill);
  color: var(--kp-c);
  text-shadow: 0 0 5px var(--kp-c);
  box-shadow: var(--kp-c-glow);
}

/* 跳转输入 */
.kp-pagination__jumper {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: var(--space-sm);
  color: var(--text-muted);
  font-size: 12px;
}
.kp-pagination__input {
  width: 48px;
  height: 28px;
  padding: 0 4px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 12px;
  text-align: center;
  outline: none;
  transition: border-color var(--transition-fast);
  /* 隐藏数字输入的旋钮 */
  -moz-appearance: textfield;
}
.kp-pagination__input::-webkit-outer-spin-button,
.kp-pagination__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.kp-pagination__input:focus {
  border-color: var(--kp-c);
}
</style>
