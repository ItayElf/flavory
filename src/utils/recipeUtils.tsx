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

export const getConvertable = (recipe: Recipe) => {
  return {
    volume: recipe.ingredients.filter((i) =>
      Object.keys(volumeUnits).includes(i.units.toLowerCase())
    ),
    weight: recipe.ingredients.filter((i) =>
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
