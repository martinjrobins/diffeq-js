import { WASI, File, OpenFile, PreopenDirectory } from "@bjorn3/browser_wasi_shim";

let args = ["bin", "arg1", "arg2"];
let env = ["FOO=bar"];
let fds = [
    new OpenFile(new File([])), // stdin
    new OpenFile(new File([])), // stdout
    new OpenFile(new File([])), // stderr
];
let wasi = new WASI(args, env, fds);
let inst: WebAssembly.WebAssemblyInstantiatedSource | undefined = undefined;

async function compileModel(text: string) {
  const response = fetch("url/to/wasm");
  const importObject = {
    "wasi_snapshot_preview1": wasi.wasiImport,
  };
  return WebAssembly.instantiateStreaming(response, importObject).then(
    (obj) => { inst = obj },
  );
}







