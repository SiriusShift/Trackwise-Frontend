type AnyRtkHook<TData = any> = () => [
  (args?: any) => any,
  { data?: TData; isLoading: boolean }
];

export function useTriggerFetch<TData = any>(trigger?: AnyRtkHook<TData>) {
  if (!trigger) {
    return {
      fetchData: null as null | ((args?: any) => any),
      data: undefined as TData | undefined,
      isLoading: false,
    };
  }

  const [fetchData, result] = trigger();
  return {
    fetchData,
    data: result.data as TData | undefined,
    isLoading: result.isLoading,
  };
}
