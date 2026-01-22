import React from 'react';
import { UserRole } from '../types';
import { useData } from './context/DataContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser: user } = useData();
  if (!user) {
    return <div className="flex h-screen w-full items-center justify-center text-diva-dark">Please log in.</div>;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-diva-dark">
        <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-diva-alert max-w-md w-full">
          <h2 className="text-2xl font-bold text-diva-alert mb-2">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar o módulo: <span className="font-semibold text-diva-dark">{window.location.hash}</span>.
          </p>
          <p className="text-sm text-gray-500">Sua função atual: <span className="uppercase font-bold">{user.role}</span></p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;