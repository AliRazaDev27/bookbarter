import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { getReviewReceived } from "@/api/review"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { setReviewData } from "@/store/features/review/reviewSlice"
import { Link } from "react-router"
export function ReviewCard() {
  const reviews = useAppSelector((state) => state.reviews.data);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchReviews = async () => {
      const response = await getReviewReceived();
      dispatch(setReviewData(response.data));
      console.log(response)
    }
    fetchReviews()
  }, [])
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Reviews</CardTitle>
      </CardHeader>
      <CardContent className="py-8">
        <div className="text-center">
          <p className="text-5xl font-bold">{reviews?.length || 0}</p>
          <p className="mt-2 text-sm text-muted-foreground">Reviews received</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-4">
        <Link to="/profile/reviews/view" className="flex items-center border rounded-md bg-neutral-800 hover:bg-neutral-900 text-neutral-50 px-3 py-1.5">
          <Eye className="mr-2 h-4 w-4" />
          View
        </Link>
      </CardFooter>
    </Card>
  )
}