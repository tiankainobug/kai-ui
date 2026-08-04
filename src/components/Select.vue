<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

// 赛博朋克下拉选择:单选 / 多选 / 可搜索 / 可清空
interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | (string | number)[]
  options?: Option[]
  multiple?: boolean
  filterable?: boolean
  clearable?: boolean
  disabled?: boolean
  placeholder?: string
  color?: 'cyan' | 'magenta' | 'green' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  options: () => [],
  multiple: false,
  filterable: false,
  clearable: false,
  disabled: false,
  placeholder: '请选择',
  color: 'cyan',
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[] | undefined]
  change: [value: string | number | (string | number)[] | undefined]
}>()

const is_multiple = computed(() => props.multiple)

// 面板开关 + 搜索关键字
const open = ref(false)
const query = ref('')
const root_ref = ref<HTMLElement | null>(null)
const search_ref = ref<HTMLInputElement | null>(null)

// 当前选中值归一化为数组,便于多选判断包含关系
const value_arr = computed<(string | number)[]>(() => {
  if (is_multiple.value) return Array.isArray(props.modelValue) ? [...props.modelValue] : []
  // 单选:modelValue 视为单值,排除 undefined / 数组后包装
  return props.modelValue === undefined || Array.isArray(props.modelValue) ? [] : [props.modelValue]
})

// 是否有选中值
const has_value = computed(() => value_arr.value.length > 0)

// 单选时展示的标签
const selected_label = computed(() => {
  if (is_multiple.value || !has_value.value) return ''
  const opt = props.options.find(o => o.value === props.modelValue)
  return opt ? opt.label : String(props.modelValue)
})

// 搜索过滤:filterable 开启且有关键字时按 label 包含匹配
const filtered_options = computed(() => {
  if (!props.filterable || !query.value) return props.options
  const q = query.value.toLowerCase()
  return props.options.filter(o => o.label.toLowerCase().includes(q))
})

const is_selected = (val: string | number) => value_arr.value.includes(val)

const toggle_open = () => {
  if (props.disabled) return
  open.value = !open.value
  if (open.value && props.filterable) {
    // 展开时聚焦搜索框,清空上次关键字
    query.value = ''
    nextTick(() => search_ref.value?.focus())
  }
}

const close_panel = () => {
  open.value = false
  query.value = ''
}

const select_option = (opt: Option) => {
  if (opt.disabled) return
  let next: string | number | (string | number)[]
  if (is_multiple.value) {
    // 多选:已选则移除,未选则追加
    next = is_selected(opt.value)
      ? value_arr.value.filter(v => v !== opt.value)
      : [...value_arr.value, opt.value]
  } else {
    next = opt.value
    close_panel()
  }
  emit('update:modelValue', next)
  emit('change', next)
}

// 多选标签移除:阻止冒泡以免触发 toggle
const remove_tag = (val: string | number, e: MouseEvent) => {
  e.stopPropagation()
  if (props.disabled) return
  const next = value_arr.value.filter(v => v !== val)
  emit('update:modelValue', next)
  emit('change', next)
}

// 清空:阻止冒泡,单选置 undefined,多选置空数组
const clear_value = (e: MouseEvent) => {
  e.stopPropagation()
  if (props.disabled) return
  const next: (string | number)[] | undefined = is_multiple.value ? [] : undefined
  emit('update:modelValue', next)
  emit('change', next)
}

// 点击组件外部关闭面板
const handle_doc_click = (e: MouseEvent) => {
  if (root_ref.value && !root_ref.value.contains(e.target as Node)) {
    close_panel()
  }
}
// Escape 关闭
const handle_keydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && open.value) close_panel()
}

onMounted(() => {
  document.addEventListener('mousedown', handle_doc_click)
  document.addEventListener('keydown', handle_keydown)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', handle_doc_click)
  document.removeEventListener('keydown', handle_keydown)
})
</script>

<template>
  <div
    ref="root_ref"
    class="kp-select"
    :class="[
      `kp-select--${color}`,
      `kp-select--${size}`,
      { 'is-open': open, 'is-disabled': disabled, 'is-multiple': is_multiple }
    ]"
  >
    <!-- 触发器 -->
    <div class="kp-select__trigger" @click="toggle_open">
      <div class="kp-select__values">
        <!-- 多选:标签列表 -->
        <template v-if="is_multiple">
          <span v-if="!has_value" class="kp-select__placeholder">{{ placeholder }}</span>
          <span v-for="v in value_arr" :key="v" class="kp-select__tag">
            {{ options.find(o => o.value === v)?.label ?? v }}
            <i v-if="!disabled" class="kp-select__tag-close" @click="remove_tag(v, $event)">×</i>
          </span>
        </template>
        <!-- 单选 -->
        <template v-else>
          <span v-if="has_value" class="kp-select__single">{{ selected_label }}</span>
          <span v-else class="kp-select__placeholder">{{ placeholder }}</span>
        </template>
      </div>

      <!-- 清空按钮:有值、可清空、非禁用时显示 -->
      <i
        v-if="clearable && has_value && !disabled"
        class="kp-select__clear"
        @click="clear_value"
      >×</i>
      <!-- 下拉箭头 -->
      <span v-else class="kp-select__arrow" :class="{ 'is-up': open }">▾</span>
    </div>

    <!-- 下拉面板 -->
    <transition name="kp-select-panel">
      <div v-if="open" class="kp-select__panel">
        <!-- 搜索框 -->
        <div v-if="filterable" class="kp-select__search">
          <input
            ref="search_ref"
            v-model="query"
            class="kp-select__search-input"
            type="text"
            placeholder="搜索..."
          />
        </div>
        <!-- 选项列表 -->
        <ul class="kp-select__list">
          <li v-if="filtered_options.length === 0" class="kp-select__empty">无匹配项</li>
          <li
            v-for="opt in filtered_options"
            :key="opt.value"
            class="kp-select__option"
            :class="{ 'is-selected': is_selected(opt.value), 'is-disabled': opt.disabled }"
            @click="select_option(opt)"
          >
            <span class="kp-select__option-label">{{ opt.label }}</span>
            <!-- 选中标记 -->
            <span v-if="is_selected(opt.value)" class="kp-select__option-check">✓</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.kp-select {
  position: relative;
  display: inline-block;
  width: 240px;
  font-family: var(--font-mono);
}

