export const union = <T>(a: Set<T>, b: Set<T>): Set<T> => new Set([...a, ...b]);

export const difference = <T>(a: Set<T>, b: Set<T>): Set<T> =>
  new Set([...a].filter((x) => !b.has(x)));

export const intersection = <T>(a: Set<T>, b: Set<T>): Set<T> =>
  new Set([...a].filter((x) => b.has(x)));
