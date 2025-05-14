<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import { addOrder } from '@/api/order/order'
import type { addOrderDto } from '@/types/order'
import MyCalendar from '@/components/calendar/MyCalendar.vue'
import PopUp from '@/components/PopUp/PopUp.vue'
import TimePicker from '@/components/TimePicker/TimePicker.vue'
onBeforeMount(() => {})
onMounted(() => {})
let commodity = ref('')
let amount = ref(0)
let transactionTime = ref('')

const handleSubmit = async () => {
  let res = await addOrder({
    commodity: commodity.value,
    amount: amount.value,
    transactionTime: transactionTime.value
  })
}
let selectedDate = ref(new Date())
let visible = ref<boolean>(false)
let TimePickerVisible = ref<boolean>(true)
function handleCalendarSelected(date: [number, number, number]) {
  selectedDate.value = new Date(date[0], date[1] - 1, date[2])
  visible.value = false
}
</script>
<template>
  <div class="add-order">
    <PopUp v-model:visible="visible" location="bottom">
      <MyCalendar @handle-confirm="handleCalendarSelected" @handle-cancel="visible = false" />
    </PopUp>
    <PopUp v-model:visible="TimePickerVisible" location="bottom">
      <TimePicker />
    </PopUp>
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
          {{ selectedDate.getFullYear() }}/{{ selectedDate.getMonth() + 1 }}/{{
            selectedDate.getDate()
          }}
          <div class="btn" @click="visible = true">SELECT DATE</div>
        </div>
      </div>
      <div class="form-item">
        <div class="label">TIME：</div>
        <div class="time-input">
          <div class="btn">SELECT TIME</div>
        </div>
      </div>
      <div class="submit-btn" @click="handleSubmit">SUBMIT</div>
    </div>
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
