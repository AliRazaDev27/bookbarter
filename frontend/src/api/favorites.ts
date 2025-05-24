import axios from "axios";
export async function toggleFavorite(id:number){
    try{
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/favorites/toggle/${id}`,{},{withCredentials:true})
      return null;
    }
    catch(error:any){
        console.log(error)
        return null;
    }
}