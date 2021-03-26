"use strict";

import { B, equals, propOr } from "./deps.js";
import { json, opine } from "https://deno.land/x/opine@1.2.0/mod.ts";
import { schemas, vs } from "./schemas.js";

import { LRU } from "https://deno.land/x/lru@1.0.2/mod.ts";
import { PORT } from "./constants.js";
import { fetchData } from "./controller.js";
import { parse } from "https://deno.land/std/flags/mod.ts";

const lru = new LRU(500);

const getName = propOr("")("name");
const isValidationError = B(equals("ValueSchemaError"), getName);

const app = opine();
app.use(json());

const checkSchemaMiddleware = (req, res, next) => {
  try {
    vs.applySchemaObject(schemas[req.method][req.path], req.query);
    next();
  } catch (error) {
    const statusCode = isValidationError(error) ? 404 : 500;
    res.setStatus(statusCode).json({ error: error.message, statusCode });
  }
};

app.use(checkSchemaMiddleware);

app.get("/api", (req, res) => {
  const cacheKey = JSON.stringify(res.query);
  return lru.has(cacheKey) ? res.json(lru.get(cacheKey)) : fetchData(req.query)
    .then((result) => (lru.set(cacheKey, result), result))
    .then((result) => res.json(result))
    .catch(() => res.setStatus(500).json({ error: "message" }));
});

const { args } = Deno;
const argPort = parse(args).port;
const port = argPort ? Number(argPort) : PORT;

app.listen(port, () => console.log(`Listening on localhost:${port}`));
