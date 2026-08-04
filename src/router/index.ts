import { createRouter, createWebHistory } from 'vue-router'
import Intro from '@/pages/Intro.vue'
import Preview from '@/pages/Preview.vue'
import ButtonShowcase from '@/components/ButtonShowcase.vue'
import InputShowcase from '@/components/InputShowcase.vue'
import ScrollbarShowcase from '@/components/ScrollbarShowcase.vue'
import CheckboxShowcase from '@/components/CheckboxShowcase.vue'
import DatePickerShowcase from '@/components/DatePickerShowcase.vue'

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
        { path: 'date-picker', name: 'preview-date-picker', component: DatePickerShowcase, meta: { title: '日期选择器' } }
      ]
    }
  ]
})

export default router
