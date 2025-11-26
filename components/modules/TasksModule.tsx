
import React, { useState } from 'react';
import { OpsTask, TaskStatus, TaskPriority, TaskCategory } from '../../types';
import { CheckCircle, Circle, Clock, AlertCircle, Plus, MoreHorizontal, Filter, Search, Trash2, User, GripVertical } from 'lucide-react';
import { useToast } from '../ui/ToastContext';
import NewTaskModal from '../modals/NewTaskModal';
import EditTaskModal from '../modals/EditTaskModal';
import { useData } from '../context/DataContext';

const mockTasks: OpsTask[] = [
    { id: 't1', title: 'Confirmar agenda de amanhã', status: 'todo', priority: 'high', category: 'Admin', assignedTo: 'Fernanda', dueDate: 'Hoje', createdAt: new Date().toISOString(), description: 'Verificar confirmações via WhatsApp e ligar para pendentes.' },
    { id: 't2', title: 'Comprar flores para recepção', status: 'todo', priority: 'medium', category: 'Compras', assignedTo: 'Carla', dueDate: 'Amanhã', createdAt: new Date().toISOString() },
    { id: 't3', title: 'Manutenção Ar Condicionado Sala 02', status: 'in_progress', priority: 'high', category: 'Manutenção', assignedTo: 'Técnico Externo', dueDate: 'Hoje 14h', createdAt: new Date().toISOString(), tags: ['Urgente', 'Infra'] },
    { id: 't4', title: 'Ligar para lista de espera (Laser)', status: 'in_progress', priority: 'medium', category: 'Contato', assignedTo: 'Fernanda', createdAt: new Date().toISOString() },
    { id: 't5', title: 'Limpeza profunda Sala 03', status: 'done', priority: 'medium', category: 'Limpeza', assignedTo: 'Equipe Limpeza', dueDate: 'Ontem', createdAt: new Date().toISOString() },
    { id: 't6', title: 'Atualizar vitrine de produtos', status: 'done', priority: 'low', category: 'Admin', assignedTo: 'Carla', createdAt: new Date().toISOString() },
];

