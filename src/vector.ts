import { check_function } from "./utils";

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


interface IVector {
  start?: number;
  stop?: number;
  len?: number;
  capacity?: number;
}

class Vector {
  pointer: number;
  constructor(IVector?: IVector) {
    if (IVector) {
      if (IVector.start && IVector.stop && IVector.len) {
        this.pointer = check_function(Vector_linspace_create)(IVector.start, IVector.stop, IVector.len);
      } else if (IVector.len && IVector.capacity) {
        this.pointer = check_function(Vector_create_with_capacity)(IVector.len, IVector.capacity);
      } else {
        throw new Error("Invalid arguments");
      }
    } else {
      this.pointer = check_function(Vector_create)();
    }
  }
  push(value: number) {
    check_function(Vector_push)(this.pointer, value);
  }
  get(index: number) {
    return check_function(Vector_get)(this.pointer, index);
  }
  set(index: number, value: number) {
    check_function(Vector_set)(this.pointer, index, value);
  }
  destroy() {
    check_function(Vector_destroy)(this.pointer);
  }
}

export default Vector;