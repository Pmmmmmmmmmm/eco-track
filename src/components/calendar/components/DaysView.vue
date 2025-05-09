<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, watch, watchEffect } from 'vue'
const { year, month } = defineProps({
  year: {
    type: Number,
    default: new Date().getFullYear()
  },
  month: {
    type: Number,
    default: new Date().getMonth() + 1
  }
})
const currentMonth = ref(new Date())
const preMonth = ref(new Date())
const nextMonth = ref(new Date())
const daysList = ref<number[]>([])
const fillDaysList = () => {
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDayOfWeek = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const currentDays = daysInMonth(currentMonth.value)
  const preDays = daysInMonth(preMonth.value)
  const startDay = firstDayOfWeek(currentMonth.value) || 7 // Sunday as 7

  daysList.value = []

  // Fill previous month's days
  for (let i = preDays - startDay + 2; i <= preDays; i++) {
    daysList.value.push(i)
  }

  // Fill current month's days
  for (let i = 1; i <= currentDays; i++) {
    daysList.value.push(i)
  }

  // Fill next month's days
  const remainingDays = 42 - daysList.value.length // Ensure 6 rows of 7 days
  for (let i = 1; i <= remainingDays; i++) {
    daysList.value.push(i)
  }
}
watchEffect(() => {
  currentMonth.value = new Date(`${year}-${month}`)
  if (month == 1) {
    preMonth.value = new Date(`${year - 1}-12`)
    nextMonth.value = new Date(`${year}-2`)
  } else if (month == 12) {
    nextMonth.value = new Date(`${year + 1}-1`)
    preMonth.value = new Date(`${year}-11`)
  } else {
    preMonth.value = new Date(`${year}-${month - 1}`)
    nextMonth.value = new Date(`${year}-${month + 1}`)
  }

  fillDaysList()

  // console.log('preMonth', preMonth.value.toLocaleDateString())
  // console.log('currentMonth', currentMonth.value.toLocaleDateString())
  // console.log('nextMonth', nextMonth.value.toLocaleDateString())
})

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>
<template>
  <div class="daysView">
    <div class="header">
      <div class="daysOfWeek" v-for="(item, index) in daysOfWeek" :key="index">{{ item }}</div>
    </div>
    <div class="body">
      <div class="day-item" v-for="(dayItem, index) in daysList" :key="index">{{ dayItem }}</div>
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
    flex: 1;
    display: flex;
    // justify-content: space-between;
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
    }
  }
}
</style>
