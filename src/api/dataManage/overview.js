
import request from '@/utils/request'
import { baseUrl_data } from "@/api/set.js"
// 入库历史查询
export const getSJListPage = data => request({ url: baseUrl_data+'api/data/listsjPage', method: 'get', data })
// 获取数据分类详情
export const getTypeDetail = data => request({ url: baseUrl_data+'api/data/getCount', method: 'post', data })
// 获取数据路径
export const getPaths = data => request({ url: baseUrl_data+'api/data/getPath', method: 'get', data })
// 出库记录新增数
export const getSum = data => request({ url: baseUrl_data + 'api/data/sumStatistic', method: 'get', data })
// 首页饼图数据
export const getByType = data => request({ url: baseUrl_data + 'api/data/getByType', method: 'get', data })
