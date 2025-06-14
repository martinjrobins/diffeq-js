import Vector from '../src/vector';
import Solver from '../src/solver';
import Options from '../src/options';
import { describe, it, before } from 'mocha';
import { assert, expect } from 'chai';
import { compileModel } from '/src';
import { code1 } from './logistic';


describe('Single Solver', function () {
  before(function () {
    return compileModel(code1);
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

  it('can solve with sensitivities', function () {
    let options = new Options({fixed_times: true, fwd_sens: true});
    let solver = new Solver(options);
    let times = new Vector([0, 1]);
    let inputs = new Vector([1, 2]);
    let dinputs = new Vector([1, 0]);
    let outputs = new Vector(new Array(times.length() * solver.number_of_outputs));
    let doutputs = new Vector([]);
    solver.solve_with_sensitivities(times, inputs, dinputs, outputs, doutputs);
    const should_be = [
      [1, 2],
      [1.462115,2.924229],
    ]
    for (let i = 0; i < times.length(); i++) {
      for (let j = 0; j < solver.number_of_outputs; j++) {
        assert.approximately(outputs.get(i * solver.number_of_outputs + j), should_be[i][j], 0.0001);
      }
    }
    const should_be_sens = [
      [0, 0],
      [0.39322662865615104, 0.7864532573123021],
    ]
    for (let i = 0; i < times.length(); i++) {
      for (let j = 0; j < solver.number_of_outputs; j++) {
        assert.approximately(doutputs.get(i * solver.number_of_outputs + j), should_be_sens[i][j], 0.0001);
      }
    }
    // check inputs and dinputs are unchanged
    assert.equal(inputs.get(0), 1);
    assert.equal(inputs.get(1), 2);
    assert.equal(dinputs.get(0), 1);
    assert.equal(dinputs.get(1), 0);

    solver.solve_with_sensitivities(times, inputs, dinputs, outputs, doutputs);
    for (let i = 0; i < times.length(); i++) {
      for (let j = 0; j < solver.number_of_outputs; j++) {
        assert.approximately(outputs.get(i * solver.number_of_outputs + j), should_be[i][j], 0.0001);
      }
    }
    for (let i = 0; i < times.length(); i++) {
      for (let j = 0; j < solver.number_of_outputs; j++) {
        assert.approximately(doutputs.get(i * solver.number_of_outputs + j), should_be_sens[i][j], 0.0001);
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
  it('fails gracefully when solver fails', function () {
    let options = new Options({fixed_times: false});
    let solver = new Solver(options);
    let times = new Vector([0, 1]);
    let inputs = new Vector([1, 0]);
    let outputs = new Vector(new Array(times.length() * solver.number_of_outputs));
    let error = undefined;

    // should error with a message
    try {
      solver.solve(times, inputs, outputs);
      assert.fail("Should have failed");
    } catch (e) {
      if (e instanceof Error) {
        error = e;
        expect(error.toString()).to.contain("Error");
      } else {
        assert.fail("Should have failed with an Error");
      }
    }

    // try again, error should be the same
    try {
      solver.solve(times, inputs, outputs);
      assert.fail("Should have failed");
    } catch (e) {
      if (e instanceof Error) {
        assert.equal(e.toString(), error.toString());
      } else {
        assert.fail("Should have failed with an Error");
      }
    }
      
    solver.destroy();
  });

});