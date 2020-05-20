

import request from '@/utils/request'

// 获取目录结构
export const getCatalogue = data => request({ url: 'data/getML', method: 'get', data })
// 根据ID获取元信息
export const getMetaByID = data => request({ url: `data/getById?id=${data.id}`, method: 'get', data })
// 根据name获取元信息
export const getMetaByName = data => request({ url: `data/getBydataName?dataName=${data.name}`, method: 'get', data })
