import axios from "axios";

export async function loginUser(data: FormData) {
    try {
        const response = await axios.post("http://localhost:3000/auth/login", data, {
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