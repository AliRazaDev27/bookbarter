import { getContactInfo, sendMessage } from "@/api/messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { BsFillSendFill } from "react-icons/bs";

import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { appendMessage, setMessageRead, setUpContact } from "@/store/features/mwssages";
import { setContactId } from "@/store/features/util/utilSlice";
import { IoMdArrowBack } from "react-icons/io";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";


import { useEffect, useRef, useState } from "react";
import { getImageUrl, groupMessagesWithDateLabels } from "@/lib/utils";
import { markMessageAsRead } from "@/api/messages";

export function ChatCard() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const contactId = useAppSelector(state => state.util.data.contactId);
    const contact = useAppSelector(state => state.messages[contactId]);

    const groupedMessages = groupMessagesWithDateLabels(contact?.messages || []);
    const messageInputRef = useRef<HTMLInputElement>(null); // Renamed to avoid conflict
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({}); // To store refs for each message

    const handleSend = async () => {
        if (!messageInputRef.current) return;
        if (messageInputRef.current.value === '') return;
        if (contactId === 0) return;
        setLoading(true);
        const result = await sendMessage(contactId, messageInputRef.current.value);
        setLoading(false);
        console.log(result);
        scrollToBottom();
        messageInputRef.current.value = '';
        if (result.success) {
            if (result.data) {
                dispatch(appendMessage({ contactId: contactId, message: result.data }));
            }
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    };
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const messageId = Number(entry.target.id.replace('message-', ''));
                        const message = contact?.messages?.find(msg => msg.id === messageId);
                        if (message && !message.isRead) {
                            markMessageAsRead(message.id).then(res => {
                                if(res.success){
                                    console.log(res.success);
                                    dispatch(setMessageRead({ contactId: contactId, messageId: message.id }));
                                }
                            });
                        }
                    }
                });
            },
            { threshold: 0.5 } // Adjust threshold as needed, 0.5 means 50% of the element must be visible
        );

        // Observe only unread messages
        contact?.messages?.forEach((message) => {
            if (message.senderId === contactId && !message.isRead && messageRefs.current[message.id]) {
                observer.observe(messageRefs.current[message.id]!);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [contact?.messages, contactId]); // Re-run effect if messages or contactId change


    useEffect(() => {
        scrollToBottom();
        if(contact === undefined){
            const setup = async () => {
                const result = await getContactInfo(contactId);
                if(!!result.success && !!result.data){
                    dispatch(setUpContact({ contactId: contactId, contactInfo: result.data }));
                }
            }
            setup();
        }
    }, []);

    return (
        <section className="flex flex-col h-full ">
            <SheetHeader>
                <SheetTitle>
                    <section className="flex gap-2 py-2 items-center">
                        <button onClick={() => dispatch(setContactId({ contactId: 0 }))}><IoMdArrowBack className="h-6 w-6 hover:text-red-500" /></button>
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
            <section className="flex-1 flex flex-col gap-2 p-1 mt-2 overflow-y-auto">
  {
    groupedMessages.map((item, index) => {
      if (item.type === "date") {
        return (
          <div key={`date-${index}`} className="text-center my-2">
            <span className="bg-gray-300 text-sm text-gray-700 px-3 py-1 rounded-full">
              {item.date}
            </span>
          </div>
        );
      }

      // message item
      return (
        <div
          key={item.id}
          id={`message-${item.id}`}
          ref={(el) => {
            if (item.id) {
              messageRefs.current[item.id] = el;
            }
          }}
          className={`border border-neutral-200 space-y-1 max-w-[80%] px-3 py-1.5 rounded-lg ${
            item.receiverId === contactId ? 'ml-auto bg-green-200' : 'mr-auto bg-white'
          }`}
        >
          <p className="font-medium">{item.message}</p>
          <div className="flex items-center gap-1 justify-end">
            <p className="text-xs font-medium text-neutral-500">
              {new Date(item.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
            </p>
            {
              item.receiverId === contactId &&
              (item.isRead === false
                ? <IoCheckmark className="h-6 w-6" />
                : <IoCheckmarkDone className="h-6 w-6 text-blue-500" />)
            }
          </div>
        </div>
      );
    })
  }
  <div ref={messagesEndRef} />
</section>

            <section className="mt-auto">
                <article className="flex items-center gap-2 pb-1">
                    <Input placeholder="message" ref={messageInputRef} onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }} />
                    <button disabled={loading} onClick={handleSend}>
                        <BsFillSendFill className="h-7 w-7 hover:text-green-500 " />
                    </button>
                </article>
            </section>
        </section>
    )
}
