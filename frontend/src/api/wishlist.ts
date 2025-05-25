import { IWishlist } from "@/types";
import axios from "axios";
export async function createWishlist(title: string | null, author: string | null) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/wishlist`, {
            title: title,
            author: author,
        }, {
            withCredentials: true,
        });
        return response.data;
    }
    catch (error: any) {
        if (error?.response?.data) {
            return error.response.data;
        }
        return { message: error.message || "Something went wrong" };
    }
}

export async function getWishlist(){
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wishlist`,{ withCredentials: true })
        console.log(response.data.data)
        return response.data.data as IWishlist[];
    }
    catch(error:any){
        console.log(error)
        return [];
    }
}

export async function deleteWishlist(id: number) {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/wishlist/${id}`, {
            withCredentials: true,
        });
        return { success: true, message: response.data.message };
    }
    catch (error: any) {
        if (error?.response?.data) {
            return { success: false, message: error.response.data.message };
        }
        return { success: false, message: error.message || "Something went wrong" };
    }
}

export async function countWishlist() {
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wishlist/count`,{ withCredentials: true })
        return response.data.data.count;
    }
    catch(error:any){
        console.log(error)
        return 0
    }
}