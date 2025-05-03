import { useState,useEffect } from "react"
import PostCard from "./post-card"
import { FilterSidebar } from "./filter-sidebar"
import axios from "axios"

export function Posts() {
  const [posts, setPosts] = useState([])
  useEffect(()=>{
    const fetchPosts = async () => {
    const data = await axios.get("http://localhost:3000/posts");
    const posts = await data.data;
    console.log(posts)
    setPosts(posts?.data);
    }
    fetchPosts();
  },[])
  return (
    <div className="flex min-h-screen">
     <FilterSidebar/> 
    <main className="flex-1 border-2 border-red-600 min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-50">
    <div>
    {
      posts.map((post,index) => (
      <PostCard post={post} key={index}/>
      ))
    }
    </div>
    </main>
    </div>
  )
}
