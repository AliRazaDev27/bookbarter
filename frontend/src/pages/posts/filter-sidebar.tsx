import * as React from "react"
import { ArrowDownAZ, ArrowUpDown, Filter, Flame, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "react-router"
import { bookCategoryEnum, languageEnum, bookConditionEnum, exchangeTypeEnum } from "@/zodSchemas/post"
import { useState } from "react"


export function FilterSidebar() {
  const [headerHeight, setHeaderHeight] = useState(0);
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

  React.useLayoutEffect(() => {
    const updateHeight = () => {
      const header = document.getElementById("header")
      if (header) {
        setHeaderHeight(header.offsetHeight)
      }
    };
    updateHeight(); // initial
    window.addEventListener("resize", updateHeight); // responsive

    return () => window.removeEventListener("resize", updateHeight);
  }, [])

  return (
    <div className="relative w-[calc(max(300px,20%))] max-lg:w-0">
      <section id="filter-sidebar"
        ref={sidebarRef}
        style={{
          top: `${headerHeight}px`,
          height: `calc(100svh - ${headerHeight}px)`,
        }}
        className="sticky max-lg:fixed hidden z-50 bg-neutral-50 w-full lg:flex flex-col gap-4 px-2 py-2 overflow-y-auto border-r">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button
              className="lg:hidden"
              variant="ghost" size="icon" onClick={() => sidebarRef.current?.classList.toggle("hidden")}>
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
        </section>
        <section className="flex flex-col gap-4">
          <div>
            <Collapsible className="group/collapsible">
              <li
                className="group/menu-item relative list-none"
              >
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 rounded-md">
                    Price Range <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                    <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ps-6 pe-4 py-4 space-y-3">
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

                    <div className="flex gap-2 items-center justify-between">
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
                  </div>
                </CollapsibleContent>
              </li>
            </Collapsible>
          </div>

          <div
            className="border"
          >
            <Collapsible className="group/collapsible">
              <li
                data-sidebar="menu-item"
                className="group/menu-item relative list-none">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-gray-900 bg-white border-b border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-100">
                    Conditions <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                    <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul
                    className=
                    "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5"
                  >
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
                  </ul>
                </CollapsibleContent>
              </li>
            </Collapsible>
          </div>

          <div
            className="relative flex w-full min-w-0 flex-col p-2"
          >
            <Collapsible className="group/collapsible">
              <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-gray-900 bg-white border-b border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-100">
                  Language <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                  <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div>
                  {languages.map((language) => (
                    <li
                      className="group/menu-item relative list-none"
                      key={language.value}>
                      <button
                        onClick={() => toggleLanguage(language.value)}
                      // isActive={selectedLanguages.includes(language.value)}
                      >
                        {language.name}
                      </button>
                    </li>
                  ))}
                </div>

              </CollapsibleContent>
            </Collapsible>
          </div>

          <div
            className="relative flex w-full min-w-0 flex-col p-2"
          >
            <Collapsible className="group/collapsible">
              <li className="group/menu-item relative list-none">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-gray-900 bg-white border-b border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-100">
                    Sort By <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                    <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="space-y-2 pt-3 ps-4">
                    <li>
                      <button onClick={() => setSortBy("date_desc")} className="flex items-center"
                      // isActive={sortBy === "latest"}
                      >
                        <ArrowDownAZ className="mr-2 h-4 w-4" />
                        Latest
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setSortBy("price_asc")} className="flex items-center"
                      >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Price: Low to High
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setSortBy("price_desc")} className="flex items-center"
                      // isActive={sortBy === "price-high"}
                      >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Price: High to Low
                      </button>
                    </li>
                  </ul>
                </CollapsibleContent>
              </li>
            </Collapsible>
          </div>

          <div
            className="relative flex w-full min-w-0 flex-col p-2 border"
          >
            <Collapsible className="group/collapsible">
              <li className="group/menu-item relative list-none">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-gray-900 bg-white border-b border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-100">
                    Categories <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                    <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul>
                    {categories.map((category) => (
                      <li key={category.value}>
                        <button
                          onClick={() => toggleCategory(category.value)}
                        // isActive={selectedCategories.includes(category.value)}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </li>
            </Collapsible>
          </div>

          <div
            className="flex flex-row gap-2 w-full p-2 border"
          >
            <Button variant="outline" className="w-full" onClick={clearFilter}>
              Clear
            </Button>
            <Button variant="outline" className="w-full" onClick={applyFilter}>
              Search
            </Button>
          </div>

        </section>
      </section>
    </div>
  )
}
