import { useAppSelector } from "@/hooks/redux"
import { IReview } from "@/types"
import { useEffect } from "react"
import { getReviewReceived } from "@/api/review"
import { useAppDispatch } from "@/hooks/redux"
import { setReviewData } from "@/store/features/review/reviewSlice"
import CardView from "./reviewCard"
import { IoReturnUpBackOutline } from "react-icons/io5"
import { Link } from "react-router"

export function ViewReview() {
    const reviews = useAppSelector((state) => state.reviews.data)
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
        <div className="pt-16 mb:pt-20 pb-4 px-2 md:px-4">
            <div className="flex items-center justify-between">
                <Link to="/profile" className="hover:bg-gray-300 rounded-lg p-2">
                    <IoReturnUpBackOutline className="h-8 w-8" />
                </Link>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-neutral-700">Reviews</h1>
                <span className="w-8"></span>
            </div>

            <div className="mt-4  md:mt-8 px-2 md:px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {
                    !!reviews && reviews.map((review, index) => (
                        <div key={`review-card-${index}`}>
                            <CardView data={review} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}