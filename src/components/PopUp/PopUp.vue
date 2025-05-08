<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, Teleport, watch, nextTick } from 'vue'
type Location = 'top' | 'bottom' | 'left' | 'right'
const {
  location,
  closeOnClickMask = true,
  showMask = true
} = defineProps<{
  location?: Location
  closeOnClickMask?: boolean
  showMask?: boolean
}>()
const visible = defineModel('visible', {
  type: Boolean,
  default: true,
  required: true
})

const popUpRef = ref<HTMLElement | null>(null)
const maskRef = ref<HTMLElement | null>(null)
const setLocation = (popState: boolean) => {
  if (!popUpRef.value || !location) return

  if (location === 'top') {
    popUpRef.value.style.transform = 'translateY(-100%)'
  } else if (location === 'bottom') {
    popUpRef.value.style.transform = 'translateY(100%)'
  } else if (location === 'left') {
    popUpRef.value.style.transform = 'translateX(-100%)'
  } else if (location === 'right') {
    popUpRef.value.style.transform = 'translateX(100%)'
  }
  if (popState) {
    if (maskRef.value) {
      maskRef.value.style.display = 'block'
      let timer = setTimeout(() => {
        if (maskRef.value) maskRef.value.style.opacity = '1'
        clearTimeout(timer)
      })
    }
    if (!popUpRef.value || !location) return
    if (['top', 'bottom'].includes(location)) {
      popUpRef.value.style.transform = 'translateY(0)'
    } else if (['left', 'right'].includes(location)) {
      popUpRef.value.style.transform = 'translateX(0)'
    }
  } else {
    if (maskRef.value) {
      if (maskRef.value) maskRef.value.style.opacity = '0'
      let timer = setTimeout(() => {
        if (maskRef.value) maskRef.value.style.display = 'none'
        clearTimeout(timer)
      }, 300)
    }
  }
}
watch(visible, setLocation)
onMounted(() => {
  setLocation(visible.value)
  if (popUpRef.value && location) popUpRef.value.style[location] = '0px'
})
</script>
<template>
  <Teleport to="body">
    <div
      v-if="showMask"
      class="pop-up-mask"
      @click.stop="closeOnClickMask && (visible = false)"
      ref="maskRef"
    ></div>
    <div ref="popUpRef" class="pop-up-container">
      <slot></slot>
    </div>
  </Teleport>
</template>
<style lang="less" scoped>
.pop-up-mask {
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  transition: all 0.3s ease-in-out;
}
.pop-up-container {
  z-index: 10001;
  position: fixed;
  transition: all 0.3s ease-in-out;
  width: fit-content;
  height: fit-content;
}

.mask-show {
  opacity: 1;
}
</style>
