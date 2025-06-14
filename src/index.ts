import {File, OpenFile, WASI} from "@bjorn3/browser_wasi_shim";
import {extract_vector_functions} from "./vector";
import {extract_options_functions} from "./options";
import {extract_solver_functions} from "./solver";

export { default as Vector } from "./vector";
export { default as Options, OptionsJacobian, OptionsLinearSolver, OptionsPreconditioner } from "./options";
export { default as Solver } from "./solver";

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
    return new TextDecoder().decode(slice);
  }
}

const defaultBaseUrl = "https://compbio.fhs.um.edu.mo/diffeq";

function createWasi() {
  let args: string[] = [];
  let env: string[] = [];
  let fds = [
    new OpenFile(new File([])), // stdin
    new OpenFile(new File([])), // stdout
    new OpenFile(new File([])), // stderr
  ];
  return new WASI(args, env, fds);
}

class ModelRegistry {
  private static models: Map<string, any> = new Map();
  private static defaultModel: any = null;

  static register(id: string | undefined, model: any) {
    if (id) {
      this.models.set(id, model);
    } else {
      this.defaultModel = model;
    }
  }

  static get(id?: string) {
    if (id) {
      return this.models.get(id);
    }
    return this.defaultModel;
  }
}

function compileResponse(response: Promise<Response>) {
  const wasi = createWasi();
  const importObject = {
    "wasi_snapshot_preview1": wasi.wasiImport,
  };
  return WebAssembly.instantiateStreaming(response, importObject).then(
    (obj) => { 
      wasi.initialize({
        exports: {
          memory: obj.instance.exports.memory as WebAssembly.Memory,
        },
      });
      const stderr = new SimpleOpenFile((wasi.fds[2] as OpenFile).file);
      const stdout = new SimpleOpenFile((wasi.fds[1] as OpenFile).file);
      const vectorFunctions = extract_vector_functions(obj);
      const optionsFunctions = extract_options_functions(obj);
      const solverFunctions = extract_solver_functions(obj);
      
      // Set global functions
      global.vectorFunctions = vectorFunctions;
      global.optionsFunctions = optionsFunctions;
      global.solverFunctions = solverFunctions;
      global.stderr = stderr;
      global.stdout = stdout;
      
      return {
        instance: obj,
        stderr,
        stdout,
        vectorFunctions,
        optionsFunctions,
        solverFunctions
      };
    },
  );
}

export async function compileModel(code: string, id?: string) {
  const data = {
    text: code,
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
  const response = fetch(`${defaultBaseUrl}/compile`, options).then((response) => {
    if (!response.ok) {
      return response.text().then((text) => {
        throw text;
      });
    }
    return response;
  });
  const model = await compileResponse(response);
  ModelRegistry.register(id, model);
  return model;
}

export function getModel(id?: string) {
  return ModelRegistry.get(id);
}







