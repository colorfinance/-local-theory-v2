import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, FileText, CheckSquare, Send, LogOut, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: CheckSquare },
  { href: '/audits', label: 'AI Audits', icon: FileText },
  { href: '/proposals', label: 'Proposals', icon: Send },
  { href: '/clients', label: 'Clients', icon: Users },
]

export default function Sidebar() {
  const router = useRouter()
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="w-72 border-r border-white/5 h-screen p-6 flex flex-col fixed left-0 top-0 bg-[#080808] z-50">
      <div className="mb-12 px-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-lt-primary to-lt-accent rounded-xl shadow-[0_0_20px_rgba(109,40,217,0.3)] flex items-center justify-center">
            <span className="text-white font-black text-xl italic leading-none mt-0.5 ml-0.5 text-shadow">LT</span>
        </div>
        <div>
            <h2 className="text-lg font-black italic tracking-tighter text-white leading-tight">LOCAL THEORY</h2>
            <span className="text-[10px] text-lt-muted font-bold tracking-[0.2em] uppercase opacity-60">Digital Engine</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="block relative group">
              <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative z-10 ${
                isActive 
                ? 'bg-white/5 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]' 
                : 'text-lt-muted hover:text-gray-200'
              }`}>
                <item.icon size={20} className={isActive ? 'text-lt-primary' : 'group-hover:text-lt-accent transition-colors'} />
                <span className="text-sm font-bold tracking-wide">{item.label}</span>
                {isActive && (
                    <motion.div 
                        layoutId="active-nav"
                        className="absolute inset-0 bg-gradient-to-r from-lt-primary/10 to-transparent rounded-2xl -z-10 border border-white/10"
                    />
                )}
                <ChevronRight size={14} className={`ml-auto opacity-0 group-hover:opacity-100 transition-all ${isActive ? 'translate-x-0' : '-translate-x-2'}`} />
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-white/5 pt-6">
        <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-lt-muted hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold tracking-wide uppercase">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
