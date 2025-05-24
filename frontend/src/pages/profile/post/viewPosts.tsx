import PostCard from '@/pages/posts/post-card'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
export function ViewPosts() {
    const posts = useSelector((state:any) => state.userPosts.data) as []
    return(
        <div className='container mx-auto pt-20 pb-8 px-2 '>
            <div className='flex flex-col gap-8 items-center justify-between'>
                {
                    posts.length > 0 && posts.map((post:any, index) => (
                        <PostCard key={index} post={post.post} user={post.user} />
                    ))
                }
                {
                    posts.length === 0 && <div className='flex flex-col items-center md:mt-8 space-y-4'>
                    <p className='text-2xl font-medium'>
                        No Post Found!
                    </p>
                    <div className='flex gap-4 items-center'>
                        <p>Create a new post?</p>
                    <Link to="/profile/posts/manage" className='text-sm font-medium bg-neutral-700 hover:bg-neutral-900 text-neutral-50 p-2 rounded-md'>
                    Create 
                    </Link> 
                    </div>
                    </div>
                }
            </div>
        </div>
    )
}