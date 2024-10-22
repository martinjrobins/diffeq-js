import { check_function } from "./utils";

type Options_create_t = () => number;
let Options_create: Options_create_t | undefined = undefined;
type Options_destroy_t = (ptr: number) => void;
let Options_destroy: Options_destroy_t | undefined = undefined;
type Options_set_fixed_times_t = (ptr: number, fixed_times: number) => void;
let Options_set_fixed_times: Options_set_fixed_times_t | undefined = undefined;
type Options_set_print_stats_t = (ptr: number, print_stats: number) => void;
let Options_set_print_stats: Options_set_print_stats_t | undefined = undefined;
type Options_set_fwd_sens_t = (ptr: number, fwd_sens: number) => void;
let Options_set_fwd_sens: Options_set_fwd_sens_t | undefined = undefined;
type Options_get_fixed_times_t = (ptr: number) => number;
let Options_get_fixed_times: Options_get_fixed_times_t | undefined = undefined;
type Options_get_print_stats_t = (ptr: number) => number;
let Options_get_print_stats: Options_get_print_stats_t | undefined = undefined;
type Options_get_fwd_sens_t = (ptr: number) => number;
let Options_get_fwd_sens: Options_get_fwd_sens_t | undefined = undefined;
type Options_set_linear_solver_t = (ptr: number, linear_solver: number) => void;
let Options_set_linear_solver: Options_set_linear_solver_t | undefined = undefined;
type Options_get_linear_solver_t = (ptr: number) => number;
let Options_get_linear_solver: Options_get_linear_solver_t | undefined = undefined;
type Options_set_preconditioner_t = (ptr: number, preconditioner: number) => void;
let Options_set_preconditioner: Options_set_preconditioner_t | undefined = undefined;
type Options_get_preconditioner_t = (ptr: number) => number;
let Options_get_preconditioner: Options_get_preconditioner_t | undefined = undefined;
type Options_set_jacobian_t = (ptr: number, jacobian: number) => void;
let Options_set_jacobian: Options_set_jacobian_t | undefined = undefined;
type Options_get_jacobian_t = (ptr: number) => number;
let Options_get_jacobian: Options_get_jacobian_t | undefined = undefined;
type Options_set_atol_t = (ptr: number, atol: number) => void;
let Options_set_atol: Options_set_atol_t | undefined = undefined;
type Options_get_atol_t = (ptr: number) => number;
let Options_get_atol: Options_get_atol_t | undefined = undefined;
type Options_set_rtol_t = (ptr: number, rtol: number) => void;
let Options_set_rtol: Options_set_rtol_t | undefined = undefined;
type Options_get_rtol_t = (ptr: number) => number;
let Options_get_rtol: Options_get_rtol_t | undefined = undefined;
type Options_set_linsol_max_iterations_t = (ptr: number, linsol_max_iterations: number) => void;
let Options_set_linsol_max_iterations: Options_set_linsol_max_iterations_t | undefined = undefined;
type Options_get_linsol_max_iterations_t = (ptr: number) => number;
let Options_get_linsol_max_iterations: Options_get_linsol_max_iterations_t | undefined = undefined;
type Options_set_debug_t = (ptr: number, debug: number) => void;
let Options_set_debug: Options_set_debug_t | undefined = undefined;
type Options_get_debug_t = (ptr: number) => number;
let Options_get_debug: Options_get_debug_t | undefined = undefined;
type Options_set_mxsteps_t = (ptr: number, mxsteps: number) => void;
let Options_set_mxsteps: Options_set_mxsteps_t | undefined = undefined;
type Options_get_mxsteps_t = (ptr: number) => number;
let Options_get_mxsteps: Options_get_mxsteps_t | undefined = undefined;
type Options_set_min_step_t = (ptr: number, min_step: number) => void;
let Options_set_min_step: Options_set_min_step_t | undefined = undefined;
type Options_get_min_step_t = (ptr: number) => number;
let Options_get_min_step: Options_get_min_step_t | undefined = undefined;
type Options_set_max_step_t = (ptr: number, max_step: number) => void;
let Options_set_max_step: Options_set_max_step_t | undefined = undefined;
type Options_get_max_step_t = (ptr: number) => number;
let Options_get_max_step: Options_get_max_step_t | undefined = undefined;


