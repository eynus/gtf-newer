
import request from '@/utils/request'
import { baseUrl_data } from "@/api/set.js"
// 入库历史查询
export const getSJListPage = data => request({ url: baseUrl_data+'api/data/listsjPage', method: 'post', data })
// 获取数据分类详情
export const getTypeDetail = data => request({ url: baseUrl_data+'api/data/getCount', method: 'post', data })
// 获取数据路径
export const getPaths = data => request({ url: baseUrl_data+'api/data/getPath', method: 'get', data })

