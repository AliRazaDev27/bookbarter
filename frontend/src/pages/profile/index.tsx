import { useSelector } from "react-redux"
import { Link } from "react-router"
import { ChevronRight, Eye, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function Profile() {
  const user = useSelector((state: any) => state.user.data)
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
        <div className="min-h-screen pt-16 bg-muted/40">
          <div className="container mx-auto py-8">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold">Profile Dashboard</h1>
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                        <div className="flex h-full w-full items-center justify-center text-2xl">JD</div>
                      </div>
                      <div>
                        <p className="text-lg font-medium">John Doe</p>
                        <p className="text-sm text-muted-foreground">john.doe@example.com</p>
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
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-medium">Posts</CardTitle>
                </CardHeader>
                <CardContent className="py-8">
                  <div className="text-center">
                    <p className="text-5xl font-bold">24</p>
                    <p className="mt-2 text-sm text-muted-foreground">Total posts created</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                </CardFooter>
              </Card>

              {/* Requests Card */}
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-medium">Requests</CardTitle>
                </CardHeader>
                <CardContent className="py-8">
                  <div className="text-center">
                    <p className="text-5xl font-bold">8</p>
                    <p className="mt-2 text-sm text-muted-foreground">Pending requests</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                </CardFooter>
              </Card>

              {/* Reviews Card */}
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-medium">Reviews</CardTitle>
                </CardHeader>
                <CardContent className="py-8">
                  <div className="text-center">
                    <p className="text-5xl font-bold">42</p>
                    <p className="mt-2 text-sm text-muted-foreground">Reviews received</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                </CardFooter>
              </Card>

              {/* Wishlist Card */}
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-medium">Wishlist</CardTitle>
                </CardHeader>
                <CardContent className="py-8">
                  <div className="text-center">
                    <p className="text-5xl font-bold">16</p>
                    <p className="mt-2 text-sm text-muted-foreground">Items in wishlist</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
}
    </div>
    )}

