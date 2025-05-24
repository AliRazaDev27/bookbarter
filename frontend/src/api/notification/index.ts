import axios from 'axios';
export async function getNotifications() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications`, { withCredentials: true })
        return response.data.data;
    }
    catch (error: any) {
        return null;
    }
}

export async function markAsRead(id: number) {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/notifications/markAsRead/${id}`, {}, { withCredentials: true });
        if(response.status === 200) {
            return true;
        }
        return false;
    }
    catch (error: any) {
        return false;
    }
}

export async function deleteNotification(id: number) {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/notifications/${id}`, { withCredentials: true });
        if(response.status === 200) {
            return {success:true, message: response.data.message};
        }
    }
    catch (error: any) {
        return {success:false, message: error.response?.data?.message || "Something went wrong"};
    }
}