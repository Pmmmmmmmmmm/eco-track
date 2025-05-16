<script setup lang="ts">
import { ref, computed } from 'vue'
import DaysView from './components/DaysView.vue'
import YearAndMonth from './components/YearAndMonth.vue'
const year = ref(new Date().getFullYear().toString())
const month = ref('01')
const day = ref('01')
const { defaultValue } = defineProps<{ defaultValue?: string }>()
function setDefaultDate(defaultDate: string | undefined) {
  if (defaultDate) {
    let dateList = defaultDate.split('-')
    year.value = dateList[0]
    month.value = dateList[1]
    day.value = dateList[2]
  }
}
setDefaultDate(defaultValue)
function setDateToToday() {
  let now = new Date()
  year.value = now.getFullYear().toString()
  month.value = (now.getMonth() + 1).toString().padStart(2, '0')
}
let currentView = ref<'calendar' | 'year&month'>('calendar')
function handleViewChange() {
  if (currentView.value === 'calendar') {
    currentView.value = 'year&month'
  } else {
    currentView.value = 'calendar'
  }
}
const getTipText = computed(() => {
  let now = new Date()
  let selectedDate = new Date(Number(year.value), Number(month.value) - 1, Number(day.value))
  let diff = selectedDate.getTime() - now.getTime()
  let daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return daysDiff == 0
    ? '今天'
    : daysDiff == -1
      ? `昨天`
      : daysDiff == -2
        ? '前天'
        : `${Math.abs(daysDiff)}天前`
})
const emit = defineEmits(['handleConfirm', 'handleCancel'])
</script>
<template>
  <div class="calendar">
    <div class="calendar-value">
      {{ year }}年 {{ month }}月 {{ day }}日
      <div class="value-tip">{{ getTipText }}</div>
    </div>
    <div class="calendar-header">
      <div class="ctrl-btn" @click="emit('handleCancel')">cancel</div>
      <div class="ctrl-btn" @click="emit('handleConfirm', [year, month, day])">confirm</div>
      <div class="ctrl-btn" @click="handleViewChange">切换视图</div>
      <div class="ctrl-btn" @click="setDateToToday">今</div>
    </div>
    <div class="calendar-body">
      <YearAndMonth
        :currentView="currentView"
        v-show="currentView === 'year&month'"
        v-model:year="year"
        v-model:month="month"
      />
      <DaysView
        v-show="currentView === 'calendar'"
        v-model:year="year"
        v-model:month="month"
        v-model:day="day"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.calendar {
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #dbd5ae;

  .calendar-value {
    padding: 10px;
    font-size: 24px;
    display: flex;
    align-items: center;
    .value-tip {
      font-size: 16px;
      color: #666;
      margin-left: 10px;
      border: 1px solid #000000;
      padding: 4px;
      width: fit-content;
      border-radius: 4px;
    }
  }
  .calendar-header {
    display: flex;
    align-items: center;
    .ctrl-btn {
      height: 30px;
      padding: 0 10px;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f0f0f0;
      border-radius: 5px;
      margin: 10px;
      cursor: pointer;
    }
  }

  .calendar-body {
    width: 100vw;
    height: 80vw;
  }
}
</style>
