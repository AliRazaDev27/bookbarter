import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { markAsReviewed, removeSentRequest, setSentRequests } from "@/store/features/request/sentRequestSlice"
import { removeReceivedRequest, setReceivedRequests } from "@/store/features/request/receivedRequestSlice"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { MdAssignmentLate } from "react-icons/md";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { deleteRequest, getReceivedRequests, getSentRequests, sendProposal, updateRequestStatus } from "@/api/request"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { sendReview } from "@/api/review"
import { MdDelete } from "react-icons/md";





export function Requests() {
    const sentRequests = useSelector((state: any) => state.sentRequests.data)
    const receivedRequests = useSelector((state: any) => state.receivedRequests.data)
    const [showMore, setShowMore] = useState(false)
    const [slectedType, setSelectedType] = useState<"sent" | "received">("sent")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const dispatch = useDispatch()
    const detailView = (type: "sent" | "received", index: number) => {
        setSelectedType(type)
        setSelectedIndex(index)
        setShowMore(true)
    }
    useEffect(() => {
        const sentRequests = async () => {
            const response = await getSentRequests()
            if (!!response) {
                dispatch(setSentRequests(response))
            }
        }
        const receivedRequests = async () => {
            const response = await getReceivedRequests()
            if (!!response) {
                dispatch(setReceivedRequests(response))
            }
        }
        sentRequests()
        receivedRequests()
    }, [])
    return (
        <Sheet>
            <SheetTrigger>
                <MdAssignmentLate className="text-xl" />
            </SheetTrigger>
            <SheetContent className="overflow-y-scroll w-full">
                <SheetHeader>
                    <SheetTitle>{showMore === false ?
                        "Manage Requests" :
                        <button
                            className="text-2xl border rounded-3xl p-1 bg-neutral-100 hover:bg-neutral-200"
                            onClick={() => setShowMore(!showMore)}>
                            <IoReturnUpBackOutline />
                        </button>
                    }
                    </SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                </SheetHeader>
                {!showMore &&
                    <Tabs defaultValue="sent" className="w-full">
                        <TabsList className="w-full space-x-1 px-1">
                            <TabsTrigger value="sent" className="w-1/2 border hover:bg-neutral-200">Sent</TabsTrigger>
                            <TabsTrigger value="received" className="w-1/2 border hover:bg-neutral-200">Received</TabsTrigger>
                        </TabsList>
                        <TabsContent value="sent">
                            <div className="flex flex-col gap-4">
                                {
                                    sentRequests.map((request: any, index: number) =>
                                        <div key={`sent-request-${index}`} className="relative">
                                            <RequestCard data={request} type="sent" />
                                            <Button
                                                className="absolute bottom-1 left-4"
                                                onClick={() => detailView("sent", index)}
                                            >Details</Button>
                                        </div>
                                    )
                                }
                            </div>
                        </TabsContent>
                        <TabsContent value="received">
                            <div className="flex flex-col gap-4">
                                {
                                    receivedRequests.map((request: any, index: number) =>
                                        <div key={`received-request-${index}`} className="relative">
                                            <RequestCard data={request} type="received" />
                                            <Button
                                                className="absolute bottom-1 left-4"
                                                onClick={() => detailView("received", index)}
                                            >Details</Button>
                                        </div>
                                    )
                                }
                            </div>
                        </TabsContent>
                    </Tabs>
                }
                {
                    showMore && <div>
                        <DetailView index={selectedIndex} type={slectedType} />
                    </div>
                }
            </SheetContent>
        </Sheet>
    )
}

