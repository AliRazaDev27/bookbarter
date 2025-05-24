import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {useToast} from "@/hooks/use-toast"
import { getAllUsers, updateUserStatus } from "@/api/user"

// Define the User type
type User = {
    id: string
    username: string
    email: string
    mobileNo: string
    picture: string
    status: "unverified" | "active" | "blocked"
    createdAt: Date
}


export function UsersTable() {
    const { toast } = useToast()
    const [userData, setUserData] = useState<User[]>([])

    const handleStatusChange = async (userId: string, newStatus: "unverified" | "active" | "blocked") => {
        const user = userData.find((user) => user.id === userId)
        if (user?.status === newStatus) return
        const ok = await updateStatus(userId, newStatus)
        if (ok) {
            setUserData((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
            toast({
                title: "Status Updated",
                description: `User status updated to ${newStatus}`,
                duration: 2000,
                className: "bg-green-600 text-white",
            })
        }
        else{
            toast({
                title: "Error",
                description: "Failed to update status",
                duration: 3000,
                className: "bg-red-500 text-white",
            })
        }
    }

    const getStatusBadge = (status: "unverified" | "active" | "blocked") => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-600 text-md">Active</Badge>
            case "unverified":
                return <Badge className="bg-yellow-500 text-md">Unverified</Badge>
            case "blocked":
                return <Badge className="bg-red-500 text-md">Blocked</Badge>
            default:
                return null
        }
    }

    const updateStatus = async (userId: string, status: "unverified" | "active" | "blocked") => {
            const response = await updateUserStatus(userId, status)
            return response;
    }

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await getAllUsers();
            if(!!response){
            setUserData(response);
            }
        }
        fetchUsers()
    }, [])

    return (
        <div className="rounded-md border bg-black/70 text-white/90">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {userData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                No users found, please add some, and connect db & server.
                            </TableCell>
                        </TableRow>
                    )}
                    {userData?.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={user.picture} alt={`${user.username}`} />
                                    <AvatarFallback>
                                        {user.username}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.mobileNo}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {/* {getStatusBadge(user.status)} */}
                                    <Select
                                        value={user.status}
                                        onValueChange={(value: "unverified" | "active" | "blocked") => handleStatusChange(user.id, value)}
                                    >
                                        <SelectTrigger className="w-[130px] bg-transparent">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-500">
                                            <SelectItem value="unverified" className="">{getStatusBadge("unverified")}</SelectItem>
                                            <SelectItem value="active" className="">{getStatusBadge("active")}</SelectItem>
                                            <SelectItem value="blocked">{getStatusBadge("blocked")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TableCell>
                            <TableCell>{format(user.createdAt, "MMM dd, yyyy")}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
