import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { IReview } from "@/types"


function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
        />
        
      ))}
      <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
    </div>
  )
}

export default function ReviewCard({data}:{data: IReview}){
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-teal-100 shadow-2xl border">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={data.userPicture} alt={data.userName} />
            <AvatarFallback>{data.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{data.userName}</h3>
              <Badge variant="secondary" className="text-xs">
                {formatDate(data.createdAt)}
              </Badge>
            </div>
            <StarRating rating={data.rating} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <img
              src={data.postImages[0]}
              alt={`${data.postTitle} cover`}
              className="w-20 h-30 object-cover rounded-md shadow-sm"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-xl mb-1">{data.postTitle}</h4>
            <p className="text-muted-foreground mb-3">by {data.postAuthor}</p>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm italic">{data.review || "No review text provided"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
