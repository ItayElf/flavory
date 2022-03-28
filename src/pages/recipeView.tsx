import { useParams, useNavigate } from "react-router-dom";
import Hashids from "hashids";
import Recipe from "../interfaces/Recipe";
import { useEffect, useState } from "react";
import { gql, useApolloClient } from "@apollo/client";
import useCurrentUser from "../hooks/useCurrentUser";
import Loading from "../components/loading";
import { Header } from "../components/header";
import RecipeContent from "../components/recipeContent";
import {
  MdSyncAlt,
  MdShare,
  MdPrint,
  MdOutlineBook,
  MdEdit,
} from "react-icons/md";
import { NotFound } from "../components/notFound";
import ScaleModal from "../components/modals/scaleModal";
import { scaleRecipe } from "../utils/recipeUtils";

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

export default function RecipeView() {
  const [original, setOriginal] = useState<Recipe | undefined | null>(null);
  const [recipe, setRecipe] = useState<Recipe | undefined | null>(null);
  const [isScale, setIsScale] = useState(false);
  const client = useApolloClient();
  const navigate = useNavigate();
  const { id: encoded } = useParams();
  const id = (new Hashids().decode(encoded ?? "")[0] as number) ?? -1;
  const user = useCurrentUser(false);
  const owner = user ? user.posts.indexOf(id) !== -1 : false;

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const res = await client.query({
          query: recipeQuery(id),
          fetchPolicy: "no-cache",
        });
        setRecipe(res.data.recipe);
        setOriginal({ ...res.data.recipe });
      } catch (e) {
        setRecipe(undefined);
        setOriginal(undefined);
      }
    };
    getRecipe();
  }, [client, id]);

  if (recipe === null || original === null) {
    return <Loading className="h-screen w-screen" />;
  } else if (recipe === undefined || original === undefined) {
    return <NotFound className="h-screen" />;
  }
  return (
    <>
      <Header user={user} contentStyle="w-full sm:w-[858px]" />
      <div className="mt-24 w-full sm:mx-auto sm:w-[856px]">
        <div className="flex items-center justify-evenly bg-white py-2 sm:shadow sm:shadow-primary-200 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            enableBackground="new 0 0 24 24"
            viewBox="0 0 24 24"
            className="h-8 w-8 cursor-pointer text-primary-600"
            onClick={() => setIsScale(true)}
          >
            <g>
              <path
                fill="#5DB65A"
                d="M14,11V8c4.56-0.58,8-3.1,8-6H2c0,2.9,3.44,5.42,8,6l0,3c-3.68,0.73-8,3.61-8,11h6v-2H4.13c0.93-6.83,6.65-7.2,7.87-7.2 s6.94,0.37,7.87,7.2H16v2h6C22,14.61,17.68,11.73,14,11z M18.87,4C17.5,5.19,15,6.12,12,6.12C9,6.12,6.5,5.19,5.13,4H18.87z M12,22 c-1.1,0-2-0.9-2-2c0-0.55,0.22-1.05,0.59-1.41C11.39,17.79,16,16,16,16s-1.79,4.61-2.59,5.41C13.05,21.78,12.55,22,12,22z"
              />
            </g>
          </svg>
          <MdSyncAlt className="h-8 w-8 cursor-pointer text-primary-600" />
          <MdShare className="h-8 w-8 cursor-pointer text-primary-600" />
          <MdPrint className="h-8 w-8 cursor-pointer text-primary-600" />
          <MdOutlineBook className="h-8 w-8 cursor-pointer text-primary-600" />
          {owner && (
            <MdEdit
              className="h-8 w-8 cursor-pointer text-primary-600"
              onClick={() =>
                navigate(`/recipe/edit/${new Hashids().encode(id)}`)
              }
            />
          )}
        </div>
        <main className="bg-white p-10 shadow shadow-primary-200 sm:my-9">
          <RecipeContent recipe={recipe} />
        </main>
        <ScaleModal
          onClose={(val) => {
            setIsScale(false);
            val && setRecipe(scaleRecipe(original, val));
          }}
          isOpen={isScale}
          servings={original.servings}
        />
      </div>
    </>
  );
}
