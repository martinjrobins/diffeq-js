import Options from '../src/options';
import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import { compileModel, compileResponse } from '../src/index';
import * as fs from 'fs';
import logistic_code from './logistic';


describe('Options', function () {
  before(function () {
    return compileModel(logistic_code);
  });

  it('can construct and destroy', function () {
    let options = new Options({});
    options.destroy();
  });

  it('can set fixed_times', function () {
    let options = new Options({ fixed_times: true });
    assert.equal(options.get_fixed_times(), true);
    options.destroy();

    options = new Options({ fixed_times: false });
    assert.equal(options.get_fixed_times(), false);
    options.destroy();
  });

  it('can set print_stats', function () {
    let options = new Options({ print_stats: true });
    assert.equal(options.get_print_stats(), true);
    options.destroy();

    options = new Options({ print_stats: false });
    assert.equal(options.get_print_stats(), false);
    options.destroy();
  });

});