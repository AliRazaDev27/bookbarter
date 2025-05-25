import axios from "axios";

export async function sendReview(id:number,rating:number,review:string){
    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reviews`,{id,rating,review},{withCredentials:true});
        return {success:true,message:response.data.message};
    }
    catch(error:any){
        console.log(error);
        return {success:false,message:error.response.data.message || "Something went wrong"};
    }
}