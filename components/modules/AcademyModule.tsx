
import React, { useState } from 'react';
import { Course, CourseCategory, Lesson } from '../../types';
import { PlayCircle, BookOpen, CheckCircle, Search, Award, Clock, ChevronRight, Lock } from 'lucide-react';

const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'Onboarding: Cultura Diva Spa',
    description: 'Boas-vindas e introdução aos valores, missão e padrão de atendimento de excelência da marca.',
    category: 'onboarding',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    instructor: 'Ana (CEO)',
    totalLessons: 5,
    completedLessons: 5,
    duration: '1h 30m',
    tags: ['Obrigatório', 'Cultura'],
    lessons: [
        { id: 'l1', title: 'Boas Vindas da CEO', duration: '10:00', type: 'video', completed: true },
        { id: 'l2', title: 'Nossa História', duration: '15:00', type: 'video', completed: true },
        { id: 'l3', title: 'Manual de Conduta', duration: '20 min', type: 'text', completed: true },
        { id: 'l4', title: 'Tour pela Clínica', duration: '20:00', type: 'video', completed: true },
        { id: 'l5', title: 'Quiz de Cultura', duration: '10 min', type: 'quiz', completed: true },
    ]
  },
  {
    id: 'c2',
    title: 'Protocolo Avançado: Laser Alexandrite',
    description: 'Domine a técnica de aplicação do laser Alexandrite para fototipos I a III, garantindo segurança e eficácia.',
    category: 'technical',
    thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop',
    instructor: 'Dra. Julia Martins',
    totalLessons: 8,
    completedLessons: 2,
    duration: '3h 15m',
    tags: ['Técnico', 'Laser'],
    lessons: [
        { id: 'l21', title: 'Física do Laser', duration: '25:00', type: 'video', completed: true },
        { id: 'l22', title: 'Avaliação de Fototipo', duration: '20:00', type: 'video', completed: true },
        { id: 'l23', title: 'Parametrização Segura', duration: '30:00', type: 'video', completed: false },
        { id: 'l24', title: 'Aplicação Prática (Pernas)', duration: '45:00', type: 'video', completed: false },
    ]
  },
  {
    id: 'c3',
    title: 'Vendas Consultivas & Upsell',
    description: 'Técnicas de negociação para vender pacotes de alto valor e home care durante o atendimento.',
    category: 'sales',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop',
    instructor: 'Carlos (Diretor Comercial)',
    totalLessons: 6,
    completedLessons: 0,
    duration: '2h 00m',
    tags: ['Vendas', 'Performance'],
    lessons: []
  },
  {
    id: 'c4',
    title: 'Biossegurança e Higienização',
    description: 'Protocolos rigorosos de limpeza de sala e esterilização de materiais.',
    category: 'service',
    thumbnail: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=2066&auto=format&fit=crop',
    instructor: 'Enf. Mariana',
    totalLessons: 4,
    completedLessons: 0,
    duration: '1h 15m',
    tags: ['Segurança', 'Anvisa'],
    lessons: []
  }
];

