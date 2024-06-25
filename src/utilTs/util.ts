import Axios from 'axios';

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
    imgUrl: string
}

export const loadingData = (): Promise<USERDATA> => Axios.post("http://localhost:8080/user/loading", {}, {
    withCredentials: true
}).then((res) => {
    if (res.status === 200) {
        console.log("从后端加载的当前session中的user：");
        console.log(res.data.userData);
        return res.data.userData as USERDATA;
    } else {
        console.log("Error");
        throw new Error();
    }
}).catch((error) => {
    console.error(error);
    throw error;
});