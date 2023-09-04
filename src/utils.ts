export function check_function<T>(func: T | undefined): T {
  if (!func) throw new Error("Function not initialized");
  return func;
}