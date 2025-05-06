<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import { addOrder } from '@/api/order/order'
import type { addOrderDto } from '@/types/order'
import MyCalendar from '@/components/calendar/MyCalendar.vue'
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
const showCalendar = () => {
  const calendar = document.querySelector('.calendar')
  if (calendar) {
    calendar.classList.toggle('show')
  }
}
let selectedDate = ref('')
</script>
<template>
  <div class="add-form">
    {{ selectedDate }}
    <div class="form-item">
      <div class="label">商品：</div>
      <input type="text" v-model="commodity" />
    </div>
    <div class="form-item">
      <div class="label">金额：</div>
      <input type="number" v-model="amount" />
    </div>
    <div class="form-item">
      <div class="label">交易时间：</div>
      <div class="time-input">
        <div class="btn">此刻</div>
        <div class="btn">昨天</div>
        <div class="btn" @click="showCalendar">更多</div>
        <MyCalendar v-model="selectedDate" />
      </div>
    </div>
    <div class="submit-btn" @click="handleSubmit">提交</div>
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
