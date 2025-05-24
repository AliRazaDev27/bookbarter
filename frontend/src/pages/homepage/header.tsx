import { Outlet, Link } from "react-router";
import { useEffect } from "react";
import { IoNotifications } from "react-icons/io5";
import { MdMessage, MdMenu } from "react-icons/md";
import { Profile } from "./profile";
import { Requests } from "./requests";
import { useSelector } from "react-redux";
import { setUserData } from "@/store/features/user/userSlice";
import { getCurrentUser } from "@/api/user";
import { useAppDispatch } from "@/hooks/redux";
import { Notifications } from "./notifications";

export function Header() {
    const dispatch = useAppDispatch()
    const user = useSelector((state: any) => state.user.data)
    useEffect(() => {
        const getUser = async () => {
            const user = await getCurrentUser();
            if (!!user) {
                dispatch(setUserData(user))
            }
        }
        getUser();
    }, [])
    const toggleFilterSidebar = () => {
        const filterSidebarRef = document.getElementById("filter-sidebar")
        filterSidebarRef?.classList.toggle("hidden")
    }
    return (
        <>
            {/* very bad method */}
            <nav id="header" className="fixed top-0 border-b bg-white z-50 w-full flex justify-between items-center px-4 py-1 md:px-8 md:py-2">
                <div>
                    <Link to="/" className="max-lg:hidden hover:border-b hover:cursor-pointer hover:border-black">
                        <span className="text-2xl font-bold italic text-orange-500">Book</span>
                        <span className="text-xl font-semibold italic">Barter</span>
                    </Link>
                    <button onClick={toggleFilterSidebar} className="lg:hidden">
                        <MdMenu className="text-2xl" />
                    </button>
                </div>
                {
                    !!user ?
                        <div>
                            <ul className="flex items-center gap-4 md:gap-6">
                                <li>
                                    <Notifications />
                                </li>
                                <li>
                                    <MdMessage className="text-xl" />
                                </li>
                                <li id="req_link">
                                    <Requests />
                                </li>
                                <li>
                                    <Profile />
                                </li>
                            </ul>
                        </div>
                        :
                        <Link to={"/signin"} className="border bg-blue-400 hover:bg-blue-500 text-white font-bold px-4 rounded-3xl h-9 md:h-11 flex items-center">Login</Link>
                }
            </nav>
            <Outlet />
        </>
    )
}