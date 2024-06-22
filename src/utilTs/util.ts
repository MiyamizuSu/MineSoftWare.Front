import Axios from 'axios';

export interface USERDATA{
    "userName": string,
    "belongCompany": string,
    "userPhoneNumber": string,
    "userEmail": string,
    "userRealName": string,
    "admin": boolean
    "belongDept":string
    "startTime":string
}

export const loadingData = (): Promise<USERDATA> => Axios.post("http://localhost:8080/user/loading", {}, {
    withCredentials: true
}).then((res) => {
    if (res.status === 200) {
        console.log(res.data.userData)
        return res.data.userData as USERDATA;
    } else {
        console.log("Error");
        throw new Error();
    }
}).catch((error) => {
    console.error(error);
    throw error;
});