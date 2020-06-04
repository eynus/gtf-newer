import request from '@/utils/request'
import { baseUrl_user } from "@/api/set.js"

// 用户列表
export const userList = data => request({ url: baseUrl_user + 'api/system/user/listUsersByPage', method: 'post', data })
// 用户新建
export const userInsert = data => request({ url: baseUrl_user + 'api/system/user/insertUserInfo', method: 'post', data })
// 用户修改
export const userEdit = data => request({ url: baseUrl_user + 'api/system/user/updateUserInfo', method: 'post', data })
// 用户删除
export const userDel = data => request({ url: baseUrl_user + 'api/system/user/deleteUserByPkId', method: 'post', data })
// 用户详情
export const userDetail = data => request({ url: baseUrl_user + 'api/system/user/getUserInfoByPkId', method: 'post', data })
// 角色列表 -- select
export const roles = data => request({ url: baseUrl_user + 'api/system/role/listRole', method: 'post', data })
// 角色列表
export const roleList = data => request({ url: baseUrl_user + 'api/system/role/listRoleByPage', method: 'post', data })
// 角色新建
export const roleInsert = data => request({ url: baseUrl_user + 'api/system/role/insertRoleInfo', method: 'post', data })
// 角色修改
export const roleEdit = data => request({ url: baseUrl_user + 'api/system/role/updateRoleInfo', method: 'post', data })
// 角色删除
export const roleDel = data => request({ url: baseUrl_user + 'api/system/role/deleteRoleByPkid', method: 'post', data })
// 资源和角色绑定
export const resourceToUser = data => request({ url: baseUrl_user + 'api/system/resource/addRoleResourceBinding', method: 'post', data })
// 资源名称信息列表
export const resources = data => request({ url: baseUrl_user + 'api/system/resource/listResource', method: 'post', data })
// 资源列表
export const resourceList = data => request({ url: baseUrl_user + 'api/system/resource/listResourcesByPage', method: 'post', data })
// 获取用户对应资源信息
export const resourceByUid = data => request({ url: baseUrl_user + 'api/system/resource/listResourceByUserId', method: 'post', data })
// 获取角色对应资源信息
export const resourceByRid = data => request({ url: baseUrl_user + 'api/system/resource/listRoleResource', method: 'post', data })
// 登录日志列表
export const lnLogList = data => request({ url: baseUrl_user + 'api/system/log/listLoginLogInfoByPage', method: 'post', data })
// 操作日志列表
export const optLogList = data => request({ url: baseUrl_user + 'api/system/log/listOperationLogInfoByPage', method: 'post', data })
// 数据库备份列表
export const dbList = data => request({ url: baseUrl_user + 'api/backupRestore/getBackUpRecord', method: 'post', data })
// 执行数据库备份
export const dbExecute = data => request({ url: baseUrl_user + 'api/backupRestore/executeBackup', method: 'post', data })
// 执行 数据恢复
export const dbRecover = data => request({ url: baseUrl_user + 'api/backupRestore/recoverBackUp', method: 'post', data })
