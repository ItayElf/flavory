import { useNavigate } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";
import { gql, useApolloClient } from "@apollo/client";
import { Header } from "../components/header";
import { RecipeEditor } from "../components/recipeEditor";
import Recipe from "../interfaces/Recipe";
import { escape, safeMutation } from "../utils/fetchUtils";

const makePost = (token: string, r: Recipe, image: string | null) => gql`
mutation {
    makePost(
        token: "${escape(token)}", 
        author: "${escape(r.author)}", 
        cookingTime: ${r.cookingTime ?? "0"}, 
        description: "${escape(r.description)}", 
        idx: ${r.idx}, 
        ingredients: "${escape(JSON.stringify(r.ingredients))}", 
        servings: ${r.servings ? '"' + escape(r.servings) + '"' : '""'}, 
        steps: "${escape(JSON.stringify(r.steps))}", 
        ${image !== null ? 'image: "' + escape(image) + '"' : ""}
        title: "${escape(r.title)}"
    ) {
        post {
            idx
        }
    }
}
`;

export function RecipeCreate() {
  const user = useCurrentUser(true);
  const client = useApolloClient();
  const navigate = useNavigate();

  const save = async (recipe: Recipe, image: string | null) => {
    if (!recipe.title) {
      alert("Please add a title for the recipe");
      return;
    } else if (recipe.ingredients.length === 0) {
      alert("Please add ingredients for the recipe");
      return;
    } else if (recipe.steps.length === 0) {
      alert("please add steps for the recipe");
      return;
    }
    console.log(recipe);
    await safeMutation(client, makePost, recipe, image);
    navigate(`/feed`);
  };

  return (
    <>
      <Header user={user} contentStyle="w-full" />
      <main className="mt-16">
        <RecipeEditor onDiscard={() => navigate(-1)} onSave={save} />
      </main>
    </>
  );
}
