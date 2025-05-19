<script setup lang="ts">
import { ref, Teleport, watch, onMounted } from 'vue'
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
  required: true
})

const popUpRef = ref<HTMLElement | null>(null)
const maskRef = ref<HTMLElement | null>(null)
const setLocation = (popState: boolean) => {
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
      maskRef.value.style.opacity = '0'
      if (popUpRef.value) popUpRef.value.style.transform = 'translateY(100%)'
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
    <div
      ref="popUpRef"
      class="pop-up-container"
      :class="{
        'top-pop': location === 'top',
        'bottom-pop': location === 'bottom',
        'left-pop': location === 'left',
        'right-pop': location === 'right'
      }"
    >
      <slot></slot>
    </div>
  </Teleport>
</template>
<style lang="less" scoped>
.pop-up-mask {
  display: none;
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
.top-pop {
  top: 0;
  transform: translateY(-100%);
}
.bottom-pop {
  bottom: 0;
  transform: translateY(100%);
}
.left-pop {
  left: 0;
  transform: translateX(-100%);
}
.right-pop {
  right: 0;
  transform: translateX(100%);
}

.mask-show {
  opacity: 1;
}
</style>
