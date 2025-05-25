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
import { deleteWishlist, getWishlist } from "@/api/wishlist";
import { useToast } from "@/hooks/use-toast";
import { CreateWishlist } from "./createWishlist";
import { Link } from "react-router";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { IWishlist } from "@/types";


export function ManageWishlist() {
    const [wishlist, setWishlist] = useState<IWishlist[]>([]);
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
                <Link to="/profile" className="hover:bg-gray-300 rounded-lg p-2">
                    <IoReturnUpBackOutline className="h-8 w-8" />
                </Link>
                <h1 className="text-3xl font-bold text-neutral-700">Manage Wishlist</h1>
                <div className="flex gap-4">
                    <CreateWishlist />
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