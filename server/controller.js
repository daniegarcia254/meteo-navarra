"use strict";

import {
  B,
  cheerio,
  findBy,
  forEach,
  forEachIndexed,
  formatDate,
  groupByProp,
  I,
  join,
  K,
  keys,
  map,
  newDate,
  omit,
  parallelAp,
  pathOr,
  pipe,
  prop,
  reduce,
  reverse,
  split,
  toFixed,
  trim,
  when,
} from "./deps.js";

import { PARAMETERS } from "./constants.js";
import { qs } from "https://deno.land/x/deno_qs/mod.ts";

const stringifyParams = (params) =>
  qs.stringify(params, { encode: false, indices: false });

const getChildrenData = pathOr("")([0, "children", 0, "data"]);
const omitDates = map(omit(["date"]));
const reverseDate = pipe(split("/"), reverse, join("-"));
const getDateValue = pipe(
  getChildrenData,
  trim,
  reverseDate,
  newDate,
  formatDate("dd/MM/YYY"),
);
const getValue = pipe(parseFloat, toFixed(2), parseFloat, when(isNaN)(K("-")));

const baseUrl = "http://meteo.navarra.es/estaciones/estacion_datos_m.cfm?";

const fetchData = (queryParams) => {
  const { parameters, endDate, startDate, station } = queryParams;
  const url = `${baseUrl}${
    stringifyParams({
      p_d: parameters,
      fecha_desde: startDate,
      fecha_hasta: endDate,
      IDEstacion: station,
    })
  }`;

  console.log(url);

  return fetch(url)
    .then((response) => response.text())
    .then((textData) => cheerio.load(textData))
    .then(($) => {
      const results = [];
      forEachIndexed((paramId, paramIdx) => {
        const paramInfo = findBy("id")(parseInt(paramId))(PARAMETERS);
        const valueElements = $(
          `.c1 table tbody tr td:nth-child(${paramIdx + 2}) font`,
        );
        forEach((element) => {
          const parentSiblings = $(element).parent().siblings();
          results.push({
            date: getDateValue(parentSiblings || []),
            id: paramId,
            value: getValue($(element).text()),
            text: `${paramInfo.name} (${paramInfo.unit})`,
          });
        })(valueElements);
      })(parameters);

      return pipe(
        groupByProp("date"),
        parallelAp(I)(keys),
        ([obj, keys]) =>
          reduce((acc, key) => ({
            ...acc,
            [key]: B(omitDates, prop(key))(obj),
          }))({})(keys),
      )(results);
    });
};

export { fetchData };
