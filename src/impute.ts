import {Encoding} from './encoding';
import {isFieldDef} from './fielddef';
import {ImputeTransform} from './transform';

export interface ImputeProperties {

  // Should we add this?
  // keyChannel?: string;

  /**
   * The imputation method to use for the field value of imputed data objects.
   * One of `value`, `mean`, `median`, `max` or `min`.
   *
   * __Default value:__  `"value"`
   */
  method?: 'value' | 'mean' | 'median' | 'max' | 'min';
  /**
   * The field value to use when the imputation `method` is `"value"`.
   */
  value?: any;

  // Should we add this?
  // groupby?: string;

  /**
   * The frame over which the `method` will be applied.
   */
  frame?: (null | number)[];
}

export function normalizeimputeProperties(encoding: Encoding<string>): ImputeTransform | undefined {
  const xDef = encoding.x;
  const yDef = encoding.y;

  if (isFieldDef(xDef) && isFieldDef(yDef)) {

    const imputedChannel = xDef.impute ? xDef : (yDef.impute ? yDef: undefined);
    if (imputedChannel === undefined) {
      return undefined;
    }
    const keyChannel = xDef.impute ? yDef : (yDef.impute ? xDef: undefined);
    const {method, value, frame} = imputedChannel.impute;
    return {
      impute: imputedChannel.field,
      key: keyChannel.field,
      ...(method ? {method}:{}),
      ...(value ? {value} : {}),
      ...(frame ? {frame} : {}),
      ...(isFieldDef(encoding.color) ? {groupby: [encoding.color.field]} : {} )
    };
  }
  return undefined;
}
