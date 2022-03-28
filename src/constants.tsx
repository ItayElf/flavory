export const apiUrl = "http://192.168.1.16:5000/";

export const volumeUnits = {
  milliliter: 1,
  milliliters: 1,
  liter: 1000,
  liters: 1000,
  tbsp: 14.786,
  tsp: 4.928,
  cup: 240,
  cups: 240,
  pint: 473.176,
  pints: 473.176,
  floz: 29.573,
};

export const weightUnits = {
  gram: 1,
  grams: 1,
  kg: 1000,
  kgs: 1000,
  lb: 453.592,
  lbs: 453.592,
  oz: 28.349,
};

export const units = [...Object.keys(volumeUnits), ...Object.keys(weightUnits)];
