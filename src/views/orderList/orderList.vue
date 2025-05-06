<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, inject, computed } from 'vue'
import { getOrderList } from '@/api/order/order'
import type { OrderDto } from '@/types/order'
import { formatDate } from '@/utils'
import { useRouter } from 'vue-router'
const router = useRouter()
const handleNavToAdd = () => {
  router.push('/addOrder')
}

let billsData = ref<OrderDto[]>([])
let getBillsData = async () => {
  let res = await getOrderList({
    page: 1,
    pageSize: 10
  })
  billsData.value = res.data.data.list
}
getBillsData()
</script>
<template>
  <div class="order-list">
    <div class="order-item add-btn" @click="handleNavToAdd">+</div>
    <div class="order-item" v-for="item in billsData" :key="item.id">
      <div class="info-item">
        <div class="label">交易时间:</div>
        <div class="value">
          {{ formatDate(item.transactionTime) }}
        </div>
      </div>

      <div class="info-item">
        <div class="label">商品:</div>
        <div class="value">{{ item.commodity }}</div>
      </div>
      <div class="info-item">
        <div class="label">金额:</div>
        <div class="value">{{ item.amount }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.order-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 10px;
  .order-item {
    width: 100%;
    padding: 20px;
    border: 1px solid #ccc;
    background-color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-radius: 6px;
    .info-item {
      display: flex;
      align-items: center;
      line-height: 30px;
      .label {
        font-size: 20px;
        line-height: 26px;
        color: rgb(0, 90, 169);
      }
      .value {
        margin: 0 0 0 10px;
        font-size: 18px;
        line-height: 30px;
      }
    }
  }
  .add-btn {
    position: sticky;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: black;
  }
}
</style>
