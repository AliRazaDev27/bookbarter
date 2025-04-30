import * as React from "react"
import { ArrowDownAZ, ArrowUpDown, Filter, Flame, Minus, Plus } from "lucide-react"
import { SearchForm } from "./search-form"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"

// Sample categories data
const categories = [
  { id: 1, name: "Fiction" },
  { id: 2, name: "Non-Fiction" },
  { id: 3, name: "Science Fiction" },
  { id: 4, name: "Mystery" },
  { id: 5, name: "Biography" },
  { id: 6, name: "History" },
  { id: 7, name: "Self-Help" },
  { id: 8, name: "Business" },
]

export function FilterSidebar() {
  const [priceRange, setPriceRange] = React.useState([0, 100])
  const [sortBy, setSortBy] = React.useState("latest")
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>([])
  const [sidebarWidth, setSidebarWidth] = React.useState(280)
  const [isResizing, setIsResizing] = React.useState(false)
  const sidebarRef = React.useRef<HTMLDivElement>(null)

  // Handle resizing
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = e.clientX
      if (newWidth >= 200 && newWidth <= 500) {
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  return (
    <div className="relative" style={{ width: `${sidebarWidth}px` }} ref={sidebarRef}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between p-2">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
            <div className="px-2 pb-2">
              <SearchForm />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      Price Range <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 py-2">
                      <div className="mb-4">
                        <Slider
                          defaultValue={[0, 100]}
                          max={100}
                          step={1}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="min-price">Min: ${priceRange[0]}</Label>
                        </div>
                        <div>
                          <Label htmlFor="max-price">Max: ${priceRange[1]}</Label>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarGroup>

            <SidebarGroup>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      Sort By <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton onClick={() => setSortBy("latest")} isActive={sortBy === "latest"}>
                          <ArrowDownAZ className="mr-2 h-4 w-4" />
                          Latest
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setSortBy("popularity")}
                          isActive={sortBy === "popularity"}
                        >
                          <Flame className="mr-2 h-4 w-4" />
                          Popularity
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton onClick={() => setSortBy("price-low")} isActive={sortBy === "price-low"}>
                          <ArrowUpDown className="mr-2 h-4 w-4" />
                          Price: Low to High
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setSortBy("price-high")}
                          isActive={sortBy === "price-high"}
                        >
                          <ArrowUpDown className="mr-2 h-4 w-4" />
                          Price: High to Low
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarGroup>

            <SidebarGroup>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      Categories <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {categories.map((category) => (
                        <SidebarMenuSubItem key={category.id}>
                          <SidebarMenuSubButton
                            onClick={() => toggleCategory(category.id)}
                            isActive={selectedCategories.includes(category.id)}
                          >
                            {category.name}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        {/* Resizer handle */}
        <div
          className="absolute top-0 right-0 h-full w-2 cursor-ew-resize bg-transparent hover:bg-gray-300/20 z-10"
          onMouseDown={handleResizeStart}
        />
      </SidebarProvider>
    </div>
  )
}
