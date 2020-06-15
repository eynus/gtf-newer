import request from '@/utils/request'
import { baseUrl_model } from "@/api/set.js"
// 获取列表
export const getList = data => request({ url: baseUrl_model + 'api/model/list', method: 'post', data })
// 获取所属类型列表
export const getByLevel = data => request({ url: baseUrl_model + 'api/model/getByLevel', method: 'get', data })
// 上传列表
export const importData = data => request({ url: baseUrl_model + 'api/model/importData', method: 'post', data })