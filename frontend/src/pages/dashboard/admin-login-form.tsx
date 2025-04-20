import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long")
    .max(32, "Username must not exceed 32 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must only contain letters and numbers"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must not exceed 32 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

type Schema = z.infer<typeof schema>;

export function AdminLoginForm({
  className,
    trigger,
  ...props
}: { trigger: React.Dispatch<React.SetStateAction<boolean> >} & React.ComponentPropsWithoutRef<"div">) {

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()  
  const { register, handleSubmit, formState: { errors } } = useForm<Schema>({
    resolver: zodResolver(schema)
  })

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData()
    formData.append("username", data.username);
    formData.append("password", data.password);
    setIsLoading(true)
    const response = await axios.post("http://localhost:3000/admin/login", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setIsLoading(false)
    if (response.data.success) {
    toast({
        title: "Success",
        description: response.data.message,
        duration: 2000,
        className: "bg-green-600 text-white",
    })
    trigger(true)
    }
    else {
    toast({
        title: "Error",
        description: response?.data?.errors?.[0]?.message || response.data.message,
        duration: 3000,
        className: "bg-red-500 text-white",
    })
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your admin credentials below to login to dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="name"
                  placeholder="username"
                  required
                  {...register("username")}
                />
                {
                  errors.username && <span className="text-red-500">{errors.username.message}</span>
                }
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required {...register("password")} />
                {
                  errors.password && <span className="text-red-500">{errors.password.message}</span>
                }
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
