import PostCard from "./post-card";
import { FilterSidebar } from "./filter-sidebar";
import { useLoaderData } from "react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { getPosts } from "../../api/queries/getPosts"; // Assuming this path is correct

export function Posts() {
  const initialData: {message: string,data: Array<{post: any, user: any}>} = useLoaderData() as {message: string,data: Array<{post: any, user: any}>};
  
  const [posts, setPosts] = useState(initialData?.data || []);
  const [page, setPage] = useState(1); // Assuming page 1 is loaded by useLoaderData
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Assume more posts initially

  // Effect to update posts if initialData changes (e.g. due to filters)
  useEffect(() => {
    setPosts(initialData?.data || []);
    setPage(1); // Reset page to 1
    setHasMore(true); // Assume new data might have more pages
    // It's important that the API returns a way to know if there are truly more pages
    // For example, if initialData.data.length < ITEMS_PER_PAGE, setHasMore(false)
  }, [initialData?.data]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Effect to fetch more posts when page changes
  useEffect(() => {
    if (page === 1) { 
      // Initial data is handled by useLoaderData and the effect above
      // Check if initial load itself means no more data
      if (initialData?.data?.length === 0 || (initialData?.data && initialData.data.length < 4)) { // Assuming 10 items per page
          setHasMore(false);
      }
      return;
    }

    const fetchMorePosts = async () => {
      setLoading(true);
      try {
        // Pass current filter parameters if they are available in this component's scope
        // For now, fetching without filters other than page & limit
        const newPostsData = await getPosts(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, page, 10); // Fetch page with limit 10

        if (newPostsData && newPostsData.data && newPostsData.data.length > 0) {
          setPosts(prevPosts => [...prevPosts, ...newPostsData.data]);
          setHasMore(true);
        } else {
          setHasMore(false); // No more posts
        }
      } catch (error) {
        console.error("Failed to fetch more posts:", error);
        // Optionally set an error state here
      }
      setLoading(false);
    };

    if (hasMore) { // Only fetch if we think there are more posts
        fetchMorePosts();
    }
  }, [page, hasMore, initialData?.data]); // Added initialData.data to re-evaluate hasMore on filter changes

  return (
    <div className="flex min-h-screen">
      <FilterSidebar />
      <main className="flex-1 flex flex-col gap-8 mx-[8px] min-h-screen items-center p-4 md:p-24">
          {posts.length > 0 && posts.map((data, index) => {
            if (posts.length === index + 1) {
              // Attach ref to a wrapper div around the last element
              return (
                <div ref={lastPostElementRef} key={`post-wrapper-${index}`} className="w-full flex justify-center">
                  <PostCard post={data.post} user={data.user} />
                </div>
              );
            } else {
              return (
                <div key={`post-wrapper-${index}`} className="w-full flex justify-center">
                  <PostCard post={data.post} user={data.user} />
                </div>
              );
            }
          })}
          {loading && <p className="text-center my-4">Loading more posts...</p>}
          {!hasMore && posts.length > 0 && <p className="text-center my-4">You've reached the end!</p>}
          {posts.length === 0 && !loading && <p className="text-center my-4">No posts found.</p>}
      </main>
    </div>
  );
}
