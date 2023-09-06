import Vector from '../src/vector';
import Solver from '../src/solver';
import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import { compileResponse } from '../src';
import * as fs from 'fs';


describe('Solver', function () {
  before(function () {
    const data = fs.readFileSync("logistic.wasm");
    const blob = new Blob([data], { type: "application/wasm" });
    const promise = new Response(blob);
    return compileResponse(Promise.resolve(promise));
  });

  it('can construct and destroy', function () {
    let solver = new Solver();
    solver.destroy();
  });
  
  it('can solve', function () {
    let solver = new Solver();
    let times = new Vector([0, 1, 2, 3, 4, 5]);
    let inputs = new Vector([1, 1]);
    let outputs = new Vector(new Array(times.length * solver.number_of_outputs));
    solver.solve(times, inputs, outputs);
    solver.destroy();
  });
});
