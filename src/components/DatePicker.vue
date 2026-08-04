<script lang="ts">
// 日期选择器实例序号:用于生成不重复的弹层 ID
let date_picker_id_seed = 0
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// 日历单元格:保存日期及其展示状态
interface CalendarDay {
  date: Date
  value: string
  day: number
  current_month: boolean
  today: boolean
  selected: boolean
  disabled: boolean
}

// 日期选择器属性:支持尺寸、边界、禁用、清空和错误态
interface Props {
  modelValue?: string
  placeholder?: string
  min?: string
  max?: string
  disabled?: boolean
  clearable?: boolean
  error?: string | boolean
  size?: 'sm' | 'md' | 'lg'
}

// 组件属性:补齐日期选择器默认配置
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请选择日期',
  min: '',
  max: '',
  disabled: false,
  clearable: true,
  error: false,
  size: 'md'
})

// 组件事件:同步值并通知打开、关闭、变更和清空动作
const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  clear: []
  open: []
  close: []
}>()

// 星期标题:以周一作为每周第一天
const week_labels = ['一', '二', '三', '四', '五', '六', '日']

// 两位数字格式化:用于生成稳定的日期字符串
const pad_number = (value: number) => String(value).padStart(2, '0')

// 日期格式化:将本地日期转为 YYYY-MM-DD
const format_date = (date: Date) => {
  return `${date.getFullYear()}-${pad_number(date.getMonth() + 1)}-${pad_number(date.getDate())}`
}

// 日期解析:仅接受真实存在的 YYYY-MM-DD 日期
const parse_date = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(year, month, day)
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
    ? date
    : null
}

// 月份日期计算:返回目标月份指定日期，并自动限制到月末
const date_in_month = (date: Date, offset: number) => {
  const target_month = date.getMonth() + offset
  const last_day = new Date(date.getFullYear(), target_month + 1, 0).getDate()
  return new Date(date.getFullYear(), target_month, Math.min(date.getDate(), last_day))
}

// 当天日期:用于“今天”标记和快捷选择
const today = new Date()

// 根元素引用:用于判断点击是否发生在组件外部
const root_ref = ref<HTMLElement | null>(null)

// 弹层元素引用:用于测量弹层是否超出视口
const panel_ref = ref<HTMLElement | null>(null)

// 弹层水平偏移:将弹层校正到可视区域内
const panel_shift = ref(0)

// 弹层打开状态:控制日历显示与无障碍属性
const is_open = ref(false)

// 当前展示月份:默认显示已选日期，否则显示当月
const view_date = ref(parse_date(props.modelValue) ?? today)

// 键盘活动日期:记录方向键移动后的焦点日期
const active_date = ref(parse_date(props.modelValue) ?? today)

// 弹层唯一 ID:关联输入框与日历区域
const panel_id = `kp-datepicker-panel-${++date_picker_id_seed}`

// 合法最小日期:无效配置视为未设置
const min_value = computed(() => parse_date(props.min) ? props.min : '')

// 合法最大日期:无效配置视为未设置
const max_value = computed(() => parse_date(props.max) ? props.max : '')

// 错误状态:字符串和布尔值均可触发错误样式
const error_state = computed(() => !!props.error)

// 错误提示:仅字符串错误展示文字
const error_message = computed(() => typeof props.error === 'string' ? props.error : '')

// 输入框展示值:仅展示合法的绑定日期
const display_value = computed(() => parse_date(props.modelValue) ? props.modelValue : '')

// 月份标题:展示当前日历年月
const month_title = computed(() => `${view_date.value.getFullYear()} / ${pad_number(view_date.value.getMonth() + 1)}`)

// 日期禁用判断:根据 min 和 max 限制可选范围
const is_date_disabled = (value: string) => {
  return (!!min_value.value && value < min_value.value) || (!!max_value.value && value > max_value.value)
}

// 日期边界修正:确保键盘活动日期始终落在可选范围内
const clamp_date = (date: Date) => {
  const value = format_date(date)
  if (min_value.value && value < min_value.value) return parse_date(min_value.value) ?? date
  if (max_value.value && value > max_value.value) return parse_date(max_value.value) ?? date
  return date
}

// 日历日期网格:固定生成 6 周，避免切换月份时弹层跳动
const calendar_days = computed<CalendarDay[]>(() => {
  const year = view_date.value.getFullYear()
  const month = view_date.value.getMonth()
  const first_day = new Date(year, month, 1)
  const monday_offset = (first_day.getDay() + 6) % 7

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(year, month, index - monday_offset + 1)
    const value = format_date(date)
    return {
      date,
      value,
      day: date.getDate(),
      current_month: date.getMonth() === month,
      today: value === format_date(today),
      selected: value === props.modelValue,
      disabled: is_date_disabled(value)
    }
  })
})

