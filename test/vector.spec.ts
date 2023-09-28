import Vector from '../src/vector';
import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import * as fs from 'fs';
import logistic_code from './logistic';
import { compileModel } from '../src/index';


describe('Vector', function () {
  before(function () {
    return compileModel(logistic_code);
  });

  it('can construct and destroy', function () {
    const test_arrays = [
      [],
      [1],
      [1.0, 2],
      [1.1, 2.2, 3.4],
    ];
    for (let i = 0; i < test_arrays.length; i++) {
      const v = new Vector(test_arrays[i]);
      for (let j = 0; j < test_arrays[i].length; j++) {
        assert.equal(v.get(j), test_arrays[i][j]);
      }
      v.destroy();
    }
  });
  
  it('can get a Float64Array', function () {
    const test_arrays = [
      [],
      [1],
      [1.0, 2],
      [1.1, 2.2, 3.4],
    ];
    for (let i = 0; i < test_arrays.length; i++) {
      const v = new Vector(test_arrays[i]);
      const float64array = v.getFloat64Array();
      for (let j = 0; j < test_arrays[i].length; j++) {
        assert.equal(float64array[j], test_arrays[i][j]);
      }
      v.destroy();
    }
  });

});