<script lang="ts">
// 日期时间选择器实例序号:用于生成不重复的弹层 ID
let date_time_picker_id_seed = 0
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

// 时间步进分量:时、分、秒三类
type TimeUnit = 'hour' | 'minute' | 'second'

// 日期时间选择器属性:在日期基础上增加秒级精度开关
interface Props {
  modelValue?: string
  placeholder?: string
  min?: string
  max?: string
  disabled?: boolean
  clearable?: boolean
  error?: string | boolean
  size?: 'sm' | 'md' | 'lg'
  showSeconds?: boolean
}

// 组件属性:补齐日期时间选择器默认配置
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请选择日期时间',
  min: '',
  max: '',
  disabled: false,
  clearable: true,
  error: false,
  size: 'md',
  showSeconds: false
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

// 两位数字格式化:用于生成稳定的日期时间字符串
const pad_number = (value: number) => String(value).padStart(2, '0')

// 日期部分格式化:将本地日期转为 YYYY-MM-DD
const format_date = (date: Date) => {
  return `${date.getFullYear()}-${pad_number(date.getMonth() + 1)}-${pad_number(date.getDate())}`
}

// 完整日期时间格式化:YYYY-MM-DD HH:mm[:ss],秒级由 showSeconds 决定
const format_date_time = (date: Date) => {
  const time = props.showSeconds
    ? `${pad_number(date.getHours())}:${pad_number(date.getMinutes())}:${pad_number(date.getSeconds())}`
    : `${pad_number(date.getHours())}:${pad_number(date.getMinutes())}`
  return `${format_date(date)} ${time}`
}

// 解析完整日期时间字符串:仅接受真实存在的 YYYY-MM-DD HH:mm[:ss]
const parse_date_time = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const hour = Number(match[4])
  const minute = Number(match[5])
  const second = match[6] ? Number(match[6]) : 0
  const date = new Date(year, month, day, hour, minute, second)
  // 校验各字段真实存在,避免 2-31 等无效日期被自动进位
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute ||
    date.getSeconds() !== second
  ) return null
  return date
}

// 月份日期计算:返回目标月份指定日期,并自动限制到月末
const date_in_month = (date: Date, offset: number) => {
  const target_month = date.getMonth() + offset
  const last_day = new Date(date.getFullYear(), target_month + 1, 0).getDate()
  return new Date(date.getFullYear(), target_month, Math.min(date.getDate(), last_day))
}

// 数值钳制:将字符串解析后限定在 [min, max] 区间
const clamp_int = (value: string, min: number, max: number) => {
  let num = parseInt(value, 10)
  if (Number.isNaN(num)) num = min
  return Math.max(min, Math.min(max, num))
}

// 当天时刻:用于"此刻"快捷选择和今天标记
const today = new Date()

// 根元素引用:用于判断点击是否发生在组件外部
const root_ref = ref<HTMLElement | null>(null)

// 弹层元素引用:用于测量弹层是否超出视口
const panel_ref = ref<HTMLElement | null>(null)

// 弹层水平偏移:将弹层校正到可视区域内
const panel_shift = ref(0)

// 弹层打开状态:控制面板显示与无障碍属性
const is_open = ref(false)

// 当前展示月份:默认指向已选值所在月,否则显示当月
const view_date = ref(parse_date_time(props.modelValue) ?? today)

// 键盘活动日期:记录方向键移动后的焦点日期
const active_date = ref(parse_date_time(props.modelValue) ?? today)

// 草稿日期时间:面板内的临时选择,确认后才同步到 modelValue
const draft = ref(parse_date_time(props.modelValue) ?? new Date())

// 弹层唯一 ID:关联输入框与面板区域
const panel_id = `kp-datetime-panel-${++date_time_picker_id_seed}`

// 合法最小值:无效配置视为未设置
const min_date = computed(() => parse_date_time(props.min))

// 合法最大值:无效配置视为未设置
const max_date = computed(() => parse_date_time(props.max))

// 错误状态:字符串和布尔值均可触发错误样式
const error_state = computed(() => !!props.error)

// 错误提示:仅字符串错误展示文字
const error_message = computed(() => typeof props.error === 'string' ? props.error : '')

// 输入框展示值:仅展示合法的绑定值
const display_value = computed(() => {
  const date = parse_date_time(props.modelValue)
  return date ? format_date_time(date) : ''
})

