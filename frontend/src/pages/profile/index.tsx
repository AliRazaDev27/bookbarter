import { useAppSelector } from "@/hooks/redux"
import { Link } from "react-router"
import { ChevronRight, User } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PostCard } from "./post/postCard";
import { ReviewCard } from "./reviewCard";
import { WishlistCard } from "./wishlist/wishlistCard";

export function Profile() {
  const user = useAppSelector((state)=> state.user.data)
  return (
    <div className="bg-gradient-to-b from-[#565656] to-[#181818] w-full min-h-screen">
      {
        !user && <div className="min-h-screen flex flex-col items-center justify-center gap-8 ">
          <h1 className="text-3xl text-white/80 font-semibold">You are not Logged in, Please Login first.</h1>
          <Link to="/signin" className="bg-black hover:bg-green-700 transition-colors duration-300 shadow-sm text-white px-4 py-2 rounded-xl">Login</Link>
        </div>
      }
      {
        !!user &&
        <div className="min-h-screen pt-8 md:pt-12 bg-muted/40">
          <div className="container mx-auto py-8 px-2">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-neutral-50">Profile Dashboard</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* User Info Card */}
              <Link to="/profile/info">
                <Card className="h-full cursor-pointer transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-medium">User Info</CardTitle>
                    <User className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 py-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="flex h-full w-full items-center justify-center text-2xl">{
                          user.firstName[0].toUpperCase()+user.lastName[0].toUpperCase()
                          }</div>
                      </div>
                      <div>
                        <p className="text-lg font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                      <span>View complete profile</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>

              {/* Posts Card */}
              <PostCard />
              {/* Reviews Card */}
              <ReviewCard />
              {/* Wishlist Card */}
              <WishlistCard />
            </div>
          </div>
        </div>
      }
    </div>
  )
}

