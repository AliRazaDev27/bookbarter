import axios from "axios";

export async function sendMessage(contactId: number, message: string) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/messages`, { contactId, message }, { withCredentials: true })
        return response.data;
    }
    catch (error: any) {
        if(error?.response?.data) {
            return error.response.data;
        }
        return { message: error.message || "Something went wrong" };
    }
}

export async function markMessageAsRead(messageId: number) {
    try{
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/messages/${messageId}`, {}, { withCredentials: true });
        return response.data as { success: boolean };
    }
    catch(error:any){
        if(error?.response?.data) {
            return error.response.data as { success: boolean };
        }
        return { success:false };
    }
}

export async function getMessages() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/messages`, { withCredentials: true })
        return response.data;
    }
    catch (error: any) {
        if(error?.response?.data) {
            return error.response.data;
        }
        return { message: error.message || "Something went wrong" };
    }
}
