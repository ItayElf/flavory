import { Transition, Dialog } from "@headlessui/react";
import { useRef, useState } from "react";
import Ingredient from "../interfaces/Ingredient";
import { TextField } from "./textField";
import { units as available } from "../constants";
import { MdCancel, MdKeyboardBackspace } from "react-icons/md";
import { ButtonPrimary } from "./buttonPrimary";

interface Props {
  ingredients: Ingredient[];
  isOpen: boolean;
  onClose: (ingredients: Ingredient[]) => void;
}

export function IngredientsModal({
  ingredients: ings,
  isOpen,
  onClose,
}: Props) {
  const [ingredients, setIngredients] = useState([...ings]);
  const focus = useRef(null);

  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog
        as="div"
        onClose={() => onClose(ingredients)}
        className="fixed inset-0 h-full w-full overflow-y-auto sm:m-4"
        initialFocus={focus}
      >
        <Dialog.Overlay
          className="fixed inset-0 bg-black/75"
          onClick={() => onClose(ingredients)}
        />
        <button className="hidden" ref={focus}></button>
        <div className="relative flex h-full w-screen flex-col overflow-y-auto rounded border-2 border-primary-600 bg-white sm:mx-auto sm:h-auto sm:min-w-[640px] sm:max-w-[960px]">
          <div className="w-full p-4">
            <div className="flex">
              <MdKeyboardBackspace
                className="h-10 w-10 sm:hidden"
                onClick={() => onClose(ingredients)}
              />
              <h1 className="h4 sm:h3 w-full text-center underline decoration-primary-600">
                Ingredients
              </h1>
              <div className="h-10 w-10 sm:hidden" />
            </div>

            <div className="mt-10 w-full space-y-6">
              {ingredients.map((ing, idx) => (
                <IngTile
                  key={idx}
                  ing={ing}
                  idx={idx + 1}
                  onDelete={(ing) =>
                    setIngredients(ingredients.filter((i) => i !== ing))
                  }
                />
              ))}
              <ButtonPrimary
                className="w-full"
                onClick={() =>
                  setIngredients([
                    ...ingredients,
                    { name: "", units: "", quantity: 0 },
                  ])
                }
              >
                Add Ingredient
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

interface Props2 {
  ing: Ingredient;
  idx: number;
  onDelete: (ing: Ingredient) => void;
}

const IngTile = ({ ing, idx, onDelete }: Props2) => {
  const [quantity, setQuantity] = useState(ing.quantity + "");
  const [units, setUnits] = useState(ing.units ? ing.units : "");
  const [name, setName] = useState(ing.name);

  const filtered =
    units === ""
      ? available
      : available.filter(
          (u) =>
            u.toLowerCase().includes(units.toLowerCase()) &&
            u.toLowerCase() !== units.toLowerCase()
        );

  return (
    <div>
      <h2 className="h6 mb-4 underline decoration-primary-600">
        Ingredient no.{idx}
      </h2>
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4">
        <TextField
          type="number"
          value={quantity}
          setValue={setQuantity}
          label="Quantity"
          className="h-full"
          id={ing.name + ing.quantity + ing.units + 1}
        />
        <TextField
          type="text"
          value={units}
          setValue={setUnits}
          label="units"
          options={filtered}
          className="w-full"
          id={ing.name + ing.quantity + ing.units + 2}
        />
        <TextField
          className="w-full"
          type="text"
          value={name}
          setValue={setName}
          label="name"
          id={ing.name + ing.quantity + ing.units + 3}
        />
        <MdCancel
          className="h-8 w-8 cursor-pointer text-error"
          onClick={() => onDelete(ing)}
        />
      </div>
    </div>
  );
};
