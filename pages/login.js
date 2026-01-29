import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    // If user is already logged in, send them to dashboard
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) router.push('/')
    }
    checkUser()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    // Explicitly set the redirect URL to the current origin
    const redirectUrl = typeof window !== 'undefined' ? window.location.origin : 'https://local-theory-v2.vercel.app'
    
    console.log("Attempting login for:", email, "Redirecting to:", redirectUrl)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) {
      setMessage("Error: " + error.message)
    } else {
      setMessage('Check your email for the magic link!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#121214] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px] rounded-full" />
        
        <div className="text-center mb-10 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-[#6D28D9] to-[#A78BFA] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(109,40,217,0.3)]">
                <span className="text-white font-black text-2xl italic">LT</span>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Mission Control</h1>
            <p className="text-[#737373] mt-2 font-bold text-xs uppercase tracking-widest opacity-60">Authorize Terminal Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
                <label className="text-[10px] font-black text-[#737373] uppercase tracking-[0.2em] mb-2 block px-1">Operator Credentials</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#6D28D9]/50 transition-all font-bold placeholder-white/5 uppercase italic"
                    placeholder="ENTER EMAIL"
                    required
                />
            </div>

            <motion.button 
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-[#6D28D9] hover:bg-[#7c3aed] text-white font-black italic py-5 rounded-2xl text-lg shadow-[0_0_20px_rgba(109,40,217,0.2)] transition-all disabled:opacity-50 tracking-tight"
            >
                {loading ? 'TRANSMITTING...' : 'INITIALIZE LOGIN'}
            </motion.button>
        </form>

        {message && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 text-center text-xs font-bold text-[#A78BFA] uppercase tracking-widest"
            >
                {message}
            </motion.div>
        )}
      </motion.div>
    </div>
  )
}
