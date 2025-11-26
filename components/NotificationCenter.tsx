
import React from 'react';
import { AppNotification } from '../types';
import { X, Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';

// Mock Notifications
const mockNotifications: AppNotification[] = [
  {
    id: 'n0',
    title: 'Atenção: Leads Estagnados',
    message: '3 Leads no estágio "Novos" não receberam contato nas últimas 24 horas.',
    type: 'alert',
    category: 'system',
    timestamp: 'Agora',
    read: false,
    actionLabel: 'Ver Funil',
    actionLink: '/funnel'
  },
  {
    id: 'n1',
    title: 'Estoque Baixo',
    message: 'Toxina Botulínica (Botox) atingiu o nível mínimo (2 un).',
    type: 'alert',
    category: 'inventory',
    timestamp: '5 min atrás',
    read: false,
    actionLabel: 'Repor',
    actionLink: '/marketplace'
  },
  {
    id: 'n2',
    title: 'Agendamento Confirmado',
    message: 'Ana Silva confirmou presença para amanhã às 14h.',
    type: 'success',
    category: 'schedule',
    timestamp: '1 hora atrás',
    read: true
  }
];

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-16 right-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-diva-dark text-sm flex items-center">
                    <Bell size={14} className="mr-2" /> Notificações
                </h3>
                <button onClick={onClose}><X size={16} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {mockNotifications.map(notif => (
                    <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-xs font-bold uppercase ${notif.type === 'alert' ? 'text-red-500' : notif.type === 'success' ? 'text-green-500' : 'text-blue-500'}`}>
                                {notif.category}
                            </span>
                            <span className="text-[10px] text-gray-400">{notif.timestamp}</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-800 mb-1">{notif.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{notif.message}</p>
                        {notif.actionLabel && (
                            <button className="mt-2 text-xs font-bold text-diva-primary hover:underline">
                                {notif.actionLabel}
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <div className="p-2 bg-gray-50 text-center border-t border-gray-100">
                <button className="text-xs text-gray-500 hover:text-diva-dark font-medium">Marcar todas como lidas</button>
            </div>
        </div>
    );
};

export default NotificationCenter;
