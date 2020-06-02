/**
 * @Description: 根据行政区划获取等级
 * @author 张淼
 * @date 2019/4/11
*/
export const getLevel = code => {
}

/* 将数字每三位加 ，  */
export const toThousands = (num) => {
  let result = ''
  let counter = 0
  num = (num || 0).toString()
  for (let i = num.length - 1; i >= 0; i--) {
    counter++
    result = num.charAt(i) + result
    if (!(counter % 3) && i !== 0) {
      result = ',' + result
    }
  }
  return result
}

/* 日期格式装换 */
export const renderTime = date => {
  if (date === null || date === undefined) {
    return ''
  }
  let d = new Date(date)
  let times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
  return times
}

/* 年份格式装换 */
export const renderYearTime = date => {
  if (date === null || date === undefined) {
    return ''
  }
  let d = new Date(date)
  let times = d.getFullYear()
  return times
}

/* 日期格式装换-- 精确到分钟 */
export const renderDateTimef = date => {
  if (date === null || date === undefined) {
    return ''
  }
  let d = new Date(date)
  let times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
  return times
}
/* 日期格式装换-- 精确到秒 */
export const renderDateTime = date => {
  if (date === null || date === undefined) {
    return ''
  }
  let d = new Date(date)
  let times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  return times
}

/* 位置形状汉化 */
export const toChinese = text => {
  switch (text) {
    case 'point':
      return '点'
    case 'polyline':
      return '线'
    case 'polygon':
      return '面'
    default:
      return ''
  }
}

/* 转换经纬度为度分秒 */
export const cacuLonLat = a => {
  if (a === undefined || a === null) {
    return undefined
  } else {
    let degree = parseInt(a)
    let min = parseInt((a - degree) * 60)
    let sec = ((a - degree) * 3600 - min * 60).toFixed(2)

    let min00 = '00' + min
    min = min00.substring(min00.length - 2, min00.length)

    return degree + '°' + min + '′' + sec + '″'
  }
}

/* 转换度分秒为经纬度 */
export const cacuDMS = a => {
  if (a === undefined || a === null) {
    return undefined
  } else {
    let du = a.split('°')[0]
    let fen = a.split('°')[1].split('′')[0]
    let miao = a.split('°')[1].split('′')[1].split('″')[0]

    return Math.abs(du) + (Math.abs(fen) / 60 + Math.abs(miao) / 3600)
  }
}
/* 获取路径中文件的的后缀名 */
export const getSuffixName = str => {
  let fileName = str.lastIndexOf('.')
  let fileNameLength = str.length
  let fileFormat = str.substring(fileName + 1, fileNameLength)
  return fileFormat
}
/* 数组去重 */
export const distinct = a => {
  let arr = a.concat(a)
  for (let i = 0, len = arr.length; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1)
        // splice 会改变数组长度，所以要将数组长度 len 和下标 j 减一
        len--
        j--
      }
    }
  }
  return arr
}
/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()
// rem转化为px
export const remToPx = rem => {
  let fontSize = document.documentElement.style.fontSize
  // console.log('fontSize',fontSize,document.documentElement.style);
  return Number(Math.floor(rem * fontSize.replace('px', '')))
}

// 去除对象的空属性
export const nullStr = (obj) => {
  for (let key in obj) {
    if (obj[key] === '' || obj[key] === null) {
      delete obj[key]
    }
    if (typeof obj[key] === 'object') {
      obj[key] = nullStr(obj[key])
    }
  }
  return obj
}
