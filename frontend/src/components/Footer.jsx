import { Link } from 'react-router-dom'
import { Globe, GraduationCap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#1c1d1f] text-white text-xs border-t border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Top 4-Column Links + Language Selector */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 pb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16 text-left">
            {/* Column 1 */}
            <ul className="space-y-2.5">
              <li><Link to="/explore" className="hover:underline">Academy Business</Link></li>
              <li><Link to="/instructor/dashboard" className="hover:underline">Teach on Academy</Link></li>
              <li><Link to="/explore" className="hover:underline">Get the app</Link></li>
              <li><Link to="/explore" className="hover:underline">About us</Link></li>
              <li><Link to="/explore" className="hover:underline">Contact us</Link></li>
            </ul>

            {/* Column 2 */}
            <ul className="space-y-2.5">
              <li><Link to="/explore" className="hover:underline">Careers</Link></li>
              <li><Link to="/explore" className="hover:underline">Blog</Link></li>
              <li><Link to="/explore" className="hover:underline">Help and Support</Link></li>
              <li><Link to="/explore" className="hover:underline">Affiliate</Link></li>
              <li><Link to="/explore" className="hover:underline">Investors</Link></li>
            </ul>

            {/* Column 3 */}
            <ul className="space-y-2.5">
              <li><Link to="/explore" className="hover:underline">Terms</Link></li>
              <li><Link to="/explore" className="hover:underline">Privacy policy</Link></li>
              <li><Link to="/explore" className="hover:underline">Cookie settings</Link></li>
              <li><Link to="/explore" className="hover:underline">Sitemap</Link></li>
              <li><Link to="/explore" className="hover:underline">Accessibility statement</Link></li>
            </ul>
          </div>

          {/* Right Language Button (Udemy standard) */}
          <div className="flex items-start">
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 border border-white text-white hover:bg-slate-800 transition-colors font-bold text-xs rounded-none cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>English</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar: Logo and Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 select-none group">
            <div className="w-7 h-7 rounded-md bg-[#a435f0] flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight leading-none">
              E-Learning <span className="text-[#a435f0]">Academy</span>
            </span>
          </Link>

          <p className="text-3xs text-slate-400">
            © 2026 E-Learning Academy, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