// 月份标题:展示当前日历年月
const month_title = computed(() => `${view_date.value.getFullYear()} / ${pad_number(view_date.value.getMonth() + 1)}`)

// 草稿时间各分量:用于时间步进器展示
const draft_hour = computed(() => pad_number(draft.value.getHours()))
const draft_minute = computed(() => pad_number(draft.value.getMinutes()))
const draft_second = computed(() => pad_number(draft.value.getSeconds()))

// 时间步进字段列表:根据 showSeconds 动态决定是否含秒
const time_fields = computed(() => {
  const fields: { unit: TimeUnit; label: string; value: string }[] = [
    { unit: 'hour', label: '小时', value: draft_hour.value },
    { unit: 'minute', label: '分钟', value: draft_minute.value }
  ]
  if (props.showSeconds) fields.push({ unit: 'second', label: '秒', value: draft_second.value })
  return fields
})

// 日期禁用判断:按日期粒度比较 min/max 的日期部分
const is_date_disabled = (value: string) => {
  if (min_date.value && value < format_date(min_date.value)) return true
  if (max_date.value && value > format_date(max_date.value)) return true
  return false
}

// 草稿是否越界:确认按钮可用性依据,精确到时分秒
const draft_out_of_range = computed(() => {
  if (min_date.value && draft.value < min_date.value) return true
  if (max_date.value && draft.value > max_date.value) return true
  return false
})

// 日历日期网格:固定生成 6 周,避免切换月份时弹层跳动
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
      // 选中态跟随草稿日期,而非已确认的 modelValue
      selected: value === format_date(draft.value),
      disabled: is_date_disabled(value)
    }
  })
})

// 此刻是否越界:控制快捷按钮可用性
const now_disabled = computed(() => {
  if (min_date.value && today < min_date.value) return true
  if (max_date.value && today > max_date.value) return true
  return false
})

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

// 打开面板:用已选值或当前时刻初始化草稿
const open_picker = (focus_calendar = false) => {
  if (props.disabled || is_open.value) return
  const initial = parse_date_time(props.modelValue) ?? new Date()
  draft.value = new Date(initial)
  view_date.value = new Date(initial.getFullYear(), initial.getMonth(), 1)
  active_date.value = new Date(initial)
  is_open.value = true
  emit('open')
  adjust_panel_position()
  if (focus_calendar) focus_active_date()
}

// 关闭面板:丢弃未确认的草稿改动
const close_picker = () => {
  if (!is_open.value) return
  is_open.value = false
  emit('close')
}

// 切换面板:响应输入框和图标点击
const toggle_picker = () => {
  if (is_open.value) close_picker()
  else open_picker()
}

// 选择日期:仅更新草稿日期部分,不关闭面板(区别于 DatePicker)
const select_date = (day: CalendarDay | Date) => {
  const date = day instanceof Date ? day : day.date
  if (is_date_disabled(format_date(date))) return
  const next = new Date(draft.value)
  next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
  draft.value = next
  active_date.value = new Date(date)
  view_date.value = new Date(date.getFullYear(), date.getMonth(), 1)
}

// 时间分量步进:各分量在自身范围内循环,不跨级进位
const step_time = (unit: TimeUnit, delta: number) => {
  const next = new Date(draft.value)
  if (unit === 'hour') next.setHours((next.getHours() + delta + 24) % 24)
  else if (unit === 'minute') next.setMinutes((next.getMinutes() + delta + 60) % 60)
  else next.setSeconds((next.getSeconds() + delta + 60) % 60)
  draft.value = next
}

// 提交手动输入的时间值:失焦或回车时钳制到合法范围并同步草稿
const commit_time = (unit: TimeUnit, event: Event) => {
  const input = event.target as HTMLInputElement
  const num = clamp_int(input.value, 0, unit === 'hour' ? 23 : 59)
  const next = new Date(draft.value)
  if (unit === 'hour') next.setHours(num)
  else if (unit === 'minute') next.setMinutes(num)
  else next.setSeconds(num)
  draft.value = next
}

// 滚轮步进:向上滚加、向下滚减
const on_time_wheel = (event: WheelEvent, unit: TimeUnit) => {
  step_time(unit, event.deltaY < 0 ? 1 : -1)
}

// 聚焦时全选:便于直接覆盖输入
const select_text = (event: FocusEvent) => (event.target as HTMLInputElement).select()

