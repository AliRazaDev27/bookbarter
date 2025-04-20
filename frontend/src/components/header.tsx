import { Outlet } from "react-router";

export function Header() {
    return (
        <>
        <nav className="flex justify-between items-center">
            <span>logo</span>
            <div>
                <ul className="flex gap-2">
                    <li>Notification</li>
                    <li>Message</li>
                    <li>Requests</li>
                    <li>Profile</li>
                </ul>
            </div>
        </nav>
        <Outlet/>
        </>
    )    
}