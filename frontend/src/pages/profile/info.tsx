import { ArrowLeft, Mail, MapPin, Phone, User } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export  function UserInfo() {
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
                  <div className="flex h-full w-full items-center justify-center text-3xl">JD</div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">John Doe</h2>
                  <p className="text-muted-foreground">Member since Jan 2023</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p>John Michael Doe</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>john.doe@example.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p>San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <h3 className="font-medium">Account Type</h3>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Premium</p>
                    <p className="text-sm text-muted-foreground">All features included</p>
                  </div>
                  <Button size="sm">Upgrade</Button>
                </div>
              </div>

              <Separator />

              <div className="grid gap-2">
                <h3 className="font-medium">Privacy Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p>Profile visibility</p>
                    <p className="text-sm font-medium">Public</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Email visibility</p>
                    <p className="text-sm font-medium">Private</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Activity status</p>
                    <p className="text-sm font-medium">Visible</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-2">
                <h3 className="font-medium">Connected Accounts</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p>Google</p>
                    <p className="text-sm font-medium text-green-600">Connected</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Facebook</p>
                    <p className="text-sm font-medium text-muted-foreground">Not connected</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Twitter</p>
                    <p className="text-sm font-medium text-green-600">Connected</p>
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
