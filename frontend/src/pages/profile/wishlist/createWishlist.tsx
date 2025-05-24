import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef,useState } from "react";
import { MdOutlineCreate } from "react-icons/md";
import { useToast } from "@/hooks/use-toast";
import { createWishlist } from "@/api/wishlist";

export function CreateWishlist() {
    const titleRef = useRef<HTMLInputElement>(null);
    const authorRef = useRef<HTMLInputElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const submitHandler = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!titleRef.current || !authorRef.current) return;
        const title = titleRef.current.value;
        const author = authorRef.current.value;
        if(!title && !author){
            toast({
                title: "Error",
                description: "Please fill at least one field.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }
        setLoading(true);
        const response = await createWishlist(title, author);
        setLoading(false);
        closeRef.current?.click();
        console.log(response);
        if(!!response.data){
            toast({
                title: "Success",
                description: response?.message || "Wishlist created successfully.",
                variant: "default",
                duration: 3000,
            });
        }
        else{
            toast({
                title: "Error",
                description: response?.message || "Something went wrong.",
                variant: "destructive",
                duration: 3000,
            });
        }
    };
    return (
        <Dialog>
            <DialogTrigger className="flex items-center justify-between bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-4 py-2 rounded-lg">
                <MdOutlineCreate className="mr-2 h-4 w-4" /> Create
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="text-left">
                    <DialogTitle className="text-xl font-semibold">Create Wishlist</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Create a wishlist to automatically get notified when a new post matching your preferences is created.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <form onSubmit={submitHandler}>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input ref={titleRef} name="title" id="title" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="author">Author</Label>
                                <Input ref={authorRef} name="author" id="author" />
                            </div>
                            <div className="flex w-full gap-4 px-4">
                                <DialogClose ref={closeRef} className="w-1/2 bg-red-500 hover:bg-neutral-800 text-neutral-200 text-lg font-semibold rounded">
                                    Cancel
                                </DialogClose>
                                <Button className="w-1/2 bg-green-600 text-lg font-semibold" type="submit" disabled={loading}>Create</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}