
import request from '@/utils/request'
// 入库历史查询
export const getSJListPage = data => request({ url: 'data/listsjPage', method: 'post', data })
// 获取数据分类详情
export const getTypeDetail = data => request({ url: 'data/getCount', method: 'post', data })
// 获取数据路径
export const getPaths = data => request({ url: 'data/getPath', method: 'get', data })

