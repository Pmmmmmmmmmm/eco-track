<script setup lang="ts">
const { options } = defineProps<{ options: string[] }>()
const model = defineModel()
import {
  ref,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  useTemplateRef,
  nextTick,
  watchEffect
} from 'vue'

onBeforeMount(() => {})
onMounted(() => {})
const ItemHeight = 60
const influenceScope = 90
const baseFontSize = 20
const pickFontSize = 60
let textWidth = 0

const canvasRef = useTemplateRef('canvasRef')
const parentsRef = useTemplateRef('boxRef')
let padding = 0
let canvasHeight = ref(0)
function getCanvasHeight() {
  if (canvasHeight.value) return canvasHeight.value
  if (!canvasRef.value || !parentsRef.value) return 0
  padding = (parentsRef.value?.scrollHeight - ItemHeight) / 2
  let contentHeight = options.length * ItemHeight
  canvasHeight.value = contentHeight + padding + padding
  return contentHeight + padding + padding
}
const ctx = ref<CanvasRenderingContext2D | null>(null)
function initCanvas() {
  if (!canvasRef.value) return null
  const canvas = canvasRef.value as HTMLCanvasElement
  ctx.value = canvas.getContext('2d')
  canvas.height = getCanvasHeight()
  if (!ctx.value) return null
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
  canvas.width = maxWidth + dynamicWidth
  textWidth = maxWidth + dynamicWidth
  ctx.value.strokeStyle = 'green'
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
    ctx.value.fillText(item, textWidth / 2, newY, textWidth)
  })
}

function handleMatchShow(currentPos: number | null, speed: number) {
  if (!currentPos) return null
  let matchPos = Math.round(currentPos / ItemHeight) * ItemHeight
  if (!parentsRef.value) return null
  parentsRef.value.scrollTo({
    top: matchPos,
    behavior: 'smooth'
  })
}
let touchState = ref('end')
let scrollSpeed = ref(0)
let lastScrollTop = 0
function updateScrollSpeed() {
  // 计算滚动速度
  const currentScrollTop = parentsRef.value?.scrollTop || 0
  const deltaScrollTop = Math.abs(currentScrollTop - lastScrollTop)
  requestAnimationFrame(() => {
    scrollSpeed.value = deltaScrollTop
    lastScrollTop = currentScrollTop
    updateScrollSpeed()
  })
}

onMounted(() => {
  lastScrollTop = parentsRef.value?.scrollTop || 0
  updateScrollSpeed()
})
let lastSpeed = 0
watchEffect(() => {
  if (lastSpeed >= scrollSpeed.value && scrollSpeed.value < 0.1 && touchState.value == 'end') {
    if (parentsRef.value?.scrollTop) handleMatchShow(parentsRef.value?.scrollTop, scrollSpeed.value)
  }
  lastSpeed = scrollSpeed.value
})
onMounted(() => {
  document.fonts.ready.then(() => {
    initCanvas()
  })
  parentsRef.value?.addEventListener('scroll', (e) => {
    if (!parentsRef.value) return null
    ctx.value?.clearRect(0, 0, textWidth, canvasHeight.value)
    drawText(parentsRef.value.scrollTop)
  })
  parentsRef.value?.addEventListener('touchstart', () => {
    touchState.value = 'touching'
  })
  parentsRef.value?.addEventListener('touchmove', () => {
    touchState.value = 'touching'
  })
  parentsRef.value?.addEventListener('touchend', () => {
    touchState.value = 'end'
  })
})
</script>
<template>
  <div class="test-box" ref="boxRef">
    <canvas ref="canvasRef" class="canvas"></canvas>
  </div>
</template>
<style lang="less" scoped>
.test-box {
  // width: 100%;
  height: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
