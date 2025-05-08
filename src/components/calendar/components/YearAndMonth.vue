<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, handleError, watchEffect } from 'vue'
//年份范围
const YEARS_NUMBER = 3
const IGNORE_DIS = 40
const dateRef = ref<HTMLElement | HTMLElement[] | null>(null)
const scrollTableRef = ref<HTMLElement | null>(null)
const scrollBoxRef = ref<HTMLElement | null>(null)
const locationMap = new Map()
const XSet = new Set<number>()
const YSet = new Set<number>()
let touchState = ref<'touching' | 'end'>('end')
let scrollState = ref<'scrolling' | 'end'>('end')

let widthPadding = 0
let heightPadding = 0

onMounted(() => {
  getLocationList()
})
function bindEventState() {
  if (!scrollBoxRef.value) return
  let timer = 0
  scrollBoxRef.value.addEventListener('scroll', () => {
    scrollState.value = 'scrolling'
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      scrollState.value = 'end'
    }, 200)
  })
  scrollBoxRef.value.addEventListener('touchstart', () => {
    touchState.value = 'touching'
  })
  scrollBoxRef.value.addEventListener('touchmove', () => {
    touchState.value = 'touching'
  })
  scrollBoxRef.value.addEventListener('touchend', () => {
    touchState.value = 'end'
  })
}
onMounted(() => {
  bindEventState()
})
function getLocationList() {
  let parentsWidth = scrollBoxRef.value?.offsetWidth
  let childrenWidth = Array.isArray(dateRef.value) && dateRef.value[0].offsetWidth
  let parentsHeight = scrollBoxRef.value?.offsetHeight
  let childrenHeight = Array.isArray(dateRef.value) && dateRef.value[0].offsetHeight
  if (!parentsWidth || !childrenWidth || !parentsHeight || !childrenHeight) return
  widthPadding = (parentsWidth - childrenWidth) / 2
  heightPadding = (parentsHeight - childrenHeight) / 2

  if (Array.isArray(dateRef.value)) {
    dateRef.value.forEach((item) => {
      if (scrollBoxRef.value) {
        let x = Math.floor(item.offsetLeft - widthPadding)
        XSet.add(x)
        let y = Math.floor(item.offsetTop - heightPadding)
        YSet.add(y)
        locationMap.set(`${x},${y}`, item)
      }
    })
  }
}
function getScrollLocation() {
  scrollBoxRef.value && scrollBoxRef.value.addEventListener('scroll', handleOnScroll)
}
onMounted(() => {
  getScrollLocation()
})
function handleOnScroll() {
  if (!scrollBoxRef.value) return
  const scrollBox = scrollBoxRef.value
  let currentCenter = {
    x: Math.floor(scrollBox.scrollLeft),
    y: Math.floor(scrollBox.scrollTop)
  }
  getMatchByCenter(currentCenter)
}
onMounted(() => {
  handleOnScroll()
})
let lastMatch = ''

function getMatchByCenter({ x, y }: { x: number; y: number }) {
  let X = Array.from(XSet).sort((a: number, b: number) => Math.abs(a - x) - Math.abs(b - x))[0]
  let Y = Array.from(YSet).sort((a: number, b: number) => Math.abs(a - y) - Math.abs(b - y))[0]
  let matchStr = `${X},${Y}`
  let distance = getPointDistance([X, Y], [x, y])
  if (lastMatch) {
    let lastItem = locationMap.get(lastMatch)
    let lastPoint = lastMatch.split(',').map((item) => Number(item))
    let distance = getPointDistance([lastPoint[0], lastPoint[1]], [x, y])
    if (distance < IGNORE_DIS) return

    lastItem && lastItem.classList.remove('active')
    lastMatch = ''
  }

  if (`${X},${Y}` === lastMatch || distance > IGNORE_DIS) return
  handleNewMatch(matchStr)
}
function getPointDistance(posA: [number, number], posB: [number, number]) {
  return Math.sqrt(Math.pow(posA[0] - posB[0], 2) + Math.pow(posA[1] - posB[1], 2))
}
let year = defineModel('year', {
  type: Number
})
let month = defineModel('month', {
  type: Number
})

function handleNewMatch(matchStr: string) {
  lastMatch = matchStr
  let newItem = locationMap.get(matchStr)
  if (newItem) {
    newItem.classList.add('active')
    year.value = Number(newItem.getAttribute('yearValue'))
    month.value = Number(newItem.getAttribute('monthValue'))
  }
}
watchEffect(() => {
  if (touchState.value == 'end' && scrollState.value == 'end') {
    if (!lastMatch) return
    let target = locationMap.get(lastMatch)
    handleOnScrollDone(target.offsetTop, target.offsetLeft)
  }
})
function handleOnScrollDone(top: number, left: number) {
  scrollBoxRef.value &&
    scrollBoxRef.value.scrollTo({
      top: top - heightPadding,
      left: left - widthPadding,
      behavior: 'smooth'
    })
}

function getYearList() {
  const yearList = []
  const currentYear = new Date().getFullYear()
  for (let i = currentYear - YEARS_NUMBER; i <= currentYear; i++) {
    yearList.push(i)
  }
  return yearList
}
const yearList = getYearList()
const monthList = [
  { name: 'Jan', value: 1, label: '一月' },
  { name: 'Feb', value: 2, label: '二月' },
  { name: 'Mar', value: 3, label: '三月' },
  { name: 'Apr', value: 4, label: '四月' },
  { name: 'May', value: 5, label: '五月' },
  { name: 'Jun', value: 6, label: '六月' },
  { name: 'Jul', value: 7, label: '七月' },
  { name: 'Aug', value: 8, label: '八月' },
  { name: 'Sep', value: 9, label: '九月' },
  { name: 'Oct', value: 10, label: '十月' },
  { name: 'Nov', value: 11, label: '十一月' },
  { name: 'Dec', value: 12, label: '十二月' }
]
</script>
<template>
  <div class="picker" @touchmove.stop>
    <div class="aim-picker"></div>
    <div class="scroll-box" ref="scrollBoxRef">
      <div class="scroll-table" ref="scrollTableRef">
        <div class="years-item" v-for="yearItem in yearList" :key="yearItem">
          <div
            class="month-item"
            v-for="monthItem in monthList"
            ref="dateRef"
            :yearValue="yearItem"
            :monthValue="monthItem.value"
            :key="monthItem.value"
          >
            <div class="years">{{ yearItem }}年</div>
            <div class="month">{{ monthItem.value }}月</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.picker {
  width: 100vw;
  height: 70vw;
  position: relative;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, #dbd5ae 70%);
  .scroll-box {
    width: 100%;
    height: 100%;
    overflow: auto;
    .scroll-table {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: calc(35vw - 30px) calc(50vw - 30px);
      box-sizing: border-box;
      height: fit-content;
      width: fit-content;
      .years-item {
        display: flex;
        align-items: center;
        gap: 10px;
        .month-item {
          height: 60px;
          width: 60px;
          border: 1px solid #000;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          gap: 4px;
          transition: all 0.2s ease;
          transform: scale(1);
          z-index: 1;
          font-size: 16px;
        }
        .active {
          background-color: #cee2eb;
          color: #b41212;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          font-size: 20px;
          transform: scale(1.5);
          z-index: 2;
        }
      }
    }
  }
  .aim-picker {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 62px;
    height: 62px;
    border-radius: 6px;
    border: 2px solid #000;
    transform: translate(-50%, -50%) scale(1.8);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
}
</style>
