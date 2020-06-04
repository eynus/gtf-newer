

import request from '@/utils/request'
import { baseUrl_data } from "@/api/set.js" 
// 获取目录结构
export const getCatalogue = data => request({ url: baseUrl_data+'api/data/getML', method: 'get', data })
// 根据ID获取元信息
export const getMetaByID = data => request({ url: baseUrl_data+`api/data/getById?id=${data.id}`, method: 'get', data })
// 根据name获取元信息
export const getMetaByName = data => request({ url: baseUrl_data+`api/data/getBydataName`, method: 'post', data })
// 根据id获取子节点
export const getLeavesById = data => request({ url: baseUrl_data+`api/data/getByIdentification`, method: 'post', data })