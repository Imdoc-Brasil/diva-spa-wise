
import React, { useState, useEffect } from 'react';
import { X, Save, CheckSquare, Calendar, User, Tag, AlertCircle, Users, MessageSquare, Trash2 } from 'lucide-react';
import { OpsTask, TaskPriority, TaskStatus } from '../../types';
import { useData } from '../context/DataContext';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: OpsTask;
  onSave: (updatedTask: OpsTask) => void;
  onDelete: (taskId: string) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task, onSave, onDelete }) => {
  const { staff, taskCategories } = useData();
  const [formData, setFormData] = useState<OpsTask>(task);
  const [newTag, setNewTag] = useState('');
  const [newFollower, setNewFollower] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData(task);
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
      if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
          onDelete(formData.id);
          onClose();
      }
  };

  const handleAddTag = () => {
      if (newTag && !formData.tags?.includes(newTag)) {
          setFormData({
              ...formData,
              tags: [...(formData.tags || []), newTag]
          });
          setNewTag('');
      }
  };

  const removeTag = (tagToRemove: string) => {
      setFormData({
          ...formData,
          tags: formData.tags?.filter(t => t !== tagToRemove)
      });
  };

  const handleAddFollower = () => {
      if (newFollower && !formData.followers?.includes(newFollower)) {
          setFormData({
              ...formData,
              followers: [...(formData.followers || []), newFollower]
          });
          setNewFollower('');
      }
  };

  const removeFollower = (followerToRemove: string) => {
      setFormData({
          ...formData,
          followers: formData.followers?.filter(f => f !== followerToRemove)
      });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-lg flex items-center text-diva-dark">
            <CheckSquare size={20} className="mr-2 text-diva-primary" /> Detalhes da Tarefa
          </h3>
          <div className="flex gap-2">
              <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors" title="Excluir Tarefa">
                <Trash2 size={18} />
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-diva-dark p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Title & Status */}
          <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all text-lg font-bold text-diva-dark bg-white"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="w-40">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                <select 
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-sm font-medium text-gray-900"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as TaskStatus})}
                >
                    <option value="todo">A Fazer</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="done">Concluído</option>
                </select>
              </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">
                <MessageSquare size={14}/> Observações / Descrição
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all min-h-[100px] text-sm text-gray-900 bg-white resize-y"
              placeholder="Adicione detalhes, checklist ou observações sobre esta tarefa..."
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Left Column */}
             <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prioridade</label>
                    <div className="relative">
                        <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <select 
                            className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-sm text-gray-900"
                            value={formData.priority}
                            onChange={(e) => setFormData({...formData, priority: e.target.value as TaskPriority})}
                        >
                            <option value="low">Baixa</option>
                            <option value="medium">Média</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <select 
                            className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-sm text-gray-900"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            {taskCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Etiquetas (Tags)</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags?.map(tag => (
                            <span key={tag} className="bg-diva-light/20 text-diva-dark text-xs px-2 py-1 rounded flex items-center gap-1">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={10}/></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="+ Nova Tag" 
                            className="flex-1 p-2 border border-gray-300 rounded text-xs outline-none focus:border-diva-primary bg-white text-gray-900"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        />
                        <button type="button" onClick={handleAddTag} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 rounded text-xs font-bold">Add</button>
                    </div>
                 </div>
             </div>

             {/* Right Column */}
             <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Responsável</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <select 
                            className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-sm text-gray-900"
                            value={formData.assignedTo}
                            onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                        >
                            <option value="">Sem atribuição</option>
                            {staff.map(s => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prazo</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input 
                            type="date" 
                            className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary text-sm text-gray-900 bg-white"
                            value={formData.dueDate || ''}
                            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">
                        <Users size={14}/> Interessados / Acompanhando
                    </label>
                    <div className="space-y-1 mb-2 max-h-24 overflow-y-auto">
                        {formData.followers?.map(follower => (
                            <div key={follower} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded border border-gray-100">
                                <span>{follower}</span>
                                <button type="button" onClick={() => removeFollower(follower)} className="text-gray-400 hover:text-red-500"><X size={12}/></button>
                            </div>
                        ))}
                        {(!formData.followers || formData.followers.length === 0) && <p className="text-xs text-gray-400 italic">Ninguém acompanhando.</p>}
                    </div>
                    <div className="flex gap-2">
                        <select 
                            className="flex-1 p-2 border border-gray-300 rounded text-xs outline-none focus:border-diva-primary bg-white text-gray-900"
                            value={newFollower}
                            onChange={(e) => setNewFollower(e.target.value)}
                        >
                            <option value="">Selecionar...</option>
                            {staff.map(s => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                        <button type="button" onClick={handleAddFollower} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 rounded text-xs font-bold">Add</button>
                    </div>
                 </div>
             </div>
          </div>

        </form>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              className="px-8 py-2 bg-diva-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-diva-dark transition-all flex items-center"
            >
              <Save size={16} className="mr-2" /> Salvar Alterações
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
