import { stderr } from "./index";
import Options from "./options";
import { check_function } from "./utils";
import Vector from "./vector";

type Solver_create_t = () => number;
let Solver_create: Solver_create_t | undefined = undefined;
type Solver_destroy_t = (ptr: number) => void;
let Solver_destroy: Solver_destroy_t | undefined = undefined;
type Solver_solve_t = (ptr: number, times: number, inputs: number, outputs: number) => number;
let Solver_solve: Solver_solve_t | undefined = undefined;
type Solver_init_t = (ptr: number, options: number) => void;
let Solver_init: Solver_init_t | undefined = undefined;
type Solver_number_of_states_t = (ptr: number) => number;
let Solver_number_of_states: Solver_number_of_states_t | undefined = undefined;
type Solver_number_of_inputs_t = (ptr: number) => number;
let Solver_number_of_inputs: Solver_number_of_inputs_t | undefined = undefined;
type Solver_number_of_outputs_t = (ptr: number) => number;
let Solver_number_of_outputs: Solver_number_of_outputs_t | undefined = undefined;


export function extract_solver_functions(obj: WebAssembly.WebAssemblyInstantiatedSource) {
  Solver_create = obj.instance.exports.Sundials_create as Solver_create_t;
  Solver_destroy = obj.instance.exports.Sundials_destroy as Solver_destroy_t;
  Solver_solve = obj.instance.exports.Sundials_solve as Solver_solve_t;
  Solver_init = obj.instance.exports.Sundials_init as Solver_init_t;
  Solver_number_of_states = obj.instance.exports.Sundials_number_of_states as Solver_number_of_states_t;
  Solver_number_of_inputs = obj.instance.exports.Sundials_number_of_inputs as Solver_number_of_inputs_t;
  Solver_number_of_outputs = obj.instance.exports.Sundials_number_of_outputs as Solver_number_of_outputs_t;
}

class Solver {
  pointer: number;
  number_of_inputs: number;
  number_of_outputs: number;
  number_of_states: number;
  options: Options;
  constructor(options: Options) {
    this.options = options;
    this.pointer = check_function(Solver_create)();
    check_function(Solver_init)(this.pointer, options.pointer);
    this.number_of_inputs = check_function(Solver_number_of_inputs)(this.pointer);
    this.number_of_outputs = check_function(Solver_number_of_outputs)(this.pointer);
    this.number_of_states = check_function(Solver_number_of_states)(this.pointer);
  }
  destroy() {
    check_function(Solver_destroy)(this.pointer);
  }
  solve(times: Vector, inputs: Vector, outputs: Vector) {
    if (inputs.length() != this.number_of_inputs) {
      throw new Error(`Expected ${this.number_of_inputs} inputs, got ${inputs.length}`);
    }
    if (times.length() < 2) {
      throw new Error("Times vector must have at least two elements");
    }
    const result = check_function(Solver_solve)(this.pointer, times.pointer, inputs.pointer, outputs.pointer);
    if (result != 0) {
      throw new Error(stderr.readToString());
    }
  }
}

export default Solver;