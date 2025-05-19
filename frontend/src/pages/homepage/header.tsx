import { Outlet } from "react-router";
import { useEffect } from "react";
import { Requests } from "./requests";
import { IoNotifications } from "react-icons/io5";
import { MdMessage } from "react-icons/md";
import { Profile } from "./profile";
import { MdMenu } from "react-icons/md";


export function Header() {
    const toggleFilterSidebar = () => {
        const filterSidebarRef = document.getElementById("filter-sidebar")
        filterSidebarRef?.classList.toggle("hidden")
    }
    return (
        <>
            {/* very bad method */}
            <nav id="header" className="fixed top-0 border-b bg-white z-50 w-full flex justify-between items-center px-4 py-1 md:px-8 md:py-2">
                <div>
                <span className="max-lg:hidden">Logo</span>
                <button onClick={toggleFilterSidebar} className="lg:hidden">
                    <MdMenu className="text-2xl"/>
                </button>
                </div>
                <div>
                    <ul className="flex items-center gap-4 md:gap-6">
                        <li>
                            <IoNotifications className="text-xl"/>
                        </li>
                        <li>
                            <MdMessage className="text-xl"/>
                        </li>
                        <li id="req_link">
                            <Requests/>
                        </li>
                        <li>
                            <Profile/>
                        </li>
                    </ul>
                </div>
            </nav>
            <Outlet />
        </>
    )
}