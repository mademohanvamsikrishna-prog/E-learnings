import { Outlet } from 'react-router-dom'
import { Navbar, Sidebar } from '@/components'

export function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      {/* Dark themed navbar override wrapper */}
      <div className="[&_header]:bg-[#111111] [&_header]:border-b [&_header]:border-white/8 [&_.promo-bar]:hidden">
        <Navbar />
      </div>
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto">
        <Sidebar className="hidden lg:flex" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