const TasksModule: React.FC = () => {
  const { taskCategories } = useData();
  const [tasks, setTasks] = useState<OpsTask[]>(mockTasks);
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  
  // Modals State
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<OpsTask | null>(null);
  
  const { addToast } = useToast();

  const getPriorityColor = (priority: TaskPriority) => {
      switch(priority) {
          case 'high': return 'bg-red-100 text-red-700 border-red-200';
          case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      }
  };

  const getCategoryLabel = (cat: TaskCategory) => {
      return cat;
  };

  // DnD Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
      setDraggingId(id);
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
      e.preventDefault();
      if (draggingId) {
          const task = tasks.find(t => t.id === draggingId);
          if (task && task.status !== status) {
              setTasks(tasks.map(t => t.id === draggingId ? { ...t, status } : t));
              
              if (status === 'done') {
                  addToast('Tarefa concluída! Ótimo trabalho.', 'success');
              } else if (status === 'in_progress') {
                  addToast('Tarefa movida para Em Andamento.', 'info');
              } else {
                  addToast('Tarefa movida para A Fazer.', 'warning');
              }
          }
          setDraggingId(null);
      }
  };

  const handleDelete = (taskId: string) => {
      setTasks(tasks.filter(t => t.id !== taskId));
      addToast('Tarefa removida.', 'info');
  };

  const handleAddTask = () => {
      setIsNewTaskModalOpen(true);
  };

  const handleSaveTask = (newTask: OpsTask) => {
      setTasks([newTask, ...tasks]);
      addToast('Nova tarefa criada.', 'success');
  };

  const handleTaskClick = (task: OpsTask) => {
      setSelectedTask(task);
      setIsEditTaskModalOpen(true);
  };

  const handleUpdateTask = (updatedTask: OpsTask) => {
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      addToast('Tarefa atualizada com sucesso.', 'success');
      setIsEditTaskModalOpen(false);
      setSelectedTask(null);
  };

  const filteredTasks = filterCategory === 'all' ? tasks : tasks.filter(t => t.category === filterCategory);

  const columns: { id: TaskStatus, label: string, icon: React.ReactNode, color: string }[] = [
      { id: 'todo', label: 'A Fazer', icon: <Circle size={16} />, color: 'border-gray-300' },
      { id: 'in_progress', label: 'Em Andamento', icon: <Clock size={16} />, color: 'border-blue-400' },
      { id: 'done', label: 'Concluído', icon: <CheckCircle size={16} />, color: 'border-green-500' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-diva-light/30 shadow-sm shrink-0 gap-4">
            <div>
                <h2 className="text-xl font-serif font-bold text-diva-dark">Central de Operações</h2>
                <p className="text-sm text-gray-500">Gerencie as tarefas do dia a dia da clínica.</p>
            </div>
            
            <div className="flex gap-3 items-center">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2">
                    <Filter size={14} className="text-gray-400 mr-2" />
                    <select 
                        className="bg-transparent py-2 text-sm text-gray-600 outline-none cursor-pointer"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as any)}
                    >
                        <option value="all">Todas Categorias</option>
                        {taskCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <button 
                    onClick={handleAddTask}
                    className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark shadow-md transition-colors"
                >
                    <Plus size={16} className="mr-2" /> Nova Tarefa
                </button>
            </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto pb-2">
            <div className="flex gap-6 h-full min-w-[1000px]">
                {columns.map(col => (
                    <div 
                        key={col.id} 
                        className={`flex-1 flex flex-col bg-gray-50/50 rounded-xl border-2 transition-colors backdrop-blur-sm
                            ${draggingId ? 'border-dashed border-diva-primary/20 bg-diva-primary/5' : 'border-gray-200/60'}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                    >
                        {/* Column Header */}
                        <div className={`p-4 border-b-2 ${col.color} flex justify-between items-center bg-white/50 rounded-t-xl`}>
                            <div className="flex items-center gap-2 font-bold text-gray-700">
                                {col.icon}
                                {col.label}
                            </div>
                            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                {filteredTasks.filter(t => t.status === col.id).length}
                            </span>
                        </div>

                        {/* Task List */}
                        <div className="p-4 flex-1 overflow-y-auto space-y-3">
                            {filteredTasks.filter(t => t.status === col.id).map(task => (
                                <div 
                                    key={task.id} 
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    onClick={() => handleTaskClick(task)}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all group relative cursor-pointer hover:border-diva-primary/50"
                                >
                                    
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                                        </span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }} className="p-1 text-gray-400 hover:text-red-500 bg-gray-50 rounded" title="Excluir"><Trash2 size={12}/></button>
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-diva-dark text-sm mb-2 flex items-start gap-2">
                                        <GripVertical size={14} className="text-gray-300 mt-0.5 shrink-0" />
                                        {task.title}
                                    </h4>
                                    
                                    <div className="flex flex-wrap items-center gap-2 mb-3 pl-5">
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                                            {getCategoryLabel(task.category)}
                                        </span>
                                        {task.dueDate && (
                                            <span className={`text-[10px] flex items-center font-medium ${task.priority === 'high' ? 'text-red-500' : 'text-gray-400'}`}>
                                                <Clock size={10} className="mr-1" /> {task.dueDate}
                                            </span>
                                        )}
                                        {task.tags && task.tags.map(tag => (
                                            <span key={tag} className="text-[9px] bg-diva-light/10 text-diva-dark px-1.5 py-0.5 rounded border border-diva-light/20">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-50 pt-2 flex justify-between items-center pl-5">
                                        <div className="flex items-center gap-1">
                                            {task.assignedTo ? (
                                                <>
                                                    <div className="w-5 h-5 rounded-full bg-diva-primary text-white flex items-center justify-center text-[9px] font-bold">
                                                        {task.assignedTo.charAt(0)}
                                                    </div>
                                                    <span className="text-xs text-gray-500">{task.assignedTo}</span>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic flex items-center"><User size={10} className="mr-1"/> Não atribuído</span>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            ))}
                            
                            {/* Quick Add Placeholder */}
                            {col.id === 'todo' && (
                                <button 
                                    onClick={handleAddTask}
                                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-xs font-bold hover:border-diva-primary hover:text-diva-primary transition-colors flex items-center justify-center"
                                >
                                    <Plus size={14} className="mr-1" /> Adicionar Item
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <NewTaskModal 
            isOpen={isNewTaskModalOpen} 
            onClose={() => setIsNewTaskModalOpen(false)} 
            onSave={handleSaveTask} 
        />

        {selectedTask && (
            <EditTaskModal
                isOpen={isEditTaskModalOpen}
                onClose={() => setIsEditTaskModalOpen(false)}
                task={selectedTask}
                onSave={handleUpdateTask}
                onDelete={handleDelete}
            />
        )}
    </div>
  );
};

export default TasksModule;
