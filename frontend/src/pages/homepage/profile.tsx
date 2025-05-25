import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { logout } from "@/api/user";

export function Profile() {
    const user = useSelector((state: any) => state.user.data)
    const navigate = useNavigate();
    const handleLogout = async() => {
        const response = await logout();
        if(!!response){
            navigate("/signin");
        }
    }
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
            <Avatar className="h-9 md:h-11 w-9 md:w-11 ">
                <AvatarImage src={user?.picture} alt="Profile picture" />
                <AvatarFallback>ME</AvatarFallback>
            </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border border-neutral-300 shadow-xl mt-2 me-2">
                    <section className="">
                        <ul>
                            { user?.role === "admin" &&
                            <li>
                                <Link to="/dashboard" className="font-medium px-4 py-2 text-center block hover:bg-gray-200">Dashboard</Link>
                            </li>
                            }
                            <li>
                                <Link to="/profile" className="font-medium text-center px-4 py-2 block hover:bg-gray-200">Profile</Link>
                            </li>
                            <hr/>
                            <li>
                                <button onClick={handleLogout} className="w-full font-medium text-center px-4 py-2 block hover:bg-gray-200">Logout</button>
                            </li>
                        </ul>

                    </section>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}