import { Transition, Dialog } from "@headlessui/react";
import { useRef, useState } from "react";
import { scaleString } from "../../utils/recipeUtils";
import { ButtonPrimary } from "../buttonPrimary";
import { TextField } from "../textField";

interface Props {
  isOpen: boolean;
  onClose: (val?: number) => void;
  servings: string | null | undefined;
}

export default function ScaleModal({ isOpen, onClose, servings }: Props) {
  const [value, setValue] = useState(1);
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
        onClose={() => onClose()}
        className="fixed inset-0 flex h-full w-full items-center justify-center overflow-y-auto sm:m-4"
        initialFocus={focus}
      >
        <Dialog.Overlay
          className="fixed inset-0 bg-black/75"
          onClick={() => onClose()}
        />
        <button className="hidden" ref={focus}></button>
        <div className="relative flex w-screen flex-col overflow-y-auto rounded border-2 border-primary-600 bg-white p-4 sm:w-[640px]">
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
        </div>
      </Dialog>
    </Transition>
  );
}
