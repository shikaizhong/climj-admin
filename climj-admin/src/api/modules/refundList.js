import request from "../request";
import requestURL from "../requestUrl";
import requestParam from "../requestParam";
//总查询 搜索 分页数据
export function lists(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/refund/list'),
    data: requestParam(params, 'post', true, 'json')
  })
}

//添加反馈
export function insert(params){
  return request({
    method:'post',
    url:requestURL('/sys/refund/addRefund'),
    data:requestParam(params,'post',true,'json')
  })
}

//修改反馈
export function update(params){
  return request({
    method:'post',
    url:requestURL('/sys/refund/updateRefund'),
    data:requestParam(params,'post',true,'json')
  })
}

//删除反馈
export function less(params){
  return request({
    method:'post',
    url:requestURL('/sys/refund/deleteRefund'),
    data:requestParam(params,'post',true,'json')
  })
}

// //通过id查询到数据
// export function listById(params) {
//   // var result = params;
//   return request({
//     method: 'post',
//     url: requestURL('/sys/personnel/selectInfoByID'),
//     data: requestParam(params, 'post', true, 'json')
//   })
// }

//通过wangwangNum查询历史记录
export function listByWangWangNum(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/refund/selectInfoByWangWangNum'),
    data: requestParam(params, 'post', true, 'json')
  })
}

//通过id查询详情
export function ById(params){
  return request({
    method:'post',
    url:requestURL('/sys/refund/selectInfoById'),
    data:requestParam(params, 'post', true, 'json')
  })
}

//上传文件
// export function upload(params){
//   return request({
//     method:'post',
//     url:requestURL('/sys/refund/upload'),
//     data:requestParam(params,'post',true,'json')
//   })
// }

//根据旺旺名查询该旺旺名是否存在
export function ByWang(params){
  return request({
    method:'post',
    url:requestURL('/sys/refund/selectWang'),
    data:requestParam(params, 'post',true,'json')
  })
}

//上传文件
export function upload(params) {
  return request({
    method: "post",
    url: requestURL("/sys/refund/uploads"),
    data: requestParam(params, "post", true, "json")
  });
}

//多文件上传实现
export function addFile(params) {
  return request({
    method: "post",
    url: requestURL("/sys/refund/addFile"),
    data: requestParam(params, "post", true, "json")
  });
}

//删除指定文件
export function deleteFile(params) {
  return request({
    method: "post",
    url: requestURL("/sys/refund/deleteFile"),
    data: requestParam(params, "post", true, "json")
  });
}

//通过refundId查询file文件链接列表
export function listFile(params) {
  return request({
    method: "post",
    url: requestURL("/sys/refund/listFile"),
    data: requestParam(params, "post", true, "json")
  });
}
