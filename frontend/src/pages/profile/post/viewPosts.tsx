import PostCard from '@/pages/posts/post-card'
import { useSelector } from 'react-redux'
export function ViewPosts() {
    const posts = useSelector((state:any) => state.userPosts.data) as []
    return(
        <div className='container mx-auto pt-20 pb-8 px-2 '>
            <div className='flex flex-col gap-8 items-center justify-between'>
                {
                    posts.map((post:any, index) => (
                        <PostCard key={index} post={post.post} user={post.user} />
                    ))
                }
            </div>
        </div>
    )
}