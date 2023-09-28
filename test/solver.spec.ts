import Vector from '../src/vector';
import Solver from '../src/solver';
import Options from '../src/options';
import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import * as fs from 'fs';
import { compileModel } from '../src/index';
import logistic_code from './logistic';


describe('Solver', function () {
  before(function () {
    return compileModel(logistic_code);
  });

  it('can construct and destroy', function () {
    let options = new Options({});
    let solver = new Solver(options);
    solver.destroy();
  });
  
  it('can solve at fixed times', function () {
    let options = new Options({fixed_times: true});
    let solver = new Solver(options);
    let times = new Vector([0, 1]);
    let inputs = new Vector([1, 2]);
    let outputs = new Vector(new Array(times.length() * solver.number_of_outputs));
    solver.solve(times, inputs, outputs);
    const should_be = [
      [1, 2],
      [1.462115,2.924229],
    ]
    for (let i = 0; i < times.length(); i++) {
      for (let j = 0; j < solver.number_of_outputs; j++) {
        assert.approximately(outputs.get(i * solver.number_of_outputs + j), should_be[i][j], 0.0001);
      }
    }
    
    solver.destroy();
  });
  it('can solve at solver times', function () {
    let options = new Options({fixed_times: false});
    let solver = new Solver(options);
    let times = new Vector([0, 1]);
    let inputs = new Vector([1, 2]);
    let outputs = new Vector(new Array(times.length() * solver.number_of_outputs));
    solver.solve(times, inputs, outputs);
    const times_array = times.getFloat64Array();
    const output_array = outputs.getFloat64Array();
    const number_of_times = times_array.length;
    assert.isAbove(number_of_times, 2);
    assert.equal(output_array.length, number_of_times * solver.number_of_outputs);
    const should_be = [1.462115,2.924229];
    for (let j = 0; j < solver.number_of_outputs; j++) {
      assert.approximately(outputs.get((number_of_times - 1) * solver.number_of_outputs + j), should_be[j], 0.0001);
    }
    
    solver.destroy();
  });
});
