"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MapPin, Calendar, Tag, X, Box, Upload } from "lucide-react"

type ItemStatus = "lost" | "found"
type ItemCategory = "electronics" | "clothing" | "documents" | "accessories" | "books" | "other"

interface LostItem {
  id: string
  title: string
  description: string
  category: ItemCategory
  location: string
  date: string
  status: ItemStatus
  contactName: string
  contactEmail: string
  contactPhone: string
  image?: string
}

export default function LostAndFoundApp() {
  const [items, setItems] = useState<LostItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<ItemCategory | "all">("all")
  const [filterStatus, setFilterStatus] = useState<ItemStatus | "all">("all")
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other" as ItemCategory,
    location: "",
    date: new Date().toISOString().split("T")[0],
    status: "lost" as ItemStatus,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  })

  const [imageData, setImageData] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string>("")

  // Load items from localStorage on mount
  useEffect(() => {
    const storedItems = localStorage.getItem("lostAndFoundItems")
    if (storedItems) {
      setItems(JSON.parse(storedItems))
    }
  }, [])

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("lostAndFoundItems", JSON.stringify(items))
    }
  }, [items])

  // Filter items based on search and filters
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesStatus = filterStatus === "all" || item.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setImageData(result)
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newItem: LostItem = {
      id: Date.now().toString(),
      ...formData,
      image: imageData || undefined,
    }

    setItems([newItem, ...items])
    setShowUploadForm(false)

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "other",
      location: "",
      date: new Date().toISOString().split("T")[0],
      status: "lost",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    })
    setImageData("")
    setImagePreview("")
  }

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    setSelectedItem(null)
  }

  if (selectedItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-green-50/30 to-blue-50/50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2.5 rounded-xl shadow-md">
                <Box className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                FindMyStuff
              </h1>
            </div>
            <Button variant="ghost" onClick={() => setSelectedItem(null)} className="hover:bg-blue-50">
              <X className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="rounded-2xl shadow-lg border-blue-100">
            <CardContent className="p-6">
              {selectedItem.image && (
                <div className="mb-6 rounded-xl overflow-hidden">
                  <img
                    src={selectedItem.image || "/placeholder.svg"}
                    alt={selectedItem.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedItem.title}</h2>
                  <div className="flex gap-2">
                    <Badge
                      variant={selectedItem.status === "lost" ? "destructive" : "default"}
                      className={
                        selectedItem.status === "lost"
                          ? "bg-red-100 text-red-700 hover:bg-red-100"
                          : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                      }
                    >
                      {selectedItem.status === "lost" ? "Lost" : "Found"}
                    </Badge>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      {selectedItem.category}
                    </Badge>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedItem.id)}>
                  Delete
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-1">Description</h3>
                  <p className="text-foreground">{selectedItem.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1 flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      Location
                    </h3>
                    <p className="text-foreground">{selectedItem.location}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1 flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      Date
                    </h3>
                    <p className="text-foreground">{new Date(selectedItem.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Name: </span>
                      <span className="text-foreground">{selectedItem.contactName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email: </span>
                      <a href={`mailto:${selectedItem.contactEmail}`} className="text-primary hover:underline">
                        {selectedItem.contactEmail}
                      </a>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Phone: </span>
                      <a href={`tel:${selectedItem.contactPhone}`} className="text-primary hover:underline">
                        {selectedItem.contactPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (showUploadForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-green-50/30 to-blue-50/50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2.5 rounded-xl shadow-md">
                <Box className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                FindMyStuff
              </h1>
            </div>
            <Button variant="ghost" onClick={() => setShowUploadForm(false)} className="hover:bg-blue-50">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="rounded-2xl shadow-lg border-blue-100">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="itemImage" className="text-sm font-medium">
                    Upload Image (Optional)
                  </label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Input
                        id="itemImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                      <Upload className="h-5 w-5 text-blue-500" />
                    </div>
                    {imagePreview && (
                      <div className="relative rounded-xl overflow-hidden border-2 border-blue-200">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImageData("")
                            setImagePreview("")
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status *
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as ItemStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="found">Found</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Item Name *
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Blue Backpack"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide detailed description..."
                    required
                    className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-input bg-background resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category *
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as ItemCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="documents">Documents</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location *
                  </label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Library 3rd Floor"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Date *
                  </label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold text-lg mb-4">Contact Information</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="contactName" className="text-sm font-medium">
                        Your Name *
                      </label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contactEmail" className="text-sm font-medium">
                        Email *
                      </label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contactPhone" className="text-sm font-medium">
                        Phone Number *
                      </label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-green-50/30 to-blue-50/50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          {/* Logo and Brand */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-green-500 p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <Box className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  FindMyStuff
                </h1>
                <p className="text-sm text-blue-600/70">Campus Lost & Found</p>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-10 py-8 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-clip-text text-transparent">
              FindMyStuff
            </h2>
            <p className="text-lg text-blue-600/80 mb-6 max-w-2xl mx-auto text-pretty">
              Lost something? Found something? Let's help it return home.
            </p>
            <Button
              onClick={() => setShowUploadForm(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all rounded-xl px-8 py-6 text-lg"
            >
              <Plus className="mr-2 h-6 w-6" />
              Upload Item
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
              <Input
                type="search"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-blue-200 focus:border-blue-400 bg-white/70"
              />
            </div>

            <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as ItemCategory | "all")}>
              <SelectTrigger className="w-full md:w-[180px] rounded-xl border-blue-200 bg-white/70">
                <Tag className="mr-2 h-4 w-4 text-blue-500" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as ItemStatus | "all")}>
              <SelectTrigger className="w-full md:w-[180px] rounded-xl border-blue-200 bg-white/70">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="lost">Lost Items</SelectItem>
                <SelectItem value="found">Found Items</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-green-100 mb-4">
              <Search className="h-10 w-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-blue-900">No items found</h2>
            <p className="text-blue-600/70 mb-6">
              {items.length === 0
                ? "Be the first to report a lost or found item"
                : "Try adjusting your search or filters"}
            </p>
            {items.length === 0 && (
              <Button
                onClick={() => setShowUploadForm(true)}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl"
              >
                <Plus className="mr-2 h-5 w-5" />
                Report an Item
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <Card
                key={item.id}
                className="rounded-2xl shadow-md hover:shadow-xl border-blue-100 cursor-pointer overflow-hidden card-hover animate-fade-in"
                style={{ animationDelay: `${Math.min(index, 2) * 100}ms` }}
                onClick={() => setSelectedItem(item)}
              >
                {item.image && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1">{item.title}</h3>
                    <Badge
                      variant={item.status === "lost" ? "destructive" : "default"}
                      className={
                        item.status === "lost"
                          ? "bg-red-100 text-red-700 hover:bg-red-100 shrink-0"
                          : "bg-gradient-to-r from-blue-500 to-green-500 text-white shrink-0"
                      }
                    >
                      {item.status === "lost" ? "Lost" : "Found"}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Tag className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="capitalize">{item.category}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
