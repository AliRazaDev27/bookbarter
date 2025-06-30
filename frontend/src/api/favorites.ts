import axios from "axios";
export async function toggleFavorite(id:number){
    try{
       const result = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/favorites/toggle/${id}`,{},{withCredentials:true})
      return result.data.data as boolean;
    }
    catch(error:any){
        console.log(error)
        return null;
    }
}