// 确认选择:草稿落入边界内才提交并关闭
const confirm = () => {
  if (draft_out_of_range.value) return
  const value = format_date_time(draft.value)
  emit('update:modelValue', value)
  emit('change', value)
  close_picker()
}

// 此刻快捷:将草稿置为当前时刻
const select_now = () => {
  if (now_disabled.value) return
  const now = new Date()
  draft.value = now
  active_date.value = new Date(now)
  view_date.value = new Date(now.getFullYear(), now.getMonth(), 1)
}

// 清空日期时间:阻止点击继续触发输入框打开行为
const clear_value = (event: MouseEvent) => {
  event.stopPropagation()
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
}

// 切换月份:保留活动日期的日序并自动适配月末
const change_month = (offset: number) => {
  const next_date = date_in_month(active_date.value, offset)
  active_date.value = next_date
  view_date.value = new Date(next_date.getFullYear(), next_date.getMonth(), 1)
  focus_active_date()
}

// 移动活动日期:处理方向键的按日、按周导航
const move_active_date = (offset: number) => {
  const next_date = new Date(active_date.value)
  next_date.setDate(next_date.getDate() + offset)
  active_date.value = next_date
  view_date.value = new Date(next_date.getFullYear(), next_date.getMonth(), 1)
  focus_active_date()
}

// 输入框键盘处理:支持打开与关闭面板
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
    // 选日期不关闭,允许继续调整时间
    select_date(active_date.value)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    close_picker()
  }
}

// 外部点击处理:点击组件以外区域时关闭面板
const handle_outside_pointer = (event: PointerEvent) => {
  if (!root_ref.value?.contains(event.target as Node)) close_picker()
}

