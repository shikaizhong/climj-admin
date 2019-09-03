import request from "../request";
import requestURL from "../requestUrl";
import requestParam from "../requestParam";

//总查询 搜索 分页
export function lists(params) {
    return request({
        method: 'post',
        url: requestURL('/sys/hidden/selectHidden'),
        data: requestParam(params, 'post', true, 'json')
    });
}

//增加隐患
export function insert(params){
    return request({
        method: 'post',
        url: requestURL('/sys/hidden/addHidden'),
        data: requestParam(params, 'post', true, 'json')
    })
}

//修改隐患
export function update(params){
    return request({
        method: 'post',
        url: requestURL('/sys/hidden/updateHidden'),
        data: requestParam(params, 'post', true, 'json')
    })
}

//删除隐患
export function less(params){
    return request({
        method: 'post',
        url: requestURL('/sys/hidden/deleteHidden'),
        data: requestParam(params, 'post', true, 'json')
    })
}

//根据旺旺名查询历史记录
export function selectByWangWangNum(params){
    return request({
        method: 'post',
        url: requestURL('/sys/hidden/selectByWangWangNum'),
        data: requestParam(params, 'post', true, 'json')
    })
}

//根据pkId查询详情
export function selectByPkId(params){
    return request({
        method: 'post',
        url: requestURL('/sys/hidden/selectByPkId'),
        data: requestParam(params, 'post', true, 'json')
    })
}

//根据旺旺名查询该用户是否存在
export function ByWang(params){
    return request({
        method: 'post',
        url: requestURL('/sys/hidden/selectYN'),
        data: requestParam(params, 'post', true, 'json')
    })
}

//添加文件属性到文件表中
export function uploads(params){
    return request({
        method: 'post',
        url: requestURL('/sys/hidden/uploads'),
        data: requestParam(params, 'post', true, 'json')
    })
}

//上传文件到文件列表中
export function addFile(params){
    return request({
        method: 'post',
        url: requestURL('/sys/hidden/addFiles'),
        data: requestParam(params, 'post', true, 'json')
    })
}

//删除文件
export function deleteFile(params){
    return request({
        method: 'post',
        url: requestURL('/sys/hidden/deleteFiles'),
        data: requestParam(params, 'post', true, 'json')
    })
}

//根据hiddenId查询文件列表
export function selectFile(params){
    return request({
        method: 'post',
        url: requestURL('/sys/hidden/selectFiles'),
        data: requestParam(params, 'post', true, 'json')
    })
}