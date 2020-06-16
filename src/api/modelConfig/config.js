

import request from '@/utils/request'
import { baseUrl_model } from "@/api/set.js" 
// 获取年份
export const getYear = data => request({ url: baseUrl_model+'api/model/getYear', method: 'get', data })
// 获取目录树
export const getTreeList = data => request({ url: baseUrl_model+'api/model/listZbfl', method: 'post', data })
// 添加指标
export const insertZB = data => request({ url: baseUrl_model+'api/model/insertZbmx', method: 'post', data })
// 修改指标
export const updateZB = data => request({ url: baseUrl_model+'api/model/updateZbmx', method: 'post', data })
// 删除指标
export const deleteZB = data => request({ url: baseUrl_model+'api/model/deleteZbmx', method: 'post', data })
// 获取列表
export const getListPage= data => request({ url: baseUrl_model+'api/model/listPage', method: 'post', data })
// 添加目录
export const insertZbfl= data => request({ url: baseUrl_model+'api/model/insertZbfl', method: 'post', data })
// 删除目录
export const deleteZbfl= data => request({ url: baseUrl_model+'api/model/deleteZbfl', method: 'post', data })