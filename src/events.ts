type MyEventListener<TMap> = {
  map: Map<keyof TMap, any[]>;
};

export const createSource = <TMap>(): MyEventListener<TMap> => ({
  map: new Map(),
});

export const on = <TMap, TKey extends keyof TMap>(
  listener: MyEventListener<TMap>,
  key: TKey,
  cb: F1<TMap[TKey]>
) => {
  const arr = listener.map.get(key);
  if (arr) arr.push(cb);
  else listener.map.set(key, [cb]);
};

export const trigger = <TMap, TKey extends keyof TMap>(
  listener: MyEventListener<TMap>,
  key: TKey,
  data: TMap[TKey]
) => {
  const arr = listener.map.get(key);
  if (arr) arr.forEach((cb) => cb(data));
};
