import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect, useRef, useState } from "react"
import { MdMessage } from "react-icons/md"
import { ChatCard } from "./chat-card";
import { getMessages } from "@/api/messages";
import { appendMessage, setFetchMessages } from "@/store/features/mwssages";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { setContactId } from "@/store/features/util/utilSlice";




export function Messages() {
    const contactId = useAppSelector(state => state.util.data.contactId);
    const timestamp = useAppSelector(state => state.util.data.timestamp);
    const contactList = useAppSelector(state => state.messages);
    console.log(contactList)
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (triggerRef.current) triggerRef.current.click();
    }, [timestamp])

    useEffect(() => {
        let socket: WebSocket;
        let reconnectTimeout: NodeJS.Timeout;
        const fetchMessages = async () => {
            const result = await getMessages();
            dispatch(setFetchMessages({ data: result.data }))
        }
        fetchMessages();
        const connectSocket = () => {
            socket = new WebSocket(import.meta.env.VITE_SOCKET_URL);
            socket.onopen = () => {
                // ui indicator
                console.log('WebSocket connection opened');
                const messageSheet = document.getElementById('message-sheet');
                messageSheet?.style.setProperty('border-color', 'green');
            };
            socket.onmessage = (event) => {
                console.log(event.data)
                const data = JSON.parse(event.data);
                dispatch(appendMessage({ contactId: data.from, message: data.message }));
            };

            socket.onclose = () => {
                // ui indicator
                console.log('WebSocket connection closed');
                const messageSheet = document.getElementById('message-sheet');
                messageSheet?.style.setProperty('border-color', 'red');
                reconnectTimeout = setTimeout(() => {
                    console.log('🔁 Attempting to reconnect...');
                    connectSocket();
                }, 2000);
            };

            socket.onerror = (err) => {
                console.error('❌ WebSocket error:', err);
                socket.close();
            };
        }
        connectSocket();
        return () => {
            clearTimeout(reconnectTimeout);
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };

    }, [])

    return (
        <Sheet>
            <SheetTrigger ref={triggerRef}>
                <MdMessage className="text-2xl" />
            </SheetTrigger>
            <SheetContent id="message-sheet" className="overflow-y-auto border-2 w-full h-full px-2 py-1 bg-gray-100">
                {!contactId &&
                    <section className="w-full flex flex-col gap-4 py-2">
                        <SheetHeader>
                            <SheetTitle>Messages</SheetTitle>
                            <SheetDescription className="sr-only">
                                View all your messages here.
                            </SheetDescription>
                        </SheetHeader>
                        <section className="flex flex-col gap-2">
                            {
                                contactList && Object.entries(contactList).map(([key, value]) => {
                                    return <section
                                        onClick={() => { dispatch(setContactId({ contactId: Number(key) })) }}
                                        key={key}
                                        className="w-full flex items-center border gap-2 ps-1 pe-1.5 py-1.5 rounded-lg bg-white hover:bg-green-50  hover:cursor-pointer">
                                        <div>
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={`https://localhost:3000/${value.contactInfo.picture}`} />
                                                <AvatarFallback>{value.contactInfo.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-center">
                                                <p className="w-min text-lg">{value.contactInfo.username}</p>
                                                <p className="text-sm text-neutral-700 ">{new Date(value?.messages?.at(-1)?.createdAt).toDateString()}</p>
                                            </div>
                                            <p className="line-clamp-1 text-neutral-700">{value?.messages?.at(-1).message}</p>
                                        </div>
                                    </section>
                                })
                            }
                        </section>
                    </section>
                }
                {
                    !!contactId && <ChatCard />
                }
            </SheetContent>
        </Sheet>
    )
}
