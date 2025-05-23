import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Settings } from "lucide-react"
import { MdOutlineCreate } from "react-icons/md";
import { Button } from "@/components/ui/button"
import { useState,useEffect } from "react"
import axios from "axios";
import { Link } from "react-router"
import { setUserPosts } from "@/store/features/userPosts/userPostSlice";
import { useDispatch, useSelector } from "react-redux";
export function PostCard() {
    const posts = useSelector((state:any) => state.userPosts.data) as []
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("http://localhost:3000/posts/user", { withCredentials: true })
                console.log("Posts:", response.data)
                dispatch(setUserPosts(response.data.data))
            } catch (error) {
                console.error("Error fetching posts:", error)
            }
        }
        fetchPosts()
    },[])
    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium">Posts</CardTitle>
            </CardHeader>
            <CardContent className="py-8">
                <div className="text-center">
                    <p className="text-5xl font-bold">{posts?.length || 0}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Total posts created</p>
                </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-y-4 gap-x-2 justify-between border-t pt-4">
                <Link to="posts/view" className="flex items-center bg-black hover:bg-neutral-700 text-white px-3 py-1.5 rounded-md"> 
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </Link>
                <Link to="posts/manage" className="flex items-center bg-black hover:bg-neutral-700 text-white px-3 py-1.5 rounded-md"> 
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
                </Link>
            </CardFooter>
        </Card>
    )
}