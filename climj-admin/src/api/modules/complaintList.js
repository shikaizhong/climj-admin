import request from "../request";
import requestURL from "../requestUrl";
import requestParam from "../requestParam";
//反馈 分页数据
export function lists(params) {
    return request({
      method: 'post',
      url: requestURL('/sys/complaint/list'),
      data: requestParam(params, 'post', true, 'json')
    })
  }
  //添加反馈
  export function insert(params){
    return request({
      method:'post',
      url:requestURL('/sys/complaint/addComplaint'),
      data:requestParam(params,'post',true,'json')
    })
  }
  //修改反馈
  export function update(params){
    return request({
      method:'post',
      url:requestURL('/sys/complaint/updateComplaint'),
      data:requestParam(params,'post',true,'json')
    })
  }
  //删除反馈
  export function less(params){
    return request({
      method:'post',
      url:requestURL('/sys/complaint/deleteComplaint'),
      data:requestParam(params,'post',true,'json')
    })
  }
  //通过id查询到数据
export function listById(params) {
    // debugger
    // var result = params;
    return request({
      method: 'post',
      url: requestURL('/sys/personnel/selectInfoByID'),
      data: requestParam(params, 'post', true, 'json')
    })
  }
  //通过wangwangNum查询历史记录
export function listByWangWangNum(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/complaint/selectAllByWangWangNum'),
    data: requestParam(params, 'post', true, 'json')
  })
}
  //通过complaintId查询历史记录
  export function selectFiles(params) {
    return request({
      method: 'post',
      url: requestURL('/sys/complaint/selectFiles'),
      data: requestParam(params, 'post', true, 'json')
    })
  }
//上传文件
export function upload(params){
  return request({
    method:'post',
    url:requestURL('/sys/complaint/uploads'),
    data:requestParam(params,'post',true,'json')
  })
}
 //查询客诉大类
 export function selectLevel(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/complaint/selectLevel'),
    data: requestParam(params, 'post', true, 'json')
  })
}
 //通过wangwangNum查询历史记录
 export function getLevelName(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/complaint/getLevelName'),
    data: requestParam(params, 'post', true, 'json')
  })
}
 //通过责任人id查询责任人名字
 export function complaintName(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/personnel/selectComplaintId'),
    data: requestParam(params, 'post', true, 'json')
  })
}
 //通过责任人id查询责任人名字 远程数据
 export function complaintNames(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/personnel/selectComplaintIds'),
    data: requestParam(params, 'post', true, 'json')
  })
}
 //通过店长id查询团队
 export function teamName(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/personnel/selectTeam'),
    data: requestParam(params, 'post', true, 'json')
  })
}
 //通过无条件查询团队
 export function teamNames(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/personnel/selectTeams'),
    data: requestParam(params, 'post', true, 'json')
  })
}
//删除指定文件
export function deleteFile(params){
  return request({
    method:'post',
    url:requestURL('/sys/complaint/deleteFile'),
    data:requestParam(params,'post',true,'json')
  })
}
//添加文件
export function addFile(params){
  return request({
    method:'post',
    url:requestURL('/sys/complaint/addFile'),
    data:requestParam(params,'post',true,'json')
  })
}
//判断用户是否存在
export function exist(params){
  return request({
    method:'post',
    url:requestURL('/sys/complaint/exist'),
    data:requestParam(params,'post',true,'json')
  })
}