export function extract_options_functions(obj: WebAssembly.WebAssemblyInstantiatedSource) {
  Options_create = obj.instance.exports.Options_create as Options_create_t;
  Options_destroy = obj.instance.exports.Options_destroy as Options_destroy_t;
  Options_set_fixed_times = obj.instance.exports.Options_set_fixed_times as Options_set_fixed_times_t;
  Options_set_print_stats = obj.instance.exports.Options_set_print_stats as Options_set_print_stats_t;
  Options_get_fixed_times = obj.instance.exports.Options_get_fixed_times as Options_get_fixed_times_t;
  Options_get_print_stats = obj.instance.exports.Options_get_print_stats as Options_get_print_stats_t;
  Options_set_fwd_sens = obj.instance.exports.Options_set_fwd_sens as Options_set_fwd_sens_t;
  Options_get_fwd_sens = obj.instance.exports.Options_get_fwd_sens as Options_get_fwd_sens_t;
  Options_set_linear_solver = obj.instance.exports.Options_set_linear_solver as (ptr: number, linear_solver: number) => void;
  Options_get_linear_solver = obj.instance.exports.Options_get_linear_solver as (ptr: number) => number;
  Options_set_preconditioner = obj.instance.exports.Options_set_preconditioner as (ptr: number, preconditioner: number) => void;
  Options_get_preconditioner = obj.instance.exports.Options_get_preconditioner as (ptr: number) => number;
  Options_set_jacobian = obj.instance.exports.Options_set_jacobian as (ptr: number, jacobian: number) => void;
  Options_get_jacobian = obj.instance.exports.Options_get_jacobian as (ptr: number) => number;
  Options_set_atol = obj.instance.exports.Options_set_atol as (ptr: number, atol: number) => void;
  Options_get_atol = obj.instance.exports.Options_get_atol as (ptr: number) => number;
  Options_set_rtol = obj.instance.exports.Options_set_rtol as (ptr: number, rtol: number) => void;
  Options_get_rtol = obj.instance.exports.Options_get_rtol as (ptr: number) => number;
  Options_set_linsol_max_iterations = obj.instance.exports.Options_set_linsol_max_iterations as (ptr: number, linsol_max_iterations: number) => void;
  Options_get_linsol_max_iterations = obj.instance.exports.Options_get_linsol_max_iterations as (ptr: number) => number;
  Options_set_debug = obj.instance.exports.Options_set_debug as (ptr: number, debug: number) => void;
  Options_get_debug = obj.instance.exports.Options_get_debug as (ptr: number) => number;
  Options_set_mxsteps = obj.instance.exports.Options_set_mxsteps as (ptr: number, mxsteps: number) => void;
  Options_get_mxsteps = obj.instance.exports.Options_get_mxsteps as (ptr: number) => number;
  Options_set_min_step = obj.instance.exports.Options_set_min_step as (ptr: number, min_step: number) => void;
  Options_get_min_step = obj.instance.exports.Options_get_min_step as (ptr: number) => number;
  Options_set_max_step = obj.instance.exports.Options_set_max_step as (ptr: number, max_step: number) => void;
  Options_get_max_step = obj.instance.exports.Options_get_max_step as (ptr: number) => number;
}

export enum OptionsLinearSolver {
  LINEAR_SOLVER_DENSE = 0,
  LINEAR_SOLVER_KLU = 1,
  LINEAR_SOLVER_SPBCGS = 2,
  LINEAR_SOLVER_SPFGMR = 3,
  LINEAR_SOLVER_SPGMR = 4,
  LINEAR_SOLVER_SPTFQMR = 5,
}

export enum OptionsPreconditioner {
  PRECON_NONE = 0,
  PRECON_LEFT = 1,
  PRECON_RIGHT = 2,
}

export enum OptionsJacobian {
  DENSE_JACOBIAN = 0,
  SPARSE_JACOBIAN = 1,
  MATRIX_FREE_JACOBIAN = 2,
  NO_JACOBIAN = 3,
}
  

class Options {
  pointer: number;
  constructor({ 
    mxsteps = 500,
    min_step = 0.0,
    max_step = Number.MAX_VALUE,
    fixed_times = false, 
    print_stats = false, 
    fwd_sens = false, 
    atol = 1e-6, 
    rtol = 1e-6, 
    linear_solver = OptionsLinearSolver.LINEAR_SOLVER_DENSE, 
    preconditioner = OptionsPreconditioner.PRECON_NONE, 
    jacobian = OptionsJacobian.DENSE_JACOBIAN, 
    linsol_max_iterations = 100, 
    debug = false 
  }) {
    this.pointer = check_function(Options_create)();
    check_function(Options_set_fixed_times)(this.pointer, fixed_times ? 1 : 0);
    check_function(Options_set_print_stats)(this.pointer, print_stats ? 1 : 0);
    check_function(Options_set_fwd_sens)(this.pointer, fwd_sens ? 1 : 0);
    check_function(Options_set_atol)(this.pointer, atol);
    check_function(Options_set_rtol)(this.pointer, rtol);
    check_function(Options_set_linear_solver)(this.pointer, linear_solver);
    check_function(Options_set_preconditioner)(this.pointer, preconditioner);
    check_function(Options_set_jacobian)(this.pointer, jacobian);
    check_function(Options_set_linsol_max_iterations)(this.pointer, linsol_max_iterations);
    check_function(Options_set_debug)(this.pointer, debug ? 1 : 0);
    check_function(Options_set_mxsteps)(this.pointer, mxsteps);
    check_function(Options_set_min_step)(this.pointer, min_step);
    check_function(Options_set_max_step)(this.pointer, max_step);
  }
  destroy() {
    check_function(Options_destroy)(this.pointer);
  }
  get_fixed_times() {
    return check_function(Options_get_fixed_times)(this.pointer) === 1;
  }
  get_print_stats() {
    return check_function(Options_get_print_stats)(this.pointer) === 1;
  }
  get_fwd_sens() {
    return check_function(Options_get_fwd_sens)(this.pointer) === 1;
  }
  get_atol() {
    return check_function(Options_get_atol)(this.pointer);
  }
  get_rtol() {
    return check_function(Options_get_rtol)(this.pointer);
  }
  get_linear_solver() {
    return check_function(Options_get_linear_solver)(this.pointer);
  }
  get_preconditioner() {
    return check_function(Options_get_preconditioner)(this.pointer);
  }
  get_jacobian() {
    return check_function(Options_get_jacobian)(this.pointer);
  }
  get_linsol_max_iterations() {
    return check_function(Options_get_linsol_max_iterations)(this.pointer);
  }
  get_debug() {
    return check_function(Options_get_debug)(this.pointer) === 1;
  }
  get_mxsteps() {
    return check_function(Options_get_mxsteps)(this.pointer);
  }
  get_min_step() {
    return check_function(Options_get_min_step)(this.pointer);
  }
  get_max_step() {
    return check_function(Options_get_max_step)(this.pointer);
  }
}
  
export default Options;