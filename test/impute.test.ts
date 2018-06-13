/* tslint:disable:quotemark */
import {assert} from 'chai';
import {Encoding} from '../src/encoding';
import {normalizeimputeProperties} from '../src/impute';

describe('impute', () => {
  it('should work for value impute', () => {
    const encoding: Encoding<string> = {
      x : {aggregate: 'sum', field: 'yield', type: 'quantitative'},
      y : {field: 'variety', type: 'quantitative', impute: {'value': 500}},
      'color': {field: 'site', type: 'nominal'}
    };
    const result = normalizeimputeProperties(encoding);
    assert.deepEqual(result, {
      impute: 'variety',
      key: 'yield',
      value: 500,
      groupby: ['site']
    });
  });

  it('should work for method impute', () => {
    const encoding: Encoding<string> = {
      x : {aggregate: 'sum', field: 'yield', type: 'quantitative'},
      y : {field: 'variety', type: 'quantitative', impute: {method: 'max'}},
      'color': {field: 'site', type: 'nominal'}
    };
    const result = normalizeimputeProperties(encoding);
    assert.deepEqual(result, {
      impute: 'variety',
      key: 'yield',
      method: 'max',
      groupby: ['site']
    });
  });

  it('should work when method and frame are specified', () => {
    const encoding: Encoding<string> = {
      x : {aggregate: 'sum', field: 'yield', type: 'quantitative'},
      y : {field: 'variety', type: 'quantitative', impute: {method: 'mean', frame: [-2, 2]}},
      'color': {field: 'site', type: 'nominal'}
    };
    const result = normalizeimputeProperties(encoding);
    assert.deepEqual(result, {
      impute: 'variety',
      key: 'yield',
      method: 'mean',
      frame: [-2, 2],
      groupby: ['site']
    });
  });

  it('should work when value and frame are specified', () => {
    const encoding: Encoding<string> = {
      x : {aggregate: 'sum', field: 'yield', type: 'quantitative'},
      y : {field: 'variety', type: 'quantitative', impute: {method: 'value', value: 20, frame: [-2, 2]}},
      'color': {field: 'site', type: 'nominal'}
    };
    const result = normalizeimputeProperties(encoding);
    assert.deepEqual(result, {
      impute: 'variety',
      key: 'yield',
      method: 'value',
      value: 20,
      frame: [-2, 2],
      groupby: ['site']
    });
  });
});
