import { useState, useCallback } from 'react';

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

interface UseAsyncReturn<T> {
    execute: () => Promise<void>;
    status: AsyncStatus;
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
}

/**
 * Async Hook
 * Manages async operations with loading, success, and error states
 * 
 * @param asyncFunction - Async function to execute
 * 
 * @example
 * ```tsx
 * const fetchUser = async () => {
 *   const response = await fetch('/api/user');
 *   return response.json();
 * };
 * 
 * const MyComponent = () => {
 *   const { execute, status, data, error, isLoading } = useAsync(fetchUser);
 * 
 *   useEffect(() => {
 *     execute();
 *   }, []);
 * 
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error.message} />;
 *   if (data) return <UserProfile user={data} />;
 * };
 * ```
 */
export const useAsync = <T>(
    asyncFunction: () => Promise<T>
): UseAsyncReturn<T> => {
    const [status, setStatus] = useState<AsyncStatus>('idle');
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const execute = useCallback(async () => {
        setStatus('pending');
        setData(null);
        setError(null);

        try {
            const response = await asyncFunction();
            setData(response);
            setStatus('success');
        } catch (err) {
            setError(err as Error);
            setStatus('error');
        }
    }, [asyncFunction]);

    return {
        execute,
        status,
        data,
        error,
        isLoading: status === 'pending',
        isSuccess: status === 'success',
        isError: status === 'error'
    };
};
