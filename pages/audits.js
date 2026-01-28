import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../../components/Sidebar'
import { supabase } from '../../lib/supabaseClient'
import { Search, Globe, ShieldCheck, Zap, BarChart3, ArrowRight, Loader2 } from 'lucide-react'

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
    
    // Simulate steps for high-end UX feel
    setTimeout(() => setStep('analyzing'), 2000)

    try {
      // Logic: In prod, we'd hit /api/audit which uses Gemini
      // For this UI build, we mock a high-fidelity result
      setTimeout(() => {
        setReport({
          score: 84,
          url: url.replace('https://', '').replace('http://', ''),
          findings: [
            { category: 'SEO', status: 'warning', title: 'Missing Meta Descriptions', detail: '3 pages are missing descriptions which hurts click-through rates.' },
            { category: 'Performance', status: 'success', title: 'Lightning Fast Load', detail: 'Site loads in 0.8s, which is top 5% in the industry.' },
            { category: 'Conversion', status: 'error', title: 'Weak CTA Placement', detail: 'The primary "Buy Now" button is below the fold on mobile.' }
          ]
        })
        setStep('finished')
        setLoading(false)
      }, 4500)
    } catch (error) {
      alert("Audit failed. Try again later.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-lt-bg text-white pl-64">
      <Sidebar />
      <main className="p-12 max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-lt-primary font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Intelligence Engine</span>
                <h1 className="text-4xl font-black italic tracking-tighter">AI SITE AUDIT</h1>
            </motion.div>
        </header>

        {/* Input Card */}
        {!report && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-lt-card border border-lt-border p-1 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
                <div className="bg-lt-bg rounded-[2.3rem] p-10 relative z-10">
                    <form onSubmit={runAudit} className="space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold">Generate a Revenue Report</h2>
                            <p className="text-lt-muted text-sm">Enter a client's URL to identify SEO gaps and conversion leaks.</p>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center text-lt-muted group-focus-within:text-lt-primary transition-colors">
                                <Globe size={20} />
                            </div>
                            <input 
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://client-website.com"
                                className="w-full bg-lt-surface border border-lt-border p-5 pl-14 rounded-2xl text-lg font-medium outline-none focus:border-lt-primary/50 transition-all placeholder-white/10"
                                required
                            />
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full bg-lt-primary hover:bg-lt-primary/90 text-white font-black italic py-5 rounded-2xl text-lg shadow-[0_0_30px_rgba(109,40,217,0.3)] transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    {step === 'scraping' ? 'SCRAPING DOM...' : 'AI ANALYSIS...'}
                                </>
                            ) : (
                                <>ANALYZE WEBSITE <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-lt-primary/5 blur-[100px] rounded-full" />
            </motion.div>
        )}

        {/* Results View */}
        <AnimatePresence>
            {report && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8 pb-20"
                >
                    {/* Hero Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-lt-card border border-lt-border p-8 rounded-3xl flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-lt-muted uppercase tracking-widest mb-4">Overall Score</span>
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                                    <motion.circle 
                                        initial={{ pathLength: 0 }} animate={{ pathLength: report.score / 100 }} transition={{ duration: 1.5, ease: "easeOut" }}
                                        cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-lt-primary" 
                                    />
                                </svg>
                                <span className="absolute text-3xl font-black italic">{report.score}</span>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-lt-card border border-lt-border p-8 rounded-3xl flex flex-col justify-center">
                            <span className="text-[10px] font-bold text-lt-muted uppercase tracking-widest mb-2">Target Domain</span>
                            <h2 className="text-2xl font-black text-lt-accent truncate">{report.url}</h2>
                            <div className="mt-6 flex gap-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-lt-muted bg-lt-surface px-3 py-2 rounded-full">
                                    <ShieldCheck size={14} className="text-green-500" /> SSL SECURE
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-lt-muted bg-lt-surface px-3 py-2 rounded-full">
                                    <Zap size={14} className="text-yellow-500" /> MOBILE OPTIMIZED
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-lt-muted uppercase tracking-[0.2em] px-2">Analysis Breakdown</h3>
                        {report.findings.map((f, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                className="bg-lt-card border border-lt-border p-6 rounded-2xl flex items-start gap-5 hover:border-white/10 transition-colors"
                            >
                                <div className={`p-3 rounded-xl ${
                                    f.status === 'success' ? 'bg-green-500/10 text-green-500' : 
                                    f.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                    <BarChart3 size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-white">{f.title}</h4>
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-lt-surface rounded">{f.category}</span>
                                    </div>
                                    <p className="text-sm text-lt-muted">{f.detail}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <button 
                        onClick={() => setReport(null)}
                        className="w-full bg-lt-surface border border-lt-border hover:bg-white/5 text-white font-bold py-4 rounded-2xl transition-all"
                    >
                        NEW AUDIT
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </main>
    </div>
  )
}
