import Link from 'next/link'
import { LayoutDashboard, Users, FileText, CheckSquare, Calendar } from 'lucide-react'

export default function Sidebar() {
  return (
    <div className="w-64 border-r border-lt-border h-screen p-4 flex flex-col fixed left-0 top-0 bg-lt-card">
      <div className="text-xl font-bold mb-8 px-2 flex items-center gap-2">
        <div className="w-8 h-8 bg-lt-primary rounded-lg"></div>
        Local Theory
      </div>
      
      <nav className="space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-white bg-lt-surface rounded-md">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link href="/projects" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-lt-muted hover:text-white hover:bg-lt-surface/50 rounded-md transition">
          <CheckSquare size={18} />
          Projects
        </Link>
        <Link href="/audits" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-lt-muted hover:text-white hover:bg-lt-surface/50 rounded-md transition">
          <FileText size={18} />
          AI Audits
        </Link>
        <Link href="/clients" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-lt-muted hover:text-white hover:bg-lt-surface/50 rounded-md transition">
          <Users size={18} />
          Clients
        </Link>
      </nav>
    </div>
  )
}
