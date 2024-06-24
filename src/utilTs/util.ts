import Axios, {type AxiosResponse} from 'axios';

export interface USERDATA{
    "userName": string,
    "userRealName": string,
    "userPhoneNumber": string,
    "userEmail": string,
    "imgUrl": string,
    "userType": number,
    "belongCompany": string,
    "belongDept": string,
    "startTime": string,
}

const requestHeader={
    'Authorization': `Bearer 292|zBT0I9biZt2OZ37m2vjpm5gW7ibeqmdcyUyiSlqK`,
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin':"*",
    'Accept':'application/json'
}

export const defalutAvatar="https://img.picui.cn/free/2024/06/24/6678e71f60fa1.jpg"

export const loadingData = (): Promise<USERDATA> => Axios.post("http://localhost:8080/user/loading", {}, {
    withCredentials: true
}).then((res) => {
    if (res.status === 200) {
        return res.data.userData as USERDATA;
    } else {
        throw new Error();
    }
}).catch((error) => {
    console.error(error);
    throw error;
});

export const uploadFile = (file:File): Promise<AxiosResponse<any>> => Axios.post("https://picui.cn/api/v1/upload", {
        'file':file
    },{
    withCredentials:false,
        headers:requestHeader
    }).then((res) => {
         return res;
    }).catch((error) => {
        console.error(error);
        throw error;
    })