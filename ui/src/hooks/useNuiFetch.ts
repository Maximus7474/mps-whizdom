import { fetchNui } from '@/utils/fetchNui';
import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
}

function useNuiFetch<T>(
    eventName: string, 
    eventData?: unknown,
    mockData?: T 
) {
    const [state, setState] = useState<FetchState<T>>({
        data: undefined,
        isLoading: true,
        error: null,
    });

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const result = await fetchNui<T>(eventName, eventData, mockData); 
            setState({ data: result, isLoading: false, error: null });
        } catch (err) {
            setState({ data: undefined, isLoading: false, error: err as Error });
        }
    }, [eventName, eventData, mockData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return state;
}

export default useNuiFetch;
