import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import { supabase } from '../../lib/supabaseClient'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, MoreHorizontal } from 'lucide-react'

export default function ProjectBoard() {
  const router = useRouter()
  const { id } = router.query
  const [project, setProject] = useState(null)
  const [columns, setColumns] = useState({}) // { colId: [tasks] }
  const [colOrder, setColOrder] = useState([]) // [colId, colId]
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchBoard()
  }, [id])

  const fetchBoard = async () => {
    // 1. Get Project
    const { data: proj } = await supabase.from('projects').select('*').eq('id', id).single()
    setProject(proj)

    // 2. Get Columns
    const { data: cols } = await supabase.from('project_columns').select('*').eq('project_id', id).order('order_index')
    
    // 3. Get Tasks
    const { data: tasks } = await supabase.from('project_tasks').select('*').in('column_id', cols.map(c => c.id)).order('order_index')

    // Structure Data
    const colMap = {}
    cols.forEach(c => {
        colMap[c.id] = { ...c, tasks: tasks.filter(t => t.column_id === c.id) }
    })
    
    setColumns(colMap)
    setColOrder(cols.map(c => c.id))
    setLoading(false)
  }

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const startCol = columns[source.droppableId]
    const finishCol = columns[destination.droppableId]

    // Moving within same column
    if (startCol === finishCol) {
        const newTasks = Array.from(startCol.tasks)
        const [movedTask] = newTasks.splice(source.index, 1)
        newTasks.splice(destination.index, 0, movedTask)

        const newCol = { ...startCol, tasks: newTasks }
        setColumns({ ...columns, [newCol.id]: newCol })
        
        // Save to DB (Update order_index for all affected)
        // Optimization: In prod, batch update. Here simple loop.
        newTasks.forEach(async (t, i) => {
            await supabase.from('project_tasks').update({ order_index: i }).eq('id', t.id)
        })
        return
    }

    // Moving to different column
    const startTasks = Array.from(startCol.tasks)
    const [movedTask] = startTasks.splice(source.index, 1)
    const finishTasks = Array.from(finishCol.tasks)
    finishTasks.splice(destination.index, 0, movedTask)

    setColumns({
        ...columns,
        [startCol.id]: { ...startCol, tasks: startTasks },
        [finishCol.id]: { ...finishCol, tasks: finishTasks }
    })

    // Save DB
    await supabase.from('project_tasks').update({ column_id: finishCol.id }).eq('id', movedTask.id)
  }

  const addTask = async (colId) => {
    const title = prompt("Task Name:")
    if (!title) return

    const { data } = await supabase.from('project_tasks').insert({
        column_id: colId,
        title: title,
        description: '',
        order_index: columns[colId].tasks.length
    }).select().single()

    if (data) {
        const newCol = { ...columns[colId], tasks: [...columns[colId].tasks, data] }
        setColumns({ ...columns, [colId]: newCol })
    }
  }

  if (loading) return <div className="min-h-screen bg-lt-bg text-white pl-64 p-8">Loading Board...</div>

  return (
    <div className="min-h-screen bg-lt-bg text-white pl-64 flex flex-col">
      <Sidebar />
      
      {/* Header */}
      <header className="h-16 border-b border-lt-border flex items-center px-8 bg-lt-bg sticky top-0 z-10">
        <h1 className="font-bold text-lg">{project?.title}</h1>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 overflow-x-auto p-8">
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-full items-start">
                {colOrder.map(colId => {
                    const column = columns[colId]
                    return (
                        <div key={colId} className="w-80 flex-shrink-0 bg-lt-card border border-lt-border rounded-xl flex flex-col max-h-[80vh]">
                            <div className="p-4 font-bold flex justify-between items-center border-b border-lt-border">
                                {column.title}
                                <span className="text-xs bg-lt-surface px-2 py-1 rounded text-lt-muted">{column.tasks.length}</span>
                            </div>
                            
                            <Droppable droppableId={colId}>
                                {(provided) => (
                                    <div 
                                        {...provided.droppableProps} 
                                        ref={provided.innerRef}
                                        className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[100px]"
                                    >
                                        {column.tasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-lt-surface border border-lt-border p-3 rounded-lg hover:border-lt-primary/50 transition-colors shadow-sm"
                                                    >
                                                        <div className="font-medium text-sm mb-1">{task.title}</div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                            <button 
                                onClick={() => addTask(colId)}
                                className="p-3 text-sm text-lt-muted hover:text-white hover:bg-lt-surface transition-colors border-t border-lt-border flex items-center gap-2"
                            >
                                <Plus size={16} /> Add Card
                            </button>
                        </div>
                    )
                })}
            </div>
        </DragDropContext>
      </main>
    </div>
  )
}
