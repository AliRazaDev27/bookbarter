import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Repeat, MapPin, Tag, Clock, DollarSign, BookOpen } from "lucide-react"

interface PostCardProps {
  post?: {
    id: number
    userId: number
    title: string
    author: string
    description: string
    category: string
    bookCondition: string
    exchangeType: string
    price: string
    currency: string
    locationApproximate: string
    images: string[]
    status: string
    createdAt: string
  }
  user?: {
    id: number
    username: string
    picture: string
  }
}

export default function PostCard({ post, user }: PostCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(12)

  const postData = post 
 

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle favorite toggle
  const toggleFavorite = () => {
    if (isFavorite) {
      setFavoriteCount(favoriteCount - 1)
    } else {
      setFavoriteCount(favoriteCount + 1)
    }
    setIsFavorite(!isFavorite)
  }

  return (
    <Card className="w-full max-w-lg overflow-hidden">
      <CardHeader className="p-0">
        {/* Image Carousel */}
        <Carousel className="w-full">
          <CarouselContent>
            {postData?.images.map((_, index) => (
              <CarouselItem key={index}>
                <div className="h-80 w-full">
                  <img
                    src={post?.images[index] || `/placeholder.svg?height=400&width=600&text=Image ${index + 1}`}
                    alt={`${postData.title} image ${index + 1}`}
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

      <CardContent className="p-4">
        {/* User Info */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={ user?.picture || "/placeholder.svg"} />
            <AvatarFallback className="bg-neutral-900/10 text-neutral-900 dark:bg-neutral-50/10 dark:text-neutral-50">
              {user?.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{user?.username}</span>
        </div>

        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold capitalize">{postData?.title}</h2>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-bold">
              {postData?.price} {postData?.currency}
            </span>
          </div>
        </div>

        {/* Author */}
        <div className="text-sm text-neutral-500 mb-4 dark:text-neutral-400">
          By <span className="font-medium capitalize">{postData?.author}</span>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsContent value="info" className="mt-0">
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Condition</span>
                <p className="text-sm font-medium capitalize">{postData?.bookCondition}</p>
              </div>
              <div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Exchange Type</span>
                <p className="text-sm font-medium capitalize">{postData?.exchangeType}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="line-clamp-3 text-sm">{postData?.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-0">
            <div className="space-y-3">
              <div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Description</span>
                <p className="text-sm">{postData?.description}</p>
              </div>

              <div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Category</span>
                <p className="text-sm font-medium capitalize">{postData?.category}</p>
              </div>

              <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                <MapPin className="h-3 w-3" />
                <span className="capitalize">{postData?.locationApproximate}</span>
              </div>

              <div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Listed On</span>
                <p className="text-sm">{formatDate(postData?.createdAt || "")}</p>
              </div>

              <div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Tags</span>
              </div>
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
        <Button variant="ghost" size="sm" onClick={toggleFavorite} className="flex items-center">
          <Heart className={`h-4 w-4 mr-1 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
          <span>{favoriteCount}</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex items-center">
          <Repeat className="h-4 w-4 mr-1" />
          <span>Exchange</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex items-center">
          <MessageCircle className="h-4 w-4 mr-1" />
          <span>Message</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
