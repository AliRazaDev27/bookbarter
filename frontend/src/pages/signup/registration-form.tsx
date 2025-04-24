import type React from "react"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { registerUser } from "@/api/mutations/registerUser"

const schema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters long")
    .max(20, "First name must not exceed 20 characters"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters long")
    .max(20, "Last name must not exceed 20 characters"),
  username: z.string().min(6, "Username must be at least 6 characters long")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email format")
    .min(6, "Email must be at least 6 characters long")
    .max(254, "Email must not exceed 254 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must not exceed 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
  mobileNo: z
    .string()
    .regex(/^\d{10,15}$/, "Mobile number must be 10-15 digits long"),
  address: z.string().min(5, "Address must be at least 5 characters long")
    .max(255, "Address must not exceed 255 characters"),
  picture: z
    .any().refine((file) => file instanceof FileList, "Picture must be a valid file")
});

type Schema = z.infer<typeof schema>;

export default function RegistrationForm() {
  const { toast } = useToast()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Schema>({
    resolver: zodResolver(schema)
  })
  const navigate = useNavigate()
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData()
    if (data.picture && data.picture[0]) {
      formData.append("picture", data.picture[0]);
    }
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("mobileNo", data.mobileNo);
    formData.append("address", data.address);
    setLoading(true)
    const result = await registerUser(formData)
    console.log(result)
    setLoading(false)
    if (result.status === 201) {
      toast({
        title: "Success",
        description: "Custom User registered successfully",
        duration: 2000,
        className: "bg-green-600 text-white",
      })
      navigate("/signin");
    }
    else if (result.status === 422) {
      Object.entries(result.error).forEach(([key, value]) => {
        setError(key as keyof Schema, {
          type: "server",
          message: Array.isArray(value) ? value[0] : value,
        })
      })
    }
    else if (result.status === 400 || result.status === 409 || result.status === 500 || result.status === 100) {
      toast({
        title: "Error",
        description: result.error,
        duration: 3000,
        className: "bg-red-500 text-white",
      })
    }
  }
  return (
    <div className="">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter the required information to create your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-2">
              <Label htmlFor="picture">Profile Picture</Label>
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={imagePreview || ""} alt="Profile preview" />
                  <AvatarFallback className="text-lg">{imagePreview ? "Preview" : "Upload"}</AvatarFallback>
                </Avatar>
                <Input id="picture" type="file" accept="image/*" {...register("picture", { required: true })} onChange={handleImageChange} className="max-w-xs" />
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Ali"  {...register("firstName", { required: true })} />
                {
                  errors?.firstName && <span className="text-sm text-neutral-700">{errors?.firstName?.message}</span>
                }
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Raza" {...register("lastName", { required: true })} />
                {
                  errors?.lastName && <span className="text-sm text-neutral-700">{errors?.lastName?.message}</span>
                }
              </div>
            </div>

            {/* Username and Email */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="aliraza" {...register("username", { required: true })} />
                {
                  errors?.username && <span className="text-sm text-neutral-700">{errors?.username?.message}</span>
                }
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="aliraza@example.com" {...register("email", { required: true })} />
                {
                  errors?.email && <span className="text-sm text-neutral-700">{errors?.email?.message}</span>
                }
              </div>
            </div>

            {/* Password and Mobile */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password", { required: true })} />
                {
                  errors?.password && <span className="text-sm text-neutral-700">{errors?.password?.message}</span>
                }
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNo">Mobile Number</Label>
                <Input id="mobileNo" type="tel" placeholder="300000000" {...register("mobileNo", { required: true })} />
                {
                  errors?.mobileNo && <span className="text-sm text-neutral-700">{errors?.mobileNo?.message}</span>
                }
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Enter your full address" className="min-h-[80px]" {...register("address", { required: true })} />
              {
                errors?.address && <span className="text-sm text-neutral-700">{errors?.address?.message}</span>
              }
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
