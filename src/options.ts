import { check_function } from "./utils";

type Options_create_t = () => number;
let Options_create: Options_create_t | undefined = undefined;
type Options_destroy_t = (ptr: number) => void;
let Options_destroy: Options_destroy_t | undefined = undefined;
type Options_set_fixed_times_t = (ptr: number, fixed_times: number) => void;
let Options_set_fixed_times: Options_set_fixed_times_t | undefined = undefined;
type Options_set_print_stats_t = (ptr: number, print_stats: number) => void;
let Options_set_print_stats: Options_set_print_stats_t | undefined = undefined;
type Options_get_fixed_times_t = (ptr: number) => number;
let Options_get_fixed_times: Options_get_fixed_times_t | undefined = undefined;
type Options_get_print_stats_t = (ptr: number) => number;
let Options_get_print_stats: Options_get_print_stats_t | undefined = undefined;

export function extract_options_functions(obj: WebAssembly.WebAssemblyInstantiatedSource) {
  Options_create = obj.instance.exports.Options_create as Options_create_t;
  Options_destroy = obj.instance.exports.Options_destroy as Options_destroy_t;
  Options_set_fixed_times = obj.instance.exports.Options_set_fixed_times as Options_set_fixed_times_t;
  Options_set_print_stats = obj.instance.exports.Options_set_print_stats as Options_set_print_stats_t;
  Options_get_fixed_times = obj.instance.exports.Options_get_fixed_times as Options_get_fixed_times_t;
  Options_get_print_stats = obj.instance.exports.Options_get_print_stats as Options_get_print_stats_t;
}

class Options {
  pointer: number;
  constructor({ fixed_times = false, print_stats = false }) {
    this.pointer = check_function(Options_create)();
    check_function(Options_set_fixed_times)(this.pointer, fixed_times ? 1 : 0);
    check_function(Options_set_print_stats)(this.pointer, print_stats ? 1 : 0);
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
}
  
export default Options;