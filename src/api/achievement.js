import request from '@/utils/request'

/* 问题点列表 */
export const getListStage = data => request({ url: '/ledger/listStage', method: 'post', data })
/* 问题点审核 */
export const pointStageExamine = data => request({ url: '/ledger/pointStageExamine', method: 'post', data })
/* 问题点详情 */
export const getStageDetails = data => request({ url: '/ledger/getStageDetail', method: 'post', data })

// 生成红线监管核查报告
/* 生成红线监管核查报告导出 */
export const exportFile = data => request({ url: '/statis/redLineReportExport', method: 'post', data })
/* 生成红线监管核查报告列表 */
export const redLineReport = data => request({ url: '/statis/redLineReport', method: 'post', data })
