import { useState, useEffect } from 'react';

/**
 * Local Storage Hook
 * Persists state in localStorage with automatic sync
 * 
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * 
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * 
 * // Updates both state and localStorage
 * setTheme('dark');
 * ```
 */
export const useLocalStorage = <T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
    // Get initial value from localStorage or use initialValue
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Update localStorage when value changes
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function (same API as useState)
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    // Listen for changes in other tabs/windows
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error(`Error parsing localStorage value for key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue];
};