// 今天是否禁用:控制快捷按钮可用性
const today_disabled = computed(() => is_date_disabled(format_date(today)))

// 聚焦活动日期:在日历重绘后定位对应日期按钮
const focus_active_date = async () => {
  await nextTick()
  root_ref.value?.querySelector<HTMLButtonElement>(`[data-date="${format_date(active_date.value)}"]`)?.focus()
}

// 校正弹层位置:在不同父布局中为视口两侧保留安全间距
const adjust_panel_position = async () => {
  await nextTick()
  if (!panel_ref.value) return

  const viewport_margin = 16
  const rect = panel_ref.value.getBoundingClientRect()
  let shift = 0
  if (rect.right > window.innerWidth - viewport_margin) shift -= rect.right - window.innerWidth + viewport_margin
  if (rect.left + shift < viewport_margin) shift += viewport_margin - rect.left - shift
  panel_shift.value = shift
}

// 打开日历:同步展示月份和键盘活动日期
const open_picker = (focus_calendar = false) => {
  if (props.disabled || is_open.value) return
  const initial_date = clamp_date(parse_date(props.modelValue) ?? today)
  view_date.value = initial_date
  active_date.value = initial_date
  is_open.value = true
  emit('open')
  adjust_panel_position()
  if (focus_calendar) focus_active_date()
}

// 关闭日历:统一触发关闭事件
const close_picker = () => {
  if (!is_open.value) return
  is_open.value = false
  emit('close')
}

// 切换日历:响应输入框和日历图标点击
const toggle_picker = () => {
  if (is_open.value) close_picker()
  else open_picker()
}

// 选择日期:同步 v-model 并关闭日历
const select_date = (day: CalendarDay | Date) => {
  const date = day instanceof Date ? day : day.date
  const value = format_date(date)
  if (is_date_disabled(value)) return
  emit('update:modelValue', value)
  emit('change', value)
  view_date.value = date
  active_date.value = date
  close_picker()
}

// 清空日期:阻止点击继续触发输入框打开行为
const clear_date = (event: MouseEvent) => {
  event.stopPropagation()
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
}

// 切换月份:保留活动日期的日序并自动适配月末
const change_month = (offset: number) => {
  const next_date = clamp_date(date_in_month(active_date.value, offset))
  active_date.value = next_date
  view_date.value = next_date
  focus_active_date()
}

// 移动活动日期:处理方向键的按日、按周导航
const move_active_date = (offset: number) => {
  const next_date = new Date(active_date.value)
  next_date.setDate(next_date.getDate() + offset)
  active_date.value = clamp_date(next_date)
  view_date.value = active_date.value
  focus_active_date()
}

// 输入框键盘处理:支持打开与关闭日历
const handle_trigger_keydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    open_picker(true)
  } else if (event.key === 'Escape') {
    close_picker()
  }
}

// 日历键盘处理:支持方向键、翻月、首尾和选择操作
const handle_calendar_keydown = (event: KeyboardEvent) => {
  const key_actions: Record<string, () => void> = {
    ArrowLeft: () => move_active_date(-1),
    ArrowRight: () => move_active_date(1),
    ArrowUp: () => move_active_date(-7),
    ArrowDown: () => move_active_date(7),
    PageUp: () => change_month(-1),
    PageDown: () => change_month(1),
    Home: () => move_active_date(-((active_date.value.getDay() + 6) % 7)),
    End: () => move_active_date(6 - ((active_date.value.getDay() + 6) % 7))
  }

  if (key_actions[event.key]) {
    event.preventDefault()
    key_actions[event.key]()
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    select_date(active_date.value)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    close_picker()
  }
}

// 外部点击处理:点击组件以外区域时关闭弹层
const handle_outside_pointer = (event: PointerEvent) => {
  if (!root_ref.value?.contains(event.target as Node)) close_picker()
}

// 绑定值监听:外部更新值时同步展示月份
watch(() => props.modelValue, (value) => {
  const date = parse_date(value)
  if (date) view_date.value = date
})

// 生命周期挂载:注册外部点击和视口变化监听
onMounted(() => {
  document.addEventListener('pointerdown', handle_outside_pointer)
  window.addEventListener('resize', adjust_panel_position)
})

// 生命周期卸载:移除外部点击和视口变化监听
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handle_outside_pointer)
  window.removeEventListener('resize', adjust_panel_position)
})
</script>

