;(function (window, document) {
  const doc = document,
    docEl = doc.documentElement,
    remStyle = document.createElement('style')
  let tid: NodeJS.Timeout

  function refreshRem() {
    const width = docEl.clientWidth
    // 900宽度以上固定大小
    if (width >= 900) {
      docEl.style.fontSize = 900 / 750 + 'px'
      remStyle.innerHTML = 'html{font-size:' + 900 / 750 + 'px;}'
    } else {
      const rem = width / 750 // 750px宽度设计稿
      docEl.style.fontSize = rem + 'px'
      remStyle.innerHTML = 'html{font-size:' + rem + 'px;}'
    }
  }

  refreshRem()

  // 重新计算页面缩放时的rem值
  window.addEventListener(
    'resize',
    function () {
      clearTimeout(tid) // 防止触发多次resize事件
      tid = setTimeout(refreshRem, 300)
    },
    false
  )

  // 屏幕旋转时重新计算
  window.addEventListener(
    'pageshow',
    function (e) {
      if (e.persisted) {
        clearTimeout(tid)
        tid = setTimeout(refreshRem, 300)
      }
    },
    false
  )

  // 将<style>标签放入到文档的<head>中
  doc.head.appendChild(remStyle)
})(window, document)
