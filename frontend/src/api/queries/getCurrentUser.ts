import axios from "axios";
export async function getCurrentUser() {
    try {
        const response = await axios.get("http://localhost:3000/auth/session", { withCredentials: true });
        if (!!response.data && response.status === 200) {
            // dispatch(setUserData(response.data.data));
            return response.data.data;
        }
    }
    catch (error) {
        console.log(error);
        return null;
    }
}