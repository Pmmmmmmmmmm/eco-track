<script setup lang="ts">
import { ref, computed } from 'vue'
import DaysView from './components/DaysView.vue'
import YearAndMonth from './components/YearAndMonth.vue'
const year = ref(2024)
const month = ref(7)
const day = ref(30)
let currentView = ref<'calendar' | 'year&month'>('calendar')
function handleViewChange() {
  if (currentView.value === 'calendar') {
    currentView.value = 'year&month'
  } else {
    currentView.value = 'calendar'
  }
}
</script>
<template>
  <div class="calendar">
    <div class="year-month">
      <div class="year">{{ year }}</div>
      <div class="month">{{ month }}</div>
      <div class="day">{{ day }}</div>
    </div>
    <div class="calendar-header">
      <div class="ctrl-btn">cancel</div>
      <div class="ctrl-btn">confirm</div>
      <div class="ctrl-btn" @click="handleViewChange">change</div>
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
