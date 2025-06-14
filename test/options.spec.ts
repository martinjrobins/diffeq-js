import Options, { OptionsJacobian, OptionsLinearSolver, OptionsPreconditioner } from '../src/options';
import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import { compileModel } from '/src';
import { code1 } from './logistic';


describe('Options', function () {
  before(function () {
    return compileModel(code1);
  });

  it('can construct and destroy', function () {
    let options = new Options({});
    options.destroy();
  });

  it('can set fixed_times', function () {
    let options = new Options({ fixed_times: true });
    assert.equal(options.get_fixed_times(), true);
    options.destroy();

    options = new Options({ fixed_times: false });
    assert.equal(options.get_fixed_times(), false);
    options.destroy();
  });

  it('can set print_stats', function () {
    let options = new Options({ print_stats: true });
    assert.equal(options.get_print_stats(), true);
    options.destroy();

    options = new Options({ print_stats: false });
    assert.equal(options.get_print_stats(), false);
    options.destroy();
  });

  it('can set fwd_sens', function () {
    let options = new Options({ fwd_sens: true });
    assert.equal(options.get_fwd_sens(), true);
    options.destroy();

    options = new Options({ fwd_sens: false });
    assert.equal(options.get_fwd_sens(), false);
    options.destroy();
  });
  
  it('can set linear_solver', function () {
    let options = new Options({ linear_solver: 1 });
    assert.equal(options.get_linear_solver(), 1);
    options.destroy();

    options = new Options({ linear_solver: OptionsLinearSolver.LINEAR_SOLVER_KLU });
    assert.equal(options.get_linear_solver(), OptionsLinearSolver.LINEAR_SOLVER_KLU );
    options.destroy();
  });
  
  it('can set preconditioner', function () {
    let options = new Options({ preconditioner: 1 });
    assert.equal(options.get_preconditioner(), 1);
    options.destroy();

    options = new Options({ preconditioner: OptionsPreconditioner.PRECON_NONE });
    assert.equal(options.get_preconditioner(), OptionsPreconditioner.PRECON_NONE );
    options.destroy();
  });
  
  it('can set jacobian', function () {
    let options = new Options({ jacobian: 1 });
    assert.equal(options.get_jacobian(), 1);
    options.destroy();

    options = new Options({ jacobian: OptionsJacobian.SPARSE_JACOBIAN });
    assert.equal(options.get_jacobian(), OptionsJacobian.SPARSE_JACOBIAN );
    options.destroy();
  });
  
  it('can set linsol_max_iterations', function () {
    let options = new Options({ linsol_max_iterations: 1 });
    assert.equal(options.get_linsol_max_iterations(), 1);
    options.destroy();

    options = new Options({ linsol_max_iterations: 101 });
    assert.equal(options.get_linsol_max_iterations(), 101 );
    options.destroy();
  });
  
  it('can set debug', function () {
    let options = new Options({ debug: true });
    assert.equal(options.get_debug(), true);
    options.destroy();

    options = new Options({ debug: false });
    assert.equal(options.get_debug(), false);
    options.destroy();
  });

  it('can set atol', function () {
    let options = new Options({ atol: 1e-3 });
    assert.equal(options.get_atol(), 1e-3);
    options.destroy();

    options = new Options({ atol: 1e-6 });
    assert.equal(options.get_atol(), 1e-6);
    options.destroy();
  });
  
  it('can set rtol', function () {
    let options = new Options({ rtol: 1e-3 });
    assert.equal(options.get_rtol(), 1e-3);
    options.destroy();

    options = new Options({ rtol: 1e-6 });
    assert.equal(options.get_rtol(), 1e-6);
    options.destroy();
  });
});