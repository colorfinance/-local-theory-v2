import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import { supabase } from '../../lib/supabaseClient'
import { FileText, Plus, DollarSign, Send, Trash2, CheckCircle, Clock, Eye, Loader2 } from 'lucide-react'

export default function Proposals() {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [clients, setClients] = useState([])
  
  // New Proposal Form
  const [title, setTitle] = useState('')
  const [selectedClient, setSelectedClient] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    fetchProposals()
    fetchClients()
  }, [])

  async function fetchProposals() {
    setLoading(true)
    const { data } = await supabase.from('proposals').select('*, profiles(full_name, email)').order('created_at', { ascending: false })
    setProposals(data || [])
    setLoading(false)
  }

  async function fetchClients() {
    const { data } = await supabase.from('profiles').select('id, full_name, email').eq('role', 'client')
    setClients(data || [])
  }

  const createProposal = async () => {
    if (!title || !selectedClient) return
    
    const { data, error } = await supabase.from('proposals').insert({
        title,
        client_id: selectedClient,
        amount: parseFloat(amount) || 0,
        status: 'draft'
    }).select().single()

    if (data) {
        setProposals([data, ...proposals])
        setIsCreating(false)
        setTitle('')
        setAmount('')
        // Refresh to get joined profile data
        fetchProposals()
    }
  }

  const deleteProposal = async (id) => {
    if(!confirm("Delete this proposal?")) return
    await supabase.from('proposals').delete().eq('id', id)
    setProposals(proposals.filter(p => p.id !== id))
  }

  const getStatusStyle = (status) => {
    switch(status) {
      case 'accepted': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'sent': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-lt-surface text-lt-muted border-lt-border'
    }
  }

  return (
    <div className="min-h-screen bg-lt-bg text-white pl-64">
      <Sidebar />
      <main className="p-12 max-w-6xl mx-auto">
        
        <header className="flex justify-between items-center mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-lt-primary font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Revenue Pipeline</span>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase">Proposals</h1>
            </motion.div>
            <button 
                onClick={() => setIsCreating(true)}
                className="bg-lt-primary hover:bg-lt-primary/90 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-glow flex items-center gap-2"
            >
                <Plus size={20} /> CREATE PROPOSAL
            </button>
        </header>

        <AnimatePresence>
            {isCreating && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsCreating(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-lt-card border border-white/10 rounded-[2.5rem] p-10 z-50 space-y-6 shadow-2xl"
                    >
                        <h2 className="text-2xl font-black italic tracking-tighter text-center uppercase">New Proposal</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-lt-muted uppercase tracking-widest mb-2 block px-1">Project Title</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Q4 Growth Strategy"
                                    className="w-full bg-lt-surface border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-lt-primary/50 transition-all font-bold"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-lt-muted uppercase tracking-widest mb-2 block px-1">Assign Client</label>
                                <select 
                                    value={selectedClient}
                                    onChange={(e) => setSelectedClient(e.target.value)}
                                    className="w-full bg-lt-surface border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-lt-primary/50 transition-all font-bold appearance-none"
                                >
                                    <option value="">Select a lead...</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.full_name || c.email}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-lt-muted uppercase tracking-widest mb-2 block px-1">Budget ($)</label>
                                <div className="relative">
                                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-lt-muted" />
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="5,000"
                                        className="w-full bg-lt-surface border border-white/5 p-4 pl-10 rounded-2xl text-white outline-none focus:border-lt-primary/50 transition-all font-mono font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={createProposal}
                            disabled={!title || !selectedClient}
                            className="w-full bg-lt-primary text-white font-black italic py-4 rounded-2xl text-lg shadow-glow active:scale-95 transition-all disabled:opacity-50"
                        >
                            INITIALIZE DRAFT
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-4">
            {loading ? (
                <div className="text-center py-20 opacity-50 flex items-center justify-center gap-3">
                    <Loader2 className="animate-spin" /> FETCHING PIPELINE...
                </div>
            ) : proposals.map((p, i) => (
                <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-lt-card border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-lt-primary/30 transition-all group"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-lt-surface rounded-xl flex items-center justify-center text-lt-primary border border-white/5">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg group-hover:text-lt-accent transition-colors">{p.title}</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-lt-muted font-medium">{p.profiles?.full_name || 'Unassigned'}</span>
                                <span className="w-1 h-1 bg-white/10 rounded-full" />
                                <span className="text-xs text-lt-muted font-mono">${p.amount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${getStatusStyle(p.status)}`}>
                            {p.status}
                        </span>
                        
                        <div className="flex items-center border border-white/5 rounded-xl overflow-hidden ml-4">
                            <button className="p-3 hover:bg-white/5 text-lt-muted hover:text-white transition-colors border-r border-white/5" title="View Proposal">
                                <Eye size={18} />
                            </button>
                            <button className="p-3 hover:bg-white/5 text-lt-muted hover:text-white transition-colors border-r border-white/5" title="Send to Client">
                                <Send size={18} />
                            </button>
                            <button 
                                onClick={() => deleteProposal(p.id)}
                                className="p-3 hover:bg-red-500/10 text-lt-muted hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}

            {proposals.length === 0 && !loading && (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                    <div className="text-white/10 mb-4 flex justify-center"><FileText size={64} /></div>
                    <p className="text-lt-muted font-bold tracking-widest uppercase text-xs">Pipeline Empty</p>
                </div>
            )}
        </div>
      </main>
    </div>
  )
}
