import { IUser } from "@/types";
import axios from "axios";
export async function getCurrentUser() {
    try {
        const response = await axios.get("http://localhost:3000/auth/session", { withCredentials: true });
        if (!!response.data && response.status === 200) {
            return response.data.data as IUser;
        }
    }
    catch (error) {
        return null;
    }
}