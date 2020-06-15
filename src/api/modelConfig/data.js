import request from '@/utils/request'
import { baseUrl_model } from "@/api/set.js" 
// 获取列表
export const getList= data => request({ url: baseUrl_model+'api/model/list', method: 'post', data })