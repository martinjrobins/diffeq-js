import { check_function } from "./utils";

declare global {
  var vectorFunctions: VectorFunctions;
}

type Vector_create_t = () => number;
type Vector_destroy_t = (ptr: number) => void;
type Vector_linspace_create_t = (start: number, stop: number, len: number) => number;
type Vector_create_with_capacity_t = (len: number, capacity: number) => number;
type Vector_push_t = (ptr: number, value: number) => void;
type Vector_get_t = (ptr: number, index: number) => number;
type Vector_set_t = (ptr: number, index: number, value: number) => void;
type Vector_get_data_t = (ptr: number) => number;
type Vector_get_length_t = (ptr: number) => number;
type Vector_resize_t = (ptr: number, len: number) => void;

export interface VectorFunctions {
  Vector_create: Vector_create_t;
  Vector_destroy: Vector_destroy_t;
  Vector_linspace_create: Vector_linspace_create_t;
  Vector_create_with_capacity: Vector_create_with_capacity_t;
  Vector_push: Vector_push_t;
  Vector_get: Vector_get_t;
  Vector_set: Vector_set_t;
  Vector_get_data: Vector_get_data_t;
  Vector_get_length: Vector_get_length_t;
  Vector_resize: Vector_resize_t;
  memory: WebAssembly.Memory;
}

export function extract_vector_functions(obj: WebAssembly.WebAssemblyInstantiatedSource): VectorFunctions {
  return {
    Vector_create: obj.instance.exports.Vector_create as Vector_create_t,
    Vector_destroy: obj.instance.exports.Vector_destroy as Vector_destroy_t,
    Vector_linspace_create: obj.instance.exports.Vector_linspace_create as Vector_linspace_create_t,
    Vector_create_with_capacity: obj.instance.exports.Vector_create_with_capacity as Vector_create_with_capacity_t,
    Vector_push: obj.instance.exports.Vector_push as Vector_push_t,
    Vector_get: obj.instance.exports.Vector_get as Vector_get_t,
    Vector_set: obj.instance.exports.Vector_set as Vector_set_t,
    Vector_get_data: obj.instance.exports.Vector_get_data as Vector_get_data_t,
    Vector_get_length: obj.instance.exports.Vector_get_length as Vector_get_length_t,
    Vector_resize: obj.instance.exports.Vector_resize as Vector_resize_t,
    memory: obj.instance.exports.memory as WebAssembly.Memory
  };
}

class Vector {
  pointer: number;
  private functions: VectorFunctions;

  constructor(array: number[], functions?: VectorFunctions) {
    this.functions = functions || global.vectorFunctions;
    if (!this.functions) {
      throw new Error('Vector functions not available. Please compile the model first.');
    }
    this.pointer = check_function(this.functions.Vector_create_with_capacity)(0, array.length)
    let push = check_function(this.functions.Vector_push);
    for (let i = 0; i < array.length; i++) {
      push(this.pointer, array[i]);
    }
  }

  get(index: number) {
    return check_function(this.functions.Vector_get)(this.pointer, index);
  }

  getFloat64Array() {
    const length = check_function(this.functions.Vector_get_length)(this.pointer);
    const data = check_function(this.functions.Vector_get_data)(this.pointer);
    return new Float64Array(this.functions.memory.buffer, data, length);
  }

  destroy() {
    check_function(this.functions.Vector_destroy)(this.pointer);
  }

  resize(len: number) {
    check_function(this.functions.Vector_resize)(this.pointer, len);
  }

  length() {
    return check_function(this.functions.Vector_get_length)(this.pointer);
  }
}

export default Vector;