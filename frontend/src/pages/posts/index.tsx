import PostCard from "./post-card"
import { FilterSidebar } from "./filter-sidebar"
import { useLoaderData } from "react-router"

export function Posts() {
  const posts = useLoaderData<[]>()
  console.log(posts)
  return (
    <div className="flex min-h-screen border-2 border-yellow-600">
      <FilterSidebar />
      <main className="flex-1  mx-[8px] border border-red-600 min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <div>
          {
            posts.length > 0 && posts.map((post, index) => (
              <PostCard post={post} key={index} />
            ))
          }
        </div>
      </main>
    </div>
  )
}
