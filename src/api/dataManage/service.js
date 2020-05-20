
import request from '@/utils/request'
// 分页查询服务记录
export const getListPage = data => request({ url: 'data/fw/listPage', method: 'post', data })
// 分页查询模块服务记录
export const getListById = data => request({ url: 'data/fw/listById', method: 'post', data })
// 删除服务记录
export const delFw = data => request({ url: 'data/fw/delFw', method: 'post', data })
// 停止服务
export const updateOver = data => request({ url: 'data/fw/updateOver', method: 'post', data })
// 启动服务
export const updateStart = data => request({ url: 'data/fw/updateStart', method: 'post', data })