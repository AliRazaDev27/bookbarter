import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setReceivedRequests,updateReceivedRequestDetails,updateReceivedRequestStatus } from "../../store/features/request/receivedRequestSlice";
import { setSentRequests, updateSentRequestDetails, updateSentRequestStatus } from "../../store/features/request/sentRequestSlice";
import { appendNotification } from "@/store/features/notifications/notificationSlice";
export function ServerEventHandler() {
    const dispatch = useDispatch()
    const sentRequest = useSelector((state: any) => state.sentRequests.data)
    const receivedRequest = useSelector((state: any) => state.receivedRequests.data)
    useEffect(() => {
        const eventSource = new EventSource(`${import.meta.env.VITE_BACKEND_URL}/events`, { withCredentials: true });
        console.log(eventSource);

        eventSource.addEventListener('refetchrequests', (event) => {
            console.log(event.data);
            if (event.data === "sent") {
                try {
                    const sentRequests = async () => {
                        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/requests/sent`, { withCredentials: true })
                        const result = await response.data
                        dispatch(setSentRequests(result.data))
                    }
                    sentRequests()
                }
                catch (error: any) {
                    console.log(error)
                }
            }
            else if (event.data === "received") {
                try {
                    const receivedRequests = async () => {
                        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/requests/received`, { withCredentials: true })
                        const result = await response.data
                        dispatch(setReceivedRequests(result.data))
                    }
                    receivedRequests()
                }
                catch (error: any) {
                    console.log(error)
                }
            }
            else {
                console.log(event.data);
            }
        })

        eventSource.addEventListener('requeststatus', (event) => {
            const data = JSON.parse(event.data);
            dispatch(updateSentRequestStatus(data))
            dispatch(updateReceivedRequestStatus(data))
        })

        eventSource.addEventListener('requestproposal', (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            dispatch(updateReceivedRequestDetails(data))
            dispatch(updateSentRequestDetails(data))
        })
        eventSource.addEventListener('notification', (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            dispatch(appendNotification(data))
        })

        return () => eventSource.close();
    }, []);
    return null;
}