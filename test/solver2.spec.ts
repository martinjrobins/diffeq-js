import Vector from '../src/vector';
import Solver from '../src/solver';
import Options from '../src/options';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import { compileModel, getModel } from '/src';
import { code1, code2 } from './logistic';

describe('Multiple Solvers', function () {
  it('can compile code1 and code2', async function () {
    try {
      await Promise.all([
        compileModel(code1, 'model1'),
        compileModel(code2, 'model2')
      ]);
      assert(true);
    } catch (e) {
      assert.fail(e as string);
    }
  });


  it('can compile and solve using global functions', async function () {
    await compileModel(code1);
    let options = new Options({});
    let solver = new Solver(options);
    
    let times = new Vector([0, 2]);
    let inputs = new Vector([1, 2]);
    let outputs = new Vector(new Array(times.length() * solver.number_of_outputs));
    
    solver.solve(times, inputs, outputs);
    
    const outputArray = outputs.getFloat64Array();
    const sum = outputArray.reduce((acc, curr) => acc + curr, 0);
    const expectedSum = 167.28648630426795;
    
    assert.approximately(sum, expectedSum, 0.0001);
    
    solver.destroy();
  });

  it('can compile and solve using default model', async function () {
    await compileModel(code1);
    let options = new Options({});
    let solver = new Solver(options);
    
    let times = new Vector([0, 2], getModel().vectorFunctions);
    let inputs = new Vector([1, 2], getModel().vectorFunctions);
    let outputs = new Vector(new Array(times.length() * solver.number_of_outputs), getModel().vectorFunctions);
    
    solver.solve(times, inputs, outputs);
    
    const outputArray = outputs.getFloat64Array();
    const sum = outputArray.reduce((acc, curr) => acc + curr, 0);
    const expectedSum = 167.28648630426795;
    
    assert.approximately(sum, expectedSum, 0.0001);
    
    solver.destroy();
  });

  it('can compile using id and solve', async function () {
    await compileModel(code1, 'model1');
    
    // Solve code1 (default model)
    let options1 = new Options({}, 'model1');
    let solver1 = new Solver(options1, 'model1');
    let times1 = new Vector([0, 2], getModel('model1').vectorFunctions);
    let inputs1 = new Vector([1, 2], getModel('model1').vectorFunctions);
    let outputs1 = new Vector(new Array(times1.length() * solver1.number_of_outputs), getModel('model1').vectorFunctions);
    
    solver1.solve(times1, inputs1, outputs1);
    
    const outputArray1 = outputs1.getFloat64Array();
    const sum1 = outputArray1.reduce((acc, curr) => acc + curr, 0);
    const expectedSum1 = 167.28648630426795;
    
    assert.approximately(sum1, expectedSum1, 0.0001);
    
    solver1.destroy();
  });

  it('can compile and solve both code1 and code2, and then solve code1 again', async function () {
    await compileModel(code1, 'model1');
    await compileModel(code2, 'model2');
    
    // Solve code1 (default model)
    let options1 = new Options({}, 'model1');
    let solver1 = new Solver(options1, 'model1');
    let times1 = new Vector([0, 2], getModel('model1').vectorFunctions);
    let inputs1 = new Vector([1, 2], getModel('model1').vectorFunctions);
    let outputs1 = new Vector(new Array(times1.length() * solver1.number_of_outputs), getModel('model1').vectorFunctions);
    
    solver1.solve(times1, inputs1, outputs1);
    const outputArray1 = outputs1.getFloat64Array();
    const sum1 = outputArray1.reduce((acc, curr) => acc + curr, 0);
    const expectedSum1 = 167.28648630426795;
    assert.approximately(sum1, expectedSum1, 0.0001);
    

    // Solve code2 (model2)
    let options2 = new Options({}, 'model2');
    let solver2 = new Solver(options2, 'model2');
    let times2 = new Vector([0, 2], getModel('model2').vectorFunctions);
    let inputs2 = new Vector([1, 2], getModel('model2').vectorFunctions);
    let outputs2 = new Vector(new Array(times2.length() * solver2.number_of_outputs), getModel('model2').vectorFunctions);
    
    solver2.solve(times2, inputs2, outputs2);
    const outputArray2 = outputs2.getFloat64Array();
    const sum2 = outputArray2.reduce((acc, curr) => acc + curr, 0);
    const expectedSum2 = 45.98250398335723;
    assert.approximately(sum2, expectedSum2, 0.0001);

    
    //solve code1 again
    let times3 = new Vector([0, 2], getModel('model1').vectorFunctions);
    let inputs3 = new Vector([1, 3], getModel('model1').vectorFunctions);
    let outputs3 = new Vector(new Array(times3.length() * solver1.number_of_outputs), getModel('model1').vectorFunctions);
    

    solver1.solve(times3, inputs3, outputs3);
    const outputArray3 = outputs3.getFloat64Array();
    const sum3 = outputArray3.reduce((acc, curr) => acc + curr, 0);
    const expectedSum3 = 176.28342332633014;
    
    assert.approximately(sum3, expectedSum3, 0.0001);
  });
}); 