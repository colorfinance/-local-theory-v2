import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'
import { supabase } from '../lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ArrowRight, Folder } from 'lucide-react'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    // Wrap in try-catch to prevent crash
    try {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
        setProjects(data || [])
    } catch (e) {
        console.error(e)
    }
    setLoading(false)
  }

  const createProject = async () => {
    if (!newTitle) return
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase.from('projects').insert({
        title: newTitle,
        description: 'New Project',
        status: 'active',
        // In a real app, you'd select the client here. For now, we assume admin ownership.
    }).select().single()

    if (data) {
        // Create default columns
        const cols = ['To Do', 'In Progress', 'Done']
        for (let i = 0; i < cols.length; i++) {
            await supabase.from('project_columns').insert({
                project_id: data.id,
                title: cols[i],
                order_index: i
            })
        }
        
        setProjects([data, ...projects])
        setIsCreating(false)
        setNewTitle('')
    }
  }

  return (
    <div className="min-h-screen bg-lt-bg text-white pl-64">
      <Sidebar />
      <main className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Folder className="text-lt-primary" /> Projects
            </h1>
            <button 
                onClick={() => setIsCreating(true)}
                className="bg-lt-primary hover:bg-lt-primary/80 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
            >
                <Plus size={18} /> New Project
            </button>
        </div>

        {/* Create Modal */}
        <AnimatePresence>
            {isCreating && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    className="bg-lt-card border border-lt-border p-6 rounded-xl mb-8"
                >
                    <h3 className="font-bold mb-4">Create New Project</h3>
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Project Name (e.g. Website Redesign)"
                            className="flex-1 bg-lt-surface border border-lt-border rounded-lg px-4 py-2 text-white outline-none focus:border-lt-primary"
                            autoFocus
                        />
                        <button onClick={createProject} className="bg-lt-primary px-6 py-2 rounded-lg font-bold">Create</button>
                        <button onClick={() => setIsCreating(false)} className="bg-transparent border border-lt-border px-6 py-2 rounded-lg">Cancel</button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => (
                <Link key={p.id} href={`/projects/${p.id}`}>
                    <motion.div 
                        whileHover={{ y: -4 }}
                        className="bg-lt-card border border-lt-border p-6 rounded-xl cursor-pointer group hover:border-lt-primary/50 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-lt-surface rounded-lg flex items-center justify-center text-lt-muted group-hover:text-white transition-colors">
                                <Folder size={20} />
                            </div>
                            <span className="text-xs font-mono text-lt-muted px-2 py-1 bg-lt-surface rounded">{p.status}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-lt-accent transition-colors">{p.title}</h3>
                        <p className="text-lt-muted text-sm mb-4 line-clamp-2">{p.description}</p>
                        
                        <div className="flex items-center text-sm text-lt-primary font-medium gap-1">
                            View Board <ArrowRight size={16} />
                        </div>
                    </motion.div>
                </Link>
            ))}
            
            {projects.length === 0 && !loading && (
                <div className="col-span-full text-center py-20 text-lt-muted">
                    No projects yet. Create one to get started.
                </div>
            )}
        </div>
      </main>
    </div>
  )
}
