import { IPost } from '@/types';
import axios from 'axios';
export async function deletePost(id: number){
    try{
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, { withCredentials: true });
        return { success: true, message: response.data.message };
    }
    catch (error: any){
        if (error?.response?.data){
            return { success: false, message: error.response.data.message };
        }
        return { success: false, message: error.message || "Something went wrong" };
    }
}

export async function getPostById(id:number){
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, {withCredentials: true});
        const data = response.data.data as {post: IPost, user: {id: number, picture:string, username:string}};
        return data;
    }
    catch (error) {
        console.error("Error fetching post data:", error);
        return null;
    }
}