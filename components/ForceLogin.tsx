import React from 'react';
import { useData } from './context/DataContext';
import { UserRole } from '../types';

export const ForceLogin: React.FC = () => {
    const { login } = useData();

    const handleForce = () => {
        console.log('🔨 FORCING LOGIN...');
        const fakeUser = {
            uid: 'force_user_123',
            organizationId: 'org_demo', // Using demo org mostly to be safe
            email: 'force@admin.com',
            displayName: 'Forced Admin',
            role: UserRole.ADMIN,
            profileData: {
                phoneNumber: '',
                bio: '',
                preferences: { notifications: { email: true, push: true, whatsapp: false }, theme: 'light', language: 'pt-BR', twoFactorEnabled: false }
            }
        };
        login(UserRole.ADMIN, fakeUser);
    };

    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
            <button
                onClick={handleForce}
                style={{ padding: '20px', backgroundColor: 'red', color: 'white', fontWeight: 'bold', borderRadius: '10px' }}
            >
                🛑 FORCE ADMIN LOGIN
            </button>
        </div>
    );
};
