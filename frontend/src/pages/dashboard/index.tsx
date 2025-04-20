import { AdminLoginForm } from "./admin-login-form";
import { UsersTable } from "./user-table";
import { useState } from "react";

export function Dashboard() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  return (
    <main className="w-full min-h-screen py-8 bg-gradient-to-b from-[#565656] to-[#181818] ">
      {isAdmin === true ? (
        <div className="container mx-auto">
          <h1 className="text-3xl text-white/80 font-bold mb-6 ">User Management</h1>
          <UsersTable />
        </div>
      ): (
          <div className="w-full min-h-screen flex flex-col items-center justify-center gap-8 ">
            <AdminLoginForm trigger={setIsAdmin}/>
          </div>
      )
          }
    </main>
  )
}