import { useSelector, useDispatch } from "react-redux"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MdDelete } from "react-icons/md";
import { deletePost, getPostByUser } from "@/api/post";
import { useToast } from "@/hooks/use-toast";
import { deleteUserPost, setUserPosts } from "@/store/features/userPosts/userPostSlice";
import { useEffect, useState } from "react";
import { CreatePost } from "@/pages/createPost";
import { Link } from "react-router";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { PostStatus } from "@/components/ui/post-status";

export function ManagePosts() {
    const posts = useSelector((state: any) => state.userPosts.data) as any[]
    const sortedPosts = posts.toSorted((a: any, b: any) => b.post.id - a.post.id)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const dispatch = useDispatch()
    const handleDelete = async (index: number) => {
        try {
            const id = parseInt(posts[index]?.post?.id)
            setLoading(true)
            const response = await deletePost(id)
            setLoading(false)
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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getPostByUser();
                dispatch(setUserPosts(response))
            } catch (error) {
                console.error("Error fetching posts:", error)
            }
        }
        if (posts.length === 0) {
            fetchPosts()
        }
    }, [])
    return (
        <div className="pt-20 pb-8 px-2 md:px-4">
            <div className="mb-6 flex items-center justify-between">
                <Link to="/profile" className="hover:bg-gray-300 rounded-lg p-2">
                    <IoReturnUpBackOutline className="h-8 w-8" />
                </Link>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-700">Manage Posts</h1>
                <CreatePost />
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
                          // sort by date created, most recent first 
                            sortedPosts.map((post: any, index) => (
                                <TableRow key={`manage-post-${index}`} className="font-semibold">
                                    <TableCell>
                                        <img src={post.post.images[0]} alt="Cover" className="h-14 sm:h-16 md:h-18 lg:h-20" />
                                    </TableCell>
                                    <TableCell>{post.post.title}</TableCell>
                                    <TableCell>{post.post.author}</TableCell>
                                    <TableCell>{post.post.category}</TableCell>
                                    <TableCell className="capitalize">{post.post.language}</TableCell>
                                    <TableCell className="capitalize">{post.post.bookCondition}</TableCell>
                                    <TableCell className="capitalize">{post.post.exchangeType}</TableCell>
                                    <TableCell>{post.post.price}</TableCell>
                                    <TableCell>{post.post.currency}</TableCell>
                                    <TableCell>
                                        <PostStatus status={post.post.status}>
                                            <p className="p-2">
                                                {post.post.status}
                                            </p>
                                        </PostStatus>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center">
                                            <button disabled={loading} onClick={() => { handleDelete(index) }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                                                <MdDelete className="text-xl" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        {
                            posts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={12} className="bg-gray-200 h-24 text-center md:text-lg font-medium">
                                        No posts found.
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
