/* eslint-disable @typescript-eslint/no-explicit-any */
import { getKeys } from '~general/utils/object.utils';

export function deepGroupBy<T, K extends keyof T>(array: T[], key: K | ((obj: T) => string)): Record<string, T[]> {
  const keyFn = key instanceof Function ? key : (obj: T): any => obj[key] as any;
  return array.reduce((objectsByKeyValue, obj) => {
    const value = keyFn(obj);
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {} as Record<string, T[]>);
}

export function sortByKey<T>(array: Array<T>, key: keyof T): T[] {
  return array.slice().sort((a, b) => (a[key] as unknown as string)?.localeCompare(b[key] as unknown as string));
}

export function sortGroupByKeys<T>(grouped: Record<string, T[]>): Record<string, T[]> {
  const keys = getKeys(grouped);
  keys.sort((a, b) => a.localeCompare(b));
  return keys.reduce((obj, key) => {
    obj[key] = grouped[key];
    return obj;
  }, {} as Record<string, T[]>);
}
