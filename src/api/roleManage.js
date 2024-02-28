import request from '@/utils/request'

export default {
  /**查询 */
  getRoleList(data){
    return request({
      url: '/role/list',
      method: 'post',
      data: data
    })
  },

  /**新增 */
  addRole(data){
    return request({
      url: '/role/add',
      method: 'post',
      data: data
    })
  },

  /**查询单条 */
  getRoleListById(roleId){
    return request({
      url: `role/${roleId}`,
      method: 'get',
    })
  },

  /**角色修改 */
  updateRole(data){
    return request({
      url: `role/update`,
      method: 'post',
      data: data
    })
  },

  saveRole(data){
    if(data.roleId != null || data.roleId != undefined){
      return this.updateRole(data)
    } else {
      return this.addRole(data)
    }
  },

  /**根据roleId删除单条数据 */
  deleteRoleById(roleId){
    return request({
      url: `role/delete/${roleId}`,
      method: 'delete',
    })
  },


  /**根据roleId删除单条数据 */
  importExcel(){
    return request({
      url: 'import/excel',
      method: 'post',
    })
  },

}