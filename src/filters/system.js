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
// 备份类型
export const dbback = {
  value: [
    {
      label: '数据库备份',
      value: 1
    }, {
      label: '文件备份',
      value: 2
    }
  ],
  handler: function (val) {
    let result = this.value.filter(item => item.value === val)
    return result.length ? result[0].label : ''
  }
}

export const dbbackModule = {
  value: [
    {
      label: '一张图可视化',
      value: 1
    }, {
      label: '实施监督管理',
      value: 2
    }, {
      label: '模型指标配置管理',
      value: 3
    }, {
      label: '数据管理',
      value: 4
    }, {
      label: '运维管理',
      value: 5
    }
  ],
  handler: function (val) {
    let result = this.value.filter(item => item.value === val)
    return result.length ? result[0].label : ''
  }
}
