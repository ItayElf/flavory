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
