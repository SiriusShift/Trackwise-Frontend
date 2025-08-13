type AnyRtkHook<TData = any> = () => [
  (args?: any) => any,
  { data?: TData; isFetching: boolean }
];

export function useTriggerFetch<TData = any>(trigger?: AnyRtkHook<TData>) {
  if (!trigger) {
    return {
      fetchData: null as null | ((args?: any) => any),
      data: undefined as TData | undefined,
      isFetching: false,
    };
  }

  const [fetchData, result] = trigger();
  console.log("Result",result?.isFetching)
  return {
    fetchData,
    data: result.data as TData | undefined,
    isFetching: result.isFetching,
  };
}
