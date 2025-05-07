import { Outlet } from "react-router";

export function Header() {
    const toggleFilterSidebar = () => {
        const filterSidebarRef = document.getElementById("filter-sidebar")
        filterSidebarRef?.classList.toggle("hidden")
    }
    return (
        <>
            {/* very bad method */}
            <nav className="w-full h-[70px] py-4 px-4 flex justify-between items-center">
                <button onClick={toggleFilterSidebar} className="bg-gray-200 rounded-full p-2 flex items-center justify-center">
                    <span>logo</span>
                </button>
                <div>
                    <ul className="flex gap-2">
                        <li>Notification</li>
                        <li>Message</li>
                        <li>Requests</li>
                        <li>Profile</li>
                    </ul>
                </div>
            </nav>
            <Outlet />
        </>
    )
}