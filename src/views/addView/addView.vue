<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, inject } from 'vue'
import { showLoadingToast, closeToast, showSuccessToast, showFailToast } from 'vant';
let IDB: any = inject('idbWrapper')
// 定义输入项接口
// interface InputItem {
//   label: string;  // 标签，始终为字符串
//   val: string | number;  // val 可以是字符串、数字或日期
// }
const inputItem = ref({
  // category: [],
  category: '',
  amount: 0,
  date: 0,
  detail: ''
})
let handleRecordSubmit = async () => {
  const { category, amount, date, detail } = inputItem.value
  let result = {
    amount,
    date,
    detail,
    // category: category.join(',')
    category
  }
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: '添加中',
  });
  let res = await IDB.add(result)
  if (!result.amount || !result.date || !result.category) {
    showFailToast('请检查数据');
    return
  }
  if (res.success) {
    toast.close()
    showSuccessToast('添加成功');
    inputItem.value = {
      // category: [],
      category: '',
      amount: 0,
      date: 0,
      detail: ''
    }
  } else {
    showFailToast('添加失败');
  }

}
let isNum = (val: number | string) => {
  return typeof val === 'number'
}
onBeforeMount(() => { })
onMounted(() => { })
</script>
<template>
  <div class="addView">
    <div class="title">ADD</div>
    <div class="add">
      <div class="add-item">
        <div class="add-item__title">amount:</div>
        <input class="add-item__input" placeholder="-" type="number" v-model="inputItem.amount">
      </div>
      <div class="add-item">
        <div class="add-item__title">date:</div>
        <input class="add-item__input" placeholder="-" type="number" v-model="inputItem.date">
      </div>
      <div class="add-item">
        <div class="add-item__title">detail:</div>
        <input class="add-item__input" placeholder="-" type="text" v-model="inputItem.detail">
      </div>
      <div class="add-item">
        <div class="add-item__title">category:</div>
        <input class="add-item__input" placeholder="-" type="text" v-model="inputItem.category">
      </div>

    </div>
    <div class="submit-btn" @click="handleRecordSubmit">add!</div>
  </div>

</template>
<style lang="less" scoped>
.addView {
  padding: 30rem;
  min-height: 100vh;

  .title {
    .title();
    font-size: 10rem;
  }

  .add {
    margin: 40rem 0;

    .add-item {
      font-size: 40rem;
      user-select: none;

      .add-item__title {
        margin: 25rem 0 20rem 0;
      }

      .add-item__input {
        font-size: 40rem;
        font-family: 'MyFont';
        background: none;
        border: none;
        outline: none;
        border-bottom: 1px solid #000
      }
    }
  }

  .submit-btn {
    .btn();
  }
}
</style>
