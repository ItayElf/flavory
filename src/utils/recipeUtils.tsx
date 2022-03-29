import { units, volumeUnits, weightUnits } from "../constants";
import Ingredient from "../interfaces/Ingredient";
import Recipe from "../interfaces/Recipe";

export const scaleRecipe = (recipe: Recipe, factor: number) => {
  const newRecipe = { ...recipe };
  newRecipe.ingredients = newRecipe.ingredients.map((v) => {
    return { ...v, quantity: v.quantity * factor };
  });
  newRecipe.servings = scaleString(newRecipe.servings, factor);

  return newRecipe;
};

export const scaleString = (
  value: string | null | undefined,
  factor: number
) => {
  if (!value) {
    return value;
  }
  // @ts-ignore
  const nums = [...value.matchAll(/\d+?/g)].reduce((obj, x) => {
    obj[x[0]] = parseInt(x[0]) * factor;
    return obj;
  }, {});
  const keys = Object.keys(nums).sort((a, b) =>
    factor < 1 ? parseInt(a) - parseInt(b) : parseInt(b) - parseInt(a)
  );
  keys.forEach(
    (k) =>
      (value = value?.replace(
        k,
        nums[k] % 1 ? nums[k] + "" : parseInt(nums[k]) + ""
      ))
  );
  return value;
};

export const getConvertable = (ings: Ingredient[]) => {
  return {
    volume: ings.filter((i) =>
      Object.keys(volumeUnits).includes(i.units.toLowerCase())
    ),
    weight: ings.filter((i) =>
      Object.keys(weightUnits).includes(i.units.toLowerCase())
    ),
  };
};

export const convertIngredient = (ing: Ingredient, to: string) => {
  if (!units.includes(ing.units)) {
    throw Error("Non convertable ingredient");
  }
  const isVolume = Object.keys(volumeUnits).includes(ing.units);
  const pool = isVolume ? volumeUnits : weightUnits;
  const amount =
    Math.round((ing.quantity * pool[ing.units] * 100) / pool[to]) / 100;
  if (isNaN(amount)) {
    throw Error(
      `Units mismatch! ing is ${ing.units} cannot be converted to ${to}`
    );
  }
  return {
    ...ing,
    units: to,
    quantity: amount,
  } as Ingredient;
};

export const convertDegrees = (originalSteps: string[], toCelsius: boolean) => {
  const regexes = toCelsius
    ? {
        F: [/(\d+?)[ ]?F\b/g, "C"],
        f: [/(\d+?)[ ]?f\b/g, "c"],
        fahrenheit: [/(\d+?)[ ]?fahrenheit\b/g, "celsius"],
        Fahrenheit: [/(\d+?)[ ]?Fahrenheit\b/g, "Celsius"],
        degrees: [/(\d+?)[ ]?degrees\b/g, "celsius"],
        Degrees: [/(\d+?)[ ]?Degrees\b/g, "Celsius"],
      }
    : {
        C: [/(\d+?)[ ]?C\b/g, "F"],
        c: [/(\d+?)[ ]?c\b/g, "f"],
        celsius: [/(\d+?)[ ]?celsius\b/g, "fahrenheit"],
        Celsius: [/(\d+?)[ ]?Celsius\b/g, "Fahrenheit"],
        degrees: [/(\d+?)[ ]?degrees\b/g, "fahrenheit"],
        Degrees: [/(\d+?)[ ]?Degrees\b/g, "Fahrenheit"],
      };

  const steps: string[] = [];
  originalSteps.forEach((s) => {
    let step = s;
    Object.keys(regexes).forEach((k) => {
      // @ts-ignore
      [...s.matchAll(regexes[k][0])].forEach((arr) => {
        const val = parseInt(arr[1]);
        const calc = Math.round(
          toCelsius ? ((val - 32) * 5) / 9 : (val * 9) / 5 + 32
        );
        step = step.replace(
          arr[0],
          arr[0].replace(k, regexes[k][1]).replace(val + "", calc + "")
        );
      });
    });
    steps.push(step);
  });
  return steps;
};
