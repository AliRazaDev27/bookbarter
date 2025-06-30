import { ArrowLeft, Mail, MapPin, Phone, User } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAppSelector } from "@/hooks/redux"
import { Badge } from "@/components/ui/badge"

export function UserInfo() {
  const user = useAppSelector((state) => state.user.data)
  return (
    <div className="min-h-screen bg-muted/40 pt-16">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <Link to="/profile">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center space-x-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-muted">
                  <div className="flex h-full w-full items-center justify-center text-3xl">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user?.username}</h2>
                  <p className="text-muted-foreground">Member since {new Date(user?.createdAt || "").toDateString()}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p>
                      {user?.firstName} {user?.lastName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>+92 {user?.mobileNo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p>{user?.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <h3 className="font-medium">Account Type</h3>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="grid grid-cols-2 w-full">
                    <div className="flex flex-col gap-2">
                      <p className="font-medium">Role</p>
                      <p className="font-medium">Status</p>
                    </div>
                    <div className="flex flex-col w-min gap-2">
                      <Badge className="uppercase">{user?.role}</Badge>
                      <Badge className="uppercase">{user?.status}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