<template>
  <div
    ref="root_ref"
    class="kp-datepicker-wrap"
    :class="{ 'is-error': error_state, 'is-disabled': disabled, 'is-open': is_open }"
  >
    <div class="kp-datepicker" :class="`kp-datepicker--${size}`" @click="toggle_picker">
      <input
        class="kp-datepicker__input"
        type="text"
        role="combobox"
        readonly
        :value="display_value"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-expanded="is_open"
        :aria-controls="panel_id"
        aria-haspopup="dialog"
        @keydown="handle_trigger_keydown"
      />

      <button
        v-if="clearable && display_value && !disabled"
        class="kp-datepicker__icon-button kp-datepicker__clear"
        type="button"
        aria-label="清空日期"
        title="清空日期"
        @click="clear_date"
      >×</button>

      <button
        class="kp-datepicker__icon-button kp-datepicker__calendar-icon"
        type="button"
        :disabled="disabled"
        aria-label="打开日期选择器"
        title="打开日期选择器"
        tabindex="-1"
      >▦</button>

      <span class="kp-datepicker__bar" />
    </div>

    <Transition name="kp-calendar">
      <div
        v-if="is_open"
        :id="panel_id"
        ref="panel_ref"
        class="kp-datepicker__panel"
        role="dialog"
        aria-label="选择日期"
        :style="{ '--kp-panel-shift': `${panel_shift}px` }"
        @keydown="handle_calendar_keydown"
      >
        <div class="kp-datepicker__panel-line" />

        <header class="kp-datepicker__header">
          <button
            class="kp-datepicker__nav"
            type="button"
            aria-label="上个月"
            title="上个月"
            @click="change_month(-1)"
          >‹</button>
          <strong class="kp-datepicker__month">{{ month_title }}</strong>
          <button
            class="kp-datepicker__nav"
            type="button"
            aria-label="下个月"
            title="下个月"
            @click="change_month(1)"
          >›</button>
        </header>

        <div class="kp-datepicker__week" aria-hidden="true">
          <span v-for="label in week_labels" :key="label">{{ label }}</span>
        </div>

        <div class="kp-datepicker__grid" role="grid" aria-label="日期">
          <button
            v-for="day in calendar_days"
            :key="day.value"
            class="kp-datepicker__day"
            :class="{
              'is-outside': !day.current_month,
              'is-today': day.today,
              'is-selected': day.selected
            }"
            type="button"
            role="gridcell"
            :data-date="day.value"
            :disabled="day.disabled"
            :tabindex="day.value === format_date(active_date) ? 0 : -1"
            :aria-label="day.value"
            :aria-selected="day.selected"
            @focus="active_date = day.date"
            @click="select_date(day)"
          >
            <span>{{ day.day }}</span>
          </button>
        </div>

        <footer class="kp-datepicker__footer">
          <span class="kp-datepicker__hint">DATE::LOCAL</span>
          <button
            class="kp-datepicker__today"
            type="button"
            :disabled="today_disabled"
            @click="select_date(today)"
          >今天</button>
        </footer>
      </div>
    </Transition>

    <p v-if="error_message" class="kp-datepicker__error">{{ error_message }}</p>
  </div>
</template>

<style scoped>
.kp-datepicker-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.kp-datepicker {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: var(--bg-input);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
}

.kp-datepicker:hover,
.kp-datepicker:focus-within,
.kp-datepicker-wrap.is-open .kp-datepicker {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 7px rgba(0, 240, 255, 0.22), inset 0 0 7px rgba(0, 240, 255, 0.05);
}

.kp-datepicker__input {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: inherit;
  caret-color: transparent;
  cursor: pointer;
}

.kp-datepicker__input::placeholder { color: var(--text-dim); }

.kp-datepicker__icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  cursor: pointer;
  transition: color var(--transition-fast), text-shadow var(--transition-fast);
}

.kp-datepicker__clear { font-size: 17px; }
.kp-datepicker__clear:hover { color: var(--neon-red); text-shadow: 0 0 6px var(--neon-red); }
.kp-datepicker__calendar-icon { font-size: 18px; }
.kp-datepicker:hover .kp-datepicker__calendar-icon,
.kp-datepicker-wrap.is-open .kp-datepicker__calendar-icon {
  color: var(--neon-cyan);
  text-shadow: 0 0 7px var(--neon-cyan);
}

.kp-datepicker__bar {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
  transform: translateX(-50%);
  transition: width var(--transition-slow);
  pointer-events: none;
}

.kp-datepicker-wrap.is-open .kp-datepicker__bar,
.kp-datepicker:focus-within .kp-datepicker__bar { width: 100%; }

.kp-datepicker--sm { height: 32px; padding: 0 8px 0 10px; font-size: var(--font-size-xs); }
.kp-datepicker--md { height: 40px; padding: 0 10px 0 14px; font-size: var(--font-size-sm); }
.kp-datepicker--lg { height: 48px; padding: 0 12px 0 18px; font-size: var(--font-size-md); }

