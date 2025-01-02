<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, inject } from 'vue'
let IDB: any = inject('idbWrapper')
interface billsItem {
  amount: number
  date: number
  detail: string
  category: string
  id: number
}
let billsData = ref<billsItem[]>([])
let getBillsData = async () => {
  let res = await IDB.openCursor()
  billsData.value = res
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
        <div class="amount">
          <div class="label">amount:</div>
          <div class="value">{{ item.amount }}</div>
        </div>
        <div class="detail">
          <div class="label">detail:</div>
          <div class="value">{{ item.detail }}</div>
        </div>
        <div class="date">
          <div class="label">date:</div>
          <div class="value">{{ item.date }}</div>
        </div>
        <div class="category">
          <div class="label">category:</div>
          <div class="value">{{ item.category }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped></style>
