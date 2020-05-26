

import request from '@/utils/request'
import { baseUrl_data } from "@/api/set.js"
// 获取目录列表
export const getzjML = data => request({ url: baseUrl_data+'api/data/zj/getzjML', method: 'get', data })