/* 颜色变量 */
.kp-select--cyan    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan);    --kp-c-fill: rgba(0, 240, 255, 0.12); }
.kp-select--magenta { --kp-c: var(--neon-magenta); --kp-c-glow: var(--glow-magenta); --kp-c-fill: rgba(255, 46, 151, 0.12); }
.kp-select--green   { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green);   --kp-c-fill: rgba(0, 255, 159, 0.12); }
.kp-select--yellow  { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4), 0 0 28px rgba(255, 247, 0, 0.2); --kp-c-fill: rgba(255, 247, 0, 0.12); }

/* ========== 触发器 ========== */
.kp-select__trigger {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0 var(--space-sm);
  border: 1px solid var(--border-bright);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  cursor: pointer;
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
}

.kp-select--sm .kp-select__trigger { height: 28px; font-size: var(--font-size-xs); }
.kp-select--md .kp-select__trigger { height: 34px; font-size: var(--font-size-sm); }
.kp-select--lg .kp-select__trigger { height: 40px; font-size: var(--font-size-md); }

.kp-select__trigger:hover { border-color: var(--kp-c); }
.kp-select.is-open .kp-select__trigger {
  border-color: var(--kp-c);
  box-shadow: 0 0 0 1px var(--kp-c), var(--kp-c-glow);
}

.kp-select__values {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.kp-select__placeholder {
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

.kp-select__single {
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多选标签 */
.kp-select__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 6px;
  border: 1px solid var(--kp-c);
  border-radius: var(--radius-sm);
  background: var(--kp-c-fill);
  color: var(--kp-c);
  font-size: 11px;
  line-height: 1.5;
}
.kp-select__tag-close {
  font-style: normal;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}
.kp-select__tag-close:hover { opacity: 1; }

/* 清空 / 箭头 */
.kp-select__clear,
.kp-select__arrow {
  flex-shrink: 0;
  color: var(--text-muted);
  font-style: normal;
  font-size: 14px;
  transition: color var(--transition-fast), transform var(--transition-normal);
}
.kp-select__clear { cursor: pointer; }
.kp-select__clear:hover { color: var(--neon-red); }
.kp-select__arrow.is-up { transform: rotate(180deg); color: var(--kp-c); }

/* ========== 下拉面板 ========== */
.kp-select__panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--bg-elevated);
  border: 1px solid var(--kp-c);
  border-radius: var(--radius-sm);
  box-shadow: var(--kp-c-glow), 0 8px 24px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

/* 搜索框 */
.kp-select__search {
  padding: var(--space-xs);
  border-bottom: 1px solid var(--border-color);
}
.kp-select__search-input {
  width: 100%;
  height: 26px;
  padding: 0 var(--space-xs);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 12px;
  outline: none;
  transition: border-color var(--transition-fast);
}
.kp-select__search-input:focus { border-color: var(--kp-c); }

/* 选项列表 */
.kp-select__list {
  max-height: 200px;
  overflow-y: auto;
  padding: var(--space-xs) 0;
  list-style: none;
}

.kp-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px var(--space-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}
.kp-select__option:hover:not(.is-disabled) {
  background: var(--kp-c-fill);
  color: var(--text-primary);
}
.kp-select__option.is-selected {
  color: var(--kp-c);
  background: var(--kp-c-fill);
}
.kp-select__option.is-disabled {
  color: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.5;
}
.kp-select__option-check {
  color: var(--kp-c);
  text-shadow: 0 0 4px var(--kp-c);
}

.kp-select__empty {
  padding: var(--space-md);
  text-align: center;
  color: var(--text-muted);
  font-size: 12px;
}

/* 面板展开/收起动画 */
.kp-select-panel-enter-active,
.kp-select-panel-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
  transform-origin: top;
}
.kp-select-panel-enter-from,
.kp-select-panel-leave-to {
  opacity: 0;
  transform: scaleY(0.9) translateY(-4px);
}

/* ========== 禁用 ========== */
.kp-select.is-disabled {
  cursor: not-allowed;
  opacity: 0.4;
  filter: grayscale(0.6);
}
.kp-select.is-disabled .kp-select__trigger { cursor: not-allowed; }
</style>
