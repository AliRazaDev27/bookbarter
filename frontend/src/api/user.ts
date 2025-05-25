import axios from "axios";
import { IUser } from "@/types";
export async function registerUser(data: FormData) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return { status: response.status, error: response.data.error };
    }
    catch (error: any) {
        if(error?.status){
            return { status: error.status, error: error.response.data.error };
        }
        else{
        return { status: 100, error: error.message };
        }
    }
}

export async function getCurrentUser() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/session`, { withCredentials: true });
        if (!!response.data && response.status === 200) {
            return response.data.data as IUser;
        }
    }
    catch (error) {
        return null;
    }
}

export async function loginUser(data: FormData) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, data, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return { status: response.status, error: response.data.error };
    }
    catch (error: any) {
        if (error?.status) {
            return { status: error.status, error: error.response.data.error };
        }
        else {
            return { status: 100, error: error.message };
        }
    }
}

export async function updateUserStatus(userId: string, status: "unverified" | "active" | "blocked") {
    try{
            const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/updateStatus`, {
                userId,
                status
            })
            if (result.data.success) {
                return true;
            }
            else{
                console.log(result.data);
                return false;
            }
    }
    catch(error:any){
        console.log("updateUserStatus:",error)
        return false;
    }
}

export async function getAllUsers(){
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getAllUsers`,{withCredentials:true})
        if(response.data.success) {
            return response.data.data;
        }        
    }
    catch(error:any){
        console.log("getAllUsers:", error);
        return null;
    }
}

export async function logout(){
    try{
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`,{withCredentials:true});
        return true;
    }
    catch(error:any){
        console.log("logout:", error);
        return false;
    }
}