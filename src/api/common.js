import request from '@/utils/request'
import { baseUrl_user } from "@/api/set.js"

// 昭通市行政区划列表
export const areaList = data => request({ url: baseUrl_user + 'api/system/listPage', method: 'get', data })

