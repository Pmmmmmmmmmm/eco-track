<script setup lang="ts">
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
const pickFontSize = 70
let textWidth = 0
const hourList = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
  '48',
  '49',
  '50',
  '51',
  '52',
  '53',
  '54',
  '55',
  '56',
  '57',
  '58',
  '59'
]
const canvasRef = useTemplateRef('canvasRef')
const parentsRef = useTemplateRef('boxRef')
let padding = 0
let canvasHeight = ref(0)
function getCanvasHeight() {
  if (canvasHeight.value) return canvasHeight.value
  if (!canvasRef.value || !parentsRef.value) return 0
  padding = (parentsRef.value?.scrollHeight - ItemHeight) / 2
  let contentHeight = hourList.length * ItemHeight
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
  hourList.forEach((text) => {
    const metrics = ctx.value?.measureText(text)
    maxWidth = Math.max(maxWidth, metrics?.width || 0)
    const length = text.length
    if (length > maxLength) {
      maxLength = length
    }
  })
  let dynamicWidth = (pickFontSize - baseFontSize) * maxLength
  canvas.width = maxWidth + dynamicWidth + 30
  textWidth = maxWidth + dynamicWidth + 30
  ctx.value.strokeStyle = 'green'
  ctx.value.textAlign = 'center'
  ctx.value.textBaseline = 'middle'
  drawText(0)
}
let posMap = new Map()
let contentMap = new Map()
function drawText(scrollTop: number) {
  if (!ctx.value) return null
  hourList.forEach((item, index) => {
    if (!ctx.value) return null
    let rate = 1 - Math.abs(index * ItemHeight - scrollTop) / influenceScope
    if (rate < 0) rate = 0
    let newFontSize = baseFontSize + (pickFontSize - baseFontSize) * rate
    // （newFontSize * 0.1）估算文字高度，使文字上下居中
    let newY = index * ItemHeight + padding + ItemHeight / 2 + newFontSize * 0.1
    if (posMap.size !== hourList.length) {
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
    <div class="line"></div>
    <canvas ref="canvasRef" class="canvas"></canvas>
  </div>
</template>
<style lang="less" scoped>
.test-box {
  width: 100vw;
  height: 100vh;
  overflow: scroll;

  .line {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    height: 1px;

    background-color: #5f0b0b;
  }
}
.canvas {
  border: 1px solid #5f0b0b;
  // width: 200px;
  // height: 400px;
  // background-color: #f0f0f0;
}
</style>