.kp-datepicker__panel {
  position: absolute;
  z-index: 50;
  top: calc(100% + 8px);
  left: 0;
  width: min(320px, calc(100vw - 32px));
  padding: 14px;
  overflow: hidden;
  background:
    linear-gradient(rgba(0, 240, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.025) 1px, transparent 1px),
    var(--bg-elevated);
  background-size: 16px 16px;
  border: 1px solid var(--border-bright);
  border-radius: var(--radius-md);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.55), 0 0 18px rgba(0, 240, 255, 0.14);
  transform: translateX(var(--kp-panel-shift, 0));
}

.kp-datepicker__panel-line {
  position: absolute;
  top: 0;
  left: 14%;
  width: 72%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
  box-shadow: 0 0 8px var(--neon-cyan);
}

.kp-datepicker__header {
  display: grid;
  grid-template-columns: 32px 1fr 32px;
  align-items: center;
  margin-bottom: 10px;
}

.kp-datepicker__month {
  color: var(--text-primary);
  font-size: 14px;
  letter-spacing: 0;
  text-align: center;
}

.kp-datepicker__nav {
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);
}

.kp-datepicker__nav:hover,
.kp-datepicker__nav:focus-visible {
  color: var(--neon-cyan);
  border-color: rgba(0, 240, 255, 0.4);
  background: rgba(0, 240, 255, 0.08);
  outline: 0;
}

.kp-datepicker__week,
.kp-datepicker__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.kp-datepicker__week {
  margin-bottom: 4px;
  color: var(--text-muted);
  font-size: 10px;
  text-align: center;
}

.kp-datepicker__week span { padding: 4px 0; }

.kp-datepicker__grid { gap: 2px; }

.kp-datepicker__day {
  position: relative;
  aspect-ratio: 1;
  min-width: 0;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 12px;
  cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast), box-shadow var(--transition-fast);
}

.kp-datepicker__day:hover:not(:disabled),
.kp-datepicker__day:focus-visible {
  color: var(--neon-cyan);
  border-color: rgba(0, 240, 255, 0.55);
  background: rgba(0, 240, 255, 0.08);
  outline: 0;
}

.kp-datepicker__day.is-outside { color: var(--text-muted); opacity: 0.5; }

.kp-datepicker__day.is-today:not(.is-selected) {
  color: var(--neon-green);
  border-color: rgba(0, 255, 159, 0.6);
  box-shadow: inset 0 0 8px rgba(0, 255, 159, 0.08);
}

.kp-datepicker__day.is-selected {
  color: var(--bg-base);
  background: var(--neon-cyan);
  border-color: var(--neon-cyan);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.65);
  font-weight: 700;
}

.kp-datepicker__day:disabled {
  color: var(--text-muted);
  opacity: 0.22;
  cursor: not-allowed;
  text-decoration: line-through;
}

.kp-datepicker__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 31px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
}

.kp-datepicker__hint {
  color: var(--text-muted);
  font-size: 9px;
  letter-spacing: 0;
}

.kp-datepicker__today {
  min-width: 52px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid rgba(0, 255, 159, 0.45);
  border-radius: var(--radius-sm);
  background: rgba(0, 255, 159, 0.06);
  color: var(--neon-green);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  transition: background var(--transition-fast), box-shadow var(--transition-fast);
}

.kp-datepicker__today:hover:not(:disabled),
.kp-datepicker__today:focus-visible {
  background: rgba(0, 255, 159, 0.12);
  box-shadow: 0 0 8px rgba(0, 255, 159, 0.3);
  outline: 0;
}

.kp-datepicker__today:disabled { opacity: 0.25; cursor: not-allowed; }

.kp-datepicker-wrap.is-error .kp-datepicker {
  border-color: var(--neon-red);
  box-shadow: 0 0 6px rgba(255, 0, 60, 0.2), inset 0 0 6px rgba(255, 0, 60, 0.05);
}

.kp-datepicker-wrap.is-error .kp-datepicker__bar {
  width: 100%;
  background: linear-gradient(90deg, transparent, var(--neon-red), transparent);
}

.kp-datepicker__error {
  color: var(--neon-red);
  font-size: var(--font-size-xs);
  text-shadow: 0 0 6px rgba(255, 0, 60, 0.5);
}

.kp-datepicker-wrap.is-disabled { opacity: 0.4; pointer-events: none; }

.kp-calendar-enter-active,
.kp-calendar-leave-active { transition: opacity 160ms ease, transform 160ms ease; }
.kp-calendar-enter-from,
.kp-calendar-leave-to { opacity: 0; transform: translate(var(--kp-panel-shift, 0), -5px); }

@media (max-width: 480px) {
  .kp-datepicker__panel {
    right: 0;
    left: auto;
    padding: 12px;
  }
  .kp-datepicker__day { font-size: 11px; }
}

@media (prefers-reduced-motion: reduce) {
  .kp-calendar-enter-active,
  .kp-calendar-leave-active { transition: none; }
}
</style>
