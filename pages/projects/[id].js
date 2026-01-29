import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabaseClient'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, MoreHorizontal, Layout, ChevronLeft, Target } from 'lucide-react'

export default function ProjectBoard() {
  const router = useRouter()
  const { id } = router.query
  const [project, setProject] = useState(null)
  const [columns, setColumns] = useState({})
  const [colOrder, setColOrder] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchBoard()
  }, [id])

  const fetchBoard = async () => {
    const { data: proj } = await supabase.from('projects').select('*').eq('id', id).single()
    setProject(proj)

    const { data: cols } = await supabase.from('project_columns').select('*').eq('project_id', id).order('order_index')
    const { data: tasks } = await supabase.from('project_tasks').select('*').in('column_id', cols.map(c => c.id)).order('order_index')

    const colMap = {}
    cols.forEach(c => {
        colMap[c.id] = { ...c, tasks: tasks.filter(t => t.column_id === c.id) }
    })
    
    setColumns(colMap)
    setColOrder(cols.map(c => c.id))
    setLoading(false)
  }

  const onDragEnd = async (result) => {
    const { destination, source } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const startCol = columns[source.droppableId]
    const finishCol = columns[destination.droppableId]

    if (startCol === finishCol) {
        const newTasks = Array.from(startCol.tasks)
        const [movedTask] = newTasks.splice(source.index, 1)
        newTasks.splice(destination.index, 0, movedTask)
        setColumns({ ...columns, [startCol.id]: { ...startCol, tasks: newTasks } })
        newTasks.forEach(async (t, i) => {
            await supabase.from('project_tasks').update({ order_index: i }).eq('id', t.id)
        })
        return
    }

    const startTasks = Array.from(startCol.tasks)
    const [movedTask] = startTasks.splice(source.index, 1)
    const finishTasks = Array.from(finishCol.tasks)
    finishTasks.splice(destination.index, 0, movedTask)

    setColumns({
        ...columns,
        [startCol.id]: { ...startCol, tasks: startTasks },
        [finishCol.id]: { ...finishCol, tasks: finishTasks }
    })
    await supabase.from('project_tasks').update({ column_id: finishCol.id }).eq('id', movedTask.id)
  }

  const addTask = async (colId) => {
    const title = prompt("Task Name:")
    if (!title) return
    const { data } = await supabase.from('project_tasks').insert({
        column_id: colId,
        title: title,
        order_index: columns[colId].tasks.length
    }).select().single()
    if (data) {
        setColumns({ ...columns, [colId]: { ...columns[colId], tasks: [...columns[colId].tasks, data] } })
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-lt-bg text-white pl-72 flex flex-col font-sans">
      <Sidebar />
      
      {/* Header */}
      <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-6">
            <button onClick={() => router.push('/projects')} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-lt-muted hover:text-white">
                <ChevronLeft size={20} />
            </button>
            <div>
                <span className="text-[10px] font-black text-lt-primary uppercase tracking-[0.3em] mb-1 block px-1">Tactical Deployment</span>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase">{project?.title}</h1>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-lt-bg bg-lt-surface flex items-center justify-center text-[10px] font-bold">JD</div>)}
            </div>
            <button className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all text-lt-muted">
                <MoreHorizontal size={20} />
            </button>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 overflow-x-auto p-12 bg-[radial-gradient(circle_at_top_right,rgba(109,40,217,0.05),transparent)]">
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-8 h-full items-start">
                {colOrder.map(colId => {
                    const column = columns[colId]
                    return (
                        <div key={colId} className="w-96 flex-shrink-0 flex flex-col max-h-[85vh]">
                            <div className="px-4 py-3 flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-lt-primary" />
                                    <h3 className="font-black italic tracking-wider text-sm uppercase">{column.title}</h3>
                                </div>
                                <span className="font-mono text-[10px] bg-white/5 px-2 py-1 rounded text-lt-muted font-bold tracking-tighter">{column.tasks.length} UNIT(S)</span>
                            </div>
                            
                            <Droppable droppableId={colId}>
                                {(provided) => (
                                    <div 
                                        {...provided.droppableProps} 
                                        ref={provided.innerRef}
                                        className="flex-1 overflow-y-auto space-y-4 min-h-[150px] px-1 pb-6"
                                    >
                                        {column.tasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <motion.div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{ ...provided.draggableProps.style }}
                                                        className={`glass-card p-5 rounded-2xl group cursor-grab active:cursor-grabbing transition-all duration-300 ${snapshot.isDragging ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-lt-primary/50' : 'hover:border-white/20'}`}
                                                    >
                                                        <div className="flex justify-between items-start mb-3">
                                                            <span className="text-[9px] font-bold text-lt-muted tracking-widest uppercase px-2 py-0.5 bg-white/5 rounded">TASK_ID_{task.id.slice(0,4)}</span>
                                                            <Target size={12} className="text-lt-muted group-hover:text-lt-primary transition-colors" />
                                                        </div>
                                                        <div className="font-bold text-sm text-gray-200 leading-snug">{task.title}</div>
                                                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                                            <div className="w-6 h-6 rounded-full bg-lt-surface border border-white/10" />
                                                            <div className="text-[9px] font-mono text-lt-muted uppercase">Priority_MED</div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => addTask(colId)}
                                className="mt-2 p-4 text-[10px] font-black tracking-[0.2em] text-lt-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl border border-dashed border-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={14} /> ADD COMPONENT
                            </motion.button>
                        </div>
                    )
                })}
            </div>
        </DragDropContext>
      </main>
    </div>
  )
}
