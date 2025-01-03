<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, watch, watchEffect } from 'vue'
onBeforeMount(() => {})
onMounted(() => {})
const props = defineProps({
  currentDay: {
    default: [new Date().getFullYear(), new Date().getMonth() + 1]
  }
})
type Days = {
  day: number
  date: number[]
}
const daysList = ref<Array<Days>>([])
function getDaysList(start: number, length: number, year: number, month: number) {
  return Array.from({ length }).map((_, index) => {
    return {
      day: start + index,
      date: [year, month, start + index]
    }
  })
}
let initCurrentTable = function (currentDate: number[]) {
  const result: Array<Days> = []
  let [year, month] = currentDate
  // 当前月份的天数
  let currentMonthDaysNum = new Date(year, month - 1, 0).getDate()
  // 上个月的天数
  let preMonthDaysNum = new Date(
    month === 1 ? 12 : month - 1,
    month === 1 ? year - 1 : year,
    0
  ).getDate()
  // 当前月份第一天是星期几
  let firstDayWeek = new Date(year, month - 1, 1).getDay()
  if (firstDayWeek > 1) {
    result.push(
      ...getDaysList(
        preMonthDaysNum - firstDayWeek + 2,
        firstDayWeek - 1,
        month === 1 ? year - 1 : year,
        month === 1 ? 12 : month - 1
      )
    )
  }

  result.push(...getDaysList(1, currentMonthDaysNum, year, month))
  // 当前月份最后一天是星期几
  let lastDayWeek = new Date(year, month - 1, currentMonthDaysNum).getDay()
  if (lastDayWeek < 7) {
    result.push(
      ...getDaysList(
        1,
        7 - lastDayWeek,
        month === 12 ? year + 1 : year,
        month === 12 ? 1 : month + 1
      )
    )
  }
  console.log(result)

  return result
}
function handleDaysClick(item: Days) {
  console.log(item.date.join('-'))
}

watchEffect(() => {
  daysList.value = initCurrentTable(props.currentDay)
})

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>
<template>
  <div>
    <div class="header">
      <div class="daysOfWeek-item" v-for="(item, index) in daysOfWeek" :key="index">{{ item }}</div>
    </div>
    <div class="body">
      <div
        class="days-item"
        v-for="(item, index) in daysList"
        :key="index"
        @click="handleDaysClick(item)"
      >
        {{ item.day }}
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  .daysOfWeek-item {
    width: 14.28%;
    text-align: center;
    &:nth-child(7n),
    &:nth-child(7n-1) {
      color: rgb(238, 118, 118);
    }
  }
}
.body {
  display: flex;
  flex-wrap: wrap;
  .days-item {
    width: 14.28%;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    &:nth-child(7n),
    &:nth-child(7n-1) {
      color: rgb(238, 118, 118);
    }
  }
}
</style>
