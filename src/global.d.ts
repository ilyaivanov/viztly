type Action<T> = (arg: T) => void;
type Action2<T1, T2> = (arg1: T1, arg2: T2) => void;

type Vector = {
  x: number;
  y: number;
};

type Line = {
  start: Vector;
  end: Vector;
  color: string;
};
