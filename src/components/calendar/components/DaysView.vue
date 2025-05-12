<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, watch, watchEffect } from 'vue'

type DayItem = {
  daysNum: number
  monthNum: number
  yearNum: number
}
let year = defineModel('year', {
  type: Number,
  default: new Date().getFullYear()
})
let month = defineModel('month', {
  type: Number,
  default: new Date().getMonth() + 1
})
let day = defineModel('day', {
  type: Number,
  default: new Date().getDate()
})
const currentMonth = ref(new Date())
const preMonth = ref(new Date())
const nextMonth = ref(new Date())
let preList = ref<DayItem[]>([])
let currentList = ref<DayItem[]>([])
let nextList = ref<DayItem[]>([])
const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
const firstDayOfWeek = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

const fillDaysList = () => {
  const currentMonthDays = daysInMonth(currentMonth.value)
  const preMonthDays = daysInMonth(preMonth.value)
  const startDay = firstDayOfWeek(currentMonth.value) || 7 // Sunday as 7
  const endDay = firstDayOfWeek(nextMonth.value) || 7 // Sunday as 7
  preList.value = []
  currentList.value = []
  nextList.value = []

  if (startDay > 1) {
    // 如果当前月的第一天不是周一，则需要填充上个月的日期
    // 比如当前月的第一天是周三，则需要填充上个月的最后两天形成完整的一周
    let needPreMonth = startDay - 1 // 计算上个月需要填充的天数(算出上月最后一天是周几就需要补几天)
    for (let day = preMonthDays; preList.value.length < needPreMonth; day--) {
      preList.value.unshift({
        daysNum: day,
        monthNum: preMonth.value.getMonth() + 1,
        yearNum: preMonth.value.getFullYear()
      })
    }
  } else if (startDay == 1) {
    // 补充一整周的上月日期
    for (let day = preMonthDays; preList.value.length < 7; day--) {
      preList.value.unshift({
        daysNum: day,
        monthNum: preMonth.value.getMonth() + 1,
        yearNum: preMonth.value.getFullYear()
      })
    }
  }
  for (let day = 1; day <= currentMonthDays; day++) {
    currentList.value.push({
      daysNum: day,
      monthNum: currentMonth.value.getMonth() + 1,
      yearNum: currentMonth.value.getFullYear()
    })
  }
  if (endDay > 1) {
    let needNextMonth = 7 - endDay + 1 // 计算下个月需要填充的天数（计算出本月最后一天是周几，再用7减去它，就是需要补的下个月的天数）
    for (let day = 1; nextList.value.length < needNextMonth; day++) {
      nextList.value.push({
        daysNum: day,
        monthNum: nextMonth.value.getMonth() + 1,
        yearNum: nextMonth.value.getFullYear()
      })
    }
  } else if (endDay == 1) {
    // 补充一整周的下月日期
    for (let day = 1; nextList.value.length < 7; day++) {
      nextList.value.push({
        daysNum: day,
        monthNum: nextMonth.value.getMonth() + 1,
        yearNum: nextMonth.value.getFullYear()
      })
    }
  }
}
watchEffect(() => {
  currentMonth.value = new Date(`${year.value}-${month.value}`)
  if (month.value == 1) {
    preMonth.value = new Date(`${year.value - 1}-12`)
    nextMonth.value = new Date(`${year.value}-2`)
  } else if (month.value == 12) {
    nextMonth.value = new Date(`${year.value + 1}-1`)
    preMonth.value = new Date(`${year.value}-11`)
  } else {
    preMonth.value = new Date(`${year.value}-${month.value - 1}`)
    nextMonth.value = new Date(`${year.value}-${month.value + 1}`)
  }
  fillDaysList()
})
function handleDayClick({ daysNum, monthNum, yearNum }: DayItem) {
  year.value = yearNum
  month.value = monthNum
  day.value = daysNum
}

function checkSelectedDay({ daysNum, monthNum, yearNum }: DayItem) {
  return daysNum == day.value && monthNum == month.value && yearNum == year.value
}

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>
<template>
  <div class="daysView">
    <div class="header">
      <div class="daysOfWeek" v-for="(item, index) in daysOfWeek" :key="index">{{ item }}</div>
    </div>
    <div class="body">
      <div
        class="day-item is-pre-month"
        :class="{
          last_preMonth_day: index === preList.length - 1
        }"
        v-for="(dayItem, index) in preList"
        :key="dayItem.monthNum.toString() + index"
        @click.capture="handleDayClick(dayItem)"
      >
        {{ dayItem.daysNum }}
      </div>
      <div
        class="day-item"
        :class="{
          'day-item-active': checkSelectedDay(dayItem)
        }"
        v-for="(dayItem, index) in currentList"
        :key="dayItem.monthNum + index"
        @click.capture="handleDayClick(dayItem)"
      >
        {{ dayItem.daysNum }}
      </div>
      <div
        class="day-item is-next-month"
        :class="{
          first_nextMonth_day: index === 0
        }"
        v-for="(dayItem, index) in nextList"
        :key="dayItem.monthNum + index"
        @click.capture="handleDayClick(dayItem)"
      >
        {{ dayItem.daysNum }}
      </div>
      <div class="year-month-bcg">{{ year }}/{{ month }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.daysView {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #dbd5ae;
  font-size: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #757575;
    .daysOfWeek {
      width: calc(100% / 7);
      text-align: center;
      line-height: 30px;
    }
  }
  .body {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .day-item {
      width: calc(100% / 7);
      text-align: center;
      height: 40px;
      line-height: 40px;
      &:nth-child(7n-1),
      &:nth-child(7n) {
        color: rgb(202, 101, 101);
      }
      background-color: transparent;
      z-index: 2;
      transition: all 0.2s ease;
      cursor: pointer;
      user-select: none;
      border-radius: 6px;
    }
    .day-item-active {
      background-color: #cee2eb;
      color: #b41212;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      font-size: 30px;
      z-index: 3;
    }
    .is-pre-month {
      color: #757575;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 0;
    }
    .is-next-month {
      color: #757575;
      background-color: rgb(220, 255, 212);
      border-radius: 0;
    }
    .last_preMonth_day {
      border-radius: 0 6px 6px 0;
    }
    .first_nextMonth_day {
      border-radius: 6px 0 0 6px;
    }
    .year-month-bcg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 120px;
      z-index: 1;
      pointer-events: none;
      color: rgba(0, 0, 0, 0.082);
      text-decoration: wavy;
    }
  }
}
</style>
