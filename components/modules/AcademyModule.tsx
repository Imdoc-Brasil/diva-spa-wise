
import React, { useState } from 'react';
import { Course, CourseCategory, Lesson } from '../../types';
import { PlayCircle, BookOpen, CheckCircle, Search, Award, Clock, ChevronRight, Lock, Plus, Users, Shield, Zap, X } from 'lucide-react';
import { useUnitData } from '../hooks/useUnitData';
import NewCourseModal from '../modals/NewCourseModal';
import QuizModal from '../modals/QuizModal';
import { generateCertificate } from '../../utils/generateCertificate';

const AcademyModule: React.FC = () => {
    const { courses, updateCourse, user } = useUnitData();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [activeCategory, setActiveCategory] = useState<CourseCategory | 'all'>('all');
    const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

    const handleLessonClick = (lesson: Lesson) => {
        if (lesson.type === 'quiz') {
            setActiveLesson(lesson);
            setIsQuizOpen(true);
        }
        // Future: Handle video play logic
    };

    const handleQuizComplete = (success: boolean) => {
        setIsQuizOpen(false);
        if (success && selectedCourse && activeLesson) {
            const updatedLessons = selectedCourse.lessons.map(l =>
                l.id === activeLesson.id ? { ...l, completed: true } : l
            );
            const completedCount = updatedLessons.filter(l => l.completed).length;

            updateCourse(selectedCourse.id, {
                lessons: updatedLessons,
                completedLessons: completedCount
            });

            // Update local view
            setSelectedCourse({
                ...selectedCourse,
                lessons: updatedLessons,
                completedLessons: completedCount
            });
        }
    };

    const filteredCourses = activeCategory === 'all'
        ? courses
        : courses.filter(c => c.category === activeCategory);

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6">

            {/* Left: Course List */}
            <div className={`flex flex-col gap-6 transition-all duration-300 ${selectedCourse ? 'w-1/3' : 'w-full'}`}>

                {/* Header / Filter */}
                <div className="flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-diva-dark">Diva Academy</h2>
                        <p className="text-xs text-gray-500">Capacitação contínua para excelência.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsNewCourseModalOpen(true)}
                            className="bg-diva-dark text-white px-3 py-2 rounded-lg flex items-center text-xs font-bold shadow hover:bg-diva-primary transition-colors"
                        >
                            <Plus size={14} className="mr-1" /> Novo Curso
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
                    <button onClick={() => setActiveCategory('all')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors whitespace-nowrap ${activeCategory === 'all' ? 'bg-diva-primary/10 text-diva-primary border border-diva-primary/20' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>Todos</button>
                    <button onClick={() => setActiveCategory('technical')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors whitespace-nowrap flex items-center ${activeCategory === 'technical' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        <Zap size={12} className="mr-1.5" /> Técnicos
                    </button>
                    <button onClick={() => setActiveCategory('sales')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors whitespace-nowrap flex items-center ${activeCategory === 'sales' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        <Users size={12} className="mr-1.5" /> Vendas
                    </button>
                    <button onClick={() => setActiveCategory('service')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors whitespace-nowrap flex items-center ${activeCategory === 'service' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        <Shield size={12} className="mr-1.5" /> Protocolos
                    </button>
                    <button onClick={() => setActiveCategory('onboarding')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors whitespace-nowrap flex items-center ${activeCategory === 'onboarding' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        <BookOpen size={12} className="mr-1.5" /> Onboarding
                    </button>
                </div>

                {/* Grid */}
                <div className={`grid gap-6 overflow-y-auto pr-2 pb-4 ${selectedCourse ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                    {filteredCourses.map(course => {
                        const progress = course.totalLessons > 0 ? Math.round((course.completedLessons / course.totalLessons) * 100) : 0;
                        const isSelected = selectedCourse?.id === course.id;

                        return (
                            <div
                                key={course.id}
                                onClick={() => setSelectedCourse(course)}
                                className={`bg-white rounded-xl border overflow-hidden cursor-pointer transition-all group duration-300
                                ${isSelected ? 'border-diva-primary ring-2 ring-diva-primary/20 shadow-lg scale-[1.02]' : 'border-diva-light/30 shadow-sm hover:shadow-md hover:border-diva-light'}`}
                            >
                                {/* Thumbnail */}
                                <div className="h-40 bg-gray-200 relative overflow-hidden">
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className={`absolute inset-0 bg-black/30 transition-colors flex items-center justify-center ${isSelected ? 'bg-black/50' : 'group-hover:bg-black/20'}`}>
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform shadow-lg border border-white/30">
                                            <PlayCircle size={32} fill="currentColor" className="text-white/90" />
                                        </div>
                                    </div>
                                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 shadow-sm">
                                        {course.duration}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <div className="flex gap-2 mb-2 flex-wrap">
                                        {course.tags.map(tag => (
                                            <span key={tag} className="text-[9px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100 font-bold uppercase tracking-wider">{tag}</span>
                                        ))}
                                    </div>
                                    <h3 className={`font-bold text-diva-dark mb-1 leading-tight ${selectedCourse ? 'text-sm' : 'text-base'}`}>{course.title}</h3>
                                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{course.description}</p>

                                    {/* Progress Bar */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                                            <span>{progress}% Concluído</span>
                                            <span>{course.completedLessons}/{course.totalLessons} Aulas</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-diva-accent h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filteredCourses.length === 0 && (
                        <div className="col-span-full py-10 flex flex-col items-center justify-center text-gray-300">
                            <BookOpen size={48} className="mb-2 opacity-20" />
                            <p className="text-sm">Nenhum curso encontrado nesta categoria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Course Detail (Player) */}
            {selectedCourse && (
                <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
                    {/* Player Area */}
                    <div className="aspect-video bg-black relative group">
                        <img src={selectedCourse.thumbnail} className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-20 h-20 bg-diva-primary hover:bg-diva-accent text-white rounded-full flex items-center justify-center transition-all shadow-2xl scale-90 hover:scale-100 ring-4 ring-white/10">
                                <PlayCircle size={40} className="ml-1" fill="currentColor" />
                            </button>
                        </div>
                        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-bold bg-diva-primary px-2 py-1 rounded mb-2 inline-block shadow-sm">
                                        Aula 1 de {selectedCourse.totalLessons}
                                    </span>
                                    <h2 className="text-2xl font-bold shadow-black drop-shadow-md text-white">{selectedCourse.title}</h2>
                                </div>
                                <button onClick={() => setSelectedCourse(null)} className="text-white/70 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="border-b border-gray-100 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-6 text-xs text-gray-500">
                                    <span className="flex items-center bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                        <Award size={14} className="mr-1.5 text-diva-accent" /> Instrutor: <strong>{selectedCourse.instructor}</strong>
                                    </span>
                                    <span className="flex items-center bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                        <Clock size={14} className="mr-1.5 text-gray-400" /> Duração: <strong>{selectedCourse.duration}</strong>
                                    </span>
                                    <span className="flex items-center bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                        <CheckCircle size={14} className="mr-1.5 text-green-500" /> Certificado Incluso
                                    </span>
                                </div>
                                {selectedCourse.totalLessons > 0 && selectedCourse.completedLessons === selectedCourse.totalLessons && (
                                    <button
                                        onClick={() => generateCertificate(selectedCourse, user?.displayName || 'Colaboradora Diva')}
                                        className="bg-diva-accent text-white px-4 py-2 rounded-lg font-bold flex items-center shadow-md hover:bg-yellow-600 hover:scale-105 transition-all text-xs animate-in bounce-in"
                                    >
                                        <Award size={16} className="mr-2" /> Emitir Certificado
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{selectedCourse.description}</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50/50">
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Conteúdo do Curso</h3>
                            {selectedCourse.lessons.length > 0 ? selectedCourse.lessons.map((lesson, idx) => (
                                <div
                                    key={lesson.id}
                                    onClick={() => handleLessonClick(lesson)}
                                    className={`p-4 rounded-xl flex items-center justify-between border transition-all cursor-pointer group
                                    ${lesson.completed
                                            ? 'bg-green-50/50 border-green-100'
                                            : 'bg-white border-gray-200 hover:border-diva-primary hover:shadow-md'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 transition-colors
                                        ${lesson.completed
                                                ? 'bg-green-500 text-white border-green-500'
                                                : 'bg-gray-100 text-gray-400 border-gray-200 group-hover:bg-diva-primary group-hover:text-white group-hover:border-diva-primary'}`}>
                                            {lesson.completed ? <CheckCircle size={16} /> : idx + 1}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${lesson.completed ? 'text-green-800' : 'text-gray-700 group-hover:text-diva-dark'}`}>{lesson.title}</p>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-0.5">
                                                <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded">
                                                    {lesson.type === 'video' && <PlayCircle size={12} />}
                                                    {lesson.type === 'text' && <BookOpen size={12} />}
                                                    {lesson.type === 'quiz' && <Award size={12} />}
                                                    <span className="capitalize">{lesson.type}</span>
                                                </span>
                                                <span>{lesson.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-gray-300 group-hover:text-diva-primary transition-colors">
                                        {lesson.completed ? <span className="text-xs font-bold text-green-600">Concluído</span> : <PlayCircle size={20} />}
                                    </div>
                                </div>
                            )) : (
                                <div className="p-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                    <Lock size={32} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm font-medium">Conteúdo em breve.</p>
                                    <p className="text-xs mt-1">Este curso ainda não possui aulas cadastradas.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-white">
                            <button className="w-full bg-diva-dark text-white py-3 rounded-lg font-bold hover:bg-diva-primary transition-colors flex items-center justify-center shadow-lg shadow-diva-dark/20">
                                Continuar Assistindo <ChevronRight size={18} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <NewCourseModal
                isOpen={isNewCourseModalOpen}
                onClose={() => setIsNewCourseModalOpen(false)}
            />

            {activeLesson && (
                <QuizModal
                    isOpen={isQuizOpen}
                    onClose={() => setIsQuizOpen(false)}
                    lesson={activeLesson}
                    onComplete={handleQuizComplete}
                />
            )}
        </div>
    );
};

export default AcademyModule;
