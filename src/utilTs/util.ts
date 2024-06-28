import Axios, {type AxiosResponse} from 'axios';

export interface USERDATA{
    userName: string,
    userRealName: string,
    userPhoneNumber: string,
    userEmail: string,
    imgUrl: string,
    userType: number,
    belongCompany: string,
    belongDept: string,
    startTime: string,
}

export interface Conference {
    conferenceId: number,
    conferenceName: string,
    creator: string,
    state: string, //会议状态：进行中 / 已结束
    content: string,
    beginTime: string,
    endTime: string,
    imgUrl: string,
    belongedCompany: string
}

export  interface Course{
    courseName:string,
    author:string,
    imgUrl:string,
    courseIntroduction:string,
    courseCompare:string,
    courseMediaUrl:string,
    courseCode:string,
}


export const PathNameTable= {
    "/mainView":"主页",
    "/mainView/conferenceManagement":"会议管理",
    "/mainView/courseManagement":"课程管理"
}

const requestHeader={
    'Authorization': `Bearer 292|zBT0I9biZt2OZ37m2vjpm5gW7ibeqmdcyUyiSlqK`,
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin':"*",
    'Accept':'application/json'
}

export const defaultAvatar="https://img.picui.cn/free/2024/06/24/6678e71f60fa1.jpg"

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
export const getSignatrue= (): Promise<string> =>{
       return Axios.post("http://localhost:8080/Course/getSignature", {},{
            withCredentials:true,
        }).then((res)=>{
            if (res.status === 200) {
                return res.data.signature as string
            }
            else{
                return "";
            }
        }).catch((error) => {
            return error;
        })
}
