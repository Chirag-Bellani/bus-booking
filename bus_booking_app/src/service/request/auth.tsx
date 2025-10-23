import { resetAndNavigate } from "../../utils/NavigationUtils";
import apiClient from "../apiClient"
import { getRefreshToken, removeAccessToken, removeRefreshToken, setAccessToken, setRefreshToken } from "../storage";

export const loginWithGoogle=async(idToken:string)=>{
    const {data}=await apiClient.post('/user/login',{id_token:idToken});
    console.log('Login response data:', data);

    setAccessToken(data?.accessToken);
    setRefreshToken(data?.refreshToken);
    return data?.user
}

export const logout=async()=>{
    removeAccessToken();
    removeRefreshToken();
    resetAndNavigate('LoginScreen')
}

export const refresh_tokens=async():Promise<boolean>=>{
    try{
        const refreshToken=getRefreshToken();
        if(!refreshToken){
            throw new Error('No refresh token found');
        
        }
        const {data}=await apiClient.post('/user/refresh',{
            refreshToken
        });
        if(data?.accessToken && data?.refreshToken){
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            return true;
        }else{
            throw new Error('Invalid tokens received');
        }
}catch(error){
    console.error('Error refreshing tokens:',error);
    logout();
    return false;
}
}