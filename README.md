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

For example, the following code solves a classic DAE testcase,
the Robertson (1966) problem, which models the  kinetics of an autocatalytic
reaction, given by the following set of equations:

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

## Diffeq Domain Specific Language (DSL)

The library uses a domain specific language (DSL) for specifying DAE systems to
solve. The DSL is designed to be an easy and flexible language for specifying
DAE systems and is based on the idea that a DAE system can be specified by a set
of equations of the form:

$$F(\mathbf{u}, \mathbf{\dot{u}}, t) = G(\mathbf{u}, t)$$

where $\mathbf{u}$ is the vector of state variables, $\mathbf{\dot{u}}$ is the
vector of time derivatives of the state variables, and $t$ is the time. The DSL
allows the user to specify the state vector $\mathbf{u}$ and the vector of time
derivatives of the state vector $\mathbf{\dot{u}}$, vectors $F$ and $G$
calculated at each timestep, along with an arbitrary number of intermediate
scalars and vectors of the users that are required to calculate $F$ and $G$.

### Defining variables

To write down the robertson problem given above, we first define some scalar
variables that we will use in the equations:

```
k1 { 0.04 }
k2 { 10000 }
k3 { 30000000 }
```

The names `k1`, `k2`, and `k3` are arbitrary names and can be used to refer to
the values of these scalars. The values themselves are given within the curly
braces `{}`. Here they are given as constant values, but they could also be
given as functions of time (e.g. `k1 { 0.04 * sin(t) }`), or as functions of the
other variables in the system (e.g. `k2 { 10 * k1 }`).

### Specifying inputs

We also want to potentially vary these values and resolve the system for
different values of `k1`, `k2`, and `k3`. To do this, we add a line at the top
of the code to specify that these are input variables:

```
in = [k1, k2, k3]
```

### Defining state variables

Next we define the state variables of the system, $\mathbf{u}$, and their initial values

```
u_i {
  x = 1,
  y = 0,
  z = 0,
}
```

Here `u` is the name of the vector of state variables, and the subscript `_i`
indicates that this is a 1D vector (notice how `k1` etc. do not have a subscript
as they are defined as scalars) , and `x`, `y`, and `z` are defined as labels to
the 3 elements of the vector. The values of the state variables at the initial
time are given after the `=` sign.

We next define the time derivatives of the state variables, $\mathbf{\dot{u}}$:

```
dudt_i {
  dxdt = 1,
  dydt = 0,
  dzdt = 0,
}
```

Here the initial values of the time derivatives are given, but for dxdt and dydt
this initial value is not used as we give explicit equations for these below in
the `F_i` and `G_i` sections. For the third element of the vector, `dzdt`, the
initial value is used as a starting point to calculate a set of consistent
initial values for the state variables.

### Defining the DAE system equations

We now define the equations $F$ and $G$ that we want to solve, using the
variables that we have defined above, both the input parameters and the state
variables. 


```
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
```

### Specifying outputs

Finally, we specify the outputs of the system. These might be the state
variables themselves, or they might be other variables that are calculated from
the state variables. Here we specify that we want to output the state variables
`x`, `y`, and `z`:

```
out_i {
  x,
  y,
  z,
}
```


### Required variables

The DSL allows the user to specify an arbitrary number of intermediate variables, but certain variables are required to be defined. These are:

* `u_i` - the state variables
* `dudt_i` - the time derivatives of the state variables
* `F_i` - the vector $F(\mathbf{u}, \mathbf{\dot{u}}, t)$
* `G_i` - the vector $G(\mathbf{u}, t)$
* `out_i` - the output variables


## Compiling the DSL

The DSL is compiled to a WASM module using the `compileModel` function:

```javascript
import { compileModel } from 'diffeq-js';

const code = `...`;
compileModel(code).then(() => {
  // create Solver, Vector etc here
});
```

The `compileModel` function requires an active internet connection as it sends
the model code to a remote server for compilation to WASM. All the classes in
the library are wrappers around corresponding classes in the WASM module, and so
the `compileModel` function must be called successfully before any of the other
classes can be used. 

### Options

The `compileModel` function takes an `Options` object as its argument. The contructor for the `Options` class takes the following arguments:

* `print_stats` - statistics about each solve are printed to the console after each successful call to `solve`. Default: false
* `fixed_times` - if false (the default), the solver will consider the first element 
  of `times` to be the starting time point, and the second element to be the final time point, 
  between these two times the solver will choose the time points to output (these are returned in the `times` vector). 
  If true, the solver will only return solutions at the times specified in the input `times` vector. Default: false

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

## Contact

If you have any questions or comments, please file an issue on the
[GitHub](https://github.com/martinjrobins/diffeq-web) repository or contact the
author via [email](mailto:martinjrobins@gmail.com)





