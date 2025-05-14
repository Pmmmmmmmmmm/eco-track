<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, useTemplateRef, watchEffect } from 'vue'
import { useDomState } from '../../calendar/components/getDomState'
const { options } = defineProps<{ options: unknown[] }>()

let listRef = useTemplateRef('listRef')
let itemsRef = useTemplateRef('itemsRef')
let itemPosList: Map<number, HTMLElement> | null = new Map()
let childHeight = 0
function bindDomDoneAction() {
  // 绑定操作完成的事件，页面滚动到匹配的元素位置
  if (!listRef.value) return
  const { touchState, scrollState } = useDomState(listRef.value, {
    scrollDoneTime: 100
  })
  watchEffect(() => {
    if (touchState.value == 'end' && scrollState.value == 'end') {
      handleDoneAction()
    }
  })
}

function init() {
  // 动态设置padding值
  let padding = setDynamicPadding()
  if (!itemsRef.value) return
  // 初始化itemPosList
  itemPosList = getTargetPositionList(itemsRef.value, padding)
  // 绑定滚动事件
  bindMainScroll()
  // 绑定操作完成的事件，页面滚动到匹配的元素位置
  bindDomDoneAction()
}
function getTargetPositionList(target: HTMLElement[] | null, padding: number | null) {
  if (!target || !padding) return null
  let map = new Map()
  target.forEach((item) => {
    map.set(item.offsetTop - padding, item)
  })
  return map
}
function setDynamicPadding() {
  if (!listRef.value) return null
  childHeight = (listRef.value.children[0].children[0] as HTMLElement).offsetHeight
  let paddingTarget = listRef.value.children[0] as HTMLElement
  let scrollListPadding = Math.floor((listRef.value.offsetHeight - childHeight) / 2)
  paddingTarget.style.padding = `${scrollListPadding}px 0px`
  return scrollListPadding
}
function bindMainScroll() {
  if (!listRef.value) return
  listRef.value.addEventListener('scroll', (e) => {
    handleOnScroll(e)
  })
}
onMounted(() => {
  init()
})

let lastSelectedItem = ref<HTMLElement | null>(null)
let currentSelectedItemPos = 0
let lastScrollLocation = 0
function handleOnScroll(e: Event) {
  if (e.target) {
    let scrollTop = (e.target as HTMLElement).scrollTop
    let matchPos = Math.round(scrollTop / childHeight) * childHeight
    let targetItem = itemPosList?.get(matchPos)

    let preItem = itemPosList?.get(matchPos - childHeight)
    let nextItem = itemPosList?.get(matchPos + childHeight)

    // preItem && setAnimation(preItem, false, (scrollTop - (matchPos - childHeight)) / scrollTop)
    console.log(Math.abs(matchPos - scrollTop) / scrollTop)

    // targetItem && setAnimation(targetItem, true, (scrollTop - matchPos) / scrollTop)

    // nextItem && setAnimation(nextItem, false, (scrollTop - (matchPos + childHeight)) / scrollTop)

    // if
    // if (lastSelectedItem.value) {
    //   lastSelectedItem.value.classList.remove('active')
    // }
    // targetItem?.classList.add('active')
    // currentSelectedItemPos = Math.round(scrollTop / 50) * 50

    lastSelectedItem.value = targetItem ? targetItem : null
  }
}
let num = 0
function setAnimation(target: HTMLElement, isShowing: boolean, rate: number) {
  // 给当前选中的元素设置动画
  requestAnimationFrame(() => {
    if (isShowing) {
      target.style.transform = `scale(${1.6 * rate})`
    } else {
      target.style.transform = `scale(${1 * (1 - rate)})`
    }
  })
}
function handleDoneAction() {
  listRef.value?.scrollTo({
    top: currentSelectedItemPos,
    behavior: 'smooth'
  })
}
</script>
<template>
  <div ref="listRef" class="list">
    <div>
      <div class="scroll-item" ref="itemsRef" v-for="(item, index) in options" :key="index">
        {{ item }}
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: scroll;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  .scroll-item {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #004830;
    height: 50px;
    line-height: 50px;
    flex-shrink: 0;
    padding: 0 30px;
    transform: scale(1);
  }
  // .active {
  //   transform: scale(1.6);
  //   color: #0970c9;
  // }
}
</style>
