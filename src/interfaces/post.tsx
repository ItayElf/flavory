import Recipe, { RecipePreview } from "./Recipe";
import Comment from "./comment";

export default interface Post {
  poster: string;
  recipe: Recipe;
  comments: Comment[];
  likes: string[];
  cooked: string[];
  timestamp: number;
  idx: number;
}

export interface PostPreview {
  poster: string;
  recipe: RecipePreview;
  likes: string[];
  cooked: string[];
  idx: number;
}
