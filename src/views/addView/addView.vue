<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, inject, computed } from 'vue'
import { showLoadingToast, closeToast, showSuccessToast, showFailToast } from 'vant'
import { DatePicker, Calendar, Popup } from 'vant'
import { log } from 'console'

let IDB: any = inject('idbWrapper')
// 定义输入项接口
interface InputItem {
  date: string | string[] // val 可以是字符串、数字或日期,
  category: string
  amount: number
  detail: string
}
const inputItem = ref<InputItem>({
  category: '',
  amount: 0,
  date: '',
  detail: ''
})

let IsShowDatePickerPop = ref(false)
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
    message: '添加中'
  })
  let res = await IDB.add(result)
  if (!result.amount || !result.date || !result.category) {
    showFailToast('请检查数据')
    return
  }
  if (res.success) {
    toast.close()
    showSuccessToast('添加成功')
    inputItem.value = {
      // category: [],
      category: '',
      amount: 0,
      date: [],
      detail: ''
    }
  } else {
    showFailToast('添加失败')
  }
}
let initialDate = [
  new Date().getFullYear() + '',
  new Date().getMonth() + 1 + '',
  new Date().getDate() + ''
]
let handleDateConfirm = (val: string[]) => {
  inputItem.value.date = val
  IsShowDatePickerPop.value = false
  initialDate = val
}
let getFormatDate = computed(() => {
  let DateVal = inputItem.value.date
  if (!Array.isArray(DateVal)) {
    return ''
  } else {
    return DateVal.findIndex((item) => item == '') === -1
      ? `${DateVal[0]}/${DateVal[1]}/${DateVal[2]}`
      : ''
  }
})

let getDateTag = computed(() => {
  if (Array.isArray(inputItem.value.date)) {
    let inputDate = new Date(inputItem.value.date.join('-') + ' 23:59:59')
    let now = new Date()
    let currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    console.log(inputDate, currentDate)

    // const millisecondsPerDay = 24 * 60 * 60 * 1000;
    // console.log(Math.floor((currentDate.getTime() - inputDate.getTime()) / millisecondsPerDay));
  }
  // if (Array.isArray(inputItem.value.date)) {
  //   let inputDate = new Date(inputItem.value.date.map(Number))

  // }

  // let DateVal = new Date(...inputItem.value.date)
  // console.log(DateVal);

  return 'today'
  // let
})
onMounted(() => {})
</script>
<template>
  <div class="addView">
    <div class="title">ADD</div>
    <div class="add">
      <div class="add-item">
        <div class="add-item__title">amount:</div>
        <input class="add-item__input" placeholder="-" type="number" v-model="inputItem.amount" />
      </div>
      <div class="add-item">
        <div class="add-item__title">date:</div>
        <div class="add-item__input" @click="IsShowDatePickerPop = true">
          {{ getFormatDate || '-' }}
          <div v-if="getFormatDate" class="date-tag">{{ getDateTag }}</div>
        </div>
      </div>
      <div class="add-item">
        <div class="add-item__title">detail:</div>
        <input class="add-item__input" placeholder="-" type="text" v-model="inputItem.detail" />
      </div>
      <div class="add-item">
        <div class="add-item__title">category:</div>
        <input class="add-item__input" placeholder="-" type="text" v-model="inputItem.category" />
      </div>
    </div>
    <div class="submit-btn" @click="handleRecordSubmit">add!</div>

    <popup v-model:show="IsShowDatePickerPop" round position="bottom">
      <date-picker
        title="选择日期"
        v-model="initialDate"
        @confirm="(val) => handleDateConfirm(val.selectedValues)"
        :max-date="new Date()"
      />
    </popup>

    <!-- <calendar v-model:show="isCalendarShow" @confirm="handleDateConfirm" /> -->
  </div>
</template>
<style lang="less" scoped>
.addView {
  padding: 30rem;
  min-height: 100vh;

  .title {
    .title();
    font-size: 100rem;
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
        background: none;
        border: none;
        outline: none;
        border-bottom: 1px solid #000;
        display: flex;
        align-items: center;
      }
    }
  }

  .submit-btn {
    .btn();
  }
}
</style>
