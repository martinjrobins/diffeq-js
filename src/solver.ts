import Options from "./options";
import { check_function } from "./utils";
import Vector, { VectorFunctions } from "./vector";
import { getModel } from "./index";

declare global {
  var solverFunctions: SolverFunctions;
  var vectorFunctions: VectorFunctions;
}

type Solver_create_t = () => number;
type Solver_destroy_t = (ptr: number) => void;
type Solver_solve_t = (ptr: number, times: number, inputs: number, dinputs: number, outputs: number, doutputs: number) => number;
type Solver_init_t = (ptr: number, options: number) => void;
type Solver_number_of_states_t = (ptr: number) => number;
type Solver_number_of_inputs_t = (ptr: number) => number;
type Solver_number_of_outputs_t = (ptr: number) => number;

export interface SolverFunctions {
  Solver_create: Solver_create_t;
  Solver_destroy: Solver_destroy_t;
  Solver_solve: Solver_solve_t;
  Solver_init: Solver_init_t;
  Solver_number_of_states: Solver_number_of_states_t;
  Solver_number_of_inputs: Solver_number_of_inputs_t;
  Solver_number_of_outputs: Solver_number_of_outputs_t;
}

export function extract_solver_functions(obj: WebAssembly.WebAssemblyInstantiatedSource): SolverFunctions {
  return {
    Solver_create: obj.instance.exports.Sundials_create as Solver_create_t,
    Solver_destroy: obj.instance.exports.Sundials_destroy as Solver_destroy_t,
    Solver_solve: obj.instance.exports.Sundials_solve as Solver_solve_t,
    Solver_init: obj.instance.exports.Sundials_init as Solver_init_t,
    Solver_number_of_states: obj.instance.exports.Sundials_number_of_states as Solver_number_of_states_t,
    Solver_number_of_inputs: obj.instance.exports.Sundials_number_of_inputs as Solver_number_of_inputs_t,
    Solver_number_of_outputs: obj.instance.exports.Sundials_number_of_outputs as Solver_number_of_outputs_t
  };
}

class Solver {
  pointer: number;
  number_of_inputs: number;
  number_of_outputs: number;
  number_of_states: number;
  options: Options;
  dummy_vector: Vector;
  private functions: SolverFunctions;
  private vectorFunctions: VectorFunctions;

  constructor(options: Options, modelId?: string) {
    const model = getModel(modelId);
    if (!model) {
      throw new Error(`Model ${modelId || 'default'} not found. Please compile the model first.`);
    }
    this.functions = model.solverFunctions;
    this.vectorFunctions = model.vectorFunctions;
    this.options = options;
    this.pointer = check_function(this.functions.Solver_create)();
    check_function(this.functions.Solver_init)(this.pointer, options.pointer);
    this.number_of_inputs = check_function(this.functions.Solver_number_of_inputs)(this.pointer);
    this.number_of_outputs = check_function(this.functions.Solver_number_of_outputs)(this.pointer);
    this.number_of_states = check_function(this.functions.Solver_number_of_states)(this.pointer);
    this.dummy_vector = new Vector([], this.vectorFunctions);
  }

  destroy() {
    check_function(this.functions.Solver_destroy)(this.pointer);
  }

  solve(times: Vector, inputs: Vector, outputs: Vector) {
    if (inputs.length() != this.number_of_inputs) {
      throw new Error(`Expected ${this.number_of_inputs} inputs, got ${inputs.length()}`);
    }
    if (times.length() < 2) {
      throw new Error("Times vector must have at least two elements");
    }
    const result = check_function(this.functions.Solver_solve)(this.pointer, times.pointer, inputs.pointer, this.dummy_vector.pointer, outputs.pointer, this.dummy_vector.pointer);
    if (result != 0) {
      throw new Error(this.options.stderr.readToString());
    }
  }

  solve_with_sensitivities(times: Vector, inputs: Vector, dinputs: Vector, outputs: Vector, doutputs: Vector) {
    if (inputs.length() != this.number_of_inputs) {
      throw new Error(`Expected ${this.number_of_inputs} inputs, got ${inputs.length()}`);
    }
    if (inputs.length() != dinputs.length()) {
      throw new Error(`Expected ${inputs.length()} dinputs, got ${dinputs.length()}`);
    }
    if (times.length() < 2) {
      throw new Error("Times vector must have at least two elements");
    }

    const result = check_function(this.functions.Solver_solve)(this.pointer, times.pointer, inputs.pointer, dinputs.pointer, outputs.pointer, doutputs.pointer);
    if (result != 0) {
      throw new Error(this.options.stderr.readToString());
    }
  }
}

export default Solver;