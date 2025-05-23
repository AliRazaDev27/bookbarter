import { useSelector,useDispatch } from "react-redux"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MdDelete, MdOutlineCreate } from "react-icons/md";
import { deletePost } from "@/api/mutations/posts";
import { useToast } from "@/hooks/use-toast";
import { deleteUserPost} from "@/store/features/userPosts/userPostSlice";
import { useState } from "react";
import { parse } from "path";
import { Button } from "@/components/ui/button";
import { CreatePost } from "@/pages/createPost";



export function ManagePosts() {
    const posts = useSelector((state: any) => state.userPosts.data) as []
    const [loading, setLoading] = useState(false)
    const {toast} = useToast()
    const dispatch = useDispatch()
    const handleDelete = async (index: number) => {
        try {
            const id = parseInt(posts[index].post.id)
            console.log(id)
            const response = await deletePost(id)
            console.log("Posts:", response)
            if (response.success) {
                toast({
                    title: "Success",
                    description: response.message,
                    duration: 2000,
                    className: "bg-green-600 text-white",
                })
                dispatch(deleteUserPost(id))
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
            console.error("Error fetching posts:", error)
        }
    }
    return (
        <div className="pt-20 pb-8 px-2 md:px-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-700">Manage Posts</h1>
<CreatePost/>
            </div>
            <div className="w-full border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Language</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Currency</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            posts.map((post: any, index) => (
                                <TableRow key={`manage-post-${index}`}>
                                    <TableCell className="">
                                        <img src={post.post.images[0]} alt="Avatar" className="h-14 sm:h-16 md:h-18 lg:h-20" />
                                    </TableCell>
                                    <TableCell>{post.post.title}</TableCell>
                                    <TableCell>{post.post.author}</TableCell>
                                    <TableCell>{post.post.category}</TableCell>
                                    <TableCell>{post.post.language}</TableCell>
                                    <TableCell>{post.post.bookCondition}</TableCell>
                                    <TableCell>{post.post.exchangeType}</TableCell>
                                    <TableCell>{post.post.price}</TableCell>
                                    <TableCell>{post.post.currency}</TableCell>
                                    <TableCell>{post.post.status}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center">
                                            <button disabled={loading} onClick={() => {handleDelete(index)}} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                                                <MdDelete className="text-xl"/>
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}