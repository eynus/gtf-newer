/**
 * @Description:数据工具
 * @author 阮鹏卿
 * @date 2020/4/23
 */
class Tool {
  /**
   * 随机数
   * @param min
   * @param max
   * @returns {number}
   */
  static random(min, max) {
    return Math.floor(Math.random()*(min - max) + max)
  }

  static isBoolean (value) {
    return toString.call(value) === "[object Boolean]"
  }

  static isString (value) {
    return toString.call(value) === "[object String]"
  }

  static isArray(value) {
    return toString.call(value) === "[object Array]"
  }

  static isObject() {
    return toString.call(value) === "[object Object]"
  }
}

export default Tool
