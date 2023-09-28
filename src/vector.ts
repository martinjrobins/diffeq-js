import { check_function } from "./utils";
import { getWasmMemory } from "./index";

type Vector_create_t = () => number;
let Vector_create: Vector_create_t | undefined = undefined;
type Vector_destroy_t = (ptr: number) => void;
let Vector_destroy: Vector_destroy_t | undefined = undefined;
type Vector_linspace_create_t = (start: number, stop: number, len: number) => number;
let Vector_linspace_create: Vector_linspace_create_t | undefined = undefined;
type Vector_create_with_capacity_t = (len: number, capacity: number) => number;
let Vector_create_with_capacity: Vector_create_with_capacity_t | undefined = undefined;
type Vector_push_t = (ptr: number, value: number) => void;
let Vector_push: Vector_push_t | undefined = undefined;
type Vector_get_t = (ptr: number, index: number) => number;
let Vector_get: Vector_get_t | undefined = undefined;
type Vector_set_t = (ptr: number, index: number, value: number) => void;
let Vector_set: Vector_set_t | undefined = undefined;
type Vector_get_data_t = (ptr: number) => number;
let Vector_get_data: Vector_get_data_t | undefined = undefined;
type Vector_get_length_t = (ptr: number) => number;
let Vector_get_length: Vector_get_length_t | undefined = undefined;


export function extract_vector_functions(obj: WebAssembly.WebAssemblyInstantiatedSource) {
  Vector_create = obj.instance.exports.Vector_create as Vector_create_t;
  Vector_destroy = obj.instance.exports.Vector_destroy as Vector_destroy_t;
  Vector_linspace_create = obj.instance.exports.Vector_linspace_create as Vector_linspace_create_t;
  Vector_create_with_capacity = obj.instance.exports.Vector_create_with_capacity as Vector_create_with_capacity_t;
  Vector_push = obj.instance.exports.Vector_push as Vector_push_t;
  Vector_get = obj.instance.exports.Vector_get as Vector_get_t;
  Vector_set = obj.instance.exports.Vector_set as Vector_set_t;
  Vector_get_data = obj.instance.exports.Vector_get_data as Vector_get_data_t;
  Vector_get_length = obj.instance.exports.Vector_get_length as Vector_get_length_t;
}

class Vector {
  pointer: number;
  constructor(array: number[]) {
    this.pointer = check_function(Vector_create_with_capacity)(0, array.length)
    let push = check_function(Vector_push);
    for (let i = 0; i < array.length; i++) {
      push(this.pointer, array[i]);
    }
  }
  get(index: number) {
    return check_function(Vector_get)(this.pointer, index);
  }
  getFloat64Array() {
    const length = check_function(Vector_get_length)(this.pointer);
    const data = check_function(Vector_get_data)(this.pointer);
    return new Float64Array(getWasmMemory().buffer, data, length);
  }
  destroy() {
    check_function(Vector_destroy)(this.pointer);
  }
  length() {
    return check_function(Vector_get_length)(this.pointer);
  }
}

export default Vector;