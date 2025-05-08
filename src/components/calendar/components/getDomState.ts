import { ref } from 'vue'
export const useDomState = (el: HTMLElement, { scrollDoneTime = 50 }) => {
  const touchState = ref<'touching' | 'end'>('end') //触摸状态
  const scrollState = ref<'scrolling' | 'end'>('end')
  let timer = 0
  el.addEventListener('scroll', () => {
    scrollState.value = 'scrolling'
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      scrollState.value = 'end'
    }, scrollDoneTime)
  })
  el.addEventListener('touchstart', () => {
    touchState.value = 'touching'
  })
  el.addEventListener('touchmove', () => {
    touchState.value = 'touching'
  })
  el.addEventListener('touchend', () => {
    touchState.value = 'end'
  })
  return {
    touchState,
    scrollState
  }
}
