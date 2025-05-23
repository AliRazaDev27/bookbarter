import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {  Settings } from "lucide-react"
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { countWishlist } from "@/api/mutations/wishlist";
export function WishlistCard(){
  const [wishlistCount, setWishlistCount] = useState(0)
  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const response = await countWishlist();
        setWishlistCount(response);
      } catch (error) {
        console.error("Error fetching wishlist:", error)
      }
    }
    fetchWishlistCount()
  }, [])
    return(
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-medium">Wishlist</CardTitle>
                </CardHeader>
                <CardContent className="py-8">
                  <div className="text-center">
                    <p className="text-5xl font-bold">{wishlistCount}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Items in wishlist</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-4">
                  <Link to="/profile/wishlist/manage" className="flex items-center bg-black hover:bg-neutral-700 text-white px-3 py-1.5 rounded-md">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
                  </Link>
                </CardFooter>
              </Card>
    )}