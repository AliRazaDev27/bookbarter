import { useSelector } from "react-redux";
import { UsersTable } from "./user-table";
import { useNavigate } from "react-router";
import { useEffect } from "react";


export function Dashboard() {
  const user = useSelector((state: any) => state.user.data);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || user?.role !== "admin") {
      navigate("/signin");
    }
  }, [user]);
  return (
    <main className="w-full min-h-screen py-8 bg-gradient-to-b from-[#565656] to-[#181818] ">
      {!!user && user?.role === "admin" && (
        <div className="container mx-auto">
          <h1 className="text-3xl text-white/80 font-bold mb-6 ">User Management</h1>
          <UsersTable />
        </div>
      )}
    </main>
  )
}