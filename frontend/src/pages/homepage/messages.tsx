import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useAppSelector } from "@/hooks/redux";
import { useEffect, useRef, useState } from "react"
import { MdMessage } from "react-icons/md"


export function Messages() {
    const receiverId = useAppSelector(state => state.messages.data.receiverId);
    const timestamp = useAppSelector(state => state.messages.data.timestamp);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [more,setMore] = useState(false);

    useEffect(() => {
        if(receiverId>0){
            triggerRef.current?.click();
            setMore(true);
            console.log(receiverId);
        }
    }, [receiverId,timestamp])
    
    return (
        <Sheet>
            <SheetTrigger ref={triggerRef}>
                <MdMessage className="text-2xl" />
            </SheetTrigger>
            <SheetContent className="overflow-y-scroll w-full">
                <SheetHeader>
                    <SheetTitle>Messages</SheetTitle>
                    <SheetDescription>
                        View all your messages here.
                    </SheetDescription>
                </SheetHeader>
                { !more &&
                <section className="w-full flex flex-col gap-4 py-2">
                    list
                </section>
                }
                {
                    !!more &&
                    <section className="w-full flex flex-col gap-4 py-2">
                        <ChatCard/>
                    </section>
                }
            </SheetContent>
        </Sheet>
    )
}

export function ChatCard() {
    const user = useAppSelector(state => state.user.data);
    return(
        <section className="grid grid-cols-6 border">
            <div className="col-span-1">
                <Avatar>
                    <AvatarImage src={user?.picture} />
                    <AvatarFallback>
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(1)}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="col-span-5">
                <p>{user?.username}</p>
                <p>last message</p>
            </div>

        </section>
    )
}