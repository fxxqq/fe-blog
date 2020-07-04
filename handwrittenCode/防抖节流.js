// 防抖
function debounce(fn, time) {
  let timer = null;
  return function() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, time)
  }
}


// 节流
function throttle(fn, time) {
  let canRun = true;
  return function() {
    if (!canRun) {
      return
    }
    canRun = false;
    setTimeout(() => {
      fn.apply(this, arguments);
      canRun = true;
    }, time)
  }
}