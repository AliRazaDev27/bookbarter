import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Clock, BookOpen, Repeat } from "lucide-react"
import { ExchangeRequestDialog } from "./exchange-request-dialog"
import { toggleFavorite } from "@/api/favorites"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { PostStatus } from "@/components/ui/post-status"
import { setContactId, setTimestamp } from "@/store/features/util/utilSlice"
import { FaRegMessage } from "react-icons/fa6";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useState } from "react"

interface PostCardProps {
  post: {
    id: number
    userId: number
    title: string
    author: string
    description: string | null
    category: string
    bookCondition: string
    exchangeType: string
    exchangeCondition: string | null
    price: string
    currency: string
    locationApproximate: string
    images: string[]
    status: string
    createdAt: string
    isFav: boolean,
    favCount: number,
  }
  user: {
    id: number
    username: string
    picture: string
  }
}

export default function PostCard({ post, user }: PostCardProps) {

  const currentUser = useAppSelector((state) => state.user.data);
  const [isFav, setIsFav] = useState(post.isFav);
  const [favCount, setFavCount] = useState(post.favCount);
  const dispatch = useAppDispatch();

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle favorite toggle
  const handleToggleFavorite = async () => {
    try {
      if (!post) return;
      const prevIsFav = isFav;
      const prevCount = favCount;

      const optimisticIsFav = !prevIsFav;          // what we *think* it will become
      setIsFav(optimisticIsFav);
      setFavCount(c => optimisticIsFav ? c + 1 : Math.max(c - 1, 0));
      const result = await toggleFavorite(post?.id)
      if (result === null) {
        // hard error → full rollback
        setIsFav(prevIsFav);
        setFavCount(prevCount);
      } else if (result !== optimisticIsFav) {
        // server disagreed → reconcile
        setIsFav(result);
        setFavCount(prev =>
          result ? (prevIsFav ? prev : prev + 1) : (prevIsFav ? prev - 1 : prev)
        );
      }
    }
    catch (error: any) {
          console.log(error)
        }
      }

      return (
        <Card className="w-full max-w-lg overflow-hidden relative border border-neutral-600 rounded-xl shadow-lg">
          <div className="absolute top-2 right-2 z-10">
            <PostStatus status={post?.status}>
              <p className="px-2 py-1.5 font-medium">{post?.status}</p>
            </PostStatus>
          </div>
          <CardHeader className="p-0">
            {/* Image Carousel */}
            <Carousel className="w-full">
              <CarouselContent>
                {post?.images.map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="h-80 w-full">
                      <img
                        src={post?.images[index] || `/placeholder.svg?height=400&width=600&text=Image ${index + 1}`}
                        alt={`${post.title} image ${index + 1}`}
                        className="m-auto h-full"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </CardHeader>

          <CardContent className="p-2">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 md:h-14 w-10 md:w-12">
                <AvatarImage src={user?.picture || "/placeholder.svg"} />
                <AvatarFallback className="bg-neutral-900/10 text-neutral-900 dark:bg-neutral-50/10 dark:text-neutral-50">
                  {user?.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col py-1 md:py-2 gap-0 md:gap-1">
                <span className="text-md font-medium">{user?.username}</span>
                <p className="text-sm">{formatDate(post?.createdAt || "")}</p>
              </div>
              <div className="ml-auto">
                {post?.exchangeType === "pay" && <div className="flex items-center">
                  <span className="font-medium bg-teal-300 p-1.5 rounded-l-lg rounded-tr-lg">{post?.price}</span>
                  <sub className="text-xs self-end bg-teal-300 p-1.5 rounded-r-lg">{post?.currency}</sub>
                </div>}
                {post?.exchangeType !== "pay" && <div className="flex items-center">
                  <Badge className="text-sm md:text-lg capitalize">
                    {post?.exchangeType}
                  </Badge>
                </div>}
              </div>
            </div>

            {/* Title and Price */}

            <div className="flex flex-col gap-1 items-start ps-2">
              <h2 className="text-lg md:text-xl font-semibold">{post?.title}</h2>
              <p className="text-sm text-neutral-600 mb-2 md:mb-4 dark:text-neutral-300">
                By <span className="font-medium">{post?.author}</span>
              </p>
            </div>

            {/* Author */}


            {/* Tabs */}
            <Tabs defaultValue="info" className="w-full">
              <TabsContent value="info" className="mt-0">
                <div className="">
                  <p className="line-clamp-3 text-xs md:text-sm text-neutral-600">{post?.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-0">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">Condition</span>
                      <p className="text-sm font-medium capitalize">{post?.bookCondition}</p>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">Exchange Type</span>
                      <p className="text-sm font-medium capitalize">{post?.exchangeType}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">Category</span>
                      <p className="text-sm font-medium capitalize">{post?.category}</p>
                    </div>

                    <div className="flex flex-col  gap-1">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">Location</span>
                      <span className="capitalize text-sm font-medium">{post?.locationApproximate}</span>
                    </div>
                  </div>

                  {
                    post?.exchangeCondition && (
                      <div className="py-2 text-sm font-normal">
                        {post?.exchangeCondition}
                      </div>
                    )
                  }
                </div>
              </TabsContent>

              <div className="border-t mt-4 pt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info" className="text-xs">
                    <BookOpen className="h-3.5 w-3.5 mr-1" /> Primary Info
                  </TabsTrigger>
                  <TabsTrigger value="details" className="text-xs">
                    <Clock className="h-3.5 w-3.5 mr-1" /> More Details
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-between items-center bg-neutral-100/20 p-3 border-t dark:bg-neutral-800/20">
            {
              !!currentUser ? (
                <Button variant="ghost" size="sm" onClick={handleToggleFavorite} disabled={!currentUser} className="flex items-center">
                  <Heart className={`h-4 w-4 mr-1 ${isFav ? "fill-rose-500 text-rose-500" : "text-black fill-none"}`} />
                  <span>{favCount}</span>
                </Button>
              ) :
                (
                  <Tippy
                    content="Please sign in to favorite this post.">
                    <Button variant="ghost" size="sm" className="flex items-center cursor-not-allowed">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{post?.favCount}</span>
                    </Button>
                  </Tippy>
                )
            }

            {
              !!currentUser ? (
                <div className="flex items-center">
                  <ExchangeRequestDialog data={
                    {
                      postID: post?.id,
                      title: post?.title,
                      author: post?.author,
                      username: user?.username,
                      price: post?.price,
                      type: post?.exchangeType,
                      bookList: "",
                    }
                  } />
                </div>
              ) : (
                <Tippy
                  content="Please sign in to send an exchange request.">

                  <Button variant="ghost" size="sm" className="flex items-center cursor-not-allowed">
                    <Repeat className="h-4 w-4 mr-1" />
                    <span className="max-md:hidden">
                      Exchange
                    </span>
                  </Button>
                </Tippy>
              )
            }

            {
              !!currentUser ? (
                <Button variant="ghost" size="sm" className="flex items-center" disabled={currentUser?.id === user?.id}
                  onClick={() => {
                    dispatch(setContactId({ contactId: user?.id }))
                    dispatch(setTimestamp({ timestamp: Date.now() }))
                  }}
                >
                  <FaRegMessage className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Message</span>
                </Button>
              ) : (
                <Tippy
                  content="Please sign in to send a message.">
                  <Button variant="ghost" size="sm" className="flex items-center cursor-not-allowed">
                    <FaRegMessage className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">Message</span>
                  </Button>
                </Tippy>
              )
            }
          </CardFooter>
        </Card>
      )
    }