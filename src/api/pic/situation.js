import request from "@/utils/request";
import { baseUrl_picture } from "@/api/set.js"

// 昭通四种类型开发区数据
export const funcList = data => request({ url: baseUrl_picture + 'api/picture/listGnq', method: 'get', data })
