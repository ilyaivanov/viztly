export function debounce<T>(func: (arg: T) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (arg: T) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(arg), wait);
  };
}
