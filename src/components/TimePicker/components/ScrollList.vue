<script setup lang="ts">
import {
  ref,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  useTemplateRef,
  nextTick,
  watchEffect,
  watch
} from 'vue'

const { options } = defineProps<{ options: string[] }>()
const model = defineModel()
// watch(model, (newValue) => {
//   if (!newValue) return null
//   if (!contentMap.has(newValue)) return null
//   let matchPos = contentMap.get(newValue)
//   if (!parentsRef.value) return null
//   if (matchPos === currentMatchPos) return null
//   parentsRef.value.scrollTo({
//     top: matchPos,
//     behavior: 'smooth'
//   })
// })
onBeforeMount(() => {})
onMounted(() => {})
const ItemHeight = 60
const influenceScope = 90
const baseFontSize = 20
const pickFontSize = 60

const canvasRef = useTemplateRef('canvasRef')
const parentsRef = useTemplateRef('parentsRef')
let padding = 0
let canvasHeight = 0
let canvasWidth = 0
function getCanvasHeight() {
  if (canvasHeight) return canvasHeight
  if (!canvasRef.value || !parentsRef.value) return 0
  padding = (parentsRef.value?.scrollHeight - ItemHeight) / 2
  let contentHeight = options.length * ItemHeight
  canvasHeight = contentHeight + padding + padding
  return contentHeight + padding + padding
}
function getCanvasWidth() {
  if (canvasWidth) return canvasWidth
  let maxWidth = 0
  let maxLength = 0
  options.forEach((text) => {
    const metrics = ctx.value?.measureText(text)
    maxWidth = Math.max(maxWidth, metrics?.width || 0)
    const length = text.length
    if (length > maxLength) {
      maxLength = length
    }
  })
  let dynamicWidth = (pickFontSize - baseFontSize) * maxLength
  canvasWidth = maxWidth + dynamicWidth * 0.6
  return (maxWidth + dynamicWidth) * 0.6
}
const ctx = ref<CanvasRenderingContext2D | null>(null)
function initCanvas() {
  if (!canvasRef.value) return null
  const canvas = canvasRef.value as HTMLCanvasElement
  ctx.value = canvas.getContext('2d')
  canvas.height = getCanvasHeight()
  canvas.width = getCanvasWidth()
  if (!ctx.value) return null
  ctx.value.textAlign = 'center'
  ctx.value.textBaseline = 'middle'
  drawText(0)
}
let posMap = new Map()
let contentMap = new Map()
function drawText(scrollTop: number) {
  if (!ctx.value) return null
  options.forEach((item, index) => {
    if (!ctx.value) return null
    let rate = 1 - Math.abs(index * ItemHeight - scrollTop) / influenceScope
    if (rate < 0) rate = 0
    let newFontSize = baseFontSize + (pickFontSize - baseFontSize) * rate
    // （newFontSize * 0.1）估算文字高度，使文字上下居中
    let newY = index * ItemHeight + padding + ItemHeight / 2 + newFontSize * 0.1
    if (posMap.size !== options.length) {
      posMap.set(index * ItemHeight, item)
      contentMap.set(item, index * ItemHeight)
    }
    ctx.value.font = `${newFontSize}px myFont`
    if (!canvasRef.value) return null
    ctx.value.fillText(item, canvasRef.value.width / 2, newY, canvasRef.value.width)
  })
}
let currentMatchPos = 0
let touchState = ref('end')
function bindTouchEvent() {
  parentsRef.value?.addEventListener('touchstart', () => {
    touchState.value = 'touching'
  })
  parentsRef.value?.addEventListener('touchmove', () => {
    touchState.value = 'touching'
  })
  parentsRef.value?.addEventListener('touchend', () => {
    touchState.value = 'end'
  })
}
import { useScrollSpeed } from './getScrollSpeed'
const { scrollSpeed, speedStatus } = useScrollSpeed(parentsRef)

let isOnDoneAction = false
watch([touchState, scrollSpeed], (val) => {
  if (
    (touchState.value == 'end' &&
      scrollSpeed.value <= 0.5 &&
      !isOnDoneAction &&
      '减速' === speedStatus.value) ||
    (touchState.value == 'end' && speedStatus.value === '停止' && !isOnDoneAction)
  ) {
    if (!parentsRef.value || !parentsRef.value.scrollTop) return null

    handleViewChangeByPos(parentsRef.value.scrollTop)
  }
})

onMounted(() => {
  document.fonts.ready.then(() => {
    initCanvas()
  })
  parentsRef.value?.addEventListener('scroll', (e) => {
    if (!parentsRef.value) return null
    ctx.value?.clearRect(0, 0, canvasWidth, canvasHeight)
    drawText(parentsRef.value.scrollTop)
  })
  bindTouchEvent()
})
function handleScroll(target: HTMLElement, top: number) {
  isOnDoneAction = true
  function update() {
    const currentTop = target.scrollTop
    const delta = top - currentTop
    const speed = delta / 10 // 调整速度
    target.scrollTop += speed
    if (Math.abs(delta) > 4) {
      requestAnimationFrame(update)
    } else {
      isOnDoneAction = false
      target.scrollTop = top
    }
  }
  update()
}
// 通过位置滚动到指定位置
function handleViewChangeByPos(pos: number) {
  if (!parentsRef.value) return null
  let matchPos = Math.round(pos / ItemHeight) * ItemHeight
  if (matchPos === currentMatchPos) return null
  handleScroll(parentsRef.value, matchPos)
}
// 通过值滚动到指定位置
function handleViewChangeByValue(value: string) {
  let matchPos = contentMap.get(value)
  if (!parentsRef.value) return null
  if (matchPos === currentMatchPos) return null
  handleScroll(parentsRef.value, matchPos)
}
</script>
<template>
  <div class="scroll-list" ref="parentsRef">
    <canvas ref="canvasRef" class="canvas"></canvas>
  </div>
</template>
<style lang="less" scoped>
.scroll-list {
  height: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  position: relative;
  .canvas {
    display: block;
    margin: 0 auto;
  }
}
</style>
