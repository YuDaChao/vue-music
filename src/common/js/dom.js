/**
 * 给某个dom添加class
 * @param el
 * @param className
 */
export function addClass (el, className) {
  if (hasClass(el, className)) {
    return false
  }
  // 获取指定dom的class名称
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

/**
 * 判断某个dom节点是否有某个class
 * @param el
 * @param className  \\s 表示空格
 * @returns {*}
 */
export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
