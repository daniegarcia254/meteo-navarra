"use strict";

const PARAMETERS = [
  { id: 1001, name: "Temperatura media", unit: "°C" },
  { id: 1004, name: "Humedad relativa media", unit: "%" },
  { id: 1007, name: "Precipitación acumulada", unit: "l/m²" },
  { id: 1008, name: "Vel. media viento", unit: ["m/s", "km/h"] },
];

const PORT = 3001;

export { PARAMETERS, PORT };
