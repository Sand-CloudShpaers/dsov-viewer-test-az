export function flatMap<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U[]): U[] {
  return Array.prototype.concat(...array.map(callbackfn));
}

export function uniqueObjects<T>(array: T[], key: keyof T): T[] {
  if (!array) {
    return [];
  }
  return array.reduce((acc, current) => {
    const x = acc.find((item: T) => item[key] === current[key]);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
}
