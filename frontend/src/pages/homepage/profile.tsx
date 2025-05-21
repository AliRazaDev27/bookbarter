import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";

export function Profile() {
    const user = useSelector((state: any) => state.user.data)
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
            <Avatar className="h-9 md:h-11 w-9 md:w-11 ">
                <AvatarImage src={user?.picture} alt="Profile picture" />
                <AvatarFallback>ME</AvatarFallback>
            </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <section>
                        <ul>
                            { user?.role === "admin" &&
                            <li>
                                <Link to="/dashboard" className="px-4 py-2 block hover:bg-gray-100">Dashboard</Link>
                            </li>
                            }
                            <li>
                                <Link to="/profile" className="px-4 py-2 block hover:bg-gray-100">Profile</Link>
                            </li>
                            <li>
                                <button className="w-full text-start px-4 py-2 block hover:bg-gray-100">Logout</button>
                            </li>
                        </ul>

                    </section>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}