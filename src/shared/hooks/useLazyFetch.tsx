type AnyLazyQueryHook<TData = any> = () => [
  (args?: any) => any, // the trigger function
  { data?: TData; isLoading: boolean }
];

export function useTransactionTrigger<TData = any>(
  trigger?: AnyLazyQueryHook<TData>
) {
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
