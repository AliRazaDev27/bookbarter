import axios from "axios";
export async function registerUser(data: FormData) {
    try {
        const response = await axios.post("http://localhost:3000/auth/register", data, {
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
