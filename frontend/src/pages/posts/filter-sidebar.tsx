import * as React from "react"
import { ArrowDownAZ, ArrowUpDown, Filter, Flame, Minus, Plus } from "lucide-react"
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
} from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "react-router"
import { bookCategoryEnum, languageEnum, bookConditionEnum, exchangeTypeEnum } from "@/zodSchemas/post"
import { set } from "date-fns"


export function FilterSidebar() {
  const [title, setTitle] = React.useState("")
  const [author, setAuthor] = React.useState("")
  const [minPrice, setMinPrice] = React.useState(0)
  const [maxPrice, setMaxPrice] = React.useState(0)
  const [currency, setCurrency] = React.useState("ANY")
  const [bookCondition, setBookCondition] = React.useState("ANY")
  const [exchangeType, setExchangeType] = React.useState("ANY")
  const [sortBy, setSortBy] = React.useState("latest")
  const [selectedLanguages, setSelectedLanguages] = React.useState<String[]>([])
  const [selectedCategories, setSelectedCategories] = React.useState<String[]>([])
  const sidebarRef = React.useRef<HTMLDivElement>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const categories = bookCategoryEnum.options.map((category) => ({
    value: category,
    name: category.toUpperCase(),
  }))
  const languages = languageEnum.options.map((language) => ({
    value: language,
    name: language.toUpperCase(),
  }))
  const bookConditions = bookConditionEnum.options.map((condition) => ({
    value: condition,
    name: condition.toUpperCase(),
  }))
  const exchangeTypes = exchangeTypeEnum.options.map((type) => ({
    value: type,
    name: type.toUpperCase(),
  }))


  const toggleCategory = (categoryValue: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryValue) ? prev.filter((id) => id !== categoryValue) : [...prev, categoryValue],
    )
  }

  const toggleLanguage = (languageValue: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(languageValue) ? prev.filter((id) => id !== languageValue) : [...prev, languageValue],
    )
  }

  const applyFilter = () => {
    let searchParams = new URLSearchParams()
    if (title) searchParams.set("title", title)
    if (author) searchParams.set("author", author)
    if (minPrice && minPrice > 0) searchParams.set("minPrice", minPrice.toString())
    if (maxPrice && maxPrice > 0) searchParams.set("maxPrice", maxPrice.toString())
    if (currency && currency !== "ANY") searchParams.set("currency", currency)
    if (bookCondition && bookCondition !== "ANY") searchParams.set("bookCondition", bookCondition)
    if (exchangeType && exchangeType !== "ANY") searchParams.set("exchangeType", exchangeType)
    if (sortBy && sortBy !== "latest") searchParams.set("sortBy", sortBy)
    if (selectedLanguages.length > 0) searchParams.set("languages", selectedLanguages.join(","))
    if (selectedCategories.length > 0) searchParams.set("categories", selectedCategories.join(","))
      setSearchParams(searchParams)
  }

  const clearFilter = () => {
    setTitle("")
    setAuthor("")
    setMinPrice(0)
    setMaxPrice(0)
    setCurrency("ANY")
    setBookCondition("ANY")
    setExchangeType("ANY")
    setSortBy("latest")
    setSelectedLanguages([])
    setSelectedCategories([])
    setSearchParams({})
  }


  return (
    <div id="filter-sidebar" className="relative" ref={sidebarRef}>
      <SidebarProvider>
        <Sidebar className="top-[70px] h-[calc(100svh-70px)] border-2 border-blue-600">
          <SidebarHeader>
            <div className="flex items-center justify-between p-2">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => sidebarRef.current?.classList.toggle("hidden")}>
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
            <div className="flex flex-col gap-2  pb-2">
              <div className="relative">
                <Label htmlFor="title" className="sr-only">
                  Search by title
                </Label>
                <Input id="title" placeholder="Search by title..." className="pl-8" onChange={(e) => setTitle(e.target.value)} />
                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
              </div>
              <div className="relative">
                <Label htmlFor="author" className="sr-only">
                  Search by author
                </Label>
                <Input id="author" placeholder="Search by author..." className="pl-8" onChange={(e) => setAuthor(e.target.value)} />
                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      Price Range <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-2 py-2 space-y-2">
                      <div className="flex gap-2 items-center justify-between mb-2">
                        <Label htmlFor="price-min" className="text-xs font-medium text-gray-600">
                          Min
                        </Label>
                        <Input id="price-min" type="number" min={0} value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} />
                      </div>

                      <div className="flex gap-2 items-center justify-between mb-2">
                        <Label htmlFor="price-max" className="text-xs font-medium text-gray-600">
                          Max
                        </Label>
                        <Input id="price-max" type="number" min={0} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center justify-between px-2 py-2">
                      <Label htmlFor="currency" className="text-sm font-medium text-gray-600 mb-2">
                        Currency
                      </Label>
                      <Select onValueChange={(e) => setCurrency(e)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">ALL</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="PKR">PKR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarGroup>

            <SidebarGroup>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      Conditions <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                  <SidebarMenuSub>
                      <div className="flex gap-2 items-center justify-between px-2 py-2">
                        <Select onValueChange={(e) => setBookCondition(e)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Book Condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {
                              bookConditions.map((condition) => (
                                <SelectItem key={condition.value} value={condition.value}>{condition.name}</SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2 items-center justify-between px-2 py-2">
                        <Select onValueChange={(e) => setExchangeType(e)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Exchange Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {
                              exchangeTypes.map((exchange) => (
                                <SelectItem key={exchange.value} value={exchange.value}>{exchange.name}</SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                      </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarGroup>

            <SidebarGroup>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      Language <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {languages.map((language) => (
                        <SidebarMenuSubItem key={language.value}>
                          <SidebarMenuSubButton
                            onClick={() => toggleLanguage(language.value)}
                            isActive={selectedLanguages.includes(language.value)}
                          >
                            {language.name}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>

                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarGroup>

            <SidebarGroup>
              <Collapsible className="group/collapsible">
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
              <Collapsible className="group/collapsible">
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
                        <SidebarMenuSubItem key={category.value}>
                          <SidebarMenuSubButton
                            onClick={() => toggleCategory(category.value)}
                            isActive={selectedCategories.includes(category.value)}
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

            <SidebarGroup>
              <div className="flex flex-col md:flex-row gap-2 md:gap-1 px-2 py-2">
                <Button variant="outline" className="w-full" onClick={clearFilter}>
                  Clear
                </Button>
                <Button variant="outline" className="w-full" onClick={applyFilter}>
                  Search
                </Button>
              </div>
            </SidebarGroup>

          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}
