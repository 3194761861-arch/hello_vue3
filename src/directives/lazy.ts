import { useIntersectionObserver } from '@vueuse/core'
import type { Directive } from 'vue'

export const lazy: Directive = {
  mounted(el, binding) {
    const { stop } = useIntersectionObserver(
      el,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          el.src = binding.value
          stop()
        }
      }
    )
  }
}

// Fallback if vueuse is not installed or we want a vanilla implementation
export const vLazy: Directive = {
  mounted(el: HTMLImageElement, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.src = binding.value
          observer.unobserve(el)
        }
      })
    })
    observer.observe(el)
  }
}
