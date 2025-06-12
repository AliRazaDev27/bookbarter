import { sendMessage } from "@/api/messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BsFillSendFill } from "react-icons/bs";

import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { appendMessage } from "@/store/features/mwssages";
import { setContactId } from "@/store/features/util/utilSlice";
import { IoMdArrowBack } from "react-icons/io";


import { useRef, useState } from "react";
import { getImageUrl } from "@/lib/utils";

export function ChatCard() {
    const contactId = useAppSelector(state => state.util.data.contactId);
    const contact = useAppSelector(state => state.messages[contactId]);
    // if undefined then grab from server and setup the state.
    const messageRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const handleSend = async () => {
        if (!messageRef.current) return;
        if (messageRef.current.value === '') return;
        if (contactId === 0) return;
        setLoading(true);
        const result = await sendMessage(contactId, messageRef.current.value);
        setLoading(false);
        console.log(result);
        messageRef.current.value = '';
        if (result.success) {
            // append result.data to messagges
            if (result.data) {
                dispatch(appendMessage({ contactId: contactId, message: result.data }));
            }
        }

    }
    return (
        <section className="flex flex-col h-full ">
            <SheetHeader>
                <SheetTitle>
                    <section className="flex gap-2 py-2 items-center">
                        <button onClick={() => dispatch(setContactId({ contactId: 0 }))}><IoMdArrowBack  className="h-6 w-6 hover:text-red-500"/></button>
                        <Avatar>
                            <AvatarImage src={getImageUrl(contact?.contactInfo?.picture)} alt="Profile picture" />
                            <AvatarFallback>{contact?.contactInfo?.username[0] + contact?.contactInfo?.username[1]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{contact?.contactInfo?.username}</p>
                        </div>
                    </section>
                </SheetTitle>
                <SheetDescription className="sr-only">
                    View all your messages here.
                </SheetDescription>
            </SheetHeader>
            <section className="flex-1 flex flex-col gap-2 p-1 mt-2 overflow-y-auto ">
                {
                    contact?.messages?.map((message, index) => <p key={index} className={`border  font-semibold w-fit max-w-[80%] px-3 py-1.5 rounded-lg ${message.receiverId === contactId ? 'ml-auto bg-green-200' : 'mr-auto bg-white'}`}>
                        {message.message}
                    </p>)
                }
            </section>
            <section className="mt-auto">
                <article className="flex items-center gap-2 pb-1">
                    <Input placeholder="message" ref={messageRef} onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }} />
                    <button disabled={loading} onClick={handleSend}>
                    <BsFillSendFill className="h-7 w-7 hover:text-green-500 " />
                    </button>
                </article>
            </section>
        </section>
    )
}