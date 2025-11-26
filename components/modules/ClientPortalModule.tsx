
import React, { useState } from 'react';
import { User } from '../../types';
import { Calendar, Star, Tag, Clock } from 'lucide-react';
import BookingWizard from '../modals/BookingWizard';
import { useData } from '../context/DataContext';

interface ClientPortalProps {
    user: User;
}

const ClientPortalModule: React.FC<ClientPortalProps> = ({ user }) => {
  const { clients } = useData();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Find the client associated with the logged-in user (Mock matching by email or ID logic)
  // In a real app, user.uid would link to client.userId
  const client = clients.find(c => c.email === user.email) || { 
      name: user.displayName, 
      loyaltyPoints: 0 
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-diva-dark to-diva-primary rounded-2xl p-8 text-white mb-8 shadow-lg">
            <h1 className="text-3xl font-serif mb-2">Olá, {client.name.split(' ')[0]}</h1>
            <p className="text-diva-light opacity-90">Bem-vinda de volta ao seu momento de cuidado.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Next Appointment */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-diva-light/30">
                <div className="flex items-center mb-4 text-diva-primary">
                    <Calendar className="mr-2" size={24} />
                    <h2 className="text-lg font-bold text-diva-dark">Próximo Agendamento</h2>
                </div>
                
                <div className="p-4 bg-diva-light/10 rounded-xl border border-diva-light/30 text-center">
                    <p className="text-diva-dark font-medium mb-1">Depilação a Laser - Perna Inteira</p>
                    <p className="text-2xl font-bold text-diva-primary my-2">28 OUT</p>
                    <p className="text-gray-500">14:30 - Sala 01</p>
                </div>
                
                <button 
                    onClick={() => setIsBookingOpen(true)}
                    className="w-full mt-4 bg-diva-primary text-white py-3 rounded-xl hover:bg-diva-dark transition-colors font-medium shadow-md"
                >
                    Novo Agendamento
                </button>
            </div>

            {/* Loyalty / Promotions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-diva-light/30">
                 <div className="flex items-center mb-4 text-diva-accent">
                    <Star className="mr-2" size={24} />
                    <h2 className="text-lg font-bold text-diva-dark">Diva Club</h2>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Pontos Acumulados</p>
                        <p className="text-3xl font-bold text-diva-dark">{client.loyaltyPoints || 0}</p>
                    </div>
                    <div className="h-12 w-12 bg-diva-accent/10 rounded-full flex items-center justify-center text-diva-accent">
                        <Tag size={20} />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Resgate Disponível</h3>
                    <div className="flex items-center p-3 border border-diva-light/40 rounded-lg hover:border-diva-accent cursor-pointer transition-colors">
                        <div className="h-10 w-10 bg-gray-100 rounded-md mr-3 flex items-center justify-center text-xs font-bold text-gray-400">IMG</div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-diva-dark">Peeling de Diamante</p>
                            <p className="text-xs text-diva-accent font-bold">1.000 pts</p>
                        </div>
                        <button className="text-xs bg-diva-dark text-white px-2 py-1 rounded hover:bg-diva-primary">Resgatar</button>
                    </div>
                </div>
            </div>
            
            {/* History */}
             <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-diva-light/30">
                <h2 className="text-lg font-bold text-diva-dark mb-4">Histórico Recente</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase">
                                <th className="pb-3 pl-2">Data</th>
                                <th className="pb-3">Procedimento</th>
                                <th className="pb-3">Profissional</th>
                                <th className="pb-3">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-gray-50">
                                <td className="py-3 pl-2 text-gray-500">10 Out, 2023</td>
                                <td className="py-3 font-medium text-diva-dark">Limpeza de Pele Profunda</td>
                                <td className="py-3 text-gray-500">Dr. Julia</td>
                                <td className="py-3 text-gray-500">R$ 180,00</td>
                            </tr>
                            <tr>
                                <td className="py-3 pl-2 text-gray-500">15 Set, 2023</td>
                                <td className="py-3 font-medium text-diva-dark">Botox (3 regiões)</td>
                                <td className="py-3 text-gray-500">Dr. Julia</td>
                                <td className="py-3 text-gray-500">R$ 1.200,00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
             </div>
        </div>

        {/* Booking Wizard Modal */}
        <BookingWizard 
            isOpen={isBookingOpen} 
            onClose={() => setIsBookingOpen(false)} 
            user={user} 
        />
    </div>
  );
};

export default ClientPortalModule;
