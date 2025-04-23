<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, inject } from 'vue'
import { getOrderList } from '@/api/order/order'
import type { OrderDto } from '@/types/order'

let billsData = ref<OrderDto[]>([])
let getBillsData = async () => {
  let res = await getOrderList({
    page: 1,
    pageSize: 10
  })
  billsData.value = res.data.list
}
getBillsData()
</script>
<template>
  <div class="detailView">
    <div class="title">DETAIL</div>
    <div class="filter-bar">
      <div class="name">filter</div>
    </div>
    <div class="bills-list">
      <div class="bills-item" v-for="item in billsData" :key="item.id">
        <div>
          <div class="label">transactionTime:</div>
          <div class="value">{{ item.transactionTime }}</div>
        </div>
        <div>
          <div class="label">amount:</div>
          <div class="value">{{ item.amount }}</div>
        </div>
        <div>
          <div class="label">commodity:</div>
          <div class="value">{{ item.commodity }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped></style>
