import { Button } from "@/components/ui/button"
import { Link } from "react-router"
export function Home() {

  return (
      <main className="w-full h-screen bg-gradient-to-b from-[#565656] to-[#181818]  text-white flex items-center justify-center">
        <section className="flex flex-col gap-8 items-center justify-center">
          <Link to="signup" className="bg-gradient-to-br from-[#9F25FF] to-[#FF7A00] hover:scale-105 transition-transform duration-200 hover:shadow-sm hover:shadow-white/70 text-lg font-semibold py-4 rounded-3xl w-[160px] text-center">Register</Link>
          <Link to="signin" className="bg-gradient-to-br from-[#9F25FF] to-[#FF7A00] hover:scale-105 transition-transform duration-200 hover:shadow-sm hover:shadow-white/70 text-lg font-semibold py-4 rounded-3xl w-[160px] text-center">Login</Link>
          <Link to="dashboard" className="bg-gradient-to-br from-[#9F25FF] to-[#FF7A00] hover:scale-105 transition-transform duration-200 hover:shadow-sm hover:shadow-white/70 text-lg font-semibold py-4 rounded-3xl w-[160px] text-center">Dashboard</Link>
          <Link to="create_post" className="bg-gradient-to-br from-[#9F25FF] to-[#FF7A00] hover:scale-105 transition-transform duration-200 hover:shadow-sm hover:shadow-white/70 text-lg font-semibold py-4 rounded-3xl w-[160px] text-center">Create Post</Link>
          <Link to="posts" className="bg-gradient-to-br from-[#9F25FF] to-[#FF7A00] hover:scale-105 transition-transform duration-200 hover:shadow-sm hover:shadow-white/70 text-lg font-semibold py-4 rounded-3xl w-[160px] text-center">Posts</Link>
          <Button className="bg-gradient-to-br from-[#9F25FF] to-[#FF7A00] hover:scale-105 transition-transform duration-200 hover:shadow-sm hover:shadow-white/70 text-lg font-semibold py-4 rounded-3xl w-[160px] text-center"
          onClick={async()=>{
            await fetch("http://localhost:3000/test", {
              method: "GET",
          })

          }}
          >Test</Button>
        </section>
        </main>
  )
}
// background: linear-gradient(220.55deg, #B9A14C 0%, #000000 100%);

