
import React from 'react';
import { Calendar, CheckCircle, Instagram, MapPin, Phone, Star, User } from 'lucide-react';

// Mock Data (In real app, this comes from the WebsiteConfig stored in backend)
const siteData = {
    heroTitle: 'Realce Sua Beleza Natural',
    heroSubtitle: 'Tecnologia avançada em estética e depilação a laser para você se sentir única.',
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop',
    primaryColor: '#14808C',
    services: [
        { name: 'Depilação a Laser', price: 'R$ 89,90', image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Harmonização Facial', price: 'R$ 1.200', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop' },
        { name: 'Limpeza de Pele', price: 'R$ 180,00', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop' },
    ],
    team: [
        { name: 'Dra. Julia Martins', role: 'Biomédica Chefe' },
        { name: 'Carla Dias', role: 'Esteticista' }
    ],
    testimonials: [
        { name: 'Ana Silva', text: 'O melhor atendimento que já tive. O laser é realmente indolor!' },
        { name: 'Fernanda Lima', text: 'Ambiente incrível e profissionais super qualificadas.' }
    ],
    contact: { phone: '(11) 99999-9999', address: 'Rua Oscar Freire, 1234 - SP' }
};

const PublicPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white font-sans">

            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <span className="font-serif text-2xl font-bold text-gray-900 tracking-wider">DIVA SPA</span>
                    <button
                        className="px-6 py-2.5 text-white rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: siteData.primaryColor }}
                    >
                        Agendar Agora
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={siteData.heroImage} className="w-full h-full object-cover" alt="Spa Hero" />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto text-white animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <span className="uppercase tracking-[0.3em] text-sm font-bold mb-4 block opacity-90">Estética Avançada</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">{siteData.heroTitle}</h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10 font-light leading-relaxed">{siteData.heroSubtitle}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            className="px-8 py-4 text-gray-900 bg-white rounded-full font-bold shadow-xl hover:bg-gray-100 transition-colors"
                        >
                            Ver Tratamentos
                        </button>
                        <button
                            className="px-8 py-4 text-white border border-white rounded-full font-bold hover:bg-white/10 transition-colors backdrop-blur-sm"
                        >
                            Falar no WhatsApp
                        </button>
                    </div>
                </div>
            </header>

            {/* Services Section */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Nossos Tratamentos</h2>
                        <div className="w-20 h-1 bg-gray-900 mx-auto opacity-20"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {siteData.services.map((service, idx) => (
                            <div key={idx} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                                <div className="h-64 overflow-hidden">
                                    <img src={service.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={service.name} />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                                    <p className="text-gray-500 text-sm mb-6">Protocolo exclusivo para resultados visíveis desde a primeira sessão.</p>
                                    <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                        <span className="font-mono font-bold text-lg" style={{ color: siteData.primaryColor }}>
                                            {service.price}
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-900 transition-colors">
                                            Saiba Mais →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12">Especialistas em Você</h2>
                    <div className="flex flex-wrap justify-center gap-12">
                        {siteData.team.map((member, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden border-4 border-white shadow-lg">
                                    {/* Placeholder Avatar */}
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                                        <User size={40} />
                                    </div>
                                </div>
                                <h4 className="font-bold text-lg text-gray-900">{member.name}</h4>
                                <p className="text-sm text-gray-500 uppercase tracking-wider">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {siteData.testimonials.map((t, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                                <div className="flex text-yellow-400 mb-4">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-lg font-light italic mb-6">"{t.text}"</p>
                                <p className="font-bold text-sm uppercase tracking-wider opacity-70">— {t.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <div>
                        <span className="font-serif text-xl font-bold text-gray-900 tracking-wider mb-4 block">DIVA SPA</span>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Sua jornada de beleza e bem-estar começa aqui. Tecnologia de ponta e atendimento humanizado.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">Contato</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li className="flex items-center"><Phone size={16} className="mr-2" /> {siteData.contact.phone}</li>
                            <li className="flex items-center"><MapPin size={16} className="mr-2" /> {siteData.contact.address}</li>
                            <li className="flex items-center"><Instagram size={16} className="mr-2" /> @divaspa</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">Horários</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>Seg - Sex: 09h às 19h</li>
                            <li>Sáb: 09h às 14h</li>
                            <li>Dom: Fechado</li>
                        </ul>
                    </div>
                </div>
                <div className="text-center text-xs text-gray-400 pt-8 border-t border-gray-100">
                    © {new Date().getFullYear()} Diva Spa. Powered by I'mDoc®.
                </div>
            </footer>
        </div>
    );
};

export default PublicPage;
