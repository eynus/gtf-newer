

import request from '@/utils/request'
// 获取目录列表
export const getzjML = data => request({ url: 'data/zj/getzjML', method: 'get', data })

