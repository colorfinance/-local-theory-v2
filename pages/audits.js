import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../../components/Sidebar'
import { Globe, ShieldCheck, Zap, BarChart3, ArrowRight, Loader2, Target, Cpu, TrendingUp } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function AIAudit() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [step, setStep] = useState('idle') // idle, scraping, analyzing, finished

  const runAudit = async (e) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    setStep('scraping')
    
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!res.ok) throw new Error('Failed')
      setStep('analyzing')

      const data = await res.json()
      
      // Delay slightly for UX "thinking" feel
      setTimeout(() => {
        setReport({
          score: data.score,
          url: url.replace('https://', '').replace('http://', '').split('/')[0],
          findings: data.findings
        })
        setStep('finished')
        setLoading(false)
      }, 1500)
    } catch (error) {
      alert("Audit Engine Offline. Check URL and try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-lt-bg text-white pl-72 font-sans selection:bg-lt-primary/30">
      <Sidebar />
      <main className="p-12 max-w-[1400px] mx-auto min-h-screen flex flex-col">
        
        {/* Header Section */}
        <header className="mb-16 relative">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-lt-primary animate-pulse" />
                    <span className="text-lt-primary font-black text-[10px] uppercase tracking-[0.4em]">Intelligence Matrix v4.2</span>
                </div>
                <h1 className="text-6xl font-black italic tracking-tighter leading-tight uppercase">
                    Tactical <br/>
                    <span className="text-gradient underline decoration-lt-primary/30 underline-offset-8">Site Intelligence</span>
                </h1>
            </motion.div>
        </header>

        {/* Input Interface */}
        {!report && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center -mt-20"
            >
                <div className="w-full max-w-2xl glass-card rounded-[3rem] p-12 relative overflow-hidden group border-white/10 hover:border-lt-primary/40 transition-all duration-700 shadow-[0_0_100px_rgba(109,40,217,0.05)]">
                    <form onSubmit={runAudit} className="space-y-10 relative z-10">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-black italic tracking-tight text-center uppercase">Initialize Deep Scan</h2>
                            <p className="text-lt-muted text-center text-sm font-medium tracking-wide">Connect the engine to a target domain to extract tactical growth opportunities.</p>
                        </div>

                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-6 flex items-center text-lt-muted group-focus-within/input:text-lt-primary transition-colors duration-500">
                                <Globe size={22} strokeWidth={2.5} />
                            </div>
                            <input 
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="TARGET-DOMAIN.COM"
                                className="w-full bg-black/40 border border-white/5 p-6 pl-16 rounded-2xl text-xl font-black tracking-tight outline-none focus:border-lt-primary/50 transition-all placeholder-white/5 uppercase italic"
                                required
                            />
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className="w-full bg-lt-primary hover:bg-lt-primary/90 text-white font-black italic py-6 rounded-2xl text-xl shadow-glow transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-4 tracking-tighter"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    <span className="uppercase">{step === 'scraping' ? 'Ingesting DOM...' : 'Neural Processing...'}</span>
                                </>
                            ) : (
                                <>START ANALYSIS <ArrowRight size={22} /></>
                            )}
                        </motion.button>
                    </form>
                    
                    {/* Background Visuals */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-lt-primary/10 blur-[100px] rounded-full group-hover:bg-lt-primary/20 transition-all duration-700" />
                </div>
            </motion.div>
        )}

        {/* Executive Report View */}
        <AnimatePresence>
            {report && (
                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-10 pb-20"
                >
                    {/* Top Level Intelligence */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <motion.div variants={item} className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center relative overflow-hidden border-lt-primary/20">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lt-primary to-transparent opacity-50" />
                            <span className="text-[10px] font-black text-lt-muted uppercase tracking-[0.3em] mb-6">Aggregate Rating</span>
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                                    <motion.circle 
                                        initial={{ pathLength: 0 }} animate={{ pathLength: report.score / 100 }} transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                                        cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-lt-primary shadow-glow" 
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-5xl font-black italic tracking-tighter leading-none">{report.score}</span>
                                    <span className="text-[9px] font-bold text-lt-muted uppercase tracking-widest mt-1">Units</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={item} className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
                                <Target size={200} />
                            </div>
                            <span className="text-[10px] font-black text-lt-muted uppercase tracking-[0.3em] mb-3">Intelligence Target</span>
                            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-8">{report.url}</h2>
                            
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-lt-muted bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl uppercase">
                                    <ShieldCheck size={16} className="text-lt-primary" /> SSL_ENCRYPTED
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-lt-muted bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl uppercase">
                                    <Cpu size={16} className="text-lt-primary" /> EDGE_OPTIMIZED
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-lt-muted bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl uppercase">
                                    <TrendingUp size={16} className="text-lt-primary" /> GROWTH_VIABLE
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Matrix Breakdown */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                             <h3 className="text-xs font-black text-lt-muted uppercase tracking-[0.5em] flex items-center gap-4">
                                Findings Matrix <div className="h-px w-24 bg-white/5" />
                             </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {report.findings.map((f, i) => (
                                <motion.div 
                                    key={i}
                                    variants={item}
                                    whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.15)' }}
                                    className="glass-card p-8 rounded-3xl flex items-start gap-6 transition-all duration-300 relative group"
                                >
                                    <div className={`mt-1 p-4 rounded-2xl border ${
                                        f.status === 'success' ? 'bg-green-500/5 text-green-500 border-green-500/20' : 
                                        f.status === 'warning' ? 'bg-yellow-500/5 text-yellow-500 border-yellow-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'
                                    }`}>
                                        <BarChart3 size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-black text-lg text-white italic tracking-tight uppercase leading-tight">{f.title}</h4>
                                            <span className="text-[8px] font-black uppercase px-2 py-1 bg-white/5 border border-white/5 rounded-md tracking-tighter text-lt-muted">{f.category}</span>
                                        </div>
                                        <p className="text-sm text-lt-muted leading-relaxed font-medium">{f.detail}</p>
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight size={14} className="text-lt-muted" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.button 
                        variants={item}
                        onClick={() => setReport(null)}
                        className="w-full bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-black tracking-[0.5em] text-white py-6 rounded-3xl transition-all uppercase italic"
                    >
                        Dispose Intelligence / Start New Session
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
      </main>
    </div>
  )
}
