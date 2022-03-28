import { apiUrl } from "../constants";
import { MdTimer, MdRestaurant, MdEdit } from "react-icons/md";
import Recipe from "../interfaces/Recipe";
import { useState } from "react";
import Ingredient from "../interfaces/Ingredient";
import { formatQuantity, timeAsHours } from "../utils/formatUtils";

interface Props {
  recipe: Recipe;
  image?: string | null;
}

export default function RecipeContent({ recipe, image }: Props) {
  const imageSrc = () => {
    if (image === null) {
      return "";
    } else if (image) {
      return image;
    } else {
      return apiUrl + `images/recipes/${recipe.idx}`;
    }
  };

  return (
    <>
      <h1 className="h4 sm:h2 w-full text-center">{recipe.title}</h1>
      <div className="mt-2 h-px bg-primary-300"></div>
      <img
        src={imageSrc()}
        className="mt-6 aspect-video w-full object-cover"
        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        onLoad={(e) => ((e.target as HTMLImageElement).style.display = "")}
        alt={recipe.title}
      />
      <p className="s1 sm:h5 mt-4">{recipe.description}</p>
      <div className="s1 sm:h5 mt-4 flex w-full justify-center space-x-2 divide-x divide-primary-300 text-gray">
        {recipe.cookingTime && (
          <div className="flex flex-col items-center justify-center sm:flex-row">
            <MdTimer className="h-8 w-8 sm:mr-2" />
            <p>{timeAsHours(recipe.cookingTime)}</p>
          </div>
        )}
        {recipe.servings && (
          <div className="flex flex-col items-center pl-2 sm:flex-row">
            <MdRestaurant className="h-8 w-8 sm:mr-2" />
            <p>{recipe.servings}</p>
          </div>
        )}
        {recipe.author && (
          <div className="flex flex-col items-center pl-2 sm:flex-row">
            <MdEdit className="h-8 w-8 sm:mr-2" />
            <p>{recipe.author}</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-col sm:flex-row">
        <div className="w-full sm:w-2/5">
          <h2 className="h4">Ingredients:</h2>
          <div className="mb-6 h-px w-4/5 bg-primary-300 "></div>
          <div className="space-y-4">
            {recipe.ingredients.map((i, idx) => (
              <IngredientTile key={idx} ingredient={i} />
            ))}
          </div>
        </div>
        <div className="mt-6 w-full sm:ml-2 sm:mt-0 sm:w-3/5">
          <h2 className="h4">Steps:</h2>
          <div className="mb-6 h-px w-4/5 bg-primary-300"></div>
          <div className="space-y-4">
            {recipe.steps.map((s, idx) => (
              <StepTile key={idx} step={s} idx={idx + 1} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const IngredientTile = ({ ingredient }: { ingredient: Ingredient }) => {
  const [marked, setMarked] = useState(false);
  return (
    <p
      className={`h6 cursor-pointer ${
        marked ? "text-gray line-through" : "text-black no-underline"
      }`}
      onClick={() => setMarked(!marked)}
    >
      {formatQuantity(ingredient.quantity)} {ingredient.units} {ingredient.name}
    </p>
  );
};

const StepTile = ({ step, idx }: { step: string; idx: number }) => {
  const [marked, setMarked] = useState(false);
  return (
    <div className="flex cursor-pointer" onClick={() => setMarked(!marked)}>
      <div>
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${
            marked ? "bg-primary-600" : "bg-gray"
          }`}
        >
          <p className="s1">{idx}</p>
        </div>
      </div>
      <p className={`h6 ml-2 ${marked ? "text-gray" : "text-black"}`}>{step}</p>
    </div>
  );
};
