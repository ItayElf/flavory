import { useState } from "react";
import Ingredient from "../../interfaces/Ingredient";
import { TextField } from "../textField";
import { MdCancel, MdKeyboardBackspace } from "react-icons/md";
import { ButtonPrimary } from "../buttonPrimary";
import ModalWrapper from "./modalWrapper";

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

  const valids = ingredients.filter(
    (i) => i.name !== "" && !isNaN(i.quantity) && i.quantity > 0
  );

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={() => {
        onClose(valids);
        setIngredients(valids);
      }}
      className="h-full w-screen sm:mx-auto sm:h-auto sm:min-w-[640px] sm:max-w-[960px]"
      wrapperClassName="items-baseline justify-start"
    >
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
              onChange={(ing, idx) =>
                setIngredients(
                  ingredients.map((i, id) => (id === idx ? ing : i))
                )
              }
            />
          ))}
          <ButtonPrimary
            className="w-full"
            onClick={() =>
              setIngredients([
                ...ingredients,
                { name: "", units: "", quantity: NaN },
              ])
            }
          >
            Add Ingredient
          </ButtonPrimary>
        </div>
      </div>
    </ModalWrapper>
  );
}

interface Props2 {
  ing: Ingredient;
  idx: number;
  onDelete: (ing: Ingredient) => void;
  onChange: (ing: Ingredient, idx: number) => void;
}

const IngTile = ({ ing, idx, onDelete, onChange }: Props2) => {
  const [quantity, setQuantity] = useState(ing.quantity + "");
  const [units, setUnits] = useState(ing.units ? ing.units : "");
  const [name, setName] = useState(ing.name);

  // const filtered =
  //   units === ""
  //     ? available
  //     : available.filter(
  //         (u) =>
  //           u.toLowerCase().includes(units.toLowerCase()) &&
  //           u.toLowerCase() !== units.toLowerCase()
  // );

  return (
    <div>
      <h2 className="h6 mb-4 underline decoration-primary-600">
        Ingredient no.{idx}
      </h2>
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4">
        <TextField
          type="number"
          value={quantity}
          setValue={(v) => {
            setQuantity(v);
            onChange({ name, quantity: parseFloat(v), units }, idx - 1);
          }}
          label="Quantity"
          className="h-full"
          id={ing.name + ing.quantity + ing.units + 1}
        />
        <TextField
          type="text"
          value={units}
          capitalize={false}
          setValue={(v) => {
            setUnits(v);
            onChange(
              { name, quantity: parseFloat(quantity), units: v },
              idx - 1
            );
          }}
          label="units"
          // options={filtered}
          className="w-full"
          id={ing.name + ing.quantity + ing.units + 2}
        />
        <TextField
          className="w-full"
          type="text"
          value={name}
          capitalize={false}
          setValue={(v) => {
            setName(v);
            onChange(
              { name: v, quantity: parseFloat(quantity), units },
              idx - 1
            );
          }}
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
