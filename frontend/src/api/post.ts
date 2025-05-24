import axios from 'axios';
import { IPost } from '@/types';
export async function createPost(formData: any) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/posts`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });
        const data = await response.data;
        return { status: response.status, ...data };
    }
    catch (error: any) {
        console.error('Error creating post:', error);
        return { status: error.response.status || 555, message: error.message, data: error.response.data.data };
    }
}

export async function getPostById(id: number) {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, { withCredentials: true });
        const data = response.data.data as { post: IPost, user: { id: number, picture: string, username: string } };
        return data;
    }
    catch (error) {
        console.error("Error fetching post data:", error);
        return null;
    }
}

export async function deletePost(id: number) {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, { withCredentials: true });
        return { success: true, message: response.data.message };
    }
    catch (error: any) {
        if (error?.response?.data) {
            return { success: false, message: error.response.data.message };
        }
        return { success: false, message: error.message || "Something went wrong" };
    }
}

export async function getPosts(title?: string, author?: string, minPrice?: string, maxPrice?: string, currency?: string, bookCondition?: string, exchangeType?: string, sortBy?: string, languages?: string, categories?: string, page?: number, limit?: number) {
    try {
        const params = new URLSearchParams();
        if (title) params.set("title", title);
        if (author) params.set("author", author);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (currency) params.set("currency", currency);
        if (bookCondition) params.set("bookCondition", bookCondition);
        if (exchangeType) params.set("exchangeType", exchangeType);
        if (sortBy) params.set("sortBy", sortBy);
        if (languages) params.set("languages", languages);
        if (categories) params.set("categories", categories);
        if (page) params.set("page", page.toString());
        if (limit) params.set("limit", limit.toString());
        const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts?${params.toString()}`);
        const posts = await result.data;
        return posts;
    }
    catch (error: any) {
        console.log(error.message);
        return error.message;
    }
}

export async function getPostByUser() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts/user`, { withCredentials: true })
        return response.data.data
    }
    catch (error: any) {
        return null;
    }
}

export async function getPostList() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts/user/list`,
            {withCredentials: true})
        return response.data.data;    
    }
    catch (error: any) {
        return null;
    }
}