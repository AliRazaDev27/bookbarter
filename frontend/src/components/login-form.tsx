import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { useNavigate } from "react-router"
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
import { useDispatch } from "react-redux"
import { setUserData } from "@/store/features/user/userSlice"
import { useToast } from "@/hooks/use-toast"

const schema = z.object({
  email: z.string()
  .min(6, "Email must be at least 6 characters long")
  .max(254, "Email must not exceed 254 characters")
  .email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must not exceed 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

type Schema = z.infer<typeof schema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm<Schema>({
    resolver: zodResolver(schema)
  })
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData()
    formData.append("email", data.email);
    formData.append("password", data.password);
    setIsLoading(true)
    const response = await axios.post("http://localhost:3000/users/login", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setIsLoading(false)
    if(response.data.success) {
      dispatch(setUserData(response.data.data));
      toast({
        title: "Success",
        description: response.data.message,
        duration: 2000,
        className: "bg-green-600 text-white",
      })
      navigate("/user");
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
          <CardTitle className="text-2xl">User Login</CardTitle>
          <CardDescription>
            Enter your credentials below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
                {
                  errors.email && <span className="text-red-500">{errors.email.message}</span>
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
              <Button type="submit" className="w-full bg-blue-600" disabled={isLoading}>
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{""}
              <a href="signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
