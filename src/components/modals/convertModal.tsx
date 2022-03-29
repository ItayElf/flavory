import { useEffect, useState } from "react";
import Ingredient from "../../interfaces/Ingredient";
import {
  convertDegrees,
  convertIngredient,
  getConvertable,
} from "../../utils/recipeUtils";
import { convertableVolume, convertableWeight } from "../../constants";
import ModalWrapper from "./modalWrapper";
import { formatQuantity } from "../../utils/formatUtils";
import { ButtonPrimary } from "../buttonPrimary";

interface Props {
  isOpen: boolean;
  onClose: (ings: Ingredient[], steps: string[]) => void;
  ingredients: Ingredient[];
  steps: string[];
}

export default function ConvertModal({
  isOpen,
  ingredients: originals,
  onClose,
  steps: originalSteps,
}: Props) {
  //   const [originals, setOriginals] = useState([...ingredients]);
  const [ings, setIngs] = useState([...originals]);
  const [degrees, setDegrees] = useState(0); // 0 - no conversion, 1 - celsius, 2 - fahrenheit

  const onConvert = (res: Ingredient[]) => {
    setIngs(
      ings.map((i) =>
        res.some((v) => v.name === i.name)
          ? res.filter((v) => v.name === i.name)[0]
          : i
      )
    );
  };

  useEffect(() => {
    if (isOpen) {
      setDegrees(0);
    }
  }, [isOpen]);

  const steps = () =>
    degrees ? convertDegrees(originalSteps, degrees === 1) : originalSteps;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={() => onClose(originals, originalSteps)}
      className="sm:w-[640px] lg:w-[1024px]"
    >
      <h1 className="h3 mb-6 text-center underline decoration-primary-600">
        Convert
      </h1>
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
        <ConvertSection
          title="Volume"
          ings={getConvertable(ings).volume}
          pool={convertableVolume}
          onConvert={onConvert}
        />
        <ConvertSection
          title="Weight"
          ings={getConvertable(ings).weight}
          pool={convertableWeight}
          onConvert={onConvert}
        />
      </div>
      <div className="mt-6 flex items-center space-x-4">
        <p className="h6">Convert degrees to:</p>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="cel"
            className="cursor-pointer rounded transition duration-200 checked:bg-primary-600 hover:checked:bg-primary-400 focus:ring-primary-600 focus:checked:bg-primary-600"
            checked={degrees === 1}
            onChange={() => setDegrees(degrees === 1 ? 0 : 1)}
          />
          <label htmlFor="cel" className="h6 cursor-pointer">
            Celsius
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="far"
            className="cursor-pointer rounded transition duration-200 checked:bg-primary-600 hover:checked:bg-primary-400 focus:ring-primary-600 focus:checked:bg-primary-600"
            checked={degrees === 2}
            onChange={() => setDegrees(degrees === 2 ? 0 : 2)}
          />
          <label htmlFor="far" className="h6 cursor-pointer">
            Fahrenheit
          </label>
        </div>
      </div>
      <ButtonPrimary
        className="h5 mt-10"
        onClick={() => onClose(ings, steps())}
      >
        Save Convertion
      </ButtonPrimary>
    </ModalWrapper>
  );
}

interface Props2 {
  title: string;
  ings: Ingredient[];
  pool: object;
  onConvert: (ings: Ingredient[]) => void;
}

const ConvertSection: React.FC<Props2> = ({ title, ings, pool, onConvert }) => {
  const [checked, setChecked] = useState(ings.map(() => false));

  const convert = (units: string) => {
    setChecked(ings.map(() => false));
    onConvert(
      ings.map((i, idx) => (checked[idx] ? convertIngredient(i, units) : i))
    );
  };

  return (
    <div className="w-full">
      <h2 className="h4 text-center font-medium">{title}</h2>
      {ings.length !== 0 ? (
        <>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={"selectall" + title}
              className="cursor-pointer rounded transition duration-200 checked:bg-primary-600 hover:checked:bg-primary-400 focus:ring-primary-600 focus:checked:bg-primary-600"
              checked={checked.every((v) => v)}
              onChange={() =>
                setChecked(
                  checked.every((v) => v)
                    ? checked.map(() => false)
                    : checked.map(() => true)
                )
              }
            />
            <label htmlFor={"selectall" + title} className="h6 cursor-pointer">
              Select all
            </label>
          </div>
          <div className="w-ful mb-4 mr-10 h-px bg-black" />
          <div className="space-y-3">
            {ings.map((i, idx) => (
              <div className="flex items-center space-x-2" key={idx}>
                <input
                  type="checkbox"
                  id={"ing" + title + idx}
                  className="cursor-pointer rounded transition duration-200 checked:bg-primary-600 hover:checked:bg-primary-400 focus:ring-primary-600 focus:checked:bg-primary-600"
                  checked={checked[idx]}
                  onChange={() =>
                    setChecked(checked.map((v, i) => (i === idx ? !v : v)))
                  }
                />
                <label
                  htmlFor={"ing" + title + idx}
                  className="h6 cursor-pointer"
                >
                  {formatQuantity(i.quantity)} {i.units} {i.name}
                </label>
              </div>
            ))}
          </div>
          {checked.some((v) => v) && (
            <div className="mt-6 mr-10 ">
              <select
                className="h6 w-full"
                value=""
                onChange={(e) => convert(e.target.value)}
              >
                <option value="" disabled>
                  Convert to
                </option>
                {Object.keys(pool).map((k, i) => (
                  <option key={i} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="s1 mt-2 text-gray">
            There are no ingredients with {title.toLocaleLowerCase()} units.
          </p>
        </>
      )}
    </div>
  );
};