export function RequestCard({ data, type }: { data: any, type: "sent" | "received" }) {
    const dispatch = useDispatch()
    const handleDelete = async ()=>{
            const response = await deleteRequest(data.exchange_requests.id,type);
            if(!!response){
                if(type === "sent"){
                    dispatch(removeSentRequest({requestId:data.exchange_requests.id}))
                }
                else{
                    dispatch(removeReceivedRequest({requestId:data.exchange_requests.id}))
                }
            }
    }
    return (
        <div className="flex flex-col gap-2 ">
            <div className="grid grid-cols-3 border rounded-2xl ps-1 pt-1 pb-2">
                <div className="col-span-1 my-auto">
                    <img src={data.requested_post.images[0]} alt="post_image" />
                </div>
                <div className="col-span-2 flex flex-col gap-1 items-start ps-2 pe-1 justify-start">
                    <p className="font-medium text-lg">{data.requested_post.title}</p>
                    {
                        type === "sent" && <div className="flex gap-2">
                            <p className="font-medium">To</p>
                            <p>{data.receiver.username}</p>
                        </div>
                    }
                    {
                        type === "received" && <div className="flex gap-2">
                            <p className="font-medium">From</p>
                            <p>{data.sender.username}</p>
                        </div>
                    }
                    <div className="w-full flex items-center justify-between px-2">
                    <p className="text-sm font-semibold capitalize bg-blue-500 text-white px-4 py-2 rounded-3xl">{data.exchange_requests.status}</p>
                    { (data.exchange_requests.status === "cancelled" || data.exchange_requests.status === "rejected" || data.exchange_requests.status === "completed") && (
                        <button onClick={handleDelete} className="hover:text-red-500 hover:bg-neutral-700 transition-colors duration-150 rounded-lg p-1">
                        <MdDelete className="h-8 w-8" />
                    </button>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function DetailView({ index, type }: { index: number, type: "sent" | "received" }) {
    const sentRequests = useSelector((state: any) => state.sentRequests.data)
    const receivedRequests = useSelector((state: any) => state.receivedRequests.data)
    const request = type === "sent" ? sentRequests[index] : receivedRequests[index]
    const user = useSelector((state: any) => state.user.data)
    return <div className="flex flex-col gap-3">
        <div className="border p-3 rounded-3xl">
            <p className="font-medium text-lg">Request Info</p>
            <div className="flex gap-2">
                <p className="font-medium">Status</p>
                <p className="capitalize">{request.exchange_requests.status}</p>
            </div>
            <div className="flex gap-2">
                <p className="font-medium">{type === "sent" ? "Sent to" : "Received from"}</p>
                <p>{type === "sent" ? request.receiver.username : request.sender.username}</p>
            </div>
            <div className="flex gap-2">
                <p className="font-medium">Type</p>
                {request.requested_post.exchangeType === "pay" ?
                    <p className="capitalize">{request.requested_post.exchangeType} <span>{request.requested_post.price} <span>{request.requested_post.currency}</span></span></p>
                    :
                    <p className="capitalize">{request.requested_post.exchangeType}</p>
                }
            </div>
            <div>
                {
                    !!request.exchange_requests.location && <div className="flex gap-2">
                        <p className="font-medium">Location</p>
                        <p>{request.exchange_requests.location}</p>
                    </div>
                }
                {
                    !!request.exchange_requests.date && <div className="flex gap-2">
                        <p className="font-medium">Date</p>
                        <p>{new Date(request.exchange_requests.date).toDateString()}</p>
                    </div>

                }
                {
                    !!request.exchange_requests.time && <div className="flex gap-2">
                        <p className="font-medium">Time</p>
                        <p>{request.exchange_requests.time}</p>
                    </div>

                }
            </div>
        </div>
        <div className="border p-3 rounded-3xl">
            <p className="font-medium text-md mb-1">Requested Book</p>
            <div className="grid grid-cols-3">
                <div className="col-span-1 my-auto">
                    <img src={request.requested_post.images[0]} alt="post_image" />
                </div>
                <div className="col-span-2 flex flex-col items-start ps-2 justify-center">
                    <p className="font-medium text-lg">{request.requested_post.title}</p>
                    <div className="flex gap-2">
                        <p className="font-medium">Author</p>
                        <p>{request.requested_post.author}</p>
                    </div>
                    <div className="flex gap-2">
                        <p className="font-medium">Owner</p>
                        <p>{type === "sent" ? request?.receiver?.username : user?.username}</p>
                    </div>
                </div>
            </div>
        </div>
        {request.offered_post &&
            <div className="border p-3 rounded-3xl">
                <p className="font-medium text-md mb-1">Offered Book</p>
                <div className="grid grid-cols-3">
                    <div className="col-span-1 my-auto">
                        <img src={request.offered_post.images[0]} alt="post_image" />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1 items-start ps-2 justify-center">
                        <p className="font-medium text-lg">{request.offered_post.title}</p>
                        <div className="flex gap-2">
                            <p className="font-medium">Author</p>
                            <p>{request.offered_post.author}</p>
                        </div>
                        <div className="flex gap-2">
                            <p className="font-medium">Owner</p>
                            <p>{type === "sent" ? user?.username : request?.sender?.username}</p>
                        </div>
                    </div>
                </div>
            </div>
        }
        <div className="">
            <AllowedActions isReviewed={request.exchange_requests.isReviewed} type={type} state={request.exchange_requests.status} id={request.exchange_requests.id} />
        </div>
    </div>

}

export function AllowedActions({ id, type, state, isReviewed }: { id: number, type: "sent" | "received", state: "pending" | "cancelled" | "rejected" | "proposed" | "confirmed" | "expired" | "completed", isReviewed: boolean }) {
    const locationRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);
    const ratingRef = useRef<HTMLInputElement>(null);
    const reviewRef = useRef<HTMLTextAreaElement>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
    const dispatch = useDispatch()

    const handleSendProposal = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const location = locationRef?.current?.value
            const date = dateRef?.current?.value
            const time = timeRef?.current?.value
            console.log(location, date, time)
            if (!location || !date || !time) return
            setLoading(true)
            const result = await sendProposal(id, location, date, time)
            setLoading(false)
            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message,
                    duration: 2000,
                    className: "bg-green-600 text-white",
                })
            }
            else {
                toast({
                    title: "Error",
                    description: result.message,
                    duration: 3000,
                    className: "bg-red-600 text-white",
                })
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    const statusHandler = async ({ status }: { status: "cancelled" | "confirmed" | "rejected" | "completed" }) => {
        try {
            setLoading(true)
            await updateRequestStatus(id, type, status);
            setLoading(false)
        }
        catch (error: any) {
            console.log(error)
        }
    }
    const handleSendReview = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const rating = ratingRef?.current?.value
            const review = reviewRef?.current?.value
            if (!rating || !review) return
            setLoading(true)
            const result = await sendReview(id, parseInt(rating), review)
            setLoading(false)
            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message,
                    duration: 2000,
                    className: "bg-green-600 text-white",
                })
                dispatch(markAsReviewed({ requestId: id }))
            }
            else {
                toast({
                    title: "Error",
                    description: result.message,
                    duration: 3000,
                    className: "bg-red-600 text-white",
                })
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    if (type === "sent") {
        if (state === "pending") return <div className="flex gap-2 justify-center">
            <Button disabled={loading} onClick={() => statusHandler({ status: "cancelled" })}>Cancel</Button>
        </div>
        else if (state === "proposed") return <div className="flex gap-2 justify-center">
            <Button disabled={loading} onClick={() => statusHandler({ status: "cancelled" })}>Cancel</Button>
            <Button disabled={loading} onClick={() => statusHandler({ status: "confirmed" })}>Confirm</Button>
        </div>
        else if (state === "completed" && !isReviewed) return (
            <form onSubmit={handleSendReview}>
                <div className="flex flex-col gap-4">
                    <div className="">
                        <Label htmlFor="rating">Rating</Label>
                        <Input id="rating" type="number" min={0} max={10} ref={ratingRef} required/>
                    </div>
                    <div>
                        <Label htmlFor="review">Review</Label>
                        <Textarea id="review" ref={reviewRef} required/>
                    </div>
                    <div className="ms-auto">
                        <Button disabled={loading} type="submit">Submit</Button>
                    </div>
                </div>
            </form>
        )
        else return null
    }
    else if (type === "received") {
        if (state === "pending") return (
            <form onSubmit={handleSendProposal}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" ref={locationRef} type="text" required />
                        </div>
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" ref={dateRef} type="date" required />
                        </div>
                        <div>
                            <Label htmlFor="time">Time</Label>
                            <Input id="time" ref={timeRef} type="time" required />
                        </div>
                    </div>
                    <div className="flex gap-2 justify-center">
                        <Button disabled={loading} onClick={() => statusHandler({ status: "rejected" })}>Reject</Button>
                        <Button disabled={loading} type="submit" className="bg-green-600">Accept</Button>
                    </div>
                </div>
            </form>
        )
        else if (state === "proposed") return <div className="flex gap-2 justify-center">
            <Button disabled={loading} onClick={() => statusHandler({ status: "cancelled" })}>Cancel</Button>
        </div>
        else if (state === "confirmed") return <div className="flex gap-2 justify-center">
            <Button disabled={loading} onClick={() => statusHandler({ status: "cancelled" })}>Cancel</Button>
            <Button disabled={loading} onClick={() => statusHandler({ status: "completed" })}>Complete</Button>
        </div>
        else return null
    }
    else return null
}