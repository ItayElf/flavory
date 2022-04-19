import { Suspense, useEffect, useState } from "react";
import { gql, useApolloClient } from "@apollo/client";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import Hashids from "hashids";
import useCurrentUser from "../hooks/useCurrentUser";
import Recipe from "../interfaces/Recipe";
import Loading from "../components/loading";
import { NotFound } from "../components/notFound";
import { Header } from "../components/header";
import { safeMutation } from "../utils/fetchUtils";
import { escape } from "../utils/fetchUtils";
import React from "react";
import useTitle from "../hooks/useTitle";

const RecipeEditor = React.lazy(() => import("../components/recipeEditor"));

const recipeQuery = (idx: number) => gql`
{
    recipe(idx: ${idx}) {
        idx
        author
        title
        description
        steps
        cookingTime
        servings
        ingredients {
            name
            quantity
            units
        }
    }
}`;

const editRecipe = (token: string, r: Recipe, image: string | null) => gql`
mutation {
    updateRecipe(
        token: "${escape(token)}", 
        author: "${escape(r.author)}", 
        cookingTime: ${r.cookingTime ?? "0"}, 
        description: "${escape(r.description)}", 
        idx: ${r.idx}, 
        ingredients: "${escape(JSON.stringify(r.ingredients))}", 
        servings: ${r.servings ? '"' + escape(r.servings) + '"' : '""'}, 
        steps: "${escape(JSON.stringify(r.steps))}", 
        ${image !== null ? 'image: "' + escape(image) + '"' : ""}
        title: "${escape(r.title)}" ) {
        recipe {
            idx
        }
    }
}
`;

export default function RecipeEdit() {
  const [recipe, setRecipe] = useState<Recipe | undefined | null>(null);
  const client = useApolloClient();
  const { id: encoded } = useParams();
  const id = (new Hashids().decode(encoded ?? "")[0] as number) ?? -1;
  const navigate = useNavigate();
  const user = useCurrentUser(true);
  const owner = user ? user.posts.indexOf(id) !== -1 : false;

  useTitle(`Edit ${recipe?.title ?? "Recipe"}`);

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const res = await client.query({ query: recipeQuery(id) });
        setRecipe(res.data.recipe);
      } catch (e) {
        setRecipe(undefined);
      }
    };
    getRecipe();
  }, [client, id]);

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
    setRecipe(null);
    await safeMutation(client, editRecipe, recipe, image);
    navigate(`/recipe/${encoded}`);
  };

  if (recipe === null || !user) {
    return <Loading className="h-screen" />;
  } else if (recipe === undefined) {
    return <NotFound className="h-screen" />;
  } else if (!owner) {
    return <Navigate to={`/recipe/${new Hashids().encode(id)}`} />;
  }

  return (
    <>
      <Header user={user} contentStyle="w-full" />
      <main className="mt-16">
        <Suspense fallback={<Loading />}>
          <RecipeEditor
            recipe={recipe}
            onDiscard={() => navigate(`/recipe/${encoded}`)}
            onSave={save}
          />
        </Suspense>
      </main>
    </>
  );
}
