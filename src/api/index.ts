import Axios, {type AxiosResponse} from 'axios';
// 创建axios
const request = Axios.create({
    // 根请求地址
    baseURL: 'http://localhost:8080',
    // baseURL: '/api/',
    withCredentials: false,// 用于配置请求接口跨域时是否需要凭证
    timeout: 30000 // 超时时间，单位毫秒
})
// 配置请求头的参数类型，和编码格式
// Axios.defaults.headers['Content-Type'] = 'application/json?chatset=utf-8'

// 获取用户信息
export const getUserList = (data: any) => {
    return request({
        method: "post",
        url: "user/listUserInfo",
        data
    })
}

//添加用户信息
export const addUser = (data: any) => {
    return request({
        method: "post",
        url: "user/addCompanyUser",
        data
    })
}

//批量删除用户信息
export const batchDeleteUser = (data: any) => {
    return request({
        method: "post",
        url: "user/batchDeleteUser",
        data
    })
}

//删除单条用户信息
export const deleteUser = (data: any) => {
    return request({
        method: "post",
        url: "user/deleteUser",
        data
    })
}

//修改用户信息
export const updateUser = (data: any) => {
    return request({
        method: "post",
        url: "user/updateUser",
        data
    })
}

//获取租户信息
export const getCompanyList = (data: any) => {
    return request({
        method: "post",
        url: "company/listCompanyInfo",
        data
    })
}

//获取租户名称
export const getCompanyName = (data: any) => {
    return request({
        method: "post",
        url: "company/getCompanyName",
        data
    })
}

//添加租户信息
export const addCompany = (data: any) => {
    return request({
        method: "post",
        url: "company/addCompany",
        data
    })
}

//批量删除租户信息
export const batchDeleteCompany = (data: any) => {
    return request({
        method: "post",
        url: "company/batchDeleteCompany",
        data
    })
}

//修改租户信息
export const updateCompany = (data: any) => {
    return request({
        method: "post",
        url: "company/updateCompany",
        data
    })
}