import Vector from '../src/vector';
import Solver from '../src/solver';
import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import { compileResponse } from '../src';
import * as fs from 'fs';
import Options from '../src/options';


describe('Solver', function () {
  before(function () {
    const data = fs.readFileSync("logistic.wasm");
    const blob = new Blob([data], { type: "application/wasm" });
    const promise = new Response(blob);
    return compileResponse(Promise.resolve(promise));
  });

  it('can construct and destroy', function () {
    let options = new Options();
    let solver = new Solver(options);
    solver.destroy();
  });
  
  it('can solve', function () {
    let options = new Options();
    let solver = new Solver(options);
    let times = new Vector([0, 1]);
    let inputs = new Vector([1, 2]);
    let outputs = new Vector(new Array(times.length * solver.number_of_outputs));
    solver.solve(times, inputs, outputs);
    const should_be = [
      [1, 2],
      [1.462115,2.924229],
    ]
    for (let i = 0; i < times.length; i++) {
      for (let j = 0; j < solver.number_of_outputs; j++) {
        assert.approximately(outputs.get(i * solver.number_of_outputs + j), should_be[i][j], 0.0001);
      }
    }
    
    solver.destroy();
  });
});
