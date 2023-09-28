import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import { compileModel } from '../src/index';
import logistic_code from './logistic';


describe('Solver', function () {
  it('can compile a good model', function () {
    return compileModel(logistic_code).then(() => {
      assert(true);
    }).catch((e) => {
      assert.fail(e);
    });
  });

  it('fails on bad model', function () {
    return compileModel("a { 1 }").then(() => {
      assert.fail("Should have failed");
    }).catch((e) => {
      assert(true);
    });
  });
});


 