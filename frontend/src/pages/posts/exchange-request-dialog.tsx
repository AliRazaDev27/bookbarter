import { useEffect, useState } from "react"
import { Book, Clock, MapPin, CalendarIcon, Repeat } from "lucide-react"
import { format, startOfDay } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { send } from "process"
import { sendRequest } from "@/api/mutations/sendRequest"

interface ExchangeRequestData {
    postID?: number; // Made optional
    title?: string;  // Made optional
    author?: string; // Made optional
    username?: string;
    userId?: number; // Made optional
    price?: string;  // Made optional
    type?: string;   // Made optional
    bookList: string; // Kept as is, was already handled in post-card
}
export function ExchangeRequestDialog({ data }: { data: ExchangeRequestData }) {
    // This should be passed as a prop
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const [userBooks, setUserBooks] = useState<[]>([])
    const [bookOffered, setBookOffered] = useState("")
    const [notes, setNotes] = useState("")

    // title author user price postID bookList
    const handleConfirm = async () => {
        try {
            let values = {
                postId: data?.postID,
                note: notes,
                barterId: bookOffered
            }
            setLoading(true)
            const response = await sendRequest(values)
            setLoading(false)
            toast({
                title: "MSG",
                description: response.message,
                duration: 3000,
                className: "bg-green-600 text-white",
            })
        }
        catch (error: any) {
            console.log(error)
        }
    }
    useEffect(() => {
        const userBooks = async () => {
            const response = await axios.get(`http://localhost:3000/posts/user`,
                {
                    withCredentials: true
                }
            )
            const result = await response.data
            setUserBooks(result.data)
            console.log('request')
        }
        if (data.type === "barter") {
            userBooks()
        }
    }, [])
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <Repeat className="h-4 w-4 mr-1" />
                    <span className="max-md:hidden">
                        Exchange
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Request Exchange</DialogTitle>
                    <DialogDescription>
                        <span className="sr-only">description</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-0">
                    <div className="flex flex-col gap-1">
                        <p className="text-md font-medium flex items-center gap-2">
                            Title: {data.title}
                        </p>
                        <p className="text-md font-medium flex items-center gap-2">
                            Author: {data.author}
                        </p>
                        <p className="text-md font-medium flex items-center gap-2">
                            User: {data.username}
                        </p>
                        {data.type === "pay" &&
                            <p className="text-md font-medium flex items-center gap-2">
                                Price: {data.price}
                            </p>
                        }
                    </div>
                    {data.type === "barter" && userBooks.length > 0 && <div className="grid gap-2">
                        <label htmlFor="book" className="text-sm font-medium flex items-center gap-2">
                            <Book className="h-4 w-4" />
                            Select a book to offer
                        </label>
                        <Select value={bookOffered} onValueChange={setBookOffered}>
                            <SelectTrigger id="book">
                                <SelectValue placeholder="Select one of your books" />
                            </SelectTrigger>
                            <SelectContent>
                                {userBooks.map((book: any) => (
                                    <SelectItem key={book.id} value={book.id}>
                                        {book.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    }

                    <div className="grid gap-2">
                        <label htmlFor="notes" className="text-sm font-medium">
                            Custom Notes
                        </label>
                        <Textarea
                            id="notes"
                            placeholder="Add any additional information about your exchange request..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                    <DialogClose className="bg-black hover:bg-neutral-800 text-white font-semibold px-4 py-1 rounded-md">Cancel</DialogClose>
                    <Button onClick={handleConfirm} disabled={loading}>Confirm Request</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
