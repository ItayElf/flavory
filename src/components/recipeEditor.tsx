import { useState } from "react";
import Recipe from "../interfaces/Recipe";
import { ButtonPrimary } from "./buttonPrimary";
import { ButtonSecondary } from "./buttonSecondary";
import RecipeContent from "./recipeContent";
import { TextField } from "./textField";

interface Props {
  recipe?: Recipe;
  onSave: (recipe: Recipe, image: string) => void;
  onDiscard: () => void;
}

export function RecipeEditor({ recipe, onSave, onDiscard }: Props) {
  const [title, setTitle] = useState(recipe?.title ?? "");
  const [description, setDescription] = useState(recipe?.description ?? "");
  const [servings, setServings] = useState(recipe?.servings ?? "");
  const [author, setAuthor] = useState(recipe?.author ?? "");
  const time = recipe?.cookingTime ?? 0;
  const h = Math.floor(time / 60);
  const m = Math.floor(time % 60);
  const [hours, setHours] = useState(h === 0 ? "" : h + "");
  const [minutes, setMinutes] = useState(m === 0 ? "" : m + "");
  const isSm = window.innerWidth <= 640;

  const getRecipe = () => {
    let h = parseInt(hours) * 60;
    let m = parseInt(minutes);
    const cookingTime = isNaN(h) ? (isNaN(m) ? null : m) : isNaN(m) ? h : h + m;
    return {
      idx: recipe?.idx ?? -1,
      author,
      title,
      description,
      steps: recipe?.steps ?? [],
      cookingTime,
      servings,
      ingredients: recipe?.ingredients ?? [],
    } as Recipe;
  };

  return (
    <>
      <div className="fixed top-16 hidden h-full w-[340px] flex-1 flex-col space-y-6 overflow-auto bg-white p-6 shadow shadow-primary-200 sm:flex lg:w-[457px]">
        <h1 className="h4">Edit Recipe</h1>
        <TextField
          type="text"
          value={title}
          setValue={setTitle}
          label="Title"
        />
        <ButtonSecondary className="h5">Remove Image</ButtonSecondary>
        <TextField
          type="text"
          value={description}
          setValue={setDescription}
          label="Description"
        />
        <div className="flex space-x-2">
          <TextField
            type="number"
            value={hours}
            setValue={setHours}
            label="Hours"
            wrapperClassName="w-1/2"
          />
          <TextField
            type="number"
            value={minutes}
            setValue={setMinutes}
            label="Minutes"
            wrapperClassName="w-1/2"
          />
        </div>
        <TextField
          type="text"
          value={servings}
          setValue={setServings}
          label="Servings"
        />
        <TextField
          type="text"
          value={author}
          setValue={setAuthor}
          label="Author"
        />
        <ButtonSecondary className="h5">Edit Ingredients</ButtonSecondary>
        <ButtonSecondary className="h5">Edit Steps</ButtonSecondary>
        <div className="!mt-32 flex w-full">
          <ButtonSecondary className="h5 mr-3 w-1/2" onClick={onDiscard}>
            Discard
          </ButtonSecondary>
          <ButtonPrimary
            className="h5 ml-3 w-1/2"
            onClick={() => onSave(getRecipe(), "")}
          >
            Save
          </ButtonPrimary>
        </div>
      </div>
      <div className="flex">
        <div className="hidden w-[340px] sm:flex lg:w-[457px]"></div>
        <div className="ls:mt-0 mt-8 flex-1 sm:-mt-9">
          <div className="bg-white p-10 shadow shadow-primary-200 sm:my-9 sm:mx-auto sm:w-full sm:max-w-[856px]">
            <RecipeContent recipe={getRecipe()} />
          </div>
        </div>
      </div>
    </>
  );
}
