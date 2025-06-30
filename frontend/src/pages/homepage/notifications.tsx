import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { IoNotifications } from "react-icons/io5"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { deleteNotification, getNotifications, markAsRead } from "@/api/notification"
import { setNotificationData } from "@/store/features/notifications/notificationSlice"
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useToast } from "@/hooks/use-toast"



export function Notifications() {
    const notifications = useAppSelector((state) => state.notifications.data)
    const dispatch = useAppDispatch()
    const {toast} = useToast()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const fetchNotifications = async () => {
            // Fetch notifications from the API
            const response = await getNotifications()
            if(!!response){
                dispatch(setNotificationData(response))
            }
        }
        fetchNotifications()
    }, [])
    
    const handleMarkAsRead = async (id: number) => {
        setLoading(true)
        const response = await markAsRead(id)
        setLoading(false)
        if(response){
            // Update the notification state to mark as read
            const updatedNotifications = notifications?.map((notification) => {
                if(notification.id === id){
                    return {...notification, isRead: true}
                }
                return notification
            })
            dispatch(setNotificationData(updatedNotifications || []))
        }
    }
    const handleDelete = async (id: number) => {
        setLoading(true)
        const response = await deleteNotification(id)
        setLoading(false)
        if(response?.success){
            // Update the notification state to remove the deleted notification
            const updatedNotifications = notifications?.filter((notification) => notification.id !== id)
            dispatch(setNotificationData(updatedNotifications || []))
        }
        else{
            toast({
                title: "Error",
                description: response?.message || "Something went wrong",
                variant: "destructive",
                duration: 2000,
            })
        }
    }
    return (
        <Sheet>
            <SheetTrigger>
                <IoNotifications className="text-xl" />
            </SheetTrigger>
            <SheetContent className="overflow-y-scroll w-full">
                <SheetHeader>
                    <SheetTitle>Notifications</SheetTitle>
                    <SheetDescription>
                        View all your notifications here.
                    </SheetDescription>
                </SheetHeader>
                <section className="w-full flex flex-col gap-4 py-2">
                    {!!notifications && notifications.map((notification) => (
                        <div key={`notification-${notification.id}`}
                        className="w-full bg-neutral-50 border rounded-lg grid grid-cols-6">
                            <div className="col-span-2">
                                <img src={notification.image} alt="banner"  className="w-full"/>
                            </div>
                            <div className="col-span-4 w-full flex flex-col items-start justify-between h-full p-2">
                                <div>
                                <p className="text-xl font-semibold text-gray-800">
                                    {notification.notification.split("by")[0]}
                                </p>
                                <p className="text-lg font-medium text-neutral-600">
                                    {notification.notification.split("by")[1]}
                                </p>
                                <p>
                                    <span className="text-sm text-neutral-700">
                                        {new Date(notification.createdAt).toLocaleDateString()} - {new Date(notification.createdAt).toLocaleTimeString()}
                                    </span>
                                </p>

                                </div>
                                <div className="flex gap-2 border self-end">
                                {
                                    !notification.isRead &&
                                <Button
                                 disabled={loading}
                                className="hover:bg-green-500"
                                  onClick={()=>{handleMarkAsRead(notification.id)}}>
                                    <IoCheckmarkDoneSharp />
                                </Button>
                                }
                                {
                                    notification.isRead &&
                                <Button
                                disabled={loading}
                                className="hover:bg-red-500"
                                onClick={()=>{handleDelete(notification.id)}}>
                                    <MdDelete />
                                    </Button>
                                }
                                <Link
                                className="flex items-center bg-black text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
                                 to={`/post/${notification.postId}`}><FaExternalLinkAlt /></Link>
                                </div>

                            </div>
                        </div>
                    ))}
                </section>
            </SheetContent>
        </Sheet>
    )
}