import PostCard from "./post-card"
import { FilterSidebar } from "./filter-sidebar"
import { useLoaderData } from "react-router"

export function Posts() {
  const result: {message: string,data: Array<{post: any, user: any}>} = useLoaderData()
  console.log(result)
  return (
    <div className="flex min-h-screen">
      <FilterSidebar />
      <main className="flex-1 flex flex-col gap-8 mx-[8px] min-h-screen  items-center justify-center p-4 md:p-24">
          {
            result?.data?.length > 0 && result?.data?.map((data, index) => (
              <PostCard post={data.post} user={data.user} key={index} />
            ))
          }
      </main>
    </div>
  )
}
