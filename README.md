# Diffeq-js

This library provides a set of classes for solving [differential-algebraic
equations
(DAEs)](https://en.wikipedia.org/wiki/Differential-algebraic_system_of_equations)
in JavaScript. It is a thin wrapper around a [WebAssembly
(WASM)](https://webassembly.org/) runtime that is compiled from a [domain
specific language (DSL)](https://en.wikipedia.org/wiki/Domain-specific_language)
for specifying DAE systems. Compilation of the DSL to WASM is performed on a
remote server, so an active internet connection is required to use the library.
Once compiled, the WASM module is returned to the client and can be used to
solve the DAE system as many times as required.

For an online interactive demo of the library, see the
[diffeq-web](https://martinjrobins.github.io/diffeq-web/) website.

For an example of how to use the library directly, the following code solves a
classic DAE testcase, the Robertson (1966) problem, which models the  kinetics
of an autocatalytic reaction, given by the following set of equations:

$$
\begin{align}
\frac{dx}{dt} &= -0.04x + 10^4 y z \\
\frac{dy}{dt} &= 0.04x - 10^4 y z - 3 \cdot 10^7 y^2 \\
0 &= x + y + z - 1
\end{align}
$$

The javascript code to solve this problem is as follows:


```javascript
import { compileModel, Options, Solver, Vector } from 'diffeq-js';

const code = `
in = [k1, k2, k3]
k1 { 0.04 }
k2 { 10000 }
k3 { 30000000 }
u_i {
  x = 1,
  y = 0,
  z = 0,
}
dudt_i {
  dxdt = 1,
  dydt = 0,
  dzdt = 0,
}
F_i {
  dxdt,
  dydt,
  0,
}
G_i {
  -k1 * x + k2 * y * z,
  k1 * x - k2 * y * z - k3 * y * y,
  1 - x - y - z,
}
out_i {
  x,
  y,
  z,
}`;

const model = compileModel(code).then((model) => {
  const options = new Options();

  // create solver with default options
  const solver = new Solver(options);

  // solve the model at k1 = 0.04, k2 = 1e4, k3 = 3e7
  const inputs = new Vector([0.04, 1e4, 3e7]);

  // create a vector to store the output
  const outputs = new Vector([]);

  // solve the model from t = 0 to t = 1e5
  const times = new Vector([0, 1e5]);

  // solve the model, afterwards times will contain the times at which the
  // solution was computed, and outputs will contain the solution itself
  // in a vector of length 3 * times.length, where the first 3 elements
  // are the solution at times[0], the next 3 elements are the solution at
  // times[1], etc.
  solver.solve(times, inputs, outputs);

  // The contents of times and outputs are stored in WASM linear memory.
  // To access the contents of the vectors, use the getFloat64Array method
  // which returns a Float64Array view of the vector's contents
  console.log('times', times.getFloat64Array());
  console.log('outputs', outputs.getFloat64Array());
});
```

## Installation

This library is available on npm, and can be installed with the following
command:

```bash
npm install @martinjrobins/diffeq-js
```

## DiffSL Domain Specific Language (DSL)

Please see the [language documentation](https://martinjrobins.github.io/diffsl/)


## Compiling the DSL

The DSL is compiled to a WASM module using the `compileModel` function:

```javascript
import { compileModel } from 'diffeq-js';

const code = `...`;
// Compile with an optional ID to support multiple models
await compileModel(code, 'model1');
```

The `compileModel` function requires an active internet connection as it sends
the model code to a remote server for compilation to WASM. All the classes in
the library are wrappers around corresponding classes in the WASM module, and so
the `compileModel` function must be called successfully before any of the other
classes can be used.

### Multiple Models

Version 0.2.0 introduces support for compiling and solving multiple models simultaneously. Each model can be given a unique identifier when compiled:

```javascript
// Compile multiple models
await compileModel(code1, 'model1');
await compileModel(code2, 'model2');

// Create solvers for each model
const options1 = new Options({}, 'model1');
const solver1 = new Solver(options1, 'model1');

const options2 = new Options({}, 'model2');
const solver2 = new Solver(options2, 'model2');
```

### Options

The `Options` class constructor takes an options object and an optional model ID:

```javascript
const options = new Options({
  print_stats: false,  // Print statistics after each solve
  fixed_times: false,  // Use fixed time points or let solver choose
  mxsteps: 500,        // Maximum number of steps
  min_step: 0.0,       // Minimum step size
  max_step: Infinity,  // Maximum step size
  atol: 1e-6,         // Absolute tolerance
  rtol: 1e-6,         // Relative tolerance
  debug: false,        // Enable debug output
  fwd_sens: false,     // Enable forward sensitivity analysis
  linear_solver: OptionsLinearSolver.DENSE,  // Linear solver type
  preconditioner: OptionsPreconditioner.NONE, // Preconditioner type
  jacobian: OptionsJacobian.DENSE_JACOBIAN,  // Jacobian type
  linsol_max_iterations: 100  // Maximum iterations for linear solver
}, 'model1');
```

### Compilation errors

If the model code contains errors, the `compileModel` function will throw an error which is a `string` containing the error message. For example, if we try to compile the following code:

```javascript
import { compileModel } from 'diffeq-js';

const code = `
k1 { 10 * k2 }
`;

compileModel(code).then(() => {
  // create Solver, Vector etc here
}).catch((error) => {
  console.log(error);
});
```

then the following error is thrown:

```
Line 1, Column 11: Error: cannot find variable k2
Line 1, Column 1: Error: tensor k1 has no elements
Line 1, Column 1: Error: missing 'u' array
Line 1, Column 1: Error: missing 'dudt' array
Line 1, Column 1: Error: missing 'F' array
Line 1, Column 1: Error: missing 'G' array
Line 1, Column 1: Error: missing 'out' array
```

### Using diffeq from other languages

This library is only a thin wrapper around the WASM module and the remote server
that provides the compilation service, and so it is possible to compile the diffeq DSL and use the
provided WASM module directly from other languages. 

The diffeq-js library uses the [WASI browser shim](https://github.com/bjorn3/browser_wasi_shim) to provide a
[WASI](https://wasi.dev/) environment for the WASM module, and so it is possible
to use the WASM module from other languages that support WASI directly, such as
Rust or C, or from other WASM runtimes like the [Wasmer](https://wasmer.io/)
[SDK](https://github.com/wasmerio/wasmer), which supports a wide range of
languages including C, C++, C#, Go, Java, PHP, Python, Ruby, and Rust.

If you are interested in using the diffeq DSL from other languages, you could do one of the following:

* Contact the author directly, Martin Robinson, via [email](mailto:martinjrobins@gmail.com), to discuss your requirements and see if a collaboration is possible
* Consult the source code of the diffeq-js library, which is available on [GitHub](https://github.com/martinjrobins/diffeq-js), and port the code to your language of choice

## Contact

If you have any questions or comments, please file an issue on the
[GitHub](https://github.com/martinjrobins/diffeq-js) repository or contact the
author via [email](mailto:martinjrobins@gmail.com)





