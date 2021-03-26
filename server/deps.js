"use strict";

// Cheerio
export { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";

// Ramda
export {
  always as K,
  compose as B,
  equals,
  forEach,
  identity as I,
  join,
  keys,
  map,
  omit,
  pathOr,
  pipe,
  prop,
  propOr,
  reduce,
  replace,
  reverse,
  split,
  trim,
  when,
} from "https://deno.land/x/ramda@v0.27.2/mod.ts";

import {
  addIndex,
  find,
  forEach,
  groupBy,
  prop,
  propEq,
} from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const forEachIndexed = addIndex(forEach);
const findBy = (field) => (value) => find(propEq(field)(value));
const groupByProp = (field) => groupBy(prop(field));
const parallelAp = (f) => (g) => (x) => [f(x), g(x)];

export { findBy, forEachIndexed, groupByProp, parallelAp };

// Utils
const toFixed = (digits) => (number) => number.toFixed(digits);

export { toFixed };

// Date functions
export {
  format as formatDate,
} from "https://deno.land/x/date_fns@v2.15.0/fp/index.js";

const newDate = (d) => new Date(d);
export { newDate };
