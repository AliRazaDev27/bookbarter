import { getPostById } from "@/api/post";
import { IPost } from "@/types";
import { useLoaderData } from "react-router";
import PostCard from "../posts/post-card";

export function Post() {
    const data = useLoaderData() as {post: IPost, user: {id: number, picture:string, username:string}}| null;
    console.log(data);
    return (
        <div className="w-full h-screen flex items-center justify-center">
            {
                !!data && (
                    <PostCard post={data.post} user={data.user}/>
                )
            }
        </div>
    )
}

export async function loader({ params }: any) {
    const {id} = params;
    const response = await getPostById(id);
    return response;
}