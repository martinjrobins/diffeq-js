import Options from '../src/options';
import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import { compileResponse } from '../src';
import * as fs from 'fs';


describe('Options', function () {
  before(function () {
    const data = fs.readFileSync("logistic.wasm");
    const blob = new Blob([data], { type: "application/wasm" });
    const promise = new Response(blob);
    return compileResponse(Promise.resolve(promise));
  });

  it('can construct and destroy', function () {
    let options = new Options();
    options.destroy();
  });

});