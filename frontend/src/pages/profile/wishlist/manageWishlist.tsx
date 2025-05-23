import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { deleteWishlist, getWishlist } from "@/api/mutations/wishlist";
import { useToast } from "@/hooks/use-toast";
import { IoMdRefreshCircle } from "react-icons/io";
import { CreateWishlist } from "./createWishlist";


export function ManageWishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const handleDelete = async (index: number) => {
        try {
            setLoading(true)
            const response = await deleteWishlist(wishlist[index]?.id)
            setLoading(false)
            if (response.success) {
                toast({
                    title: "Success",
                    description: response.message,
                    duration: 2000,
                    className: "bg-green-600 text-white",
                })
            }
            else {
                toast({
                    title: "Error",
                    description: response.message,
                    duration: 2000,
                    className: "bg-red-600 text-white",
                })
            }
        } catch (error) {
            console.error("Error deleting item:", error)
        }
    }
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await getWishlist();
                setWishlist(response);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
        };
        fetchWishlist();
    }, []);

    return (
        <div className="pt-20 pb-8 px-2 md:px-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-neutral-700">Manage Wishlist</h1>
                <div className="flex gap-4">
                    <CreateWishlist />
                    <button>
                        <IoMdRefreshCircle className="text-3xl text-neutral-700 hover:text-green-600" />
                    </button>
                </div>
            </div>
            <div className="w-full border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Created at</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            wishlist.map((item: any, index) => (
                                <TableRow key={`wishlist-${index}`}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell className="capitalize font-semibold">{item.title || "N/A"}</TableCell>
                                    <TableCell className="capitalize font-semibold">{item.author || "N/A"}</TableCell>
                                    <TableCell>{new Date(item.createdAt).toDateString()}</TableCell>
                                    <TableCell>
                                        <Button className="bg-red-600" onClick={() => handleDelete(index)} disabled={loading}>
                                            <MdDelete className="text-xl" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        {
                            wishlist.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        No items in wishlist
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}