import {check_function} from "./utils";
import {File} from "@bjorn3/browser_wasi_shim";
import {getModel} from "./index";

declare global {
  var optionsFunctions: OptionsFunctions;
  var stderr: SimpleOpenFile;
  var stdout: SimpleOpenFile;
}

type Options_create_t = () => number;
type Options_destroy_t = (ptr: number) => void;
type Options_set_fixed_times_t = (ptr: number, value: number) => void;
type Options_set_print_stats_t = (ptr: number, value: number) => void;
type Options_set_fwd_sens_t = (ptr: number, value: number) => void;
type Options_set_atol_t = (ptr: number, value: number) => void;
type Options_set_rtol_t = (ptr: number, value: number) => void;
type Options_set_linear_solver_t = (ptr: number, value: number) => void;
type Options_set_preconditioner_t = (ptr: number, value: number) => void;
type Options_set_jacobian_t = (ptr: number, value: number) => void;
type Options_set_linsol_max_iterations_t = (ptr: number, value: number) => void;
type Options_set_debug_t = (ptr: number, value: number) => void;
type Options_set_mxsteps_t = (ptr: number, value: number) => void;
type Options_set_min_step_t = (ptr: number, value: number) => void;
type Options_set_max_step_t = (ptr: number, value: number) => void;
type Options_get_linear_solver_t = (ptr: number) => number;
type Options_get_fixed_times_t = (ptr: number) => number;
type Options_get_print_stats_t = (ptr: number) => number;
type Options_get_fwd_sens_t = (ptr: number) => number;
type Options_get_atol_t = (ptr: number) => number;
type Options_get_rtol_t = (ptr: number) => number;
type Options_get_debug_t = (ptr: number) => number;
type Options_get_mxsteps_t = (ptr: number) => number;
type Options_get_min_step_t = (ptr: number) => number;
type Options_get_max_step_t = (ptr: number) => number;
type Options_get_preconditioner_t = (ptr: number) => number;
type Options_get_jacobian_t = (ptr: number) => number;
type Options_get_linsol_max_iterations_t = (ptr: number) => number;

export interface OptionsFunctions {
  Options_create: Options_create_t;
  Options_destroy: Options_destroy_t;
  Options_set_fixed_times: Options_set_fixed_times_t;
  Options_get_fixed_times: Options_get_fixed_times_t;
  Options_set_print_stats: Options_set_print_stats_t;
  Options_get_print_stats: Options_get_print_stats_t;
  Options_set_fwd_sens: Options_set_fwd_sens_t;
  Options_get_fwd_sens: Options_get_fwd_sens_t;
  Options_set_atol: Options_set_atol_t;
  Options_get_atol: Options_get_atol_t;
  Options_set_rtol: Options_set_rtol_t;
  Options_get_rtol: Options_get_rtol_t;
  Options_set_linear_solver: Options_set_linear_solver_t;
  Options_set_preconditioner: Options_set_preconditioner_t;
  Options_set_jacobian: Options_set_jacobian_t;
  Options_set_linsol_max_iterations: Options_set_linsol_max_iterations_t;
  Options_set_debug: Options_set_debug_t;
  Options_get_debug: Options_get_debug_t;
  Options_set_mxsteps: Options_set_mxsteps_t;
  Options_get_mxsteps: Options_get_mxsteps_t;
  Options_set_min_step: Options_set_min_step_t;
  Options_get_min_step: Options_get_min_step_t;
  Options_set_max_step: Options_set_max_step_t;
  Options_get_max_step: Options_get_max_step_t;
  Options_get_linear_solver: Options_get_linear_solver_t;
  Options_get_preconditioner: Options_get_preconditioner_t;
  Options_get_jacobian: Options_get_jacobian_t;
  Options_get_linsol_max_iterations: Options_get_linsol_max_iterations_t;
}

export function extract_options_functions(obj: WebAssembly.WebAssemblyInstantiatedSource): OptionsFunctions {
  return {
    Options_create: obj.instance.exports.Options_create as Options_create_t,
    Options_destroy: obj.instance.exports.Options_destroy as Options_destroy_t,
    Options_set_fixed_times: obj.instance.exports.Options_set_fixed_times as Options_set_fixed_times_t,
    Options_get_fixed_times: obj.instance.exports.Options_get_fixed_times as Options_get_fixed_times_t,
    Options_set_print_stats: obj.instance.exports.Options_set_print_stats as Options_set_print_stats_t,
    Options_get_print_stats: obj.instance.exports.Options_get_print_stats as Options_get_print_stats_t,
    Options_set_fwd_sens: obj.instance.exports.Options_set_fwd_sens as Options_set_fwd_sens_t,
    Options_get_fwd_sens: obj.instance.exports.Options_get_fwd_sens as Options_get_fwd_sens_t,
    Options_set_atol: obj.instance.exports.Options_set_atol as Options_set_atol_t,
    Options_get_atol: obj.instance.exports.Options_get_atol as Options_get_atol_t,
    Options_set_rtol: obj.instance.exports.Options_set_rtol as Options_set_rtol_t,
    Options_get_rtol: obj.instance.exports.Options_get_rtol as Options_get_rtol_t,
    Options_set_linear_solver: obj.instance.exports.Options_set_linear_solver as Options_set_linear_solver_t,
    Options_set_preconditioner: obj.instance.exports.Options_set_preconditioner as Options_set_preconditioner_t,
    Options_set_jacobian: obj.instance.exports.Options_set_jacobian as Options_set_jacobian_t,
    Options_set_linsol_max_iterations: obj.instance.exports.Options_set_linsol_max_iterations as Options_set_linsol_max_iterations_t,
    Options_set_debug: obj.instance.exports.Options_set_debug as Options_set_debug_t,
    Options_get_debug: obj.instance.exports.Options_get_debug as Options_get_debug_t,
    Options_set_mxsteps: obj.instance.exports.Options_set_mxsteps as Options_set_mxsteps_t,
    Options_get_mxsteps: obj.instance.exports.Options_get_mxsteps as Options_get_mxsteps_t,
    Options_set_min_step: obj.instance.exports.Options_set_min_step as Options_set_min_step_t,
    Options_get_min_step: obj.instance.exports.Options_get_min_step as Options_get_min_step_t,
    Options_set_max_step: obj.instance.exports.Options_set_max_step as Options_set_max_step_t,
    Options_get_max_step: obj.instance.exports.Options_get_max_step as Options_get_max_step_t,
    Options_get_linear_solver: obj.instance.exports.Options_get_linear_solver as Options_get_linear_solver_t,
    Options_get_preconditioner: obj.instance.exports.Options_get_preconditioner as Options_get_preconditioner_t,
    Options_get_jacobian: obj.instance.exports.Options_get_jacobian as Options_get_jacobian_t,
    Options_get_linsol_max_iterations: obj.instance.exports.Options_get_linsol_max_iterations as Options_get_linsol_max_iterations_t
  };
}

