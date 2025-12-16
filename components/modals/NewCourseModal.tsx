
import React, { useState } from 'react';
import { X, Save, BookOpen, Plus, Trash2 } from 'lucide-react';
import { useUnitData } from '../hooks/useUnitData';
import { Course, Lesson, CourseCategory } from '../../types';

interface NewCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewCourseModal: React.FC<NewCourseModalProps> = ({ isOpen, onClose }) => {
    const { addCourse } = useUnitData();
    const [step, setStep] = useState(1); // 1: Info, 2: Lessons

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'technical' as CourseCategory,
        instructor: '',
        duration: '',
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070',
        tags: ''
    });

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [newLesson, setNewLesson] = useState<{ title: string, duration: string, type: 'video' | 'text' | 'quiz' }>({
        title: '',
        duration: '',
        type: 'video'
    });

    if (!isOpen) return null;

    const handleAddLesson = () => {
        if (!newLesson.title) return;
        const lesson: Lesson = {
            id: `l_${Date.now()}`,
            title: newLesson.title,
            duration: newLesson.duration || '10 min',
            type: newLesson.type,
            completed: false
        };
        setLessons([...lessons, lesson]);
        setNewLesson({ title: '', duration: '', type: 'video' });
    };

    const handleRemoveLesson = (id: string) => {
        setLessons(lessons.filter(l => l.id !== id));
    };

    const handleSave = () => {
        if (!formData.title) return;

        const course: Course = {
            id: `c_${Date.now()}`,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            instructor: formData.instructor || 'Staff',
            duration: formData.duration || '1h',
            thumbnail: formData.thumbnail,
            totalLessons: lessons.length,
            completedLessons: 0,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            lessons: lessons
        };

        addCourse(course);
        onClose();
        // Reset
        setFormData({ title: '', description: '', category: 'technical', instructor: '', duration: '', thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070', tags: '' });
        setLessons([]);
        setStep(1);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-dark text-white shrink-0">
                    <h3 className="font-bold text-lg flex items-center font-serif">
                        <BookOpen size={20} className="mr-2" /> Novo Curso
                    </h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Tabs / Steps */}
                    <div className="flex gap-4 border-b border-gray-100 pb-2 mb-4">
                        <button
                            onClick={() => setStep(1)}
                            className={`pb-2 text-sm font-bold ${step === 1 ? 'text-diva-primary border-b-2 border-diva-primary' : 'text-gray-400'}`}
                        >
                            1. Informações Básicas
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            className={`pb-2 text-sm font-bold ${step === 2 ? 'text-diva-primary border-b-2 border-diva-primary' : 'text-gray-400'}`}
                        >
                            2. Grade Curricular ({lessons.length} aulas)
                        </button>
                    </div>

                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título do Curso *</label>
                                <input
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary"
                                    placeholder="Ex: Protocolo de Limpeza de Pele"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                                <textarea
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary h-24"
                                    placeholder="Breve resumo do conteúdo..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as CourseCategory })}
                                    >
                                        <option value="onboarding">Onboarding</option>
                                        <option value="technical">Técnico/Protocolos</option>
                                        <option value="sales">Vendas</option>
                                        <option value="service">Atendimento</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Instrutor</label>
                                    <input
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary"
                                        placeholder="Ex: Dra. Julia"
                                        value={formData.instructor}
                                        onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duração Total</label>
                                    <input
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary"
                                        placeholder="Ex: 2h 30m"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tags (separar por vírgula)</label>
                                    <input
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary"
                                        placeholder="Ex: Laser, Iniciante, Obrigatório"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                            {/* Lesson List */}
                            <div className="space-y-2">
                                {lessons.map((lesson, idx) => (
                                    <div key={lesson.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-diva-dark text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                            <div>
                                                <p className="font-bold text-sm text-gray-800">{lesson.title}</p>
                                                <p className="text-xs text-gray-500 capitalize">{lesson.type} • {lesson.duration}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveLesson(lesson.id)} className="text-red-400 hover:text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {lessons.length === 0 && (
                                    <p className="text-center text-gray-400 text-sm py-4 italic">Nenhuma aula adicionada.</p>
                                )}
                            </div>

                            {/* Add Lesson Form */}
                            <div className="bg-diva-light/10 p-4 rounded-xl border border-diva-light/20">
                                <h4 className="font-bold text-sm text-diva-dark mb-3 flex items-center">
                                    <Plus size={16} className="mr-1" /> Adicionar Aula
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                    <input
                                        className="p-2 text-sm border border-gray-200 rounded-lg md:col-span-2"
                                        placeholder="Título da Aula"
                                        value={newLesson.title}
                                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                    />
                                    <select
                                        className="p-2 text-sm border border-gray-200 rounded-lg bg-white"
                                        value={newLesson.type}
                                        onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value as any })}
                                    >
                                        <option value="video">Vídeo</option>
                                        <option value="text">Texto/PDF</option>
                                        <option value="quiz">Quiz</option>
                                    </select>
                                    <input
                                        className="p-2 text-sm border border-gray-200 rounded-lg"
                                        placeholder="Duração (ex: 10 min)"
                                        value={newLesson.duration}
                                        onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={handleAddLesson}
                                    className="w-full py-2 bg-white border border-diva-primary text-diva-primary rounded-lg text-sm font-bold hover:bg-diva-primary hover:text-white transition-colors"
                                >
                                    Adicionar à Grade
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                <div className="p-4 bg-gray-50 flex justify-between border-t border-gray-100 shrink-0">
                    <button
                        onClick={step === 1 ? onClose : () => setStep(1)}
                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {step === 1 ? 'Cancelar' : 'Voltar'}
                    </button>
                    {step === 1 ? (
                        <button
                            onClick={() => setStep(2)}
                            className="px-6 py-2 bg-diva-dark text-white rounded-lg text-sm font-bold hover:bg-diva-primary transition-colors"
                        >
                            Próximo
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-500 transition-colors flex items-center"
                        >
                            <Save size={16} className="mr-2" /> Salvar Curso
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewCourseModal;
