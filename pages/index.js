import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import Sidebar from '@/components/Sidebar'
import { Layers, Zap, TrendingUp, ArrowUpRight, BarChart3, Globe, Command } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ projects: 0, audits: 0, proposals: 0 })

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      const [projCount, auditCount, propCount] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('audits').select('*', { count: 'exact', head: true }),
        supabase.from('proposals').select('*', { count: 'exact', head: true })
      ])

      setStats({
        projects: projCount.count || 0,
        audits: auditCount.count || 0,
        proposals: propCount.count || 0
      })
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
            <Command className="text-lt-primary" size={40} />
        </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDED] pl-72 font-sans selection:bg-lt-primary/30">
      <Sidebar />
      <main className="p-12 max-w-[1600px] mx-auto">
        
        {/* Hero Section */}
        <header className="mb-20 relative">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-lt-primary/10 blur-[120px] rounded-full -z-10" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <span className="h-px w-8 bg-lt-primary" />
                    <span className="text-lt-primary font-black text-[10px] uppercase tracking-[0.4em]">Proprietary Engine v2.0</span>
                </div>
                <h1 className="text-7xl font-black italic tracking-tighter mb-6 leading-[0.9]">
                    LOCAL THEORY <br/> 
                    <span className="text-gradient">DIGITAL ENGINE</span>
                </h1>
                <p className="text-lt-muted max-w-xl text-lg leading-relaxed font-medium">
                    The Darwin-based digital engine built for aggressive growth. Optimized for performance, conversion, and tactical scale.
                </p>
            </motion.div>
        </header>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Active Deployments', value: stats.projects, icon: Layers, detail: 'Ongoing tactical builds' },
            { label: 'Intelligence Reports', value: stats.audits, icon: BarChart3, detail: 'AI audits generated' },
            { label: 'Pending Revenue', value: stats.proposals, icon: TrendingUp, detail: 'Contracted potential' }
          ].map((item, i) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="glass-card p-10 rounded-[2.5rem] relative group hover:border-lt-primary/40 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <item.icon size={120} />
              </div>
              <h3 className="text-lt-muted text-[10px] font-black uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-lt-primary animate-pulse" />
                {item.label}
              </h3>
              <div className="text-6xl font-black italic tracking-tighter mb-2 group-hover:translate-x-1 transition-transform duration-500">
                {item.value}
              </div>
              <p className="text-[10px] text-lt-muted font-bold tracking-widest uppercase mt-4">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tactical Actions */}
        <section className="mt-20">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-xs font-black text-lt-muted uppercase tracking-[0.5em] px-2 flex items-center gap-4">
                    Primary Directives <div className="h-px w-24 bg-white/5" />
                </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
                <motion.button 
                    whileHover={{ scale: 1.01, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/audits')} 
                    className="glass-card p-8 rounded-3xl flex items-center justify-between hover:bg-white/[0.03] transition-all text-left group"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-lt-primary/10 flex items-center justify-center text-lt-primary group-hover:bg-lt-primary group-hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(109,40,217,0)] group-hover:shadow-[0_0_30px_rgba(109,40,217,0.3)]">
                            <Zap size={28} />
                        </div>
                        <div>
                            <div className="font-black text-xl text-white mb-1 italic tracking-tight uppercase">Execute Intelligence Audit</div>
                            <div className="text-sm text-lt-muted font-medium">Initiate deep-scan AI analysis for client domain</div>
                        </div>
                    </div>
                    <ArrowUpRight size={24} className="text-lt-muted group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </motion.button>

                <motion.button 
                    whileHover={{ scale: 1.01, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/projects')} 
                    className="glass-card p-8 rounded-3xl flex items-center justify-between hover:bg-white/[0.03] transition-all text-left group"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
                            <Globe size={28} />
                        </div>
                        <div>
                            <div className="font-black text-xl text-white mb-1 italic tracking-tight uppercase">Access Mission Control</div>
                            <div className="text-sm text-lt-muted font-medium">Coordinate active deployments and client boards</div>
                        </div>
                    </div>
                    <ArrowUpRight size={24} className="text-lt-muted group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </motion.button>
            </div>
        </section>
      </main>
    </div>
  )
}
