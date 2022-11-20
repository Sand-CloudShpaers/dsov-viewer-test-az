// Recursive function is too generic to work well with more specific types
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export function findObjectInObjectWithKeyValue(obj: any, key: string, value: string): any {
  if (!obj) {
    return null;
  }

  if (obj[key] === value) {
    return obj;
  }

  const keys = obj instanceof Object ? getKeys(obj) : [];

  for (const _key of keys) {
    const match = findObjectInObjectWithKeyValue(obj[_key], key, value);
    if (match !== null) {
      return match;
    }
  }

  return null;
}

export function getKeys<T>(object: T): Array<keyof T> {
  return <Array<keyof T>>Object.keys(object);
}
