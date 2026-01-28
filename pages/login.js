import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the magic link!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-lt-bg flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-lt-card border border-lt-border p-8 rounded-2xl shadow-2xl"
      >
        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-lt-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Local Theory</h1>
            <p className="text-lt-muted mt-2">Agency Workspace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-lt-muted uppercase tracking-wider mb-1 block">Email Address</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-lt-surface border border-lt-border rounded-lg p-3 text-white outline-none focus:border-lt-primary transition-colors"
                    placeholder="name@company.com"
                    required
                />
            </div>

            <button 
                disabled={loading}
                className="w-full bg-lt-primary hover:bg-lt-primary/80 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
                {loading ? 'Sending Link...' : 'Sign In with Email'}
            </button>
        </form>

        {message && (
            <div className="mt-6 p-4 bg-lt-surface rounded-lg border border-lt-border text-center text-sm text-lt-accent">
                {message}
            </div>
        )}
      </motion.div>
    </div>
  )
}
