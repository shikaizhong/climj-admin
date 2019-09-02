import request from "../request";
import requestURL from "../requestUrl";
import requestParam from "../requestParam";
//反馈 数据
export function lists(params) {
    return request({
      method: 'post',
      url: requestURL('/sys/responsibility/list'),
      data: requestParam(params, 'post', true, 'json')
    })
  }
//分页
export function page(params){
    return request({
        method: 'post',
        url: requestURL('/sys/responsibility/page'),
        data: requestParam(params,'post',true,'json')
    })
}
//修改判责信息
  export function update(params){
    return request({
      method:'post',
      url:requestURL('/sys/responsibility/update'),
      data:requestParam(params,'post',true,'json')
    })
  }
//添加文件
export function addFile(params){
  return request({
    method:'post',
    url:requestURL('/sys/responsibility/addFile'),
    data:requestParam(params,'post',true,'json')
  })
}
//根据id查询
export function selectById(params){
  return request({
    method:'post',
    url:requestURL('/sys/responsibility/selectById'),
    data:requestParam(params,'post',true,'json')
  })
}