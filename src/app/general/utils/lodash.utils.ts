import { isArray, mergeWith } from 'lodash-es';

type ObjectLike = Record<string, unknown>;

function customizer(
  objValue: ObjectLike | Array<ObjectLike>,
  srcValue: ObjectLike | Array<ObjectLike>
): ObjectLike | Array<ObjectLike> {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
  return objValue;
}

export function mergeObjectOrArray<TObject, TSource>(destination: TObject, source: TSource): TObject & TSource {
  return mergeWith(destination, source, customizer);
}
