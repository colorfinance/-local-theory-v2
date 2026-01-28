import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import Sidebar from '../components/Sidebar'

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
      
      // Fetch Real Data
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

  if (loading) return null

  return (
    <div className="min-h-screen bg-lt-bg text-white pl-64 font-sans">
      <Sidebar />
      <main className="p-12 max-w-7xl mx-auto">
        
        {/* Real Copy Integration from localtheory.com.au approach */}
        <header className="mb-12">
            <span className="text-lt-primary font-bold text-xs uppercase tracking-[0.3em] mb-3 block">Darwin's Premier Digital Engine</span>
            <h1 className="text-5xl font-black italic tracking-tighter mb-4 uppercase">Local Theory Digital</h1>
            <p className="text-lt-muted max-w-3xl text-lg leading-relaxed font-medium">
                Showcasing custom web apps, bespoke websites, creative content, and digital marketing solutions. Built for businesses looking to thrive online with a modern, futuristic, and professional digital presence.
            </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-lt-card border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-lt-primary/30 transition-all shadow-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-lt-primary/5 blur-3xl rounded-full" />
            <h3 className="text-lt-muted text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Active Deployments</h3>
            <div className="text-5xl font-black italic tracking-tighter text-white group-hover:text-lt-primary transition-colors">{stats.projects}</div>
            <p className="text-xs text-lt-muted mt-4 font-bold tracking-widest uppercase">Ongoing Projects</p>
          </div>

          <div className="bg-lt-card border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-lt-primary/30 transition-all shadow-2xl">
            <h3 className="text-lt-muted text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Intelligence Reports</h3>
            <div className="text-5xl font-black italic tracking-tighter text-white group-hover:text-lt-primary transition-colors">{stats.audits}</div>
            <p className="text-xs text-lt-muted mt-4 font-bold tracking-widest uppercase">AI Audits Generated</p>
          </div>

          <div className="bg-lt-card border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-lt-primary/30 transition-all shadow-2xl">
            <h3 className="text-lt-muted text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Pending Revenue</h3>
            <div className="text-5xl font-black italic tracking-tighter text-white group-hover:text-lt-primary transition-colors">{stats.proposals}</div>
            <p className="text-xs text-lt-muted mt-4 font-bold tracking-widest uppercase">Active Proposals</p>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mt-16 border-t border-white/5 pt-12">
            <h2 className="text-xs font-bold text-lt-muted uppercase tracking-[0.3em] mb-8">Primary Directives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => router.push('/audits')} className="bg-lt-surface border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all text-left group">
                    <div>
                        <div className="font-bold text-white mb-1 uppercase tracking-tight">Run New Audit</div>
                        <div className="text-xs text-lt-muted">Initiate AI analysis for a lead</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-lt-primary/10 flex items-center justify-center text-lt-primary group-hover:bg-lt-primary group-hover:text-white transition-all">→</div>
                </button>
                <button onClick={() => router.push('/projects')} className="bg-lt-surface border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all text-left group">
                    <div>
                        <div className="font-bold text-white mb-1 uppercase tracking-tight">Access Project HQ</div>
                        <div className="text-xs text-lt-muted">Manage active client boards</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-lt-primary/10 flex items-center justify-center text-lt-primary group-hover:bg-lt-primary group-hover:text-white transition-all">→</div>
                </button>
            </div>
        </section>
      </main>
    </div>
  )
}
