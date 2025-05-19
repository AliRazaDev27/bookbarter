import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/store/features/user/userSlice";
import { Link } from "react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Profile() {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user.data)
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get("http://localhost:3000/auth/session", { withCredentials: true });
                if (!!response.data) {
                    dispatch(setUserData(response.data.data));
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        getUser();
    }, [])
    return (
        <div>
            { !!user ?
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
            :
            <Link to={"/signin"} className="border bg-blue-400 hover:bg-blue-500 text-white font-bold px-4 rounded-3xl h-9 md:h-11 flex items-center">Login</Link>
            }
        </div>
    )
}