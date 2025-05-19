<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, watch } from 'vue'
import { addOrder } from '@/api/order/order'
import type { addOrderDto } from '@/types/order'
import MyCalendar from '@/components/calendar/MyCalendar.vue'
import PopUp from '@/components/PopUp/PopUp.vue'
import TimePicker from '@/components/TimePicker/TimePicker.vue'
onBeforeMount(() => {})
onMounted(() => {})
let commodity = ref('')
let amount = ref(0)
let transactionTime = ref(
  `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:${new Date().getSeconds().toString().padStart(2, '0')}`
)
let transactionDate = ref(
  `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
)

const handleSubmit = async () => {
  let res = await addOrder({
    commodity: commodity.value,
    amount: amount.value,
    transactionTime: transactionTime.value
  })
}
let datePickerVisible = ref<boolean>(false)

let timePickerVisible = ref<boolean>(false)
function handleCalendarSelected(date: [number, number, number]) {
  transactionDate.value = `${date[0]}-${date[1]}-${date[2]}`
  datePickerVisible.value = false
}
function handleTimeSelected(time: [string, string, string]) {
  transactionTime.value = `${time[0]}:${time[1]}:${time[2]}`
  timePickerVisible.value = false
}
</script>
<template>
  <div class="add-order">
    <div class="add-form">
      <div class="form-item">
        <div class="label">commodity：</div>
        <input type="text" v-model="commodity" />
      </div>
      <div class="form-item">
        <div class="label">amount：</div>
        <input type="number" v-model="amount" />
      </div>
      <div class="form-item">
        <div class="label">DATE：</div>
        <div class="time-input">
          {{ transactionDate }}
          <div class="btn" @click="datePickerVisible = true">SELECT</div>
        </div>
      </div>
      <div class="form-item">
        <div class="label">TIME：</div>
        <div class="time-input">
          {{ transactionTime }}
          <div class="btn" @click="timePickerVisible = true">SELECT</div>
        </div>
      </div>
      <div class="submit-btn" @click="handleSubmit">SUBMIT</div>
    </div>
    <PopUp v-model:visible="datePickerVisible" location="bottom">
      <MyCalendar
        :default-value="transactionDate"
        @handle-confirm="handleCalendarSelected"
        @handle-cancel="datePickerVisible = false"
      />
    </PopUp>
    <PopUp v-model:visible="timePickerVisible" location="bottom">
      <TimePicker
        :default-value="transactionTime"
        @handle-confirm="handleTimeSelected"
        @handle-cancel="timePickerVisible = false"
      />
    </PopUp>
  </div>
</template>
<style lang="less" scoped>
.add-form {
  display: flex;
  flex-direction: column;
  font-size: 26px;
  padding: 30px;
  gap: 20px;
  .form-item {
    display: flex;
    align-items: center;

    .label {
      white-space: nowrap;
    }
    input {
      width: 100%;
      border: none;
      border-bottom: 2px solid #dbd5ae;
      padding: 5px 0;
    }
    .time-input {
      display: flex;
      align-items: center;
      gap: 10px;
      .btn {
        padding: 5px 10px;
        background-color: #86a838;
        border-radius: 5px;
        cursor: pointer;
        color: azure;
      }
      .calendar {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
    }
  }
  .submit-btn {
    width: 100%;
    padding: 10px;
    background-color: #dbd5ae;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