// 绑定值监听:外部更新值时同步展示月份(仅面板关闭时,避免干扰草稿)
watch(() => props.modelValue, (value) => {
  if (is_open.value) return
  const date = parse_date_time(value)
  if (date) view_date.value = new Date(date.getFullYear(), date.getMonth(), 1)
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
    class="kp-datetime-wrap"
    :class="{ 'is-error': error_state, 'is-disabled': disabled, 'is-open': is_open }"
  >
    <div class="kp-datetime" :class="`kp-datetime--${size}`" @click="toggle_picker">
      <input
        class="kp-datetime__input"
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
        class="kp-datetime__icon-button kp-datetime__clear"
        type="button"
        aria-label="清空日期时间"
        title="清空日期时间"
        @click="clear_value"
      >×</button>

      <button
        class="kp-datetime__icon-button kp-datetime__calendar-icon"
        type="button"
        :disabled="disabled"
        aria-label="打开日期时间选择器"
        title="打开日期时间选择器"
        tabindex="-1"
      >▦</button>

      <span class="kp-datetime__bar" />
    </div>

    <Transition name="kp-datetime-panel">
      <div
        v-if="is_open"
        :id="panel_id"
        ref="panel_ref"
        class="kp-datetime__panel"
        role="dialog"
        aria-label="选择日期时间"
        :style="{ '--kp-panel-shift': `${panel_shift}px` }"
        @keydown="handle_calendar_keydown"
      >
        <div class="kp-datetime__panel-line" />

        <header class="kp-datetime__header">
          <button
            class="kp-datetime__nav"
            type="button"
            aria-label="上个月"
            title="上个月"
            @click="change_month(-1)"
          >‹</button>
          <strong class="kp-datetime__month">{{ month_title }}</strong>
          <button
            class="kp-datetime__nav"
            type="button"
            aria-label="下个月"
            title="下个月"
            @click="change_month(1)"
          >›</button>
        </header>

        <div class="kp-datetime__week" aria-hidden="true">
          <span v-for="label in week_labels" :key="label">{{ label }}</span>
        </div>

        <div class="kp-datetime__grid" role="grid" aria-label="日期">
          <button
            v-for="day in calendar_days"
            :key="day.value"
            class="kp-datetime__day"
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

        <!-- 时间步进区:时/分(/秒) 可键入、步进、滚轮 -->
        <div class="kp-datetime__time">
          <template v-for="(field, idx) in time_fields" :key="field.unit">
            <span v-if="idx > 0" class="kp-datetime__colon">:</span>
            <div class="kp-datetime__field">
              <button
                class="kp-datetime__spin"
                type="button"
                :aria-label="`增加${field.label}`"
                tabindex="-1"
                @click="step_time(field.unit, 1)"
              >▲</button>
              <input
                class="kp-datetime__num"
                type="text"
                maxlength="2"
                inputmode="numeric"
                :value="field.value"
                :aria-label="field.label"
                @keydown.up.prevent="step_time(field.unit, 1)"
                @keydown.down.prevent="step_time(field.unit, -1)"
                @keydown.enter.prevent="commit_time(field.unit, $event)"
                @wheel.prevent="on_time_wheel($event, field.unit)"
                @change="commit_time(field.unit, $event)"
                @focus="select_text"
              />
              <button
                class="kp-datetime__spin"
                type="button"
                :aria-label="`减少${field.label}`"
                tabindex="-1"
                @click="step_time(field.unit, -1)"
              >▼</button>
            </div>
          </template>
        </div>

        <footer class="kp-datetime__footer">
          <button
            class="kp-datetime__now"
            type="button"
            :disabled="now_disabled"
            @click="select_now"
          >此刻</button>
          <div class="kp-datetime__footer-right">
            <span v-if="draft_out_of_range" class="kp-datetime__warn">超出范围</span>
            <button
              class="kp-datetime__confirm"
              type="button"
              :disabled="draft_out_of_range"
              @click="confirm"
            >确认</button>
          </div>
        </footer>
      </div>
    </Transition>

    <p v-if="error_message" class="kp-datetime__error">{{ error_message }}</p>
  </div>
</template>

<style scoped>
.kp-datetime-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.kp-datetime {
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

.kp-datetime:hover,
.kp-datetime:focus-within,
.kp-datetime-wrap.is-open .kp-datetime {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 7px rgba(0, 240, 255, 0.22), inset 0 0 7px rgba(0, 240, 255, 0.05);
}

.kp-datetime__input {
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

.kp-datetime__input::placeholder { color: var(--text-dim); }

.kp-datetime__icon-button {
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

.kp-datetime__clear { font-size: 17px; }
.kp-datetime__clear:hover { color: var(--neon-red); text-shadow: 0 0 6px var(--neon-red); }
.kp-datetime__calendar-icon { font-size: 18px; }
.kp-datetime:hover .kp-datetime__calendar-icon,
.kp-datetime-wrap.is-open .kp-datetime__calendar-icon {
  color: var(--neon-cyan);
  text-shadow: 0 0 7px var(--neon-cyan);
}

.kp-datetime__bar {
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

.kp-datetime-wrap.is-open .kp-datetime__bar,
.kp-datetime:focus-within .kp-datetime__bar { width: 100%; }

.kp-datetime--sm { height: 32px; padding: 0 8px 0 10px; font-size: var(--font-size-xs); }
.kp-datetime--md { height: 40px; padding: 0 10px 0 14px; font-size: var(--font-size-sm); }
.kp-datetime--lg { height: 48px; padding: 0 12px 0 18px; font-size: var(--font-size-md); }

.kp-datetime__panel {
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

.kp-datetime__panel-line {
  position: absolute;
  top: 0;
  left: 14%;
  width: 72%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
  box-shadow: 0 0 8px var(--neon-cyan);
}

.kp-datetime__header {
  display: grid;
  grid-template-columns: 32px 1fr 32px;
  align-items: center;
  margin-bottom: 10px;
}

.kp-datetime__month {
  color: var(--text-primary);
  font-size: 14px;
  letter-spacing: 0;
  text-align: center;
}

.kp-datetime__nav {
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

.kp-datetime__nav:hover,
.kp-datetime__nav:focus-visible {
  color: var(--neon-cyan);
  border-color: rgba(0, 240, 255, 0.4);
  background: rgba(0, 240, 255, 0.08);
  outline: 0;
}

.kp-datetime__week,
.kp-datetime__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.kp-datetime__week {
  margin-bottom: 4px;
  color: var(--text-muted);
  font-size: 10px;
  text-align: center;
}

.kp-datetime__week span { padding: 4px 0; }

.kp-datetime__grid { gap: 2px; }

.kp-datetime__day {
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

.kp-datetime__day:hover:not(:disabled),
.kp-datetime__day:focus-visible {
  color: var(--neon-cyan);
  border-color: rgba(0, 240, 255, 0.55);
  background: rgba(0, 240, 255, 0.08);
  outline: 0;
}

.kp-datetime__day.is-outside { color: var(--text-muted); opacity: 0.5; }

.kp-datetime__day.is-today:not(.is-selected) {
  color: var(--neon-green);
  border-color: rgba(0, 255, 159, 0.6);
  box-shadow: inset 0 0 8px rgba(0, 255, 159, 0.08);
}

.kp-datetime__day.is-selected {
  color: var(--bg-base);
  background: var(--neon-cyan);
  border-color: var(--neon-cyan);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.65);
  font-weight: 700;
}

.kp-datetime__day:disabled {
  color: var(--text-muted);
  opacity: 0.22;
  cursor: not-allowed;
  text-decoration: line-through;
}

/* ---- 时间步进区 ---- */
.kp-datetime__time {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.kp-datetime__field {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.kp-datetime__num {
  width: 44px;
  height: 34px;
  text-align: center;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--neon-cyan);
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 0 6px rgba(0, 240, 255, 0.4);
  outline: 0;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.kp-datetime__num:focus {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.3), inset 0 0 6px rgba(0, 240, 255, 0.06);
}

.kp-datetime__spin {
  width: 26px;
  height: 12px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  font-size: 8px;
  line-height: 1;
  cursor: pointer;
  transition: color var(--transition-fast), text-shadow var(--transition-fast);
}

.kp-datetime__spin:hover {
  color: var(--neon-cyan);
  text-shadow: 0 0 6px var(--neon-cyan);
}

.kp-datetime__colon {
  color: var(--neon-cyan);
  font-size: 18px;
  font-weight: 700;
  text-shadow: 0 0 6px var(--neon-cyan);
  /* 对齐数字中部 */
  align-self: center;
  margin-bottom: 12px;
}

/* ---- 底部操作栏 ---- */
.kp-datetime__footer {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  min-height: 31px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.kp-datetime__footer-right {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-left: auto;
}

.kp-datetime__warn {
  color: var(--neon-red);
  font-size: 10px;
  letter-spacing: 0;
  text-shadow: 0 0 6px rgba(255, 0, 60, 0.5);
}

.kp-datetime__now {
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

.kp-datetime__now:hover:not(:disabled),
.kp-datetime__now:focus-visible {
  background: rgba(0, 255, 159, 0.12);
  box-shadow: 0 0 8px rgba(0, 255, 159, 0.3);
  outline: 0;
}

.kp-datetime__now:disabled { opacity: 0.25; cursor: not-allowed; }

.kp-datetime__confirm {
  min-width: 60px;
  height: 28px;
  padding: 0 14px;
  border: 1px solid var(--neon-cyan);
  border-radius: var(--radius-sm);
  background: rgba(0, 240, 255, 0.12);
  color: var(--neon-cyan);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background var(--transition-fast), box-shadow var(--transition-fast);
}

.kp-datetime__confirm:hover:not(:disabled),
.kp-datetime__confirm:focus-visible {
  background: rgba(0, 240, 255, 0.22);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.45);
  outline: 0;
}

.kp-datetime__confirm:disabled { opacity: 0.3; cursor: not-allowed; }

.kp-datetime-wrap.is-error .kp-datetime {
  border-color: var(--neon-red);
  box-shadow: 0 0 6px rgba(255, 0, 60, 0.2), inset 0 0 6px rgba(255, 0, 60, 0.05);
}

.kp-datetime-wrap.is-error .kp-datetime__bar {
  width: 100%;
  background: linear-gradient(90deg, transparent, var(--neon-red), transparent);
}

.kp-datetime__error {
  color: var(--neon-red);
  font-size: var(--font-size-xs);
  text-shadow: 0 0 6px rgba(255, 0, 60, 0.5);
}

.kp-datetime-wrap.is-disabled { opacity: 0.4; pointer-events: none; }

.kp-datetime-panel-enter-active,
.kp-datetime-panel-leave-active { transition: opacity 160ms ease, transform 160ms ease; }
.kp-datetime-panel-enter-from,
.kp-datetime-panel-leave-to { opacity: 0; transform: translate(var(--kp-panel-shift, 0), -5px); }

@media (max-width: 480px) {
  .kp-datetime__panel {
    right: 0;
    left: auto;
    padding: 12px;
  }
  .kp-datetime__day { font-size: 11px; }
}

@media (prefers-reduced-motion: reduce) {
  .kp-datetime-panel-enter-active,
  .kp-datetime-panel-leave-active { transition: none; }
}
</style>
