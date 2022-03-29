import { useState } from "react";
import { scaleString } from "../../utils/recipeUtils";
import { ButtonPrimary } from "../buttonPrimary";
import { TextField } from "../textField";
import ModalWrapper from "./modalWrapper";

interface Props {
  isOpen: boolean;
  onClose: (val?: number) => void;
  servings: string | null | undefined;
}

export default function ScaleModal({ isOpen, onClose, servings }: Props) {
  const [value, setValue] = useState(1);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} className="sm:w-[640px]">
      <h1 className="h3 mb-6 text-center underline decoration-primary-600">
        Scale
      </h1>
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div
            className={`h5 flex w-1/3 cursor-pointer items-center justify-center rounded py-2 ring-2 ring-primary-600 ${
              value === 0.5
                ? "bg-primary-600 text-white"
                : "text-primary-600 hover:text-primary-900 hover:ring-primary-900"
            }`}
            onClick={() => setValue(0.5)}
          >
            ½×
          </div>
          <div
            className={`h5 flex w-1/3 cursor-pointer items-center justify-center rounded py-2 ring-2 ring-primary-600 ${
              value === 1
                ? "bg-primary-600 text-white"
                : "text-primary-600 hover:text-primary-900 hover:ring-primary-900"
            }`}
            onClick={() => setValue(1)}
          >
            1×
          </div>
          <div
            className={`h5 flex w-1/3 cursor-pointer items-center justify-center rounded py-2 ring-2 ring-primary-600 ${
              value === 1.5
                ? "bg-primary-600 text-white"
                : "text-primary-600 hover:text-primary-900 hover:ring-primary-900"
            }`}
            onClick={() => setValue(1.5)}
          >
            1 ½×
          </div>
        </div>
        <div className="flex space-x-4">
          <div
            className={`h5 flex w-1/3 cursor-pointer items-center justify-center rounded py-2 ring-2 ring-primary-600 ${
              value === 2
                ? "bg-primary-600 text-white"
                : "text-primary-600 hover:text-primary-900 hover:ring-primary-900"
            }`}
            onClick={() => setValue(2)}
          >
            2×
          </div>
          <div
            className={`h5 flex w-1/3 cursor-pointer items-center justify-center rounded py-2 ring-2 ring-primary-600 ${
              value === 3
                ? "bg-primary-600 text-white"
                : "text-primary-600 hover:text-primary-900 hover:ring-primary-900"
            }`}
            onClick={() => setValue(3)}
          >
            3×
          </div>
          <TextField
            type="number"
            value={value + ""}
            setValue={(val) => setValue(parseFloat(val))}
            label="Factor"
            wrapperClassName="w-[32%]"
          />
        </div>
        {servings && (
          <p className="h5 !mt-8 text-gray">
            (Results in {scaleString(servings, value)})
          </p>
        )}
        <ButtonPrimary
          className="w-full"
          onClick={() => {
            if (value <= 0) {
              alert("Scale factor must be positive");
              return;
            }
            onClose(value);
          }}
        >
          Scale
        </ButtonPrimary>
      </div>
    </ModalWrapper>
  );
}
