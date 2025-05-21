import { onMounted, ref, watch } from 'vue'

import type { ShallowRef } from 'vue'
export const useScrollSpeed = (target: ShallowRef<HTMLElement | null>) => {
  const scrollSpeed = ref(0)

  let lastScrollTop = 0
  /**
   * 更新滚动速度的函数。通过比较当前滚动位置和上一次滚动位置，
   * 计算滚动速度，并使用 requestAnimationFrame 递归调用自身，实现持续更新。
   */
  function updateScrollSpeed(el: HTMLElement) {
    // 计算滚动速度
    // 获取当前元素的垂直滚动位置，若为 undefined 则默认设为 0
    const currentScrollTop = el.scrollTop || 0
    // 计算当前滚动位置与上一次滚动位置差值的绝对值，作为滚动速度
    const deltaScrollTop = Math.abs(currentScrollTop - lastScrollTop)
    // 使用 requestAnimationFrame 在浏览器下一次重绘之前执行回调函数
    requestAnimationFrame(() => {
      // 将计算得到的滚动速度赋值给响应式变量 scrollSpeed
      scrollSpeed.value = deltaScrollTop
      // 更新上一次滚动位置为当前滚动位置，为下一次计算做准备
      lastScrollTop = currentScrollTop
      // 递归调用 updateScrollSpeed 函数，持续更新滚动速度
      updateScrollSpeed(el)
    })
  }

  const { stop } = watch(target, (newEl) => {
    if (!newEl) return
    lastScrollTop = newEl.scrollTop || 0
    updateScrollSpeed(newEl)
    stop()
  })

  return {
    scrollSpeed
  }
}
