export const serviceStatus = {
  value: [
    {
      label: '正常',
      value: '0'
    }, {
      label: '未发布',
      value: '1'
    }
  ],
  handler: function (val) {
    let result = this.value.filter(item => item.value === val)
    return result.length ? result[0].label : ''
  }
}
