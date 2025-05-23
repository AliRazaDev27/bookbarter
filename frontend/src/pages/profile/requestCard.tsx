import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
export function RequestCard() {
    return(
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
                  <Button size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                </CardFooter>
              </Card>
    )
}