const AcademyModule: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeCategory, setActiveCategory] = useState<CourseCategory | 'all'>('all');

  const filteredCourses = activeCategory === 'all' 
    ? mockCourses 
    : mockCourses.filter(c => c.category === activeCategory);

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
        
        {/* Left: Course List */}
        <div className={`flex flex-col gap-6 transition-all duration-300 ${selectedCourse ? 'w-1/3' : 'w-full'}`}>
            
            {/* Header / Filter */}
            <div className="flex justify-between items-center shrink-0">
                <h2 className="text-xl font-serif font-bold text-diva-dark">Diva Academy</h2>
                <div className="flex gap-2">
                    <button onClick={() => setActiveCategory('all')} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${activeCategory === 'all' ? 'bg-diva-dark text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>Todos</button>
                    <button onClick={() => setActiveCategory('technical')} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${activeCategory === 'technical' ? 'bg-diva-dark text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>Técnicos</button>
                    <button onClick={() => setActiveCategory('sales')} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${activeCategory === 'sales' ? 'bg-diva-dark text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>Vendas</button>
                </div>
            </div>

            {/* Grid */}
            <div className={`grid gap-6 overflow-y-auto pr-2 pb-4 ${selectedCourse ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {filteredCourses.map(course => {
                    const progress = Math.round((course.completedLessons / course.totalLessons) * 100);
                    const isSelected = selectedCourse?.id === course.id;

                    return (
                        <div 
                            key={course.id}
                            onClick={() => setSelectedCourse(course)}
                            className={`bg-white rounded-xl border overflow-hidden cursor-pointer transition-all group
                                ${isSelected ? 'border-diva-primary ring-2 ring-diva-primary/20 shadow-lg' : 'border-diva-light/30 shadow-sm hover:shadow-md hover:border-diva-light'}`}
                        >
                            {/* Thumbnail */}
                            <div className="h-40 bg-gray-200 relative">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                                        <PlayCircle size={32} />
                                    </div>
                                </div>
                                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded">
                                    {course.duration}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex gap-2 mb-2">
                                    {course.tags.map(tag => (
                                        <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase">{tag}</span>
                                    ))}
                                </div>
                                <h3 className="font-bold text-diva-dark mb-1 leading-tight">{course.title}</h3>
                                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                                
                                {/* Progress Bar */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                                        <span>{progress}% Concluído</span>
                                        <span>{course.completedLessons}/{course.totalLessons} Aulas</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-diva-accent h-full rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Right: Course Detail (Player) */}
        {selectedCourse && (
            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
                {/* Player Area */}
                <div className="aspect-video bg-black relative group">
                    <img src={selectedCourse.thumbnail} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-16 h-16 bg-diva-primary hover:bg-diva-accent text-white rounded-full flex items-center justify-center transition-colors shadow-2xl">
                            <PlayCircle size={36} className="ml-1" />
                        </button>
                    </div>
                    <div className="absolute top-4 left-4 text-white">
                        <span className="text-xs font-bold bg-diva-primary px-2 py-1 rounded mb-1 inline-block">Aula 3 de {selectedCourse.totalLessons}</span>
                        <h2 className="text-xl font-bold shadow-black drop-shadow-md">Parametrização Segura</h2>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-gray-100 p-4">
                         <h2 className="text-xl font-serif font-bold text-diva-dark mb-1">{selectedCourse.title}</h2>
                         <p className="text-sm text-gray-500">{selectedCourse.description}</p>
                         <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                             <span className="flex items-center"><Award size={14} className="mr-1 text-diva-accent"/> Instrutor: {selectedCourse.instructor}</span>
                             <span className="flex items-center"><Clock size={14} className="mr-1"/> Duração Total: {selectedCourse.duration}</span>
                         </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Conteúdo do Curso</h3>
                        {selectedCourse.lessons.length > 0 ? selectedCourse.lessons.map((lesson, idx) => (
                            <div key={lesson.id} className={`p-3 rounded-lg flex items-center justify-between border transition-colors cursor-pointer
                                ${lesson.completed ? 'bg-green-50 border-green-100' : 'bg-white border-gray-200 hover:border-diva-primary'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border
                                        ${lesson.completed ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-400 border-gray-300'}`}>
                                        {lesson.completed ? <CheckCircle size={14} /> : idx + 1}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold ${lesson.completed ? 'text-green-800' : 'text-gray-700'}`}>{lesson.title}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                            {lesson.type === 'video' && <PlayCircle size={10} />}
                                            {lesson.type === 'text' && <BookOpen size={10} />}
                                            {lesson.type === 'quiz' && <Award size={10} />}
                                            <span>{lesson.duration}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    {lesson.completed ? <span className="text-xs font-bold text-green-600">Concluído</span> : <Lock size={14} />}
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-400">
                                <Lock size={24} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Conteúdo bloqueado. Contate o administrador.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-white">
                        <button className="w-full bg-diva-dark text-white py-3 rounded-lg font-bold hover:bg-diva-primary transition-colors flex items-center justify-center">
                            Continuar Assistindo <ChevronRight size={16} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AcademyModule;
