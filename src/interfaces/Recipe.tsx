import Ingredient from "./Ingredient";

export default interface Recipe {
  idx: number;
  author: string;
  title: string;
  description: string;
  steps: string[];
  cookingTime?: number;
  servings?: string | null;
  ingredients: Ingredient[];
}

export interface RecipePreview {
  title: string;
  description: string;
  cookingTime?: number;
  servings?: string;
  idx: number;
}
