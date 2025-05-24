import PostCard from "./post-card";
import { FilterSidebar } from "./filter-sidebar";
import { useLoaderData } from "react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { getPosts } from "@/api/post"; // Assuming this path is correct
import { useSearchParams } from "react-router";

export function Posts() {
  const initialData: {message: string,data: Array<{post: any, user: any}>} = useLoaderData() as {message: string,data: Array<{post: any, user: any}>};
  
  const [posts, setPosts] = useState(initialData?.data || []);
  const [page, setPage] = useState(1); // Assuming page 1 is loaded by useLoaderData
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Assume more posts initially
  const [searchParams,_] = useSearchParams();

  const LIMIT = 8; // Number of posts per page

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
        const title = searchParams.get("title") || undefined;
        const author = searchParams.get("author") || undefined;
        const minPrice = searchParams.get("minPrice") || undefined;
        const maxPrice = searchParams.get("maxPrice") || undefined;
        const currency = searchParams.get("currency") || undefined;
        const bookCondition = searchParams.get("bookCondition") || undefined;
        const exchangeType = searchParams.get("exchangeType") || undefined;
        const sortBy = searchParams.get("sortBy") || undefined;
        const languages = searchParams.get("languages") || undefined;
        const categories = searchParams.get("categories") || undefined;
        const newPostsData = await getPosts(
          title,
          author,
          minPrice,
          maxPrice,
          currency,
          bookCondition,
          exchangeType,
          sortBy,
          languages,
          categories,
          page,
          LIMIT
        );

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
    <div className="flex min-h-screen w-full">
      <FilterSidebar />
      <main className="flex flex-1 flex-col gap-4 md:gap-8 min-h-screen w-full items-center pt-[60px] md:pt-[78px] px-2 md:px-0">
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
          {posts.length === 0 && !loading && <div className="h-[80svh] flex flex-col items-center justify-center">
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-center">No posts found.</p>
            </div>}
      </main>
    </div>
  );
}

export async function loader({ request }: { request: Request }) {
          const url = new URL(request.url)
          const title = url.searchParams.get('title')
          const author = url.searchParams.get('author')
          const minPrice = url.searchParams.get('minPrice')
          const maxPrice = url.searchParams.get('maxPrice')
          const currency = url.searchParams.get('currency')
          const bookCondition = url.searchParams.get('bookCondition')
          const exchangeType = url.searchParams.get('exchangeType')
          const sortBy = url.searchParams.get('sortBy')
          const languages = url.searchParams.get('languages')
          const categories = url.searchParams.get('categories')
          console.log(title, author, minPrice, maxPrice, currency, bookCondition, exchangeType, sortBy, languages, categories)
          const result = await getPosts(
            title ?? undefined,
            author ?? undefined,
            minPrice ?? undefined,
            maxPrice ?? undefined,
            currency ?? undefined,
            bookCondition ?? undefined,
            exchangeType ?? undefined,
            sortBy ?? undefined,
            languages ?? undefined,
            categories ?? undefined
          );
          console.log(result);
          return result;
}
