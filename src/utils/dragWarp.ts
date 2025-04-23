export default function(el: HTMLElement,options: {target: HTMLElement, topEdgeEl: HTMLElement, bottomEdgeEl: HTMLElement}) {
      const target = document.querySelector('#app')
      // 获取容器（不是拖动的元素）的边界
      const topEdgeEl = document.querySelector('.app-nav')
      const bottomEdgeEl = document.querySelector('.footBar-nav-box')
      el.style.transform = 'translate(0px,0px)'
      let lastTransformX = 0
      let lastTransformY = 0
      let lastTouchX = 0
      let lastTouchY = 0
      // 移除当前页面的el
      el.remove()
      // 把el层级提高
      const appElement = document.getElementById('app')
      if (appElement) {
        appElement.appendChild(el)
      }
      // 自定义beforeHooks用来在离开页面时移除el
      const customerHook = function(this: any, to: any, from: any, next: any) {
        el.remove()
        next()
        // 移除绑定的自定义hook
        const index = this.$router.beforeHooks.findIndex(item => item === customerHook)
        this.$router.beforeHooks.splice(index, 1)
      }
      // 推入自定义hook到触发列表
      this.$router.beforeHooks.push(customerHook)

      const startDrag:() = (e) => {
        // 按下触发
        e.stopPropagation()
        // 记录按下位置
        ;[lastTouchX, lastTouchY] = [e.changedTouches[0].screenX, e.changedTouches[0].screenY].map(item => Number(item))
        el.addEventListener('touchmove', duringDrag, { passive: false })
        el.addEventListener('touchend', endDrag, { passive: false })
      }

      const duringDrag = (e) => {
        e.stopPropagation()
        e.preventDefault()
        // 检测X方向变化数值
        const XChange = e.changedTouches[0].screenX - lastTouchX
        const YChange = e.changedTouches[0].screenY - lastTouchY
        // 是不是到了X最小值
        const lessXFlag = XChange <= 0 && el.offsetLeft + lastTransformX < 1 // 数字1 给出余量，避免过度拖动
        // 是不是到了X最大值
        const moreXFlag = XChange >= 0 && el.offsetLeft + lastTransformX + el.clientWidth > target.clientWidth + target.offsetLeft - 1
        // topEdgeEl、bottomEdgeEl 手动添加了上下边界
        const lessYFlag = YChange <= 0 && el.offsetTop + lastTransformY < topEdgeEl.clientHeight + 1
        const moreYFlag = YChange >= 0 && el.offsetTop + lastTransformY + el.clientHeight > target.clientHeight + target.offsetTop - bottomEdgeEl.clientHeight - 1
        // 下一个位置
        const nextTransformX = lessXFlag ? -el.offsetLeft : moreXFlag ? target.clientWidth + target.offsetLeft - el.clientWidth - el.offsetLeft : lastTransformX + XChange
        const nextTransformY = lessYFlag ? -el.offsetTop + topEdgeEl.clientHeight + 1 : moreYFlag ? target.clientHeight + target.offsetTop - el.clientHeight - el.offsetTop - bottomEdgeEl.clientHeight : lastTransformY + YChange
        // 触发css变化
        el.style.transform = `translate(${nextTransformX}px,${nextTransformY}px)`
        // 记录新值
        ;[lastTouchX, lastTouchY] = [e.changedTouches[0].screenX, e.changedTouches[0].screenY]
        ;[lastTransformX, lastTransformY] = [nextTransformX, nextTransformY]
      }
      const endDrag = (e) => {
        e.stopPropagation()
        el.removeEventListener('touchmove', duringDrag)
        el.removeEventListener('touchend', endDrag)
      }
      // 事件监听
      el.addEventListener('touchstart', startDrag, { passive: false })
    }