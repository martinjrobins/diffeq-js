import Vector from '../src/vector';
import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import { code1 } from './logistic';
import { compileModel } from '/src';


describe('Vector', function () {
  before(function () {
    return compileModel(code1);
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

  it('can resize', function () {
    let v = new Vector([1, 2]);
    v.resize(4);
    assert.equal(v.get(0), 1);
    assert.equal(v.length(), 4);
    v.resize(1);
    assert.equal(v.get(0), 1);
    assert.equal(v.length(), 1);
  });

});