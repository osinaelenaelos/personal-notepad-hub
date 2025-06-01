
import { useState, useEffect } from 'react';
import { ApiResponse } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

// Хук для работы с API запросами
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
  options?: UseApiOptions<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data);
        options?.onSuccess?.(response.data);
      } else {
        const errorMessage = response.error || 'Unknown error occurred';
        setError(errorMessage);
        options?.onError?.(errorMessage);
        toast({
          title: "Ошибка",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      options?.onError?.(errorMessage);
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// Хук для мутаций (POST, PUT, DELETE)
export function useMutation<T, P = any>(
  apiCall: (params: P) => Promise<ApiResponse<T>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (params: P): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall(params);
      
      if (response.success) {
        if (response.message) {
          toast({
            title: "Успех",
            description: response.message,
          });
        }
        return response.data || null;
      } else {
        const errorMessage = response.error || 'Unknown error occurred';
        setError(errorMessage);
        toast({
          title: "Ошибка",
          description: errorMessage,
          variant: "destructive",
        });
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
