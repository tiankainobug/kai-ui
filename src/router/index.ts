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
import TooltipShowcase from '@/components/TooltipShowcase.vue'
import ModalShowcase from '@/components/ModalShowcase.vue'
import MessageShowcase from '@/components/MessageShowcase.vue'
import TabsShowcase from '@/components/TabsShowcase.vue'
import DrawerShowcase from '@/components/DrawerShowcase.vue'
import PopoverShowcase from '@/components/PopoverShowcase.vue'
import CardShowcase from '@/components/CardShowcase.vue'
import AlertShowcase from '@/components/AlertShowcase.vue'
import CollapseShowcase from '@/components/CollapseShowcase.vue'
import LoadingShowcase from '@/components/LoadingShowcase.vue'
import EmptyShowcase from '@/components/EmptyShowcase.vue'
import SkeletonShowcase from '@/components/SkeletonShowcase.vue'
import AvatarShowcase from '@/components/AvatarShowcase.vue'
import RateShowcase from '@/components/RateShowcase.vue'

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
        { path: 'badge', name: 'preview-badge', component: BadgeShowcase, meta: { title: '徽标' } },
        { path: 'tooltip', name: 'preview-tooltip', component: TooltipShowcase, meta: { title: '文字提示' } },
        { path: 'modal', name: 'preview-modal', component: ModalShowcase, meta: { title: '对话框' } },
        { path: 'message', name: 'preview-message', component: MessageShowcase, meta: { title: '消息提示' } },
        { path: 'tabs', name: 'preview-tabs', component: TabsShowcase, meta: { title: '标签页' } },
        { path: 'drawer', name: 'preview-drawer', component: DrawerShowcase, meta: { title: '抽屉' } },
        { path: 'popover', name: 'preview-popover', component: PopoverShowcase, meta: { title: '气泡卡片' } },
        { path: 'card', name: 'preview-card', component: CardShowcase, meta: { title: '卡片' } },
        { path: 'alert', name: 'preview-alert', component: AlertShowcase, meta: { title: '警告提示' } },
        { path: 'collapse', name: 'preview-collapse', component: CollapseShowcase, meta: { title: '折叠面板' } },
        { path: 'loading', name: 'preview-loading', component: LoadingShowcase, meta: { title: '加载' } },
        { path: 'empty', name: 'preview-empty', component: EmptyShowcase, meta: { title: '空状态' } },
        { path: 'skeleton', name: 'preview-skeleton', component: SkeletonShowcase, meta: { title: '骨架屏' } },
        { path: 'avatar', name: 'preview-avatar', component: AvatarShowcase, meta: { title: '头像' } },
        { path: 'rate', name: 'preview-rate', component: RateShowcase, meta: { title: '评分' } }
      ]
    }
  ]
})

export default router