export enum OptionsJacobian {
  DENSE_JACOBIAN = 0,
  SPARSE_JACOBIAN = 1,
  NUMERICAL_JACOBIAN = 2,
}

export enum OptionsPreconditioner {
  PRECON_NONE = 0,
  PRECON_LEFT = 1,
  PRECON_RIGHT = 2,
  PRECON_BOTH = 3,
}

export enum OptionsLinearSolver {
  LINEAR_SOLVER_DENSE = 0,
  LINEAR_SOLVER_KLU = 1,
  LINEAR_SOLVER_SPBCGS = 2,
  LINEAR_SOLVER_SPFGMR = 3,
  LINEAR_SOLVER_SPGMR = 4,
  LINEAR_SOLVER_SPTFQMR = 5,
}

class SimpleOpenFile {
  file: File;
  file_pos: number;
  constructor(file: File) {
    this.file = file;
    this.file_pos = 0;
  }
  readToString() {
    const data = this.file.data as Uint8Array
    const start = this.file_pos;
    const end = data.byteLength;
    const slice = data.slice(start, end);
    this.file_pos = end;
    return new TextDecoder().decode(slice);
  }
}

class Options {
  pointer: number;
  public functions: OptionsFunctions;
  public stderr: SimpleOpenFile;
  public stdout: SimpleOpenFile;

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
  }, modelId?: string) {
    const model = getModel(modelId);
    if (!model) {
      throw new Error(`Model ${modelId || 'default'} not found. Please compile the model first.`);
    }
    this.functions = model.optionsFunctions;
    this.stderr = model.stderr;
    this.stdout = model.stdout;
    this.pointer = check_function(this.functions.Options_create)();
    check_function(this.functions.Options_set_fixed_times)(this.pointer, fixed_times ? 1 : 0);
    check_function(this.functions.Options_set_print_stats)(this.pointer, print_stats ? 1 : 0);
    check_function(this.functions.Options_set_fwd_sens)(this.pointer, fwd_sens ? 1 : 0);
    check_function(this.functions.Options_set_atol)(this.pointer, atol);
    check_function(this.functions.Options_set_rtol)(this.pointer, rtol);
    check_function(this.functions.Options_set_linear_solver)(this.pointer, linear_solver);
    check_function(this.functions.Options_set_preconditioner)(this.pointer, preconditioner);
    check_function(this.functions.Options_set_jacobian)(this.pointer, jacobian);
    check_function(this.functions.Options_set_linsol_max_iterations)(this.pointer, linsol_max_iterations);
    check_function(this.functions.Options_set_debug)(this.pointer, debug ? 1 : 0);
    check_function(this.functions.Options_set_mxsteps)(this.pointer, mxsteps);
    check_function(this.functions.Options_set_min_step)(this.pointer, min_step);
    check_function(this.functions.Options_set_max_step)(this.pointer, max_step);
  }

  destroy() {
    check_function(this.functions.Options_destroy)(this.pointer);
  }

  get_linear_solver() {
    return check_function(this.functions.Options_get_linear_solver)(this.pointer);
  }

  get_fixed_times() {
    return check_function(this.functions.Options_get_fixed_times)(this.pointer) === 1;
  }

  get_print_stats() {
    return check_function(this.functions.Options_get_print_stats)(this.pointer) === 1;
  }

  get_fwd_sens() {
    return check_function(this.functions.Options_get_fwd_sens)(this.pointer) === 1;
  }

  get_atol() {
    return check_function(this.functions.Options_get_atol)(this.pointer);
  }

  get_rtol() {
    return check_function(this.functions.Options_get_rtol)(this.pointer);
  }

  get_debug() {
    return check_function(this.functions.Options_get_debug)(this.pointer) === 1;
  }

  get_mxsteps() {
    return check_function(this.functions.Options_get_mxsteps)(this.pointer);
  }

  get_min_step() {
    return check_function(this.functions.Options_get_min_step)(this.pointer);
  }

  get_max_step() {
    return check_function(this.functions.Options_get_max_step)(this.pointer);
  }

  get_preconditioner() {
    return check_function(this.functions.Options_get_preconditioner)(this.pointer);
  }

  get_jacobian() {
    return check_function(this.functions.Options_get_jacobian)(this.pointer);
  }

  get_linsol_max_iterations() {
    return check_function(this.functions.Options_get_linsol_max_iterations)(this.pointer);
  }
}

export default Options;