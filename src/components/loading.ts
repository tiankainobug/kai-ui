import type { Directive, DirectiveBinding } from 'vue'

// v-loading 指令:在元素上叠加加载遮罩
// 用法:v-loading="true" / v-loading="'加载中'" / v-loading="loading_ref"
// 元素自动设为 position: relative 以承载绝对定位遮罩

interface LoadingEl extends HTMLElement {
  _kp_loading_mask?: HTMLElement | null
}

// 创建遮罩 DOM(使用全局 .kp-loading-* 类,样式见 theme.css)
const create_mask = (value: boolean | string): HTMLElement => {
  const mask = document.createElement('div')
  mask.className = 'kp-loading-directive-mask'

  const spinner = document.createElement('span')
  spinner.className = 'kp-loading-directive-ring'
  mask.appendChild(spinner)

  // 字符串值作为加载文字
  if (typeof value === 'string' && value) {
    const text = document.createElement('span')
    text.className = 'kp-loading-directive-text'
    text.textContent = value
    mask.appendChild(text)
  }
  return mask
}

const show = (el: LoadingEl, value: boolean | string) => {
  if (!value) return
  if (!el._kp_loading_mask) {
    // 确保父级可承载绝对定位遮罩
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative'
    }
    const mask = create_mask(value)
    el.appendChild(mask)
    el._kp_loading_mask = mask
  }
}

const hide = (el: LoadingEl) => {
  if (el._kp_loading_mask) {
    el._kp_loading_mask.remove()
    el._kp_loading_mask = null
  }
}

export const vLoading: Directive<LoadingEl, boolean | string> = {
  mounted(el, binding: DirectiveBinding<boolean | string>) {
    if (binding.value) show(el, binding.value)
  },
  updated(el, binding: DirectiveBinding<boolean | string>) {
    if (binding.value) show(el, binding.value)
    else hide(el)
  },
  unmounted(el) {
    hide(el)
  }
}
