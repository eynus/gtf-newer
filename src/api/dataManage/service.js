
import request from '@/utils/request'
import { baseUrl_data } from "@/api/set"
// 分页查询服务记录
export const getFWListPage = data => request({ url: baseUrl_data + 'api/data/fw/listfwPage', method: 'post', data })
// 分页查询模块服务记录
export const getListById = data => request({ url: baseUrl_data + 'api/data/fw/listById', method: 'post', data })
// 删除服务记录
export const delFw = data => request({ url: baseUrl_data + 'api/data/fw/deleteFw', method: 'post', data })
// 停止服务
export const updateOver = data => request({ url: baseUrl_data + 'api/data/fw/updateOver', method: 'post', data })
// 启动服务
export const updateStart = data => request({ url: baseUrl_data + 'api/data/fw/updateStart', method: 'post', data })
// 注册服务
export const insertServer = data => request({ url: baseUrl_data + 'api/data/fw/insertServer', method: 'post', data })
// 服务树
export const getmlService = data => request({ url: baseUrl_data + 'api/data/getMLService', method: 'post', data })
