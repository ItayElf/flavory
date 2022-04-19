import { useEffect, useRef, useState } from "react";
import { apiUrl } from "../constants";
import Recipe from "../interfaces/Recipe";
import { getBase64FromUrl } from "../utils/fetchUtils";
import { blobToBase64 } from "../utils/formatUtils";
import { ButtonPrimary } from "./buttonPrimary";
import { ButtonSecondary } from "./buttonSecondary";
import RecipeContent from "./recipeContent";
import { TextArea, TextField } from "./textField";
import { Transition } from "@headlessui/react";
import {
  MdMenu,
  MdOutlineClose,
  MdDone,
  MdFormatListBulleted,
  MdRestaurant,
  MdPhoto,
  MdImageNotSupported,
} from "react-icons/md";
import { IngredientsModal } from "./modals/ingredientsModal";
import { StepsModal } from "./modals/stepsModal";
import CropModal from "./modals/cropModal";

interface Props {
  recipe?: Recipe;
  onSave: (recipe: Recipe, image: string | null) => void;
  onDiscard: () => void;
}

export default function RecipeEditor({ recipe, onSave, onDiscard }: Props) {
  const [title, setTitle] = useState(recipe?.title ?? "");
  const [description, setDescription] = useState(recipe?.description ?? "");
  const [servings, setServings] = useState(recipe?.servings ?? "");
  const [author, setAuthor] = useState(recipe?.author ?? "");
  const time = recipe?.cookingTime ?? 0;
  const h = Math.floor(time / 60);
  const m = Math.floor(time % 60);
  const [hours, setHours] = useState(h === 0 ? "" : h + "");
  const [minutes, setMinutes] = useState(m === 0 ? "" : m + "");
  const [ingredients, setIngredients] = useState(recipe?.ingredients ?? []);
  const [steps, setSteps] = useState(recipe?.steps ?? []);
  const [ingModalOpen, setIngModalOpen] = useState(false);
  const [stepsModalOpen, setStepsModalOpen] = useState(false);
  const [image, setImage] = useState<string | undefined | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCrop, setIsCrop] = useState(false);
  const [fileKey, setFileKey] = useState(Math.random().toString(36));
  const fileInput = useRef<HTMLInputElement>(null);
  const isSm = window.innerWidth <= 640;

  const toShow = () => (isSm && isOpen) || !isSm;

  useEffect(() => {
    if (recipe) {
      getBase64FromUrl(apiUrl + `images/recipes/${recipe.idx}`).then((v) => {
        setImage(v === "data:" ? null : v);
      });
    }
  }, [recipe]);

  const getRecipe = () => {
    let h = parseInt(hours) * 60;
    let m = parseInt(minutes);
    const cookingTime = isNaN(h) ? (isNaN(m) ? null : m) : isNaN(m) ? h : h + m;
    return {
      idx: recipe?.idx ?? -1,
      author,
      title,
      description,
      steps,
      cookingTime,
      servings,
      ingredients,
    } as Recipe;
  };

  const getImage = () => {
    if (image) {
      return image.split(",")[1];
    } else if (image === null) {
      return image;
    } else {
      return "";
    }
  };

  const handleImage = () => {
    if (fileInput.current === null) {
      return;
    } else if (image) {
      setImage(null);
      setFileKey(Math.random().toString(36));
    } else {
      fileInput.current.click();
    }
  };

  const changeImage = async () => {
    if (fileInput.current === null || fileInput.current.files === null) {
      return;
    }
    const text = fileInput.current.files[0];
    const fileBase64 = await blobToBase64(text);
    setImage(fileBase64 + "");
    setIsCrop(true);
  };

  useEffect(() => {
    const unloadCallback = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  return (
    <>
      <Transition
        show={toShow()}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="overflow-auto"
      >
        <div
          className="fixed top-16 h-full w-full overflow-auto bg-black/75 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
        <div className="fixed top-16 flex h-screen w-[340px] flex-1 flex-col space-y-6 overflow-auto bg-white p-6 pb-8 shadow shadow-primary-200 sm:pb-0 lg:w-[457px]">
          <h1 className="h4">Edit Recipe</h1>
          <TextField
            type="text"
            value={title}
            setValue={setTitle}
            label="Title"
          />
          {image ? (
            <ButtonSecondary className="h5" onClick={handleImage}>
              <div className="flex items-center justify-center space-x-2">
                <MdImageNotSupported />
                <span>Remove Image</span>
              </div>
            </ButtonSecondary>
          ) : (
            <ButtonPrimary className="h5" onClick={handleImage}>
              <div className="flex items-center justify-center space-x-2">
                <MdPhoto />
                <span>Add Image</span>
              </div>
            </ButtonPrimary>
          )}
          <input
            type="file"
            className="hidden"
            ref={fileInput}
            accept="image/*"
            onChange={changeImage}
            key={fileKey}
          />
          <TextArea
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
          <ButtonSecondary className="h5" onClick={() => setIngModalOpen(true)}>
            <div className="flex items-center justify-center space-x-2">
              <MdRestaurant />
              <span>Edit Ingredients</span>
            </div>
          </ButtonSecondary>
          <ButtonSecondary
            className="h5"
            onClick={() => setStepsModalOpen(true)}
          >
            <div className="flex items-center justify-center space-x-2">
              <MdFormatListBulleted />
              <span>Edit Steps</span>
            </div>
          </ButtonSecondary>
          <div className="!mb-16 hidden w-full sm:!mt-32 sm:flex">
            <ButtonSecondary className="h5 mr-3 w-1/2" onClick={onDiscard}>
              Discard
            </ButtonSecondary>
            <ButtonPrimary
              className="h5 ml-3 w-1/2"
              onClick={() => onSave(getRecipe(), getImage())}
            >
              Save
            </ButtonPrimary>
          </div>
        </div>
      </Transition>
      <div className="flex">
        <div className="hidden w-[340px] sm:flex lg:w-[457px]"></div>
        <div className="ls:mt-0 mt-8 flex-1 sm:-mt-9">
          <div className="flex items-center justify-between bg-white px-6 py-3 sm:hidden">
            <MdMenu
              className="h-12 w-12 text-primary-600"
              onClick={() => setIsOpen(true)}
            />
            <div className="flex items-center space-x-10">
              <MdOutlineClose
                className="h-12 w-12 text-primary-600"
                onClick={onDiscard}
              />
              <MdDone
                className="h-10 w-10 rounded-md bg-primary-600 text-white"
                onClick={() => onSave(getRecipe(), getImage())}
              />
            </div>
          </div>
          <div className="bg-white p-10 shadow shadow-primary-200 sm:my-9 sm:mx-auto sm:w-full sm:max-w-[856px]">
            <RecipeContent recipe={getRecipe()} image={image} />
          </div>
        </div>
      </div>
      <IngredientsModal
        ingredients={ingredients}
        isOpen={ingModalOpen}
        onClose={(ings) => {
          setIngredients(ings);
          setIngModalOpen(false);
        }}
      />
      <StepsModal
        steps={steps}
        isOpen={stepsModalOpen}
        onClose={(s) => {
          setSteps(s);
          setStepsModalOpen(false);
        }}
      />
      <CropModal
        isOpen={isCrop}
        onClose={(b64) => {
          setIsCrop(false);
          setImage(b64);
        }}
        imgSrc={image ?? ""}
        aspect={16 / 9}
      />
    </>
  );
}
