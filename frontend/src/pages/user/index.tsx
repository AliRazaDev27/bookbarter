import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import { User } from "lucide-react"
import { useSelector } from "react-redux"
import { Link } from "react-router"

export  function Profile() {
const user = useSelector((state: any) => state.user.data)
  return (
    <div className="bg-gradient-to-b from-[#565656] to-[#181818] w-full min-h-screen">
        {
            !user?.id && <div className="min-h-screen flex flex-col items-center justify-center gap-8 ">
                <h1 className="text-3xl text-white/80 font-semibold">You are not Logged in, Please Login first.</h1>
                <Link to="/signin" className="bg-black hover:bg-green-700 transition-colors duration-300 shadow-sm text-white px-4 py-2 rounded-xl">Login</Link>
            </div>
        }
        {
            user?.id && <div className="container mx-auto py-6">
      <h1 className="text-3xl text-white/80 font-bold mb-4">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="bg-transparent border-none text-white">
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={user?.picture} alt="Profile picture" />
                <AvatarFallback>
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>

              <h2 className="text-2xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground">@{user.username}</p>

              <div className="mt-2">
                <Badge className="pb-1 text-sm" style={{ backgroundColor: user.status === 'active' ? 'green' : user.status === 'unverified' ? 'yellow' : 'red' }}>{user.status}</Badge>
              </div>

              <div>
                <Button className="bg-black text-white mt-6"
                onClick={()=>{
                  localStorage.removeItem('user')
                  window.location.reload();
                }}>
                Logout
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-medium text-muted-foreground">First Name</dt>
                  <dd className="sm:col-span-2">{user.firstName}</dd>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-medium text-muted-foreground">Last Name</dt>
                  <dd className="sm:col-span-2">{user.lastName}</dd>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-medium text-muted-foreground">Username</dt>
                  <dd className="sm:col-span-2">{user.username}</dd>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-medium text-muted-foreground">Email</dt>
                  <dd className="sm:col-span-2">{user.email}</dd>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-medium text-muted-foreground">Address</dt>
                  <dd className="sm:col-span-2">{user.address}</dd>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-medium text-muted-foreground">Mobile Number</dt>
                  <dd className="sm:col-span-2">+92 {user.mobileNo}</dd>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-medium text-muted-foreground">Status</dt>
                  <dd className="sm:col-span-2">{user.status}</dd>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-medium text-muted-foreground">Created At</dt>
                  <dd className="sm:col-span-2">{formatDate(user.createdAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
}
    </div>               
  )
}

