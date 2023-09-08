import Vector from '../src/vector';
import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import { compileResponse } from '../src';
import * as fs from 'fs';


describe('Vector', function () {
  before(function () {
    const data = fs.readFileSync("logistic.wasm");
    const blob = new Blob([data], { type: "application/wasm" });
    const promise = new Response(blob);
    return compileResponse(Promise.resolve(promise));
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