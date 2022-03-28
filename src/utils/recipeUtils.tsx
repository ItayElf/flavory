import Recipe from "../interfaces/Recipe";

export const scale = (recipe: Recipe, factor: number) => {
  recipe.ingredients = recipe.ingredients.map((v) => {
    return { ...v, quantity: v.quantity * factor };
  });
  if (recipe.servings === undefined || recipe.servings === null) {
    return recipe;
  }
  const nums = [...recipe.servings.matchAll(/\d+?/g)].reduce((obj, x) => {
    obj[x[0]] = parseInt(x[0]) * factor;
    return obj;
  }, {});
  const keys = Object.keys(nums).sort((a, b) =>
    factor < 1 ? parseInt(a) - parseInt(b) : parseInt(b) - parseInt(a)
  );
  keys.forEach(
    (k) =>
      (recipe.servings = recipe.servings?.replace(
        k,
        nums[k] % 1 ? nums[k] + "" : parseInt(nums[k]) + ""
      ))
  );

  return recipe;
};
