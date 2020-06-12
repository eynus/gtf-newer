

import request from '@/utils/request'
import { baseUrl_data } from "@/api/set.js"
// 获取目录列表
export const getzjML = data => request({ url: baseUrl_data + 'api/data/zj/getzjML', method: 'get', data })
// 分页查询质检规则记录
export const getZJListPageById = data => request({ url: baseUrl_data + 'api/data/listPageById', method: 'post', data })
// 启用规则
export const startRules = data => request({ url: baseUrl_data + 'api/data/updatestartCheckById', method: 'post', data })
// 停止启用规则
export const stopRules = data => request({ url: baseUrl_data + 'api/data/updatestopCheckById', method: 'post', data })
// 删除规则
export const deleteRules = data => request({ url: baseUrl_data + 'api/data/deleteById', method: 'post', data })
// 添加规则
export const addRules = data => request({ url: baseUrl_data + 'api/data/insert', method: 'post', data })
// 修改规则
export const updateRules = data => request({ url: baseUrl_data + 'api/data/update', method: 'post', data })

// 值域规范性-代码表
export const getValRangeRuleCodeList = data => request({ url: baseUrl_data + 'api/data/list', method: 'get', data })
// 值域规范性-字段代码表
export const getVRRKeyListById = data => request({ url: baseUrl_data + 'api/data/listSxjg', method: 'post', data })