import { createRouter, createWebHistory } from 'vue-router'
import Intro from '@/pages/Intro.vue'
import Preview from '@/pages/Preview.vue'
import ButtonShowcase from '@/components/ButtonShowcase.vue'
import InputShowcase from '@/components/InputShowcase.vue'
import ScrollbarShowcase from '@/components/ScrollbarShowcase.vue'
import CheckboxShowcase from '@/components/CheckboxShowcase.vue'
import RadioShowcase from '@/components/RadioShowcase.vue'
import DatePickerShowcase from '@/components/DatePickerShowcase.vue'
import DateTimePickerShowcase from '@/components/DateTimePickerShowcase.vue'
import SwitchShowcase from '@/components/SwitchShowcase.vue'
import SelectShowcase from '@/components/SelectShowcase.vue'
import SliderShowcase from '@/components/SliderShowcase.vue'
import ProgressShowcase from '@/components/ProgressShowcase.vue'
import TagShowcase from '@/components/TagShowcase.vue'
import BadgeShowcase from '@/components/BadgeShowcase.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/intro' },
    { path: '/intro', name: 'intro', component: Intro, meta: { title: '介绍' } },
    {
      // 预览页:左侧菜单布局 + 子路由出口
      path: '/preview',
      component: Preview,
      redirect: '/preview/button',
      children: [
        { path: 'button', name: 'preview-button', component: ButtonShowcase, meta: { title: '按钮' } },
        { path: 'input', name: 'preview-input', component: InputShowcase, meta: { title: '输入框' } },
        { path: 'scrollbar', name: 'preview-scrollbar', component: ScrollbarShowcase, meta: { title: '滚动条' } },
        { path: 'checkbox', name: 'preview-checkbox', component: CheckboxShowcase, meta: { title: '多选框' } },
        { path: 'radio', name: 'preview-radio', component: RadioShowcase, meta: { title: '单选框' } },
        { path: 'date-picker', name: 'preview-date-picker', component: DatePickerShowcase, meta: { title: '日期选择器' } },
        { path: 'date-time-picker', name: 'preview-date-time-picker', component: DateTimePickerShowcase, meta: { title: '日期时间选择器' } },
        { path: 'switch', name: 'preview-switch', component: SwitchShowcase, meta: { title: '开关' } },
        { path: 'select', name: 'preview-select', component: SelectShowcase, meta: { title: '下拉选择' } },
        { path: 'slider', name: 'preview-slider', component: SliderShowcase, meta: { title: '滑块' } },
        { path: 'progress', name: 'preview-progress', component: ProgressShowcase, meta: { title: '进度条' } },
        { path: 'tag', name: 'preview-tag', component: TagShowcase, meta: { title: '标签' } },
        { path: 'badge', name: 'preview-badge', component: BadgeShowcase, meta: { title: '徽标' } }
      ]
    }
  ]
})

export default router
