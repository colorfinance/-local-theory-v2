import Sidebar from '../components/Sidebar'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-lt-bg text-white pl-64">
      <Sidebar />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Agency Dashboard</h1>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-lt-card border border-lt-border p-6 rounded-xl">
            <h3 className="text-lt-muted text-sm font-medium uppercase tracking-wider mb-2">Active Projects</h3>
            <div className="text-3xl font-mono font-bold">12</div>
          </div>
          <div className="bg-lt-card border border-lt-border p-6 rounded-xl">
            <h3 className="text-lt-muted text-sm font-medium uppercase tracking-wider mb-2">Pending Proposals</h3>
            <div className="text-3xl font-mono font-bold">$45,200</div>
          </div>
          <div className="bg-lt-card border border-lt-border p-6 rounded-xl">
            <h3 className="text-lt-muted text-sm font-medium uppercase tracking-wider mb-2">AI Audits Run</h3>
            <div className="text-3xl font-mono font-bold">156</div>
          </div>
        </div>
      </main>
    </div>
  )
}
