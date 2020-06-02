// 登录-日志列表-访问类型
export const logType = {
  value: [{
    label: '手机登录',
    value: 1
  }, {
    label: '电脑登录',
    value: 0
  }],
  handler: (val) => {
    let device = null
    switch (val) {
      case 1:
        device = '手机登录'
        break
      case 0:
        device = '电脑登录'
        break
    }
    return device
  }
}

// 日志管理-操作类型
export const logOpt = {
  value: [
    {
    label: '新增',
    value: 1
    }, {
      label: '删除',
      value: 2
    }, {
      label: '修改',
      value: 3
    }, {
      label: '上传',
      value: 4
    }
  ],
  handler: function (val) {
    let result = this.value.filter(item => item.value === val)
    return result.length ? result[0].label : ''
  }
}
