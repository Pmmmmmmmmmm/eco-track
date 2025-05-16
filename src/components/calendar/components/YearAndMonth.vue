<script setup lang="ts">
import { ref, watchEffect, nextTick, watch } from 'vue'
import { useDomState } from './getDomState'

//年份范围
const YEARS_NUMBER = 3 //年份范围
const CATCH_DISTANCE = 50 //忽略的距离
const SCROLL_DONE_TIME = 280 //判断滚动完成等待的时间
const dateRef = ref<HTMLElement | HTMLElement[] | null>(null) //获取年月项元素
const scrollTableRef = ref<HTMLElement | null>(null) //获取年月表格元素
const scrollBoxRef = ref<HTMLElement | null>(null) //获取滚动容器元素
const locationMap = new Map() //存储年月项的坐标位置
const XSet = new Set<number>() //存储年月项的X坐标位置
const YSet = new Set<number>() //存储年月项的Y坐标位置
let widthPadding = 0 //滚动容器的横向padding值
let heightPadding = 0 //滚动容器竖向的padding值
let isAllDone = false //是否完成初始化
let { currentView } = defineProps<{ currentView: 'calendar' | 'year&month' }>()
watch(
  () => currentView,
  (val) => {
    if (val === 'year&month' && !isAllDone) {
      init()
    }
  },
  {
    immediate: true
  }
)

function init() {
  isAllDone = true
  nextTick(() => {
    handleDynamicPadding() //根据宽高自动获取padding值
    getLocationList() //计算年月项的坐标位置，存储到locationMap中
    bindMainScroll() //绑定滚动事件
    initDoneAction() //绑定操作完成的事件，页面滚动到匹配的元素位置
    handleDefaultShow() //处理默认值回显
  })
}
// 根据宽高自动获取padding值
function handleDynamicPadding() {
  if (scrollTableRef.value && scrollBoxRef.value) {
    let parentWidth = scrollBoxRef.value.offsetWidth
    let parentHeight = scrollBoxRef.value.offsetHeight
    scrollTableRef.value.style.padding = `calc(${parentHeight / 2}px - 30px) calc(${
      parentWidth / 2
    }px - 30px)`
  }
}

// 计算年月项的坐标位置，存储到locationMap中
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
// 绑定滚动事件
function bindMainScroll() {
  scrollBoxRef.value && scrollBoxRef.value.addEventListener('scroll', handleOnScroll)
}
// 处理滚动事件
function handleOnScroll() {
  if (!scrollBoxRef.value) return
  const scrollBox = scrollBoxRef.value
  let currentCenter = {
    x: Math.floor(scrollBox.scrollLeft),
    y: Math.floor(scrollBox.scrollTop)
  }
  getMatchByCenter(currentCenter)
}
// 处理默认值回显
function handleDefaultShow() {
  // 第一次进入时，默认选中当前年月
  if (Array.isArray(dateRef.value)) {
    // 找到对应的元素
    let currentDate = dateRef.value.find((item) => {
      let yearValue = item.getAttribute('yearValue')
      let monthValue = item.getAttribute('monthValue')
      return currentYear.value === yearValue && currentMonth.value === monthValue
    })

    if (currentDate) {
      // 滚动到对应的元素位置
      let x = Math.floor(currentDate.offsetLeft - widthPadding)
      let y = Math.floor(currentDate.offsetTop - heightPadding)
      let matchStr = `${x},${y}`
      handleNewMatch(matchStr)
      handleScrollTo({
        top: currentDate.offsetTop,
        left: currentDate.offsetLeft,
        behavior: 'instant'
      })
    }
  }
}
let lastMatch = ''
// 根据目前中心位置匹配到最近的年月项
function getMatchByCenter({ x, y }: { x: number; y: number }) {
  let X = Array.from(XSet).sort((a: number, b: number) => Math.abs(a - x) - Math.abs(b - x))[0]
  let Y = Array.from(YSet).sort((a: number, b: number) => Math.abs(a - y) - Math.abs(b - y))[0]
  // 找到距离中心点最近的年月项
  let matchStr = `${X},${Y}`
  // 计算距离
  let distance = getPointDistance([X, Y], [x, y])
  //如果有上一个匹配的项
  if (lastMatch) {
    //获取上一个匹配的项
    let lastItem = locationMap.get(lastMatch)
    let lastPoint = lastMatch.split(',').map((item) => Number(item))
    //计算上一个匹配项与当前屏幕中心的距离
    let distance = getPointDistance([lastPoint[0], lastPoint[1]], [x, y])
    if (distance <= CATCH_DISTANCE) return // 如果距离小于捕获距离，则不处理

    lastItem && lastItem.classList.remove('active')
    lastMatch = ''
  }

  if (`${X},${Y}` === lastMatch || distance > CATCH_DISTANCE) return // 如果匹配到的元素和上一个元素相同，或者距离大于捕获距离，则不处理
  handleNewMatch(matchStr)
}
// 计算两点之间的距离
function getPointDistance(posA: [number, number], posB: [number, number]) {
  return Math.sqrt(Math.pow(posA[0] - posB[0], 2) + Math.pow(posA[1] - posB[1], 2))
}

let year = defineModel('year', {
  type: String
})
let month = defineModel('month', {
  type: String
})
watch(
  () => currentView,
  (val) => {
    if (val === 'year&month') {
      currentMonth.value = month.value
      currentYear.value = year.value
      // 处理默认值回显
      nextTick(() => {
        handleDefaultShow()
      })
    }
  }
)

const currentYear = ref(year.value) //当前选中的年份
const currentMonth = ref(month.value) //当前选中的月份
// 处理匹配到的年月项
function handleNewMatch(matchStr: string) {
  if (lastMatch) {
    let lastItem = locationMap.get(lastMatch)
    lastItem && lastItem.classList.remove('active')
  }
  lastMatch = matchStr
  let newItem = locationMap.get(matchStr)
  if (newItem) {
    newItem.classList.add('active')
    currentYear.value = newItem.getAttribute('yearValue')
    currentMonth.value = newItem.getAttribute('monthValue')
  }
}
// 绑定操作完成的事件，页面滚动到匹配的元素位置
function initDoneAction() {
  let el = scrollBoxRef.value
  if (!el) return
  const { touchState, scrollState } = useDomState(el, {
    scrollDoneTime: SCROLL_DONE_TIME
  })
  watchEffect(() => {
    if (touchState.value == 'end' && scrollState.value == 'end') {
      if (!lastMatch) return
      year.value = currentYear.value
      month.value = currentMonth.value
      let target = locationMap.get(lastMatch)
      handleScrollTo({ top: target.offsetTop, left: target.offsetLeft })
    }
  })
}
// 滚动到指定位置
function handleScrollTo({
  top,
  left,
  behavior
}: {
  top: number
  left: number
  behavior?: ScrollBehavior
}) {
  scrollBoxRef.value &&
    scrollBoxRef.value.scrollTo({
      top: top - heightPadding,
      left: left - widthPadding,
      behavior: behavior || 'smooth'
    })
}
//获取年份列表
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
            :key="yearItem + monthItem.value"
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
  width: 100%;
  height: 100%;
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
