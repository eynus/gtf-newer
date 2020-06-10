

import request from '@/utils/request'
import { baseUrl_model } from "@/api/set.js" 
// 获取年份
export const getYear = data => request({ url: baseUrl_model+'api/model/getYear', method: 'get', data })
// 获取目录树
export const getTreeList = data => request({ url: baseUrl_model+'api/model/listZbfl', method: 'post', data })
// 添加指标
export const insertZB = data => request({ url: baseUrl_model+'api/model/insertZbmx', method: 'post', data })
// 获取列表
export const getListPage= data => request({ url: baseUrl_model+'api/model/listPage', method: 'post', data })