import { WASI, File, OpenFile, PreopenDirectory } from "@bjorn3/browser_wasi_shim";
import { extract_vector_functions } from "./vector";
import { extract_options_functions } from "./options";
import { extract_solver_functions } from "./solver";
import base from "/node_modules/base-x/src/index";

export { default as Vector } from "./vector";
export { default as Options } from "./options";
export { default as Solver } from "./solver";


let args: string[] = [];
let env: string[] = [];
let fds = [
    new OpenFile(new File([])), // stdin
    new OpenFile(new File([])), // stdout
    new OpenFile(new File([])), // stderr
];
let wasi = new WASI(args, env, fds);
let inst: WebAssembly.WebAssemblyInstantiatedSource | undefined = undefined;

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
    const string = new TextDecoder().decode(slice);
    return string;
  }
}

let stderr = new SimpleOpenFile(wasi.fds[2].file);
let stdout = new SimpleOpenFile(wasi.fds[1].file);

function getWasmMemory() {
  if (inst === undefined) {
    throw new Error("WASM module not loaded");
  }
  return inst.instance.exports.memory as WebAssembly.Memory;
}

const defaultBaseUrl = "https://diffeq-backend.fly.dev";

function compileModel(text: string, baseUrl: string = defaultBaseUrl) {
  const data = {
    text,
    name: "unknown",
  };
  const options: RequestInit = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = fetch(`${baseUrl}/compile`, options).then((response) => {
    if (!response.ok) {
      return response.text().then((text) => {
        throw text;
      });
    }
    return response;
  });
  return compileResponse(response);
}

function compileResponse(response: Promise<Response>) {
  const importObject = {
    "wasi_snapshot_preview1": wasi.wasiImport,
  };
  return WebAssembly.instantiateStreaming(response, importObject).then(
    (obj) => { 
      extract_vector_functions(obj);
      extract_options_functions(obj);
      extract_solver_functions(obj);
      inst = obj 
      wasi.initialize(inst.instance);
    },
  );
}

export { compileModel, compileResponse, getWasmMemory, stderr, stdout }







