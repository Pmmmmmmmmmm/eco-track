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
<style lang="less" scoped>
.detailView {
  padding: 30rem;
  min-height: 100vh;

  .title {
    .title();
  }

  .bills-list {
    display: flex;
    flex-direction: column;

    .bills-item {
      margin: 20rem 0;
      padding: 30rem;
      background-color: #eed6a5;
      display: flex;
      align-items: center;
      flex-direction: column;
      box-shadow: 7rem 7rem 0rem 0px #844848;

      & > div {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:not(:last-child) {
          margin: 0 0 16rem 0;
        }

        .label {
          font-size: 36rem;
        }
      }
    }
  }
}
</style>
