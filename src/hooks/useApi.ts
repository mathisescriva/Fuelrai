import { useState } from 'react';
import { useToast } from '../components/Toast/Toast';

interface ApiState {
  loading: boolean;
  error: Error | null;
}

export function useApi<T>() {
  const [state, setState] = useState<ApiState>({
    loading: false,
    error: null,
  });
  const { showToast } = useToast();

  const callApi = async (apiFunction: () => Promise<T>): Promise<T | null> => {
    setState({ loading: true, error: null });
    try {
      const result = await apiFunction();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setState({ loading: false, error: error as Error });
      showToast(errorMessage, 'error');
      return null;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    loading: state.loading,
    error: state.error,
    callApi,
  };
}
