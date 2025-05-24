import axios from "axios";
export async function sendRequest(values: any) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/requests`, values, { withCredentials: true })
        return { status: response.status, ...response.data }
    }
    catch (error: any) {
        console.log(error)
        return { status: error.response.status, ...error.response.data }
    }
}

export async function getSentRequests() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/requests/sent`, { withCredentials: true })
        return response.data.data;
    }
    catch (error: any) {
        return null;
    }
}

export async function getReceivedRequests() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/requests/received`, { withCredentials: true })
        return response.data.data;
    }
    catch (error: any) {
        return null;
    }
}

export async function sendProposal(id: number, location: string, date: string, time: string) {
    try {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/requests/sendProposal/${id}`, {
            location,
            date,
            time,
        }, { withCredentials: true })
        return null;
    }
    catch (error: any) {
        console.log(error)
        return null;
    }
}

export async function updateRequestStatus(id: number, type: "sent" | "received", status: "cancelled" | "confirmed" | "rejected" | "completed") {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/requests/status/${id}`, { type, status }, { withCredentials: true })
        return null;
    }
    catch (error: any) {
        console.log(error)
        return null;
    }
}