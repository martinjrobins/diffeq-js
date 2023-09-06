import { check_function } from "./utils";

type Options_create_t = () => number;
let Options_create: Options_create_t | undefined = undefined;
type Options_destroy_t = (ptr: number) => void;
let Options_destroy: Options_destroy_t | undefined = undefined;

export function extract_options_functions(obj: WebAssembly.WebAssemblyInstantiatedSource) {
  Options_create = obj.instance.exports.Options_create as Options_create_t;
  Options_destroy = obj.instance.exports.Options_destroy as Options_destroy_t;
}

class Options {
  pointer: number;
  constructor() {
    this.pointer = check_function(Options_create)();
  }
  destroy() {
    check_function(Options_destroy)(this.pointer);
  }
}
  
export default Options;