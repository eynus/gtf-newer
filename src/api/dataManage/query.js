

import request from '@/utils/request'

// 获取目录结构
export const getCatalogue = data => request({ url: 'data/getML', method: 'get', data })
