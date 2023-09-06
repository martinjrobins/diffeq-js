import { WASI, File, OpenFile, PreopenDirectory } from "@bjorn3/browser_wasi_shim";
import { extract_vector_functions } from "./vector";
import { extract_options_functions } from "./options";
import { extract_solver_functions } from "./solver";


let args = ["bin", "arg1", "arg2"];
let env = ["FOO=bar"];
let fds = [
    new OpenFile(new File([])), // stdin
    new OpenFile(new File([])), // stdout
    new OpenFile(new File([])), // stderr
];
let wasi = new WASI(args, env, fds);
let inst: WebAssembly.WebAssemblyInstantiatedSource | undefined = undefined;

const baseUrl = "http://localhost:8080";

export function compileModel(text: string) {
  const response = fetch(`${baseUrl}/compile`);
  return compileResponse(response);
}

export function compileResponse(response: Promise<Response>) {
  const importObject = {
    "wasi_snapshot_preview1": wasi.wasiImport,
  };
  return WebAssembly.instantiateStreaming(response, importObject).then(
    (obj) => { 
      extract_vector_functions(obj);
      extract_options_functions(obj);
      extract_solver_functions(obj);
      inst = obj 
    },
  );
}







