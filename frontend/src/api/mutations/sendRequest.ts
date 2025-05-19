import axios from "axios";
export async function sendRequest(values: any) {
    try{
        const response = await axios.post(`http://localhost:3000/requests`,values,{ withCredentials: true })
        return {status:response.status,...response.data}
    }
    catch(error:any){
        console.log(error)
        return {status:error.response.status,...error.response.data}
    }
    
}