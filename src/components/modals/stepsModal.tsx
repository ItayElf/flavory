import { Transition, Dialog } from "@headlessui/react";
import { useRef, useState } from "react";
import { MdCancel, MdKeyboardBackspace } from "react-icons/md";
import { ButtonPrimary } from "../buttonPrimary";
import { TextField } from "../textField";

interface Props {
  steps: string[];
  isOpen: boolean;
  onClose: (steps: string[]) => void;
}

export function StepsModal({ isOpen, onClose, steps: s }: Props) {
  const [steps, setSteps] = useState([...s]);
  const focus = useRef(null);

  const valids = steps.filter((s) => s !== "");

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
        onClose={() => {
          onClose(valids);
          setSteps(valids);
        }}
        className="fixed inset-0 h-full w-full overflow-y-auto sm:m-4"
        initialFocus={focus}
      >
        <Dialog.Overlay
          className="fixed inset-0 bg-black/75"
          onClick={() => {
            onClose(valids);
            setSteps(valids);
          }}
        />
        <button className="hidden" ref={focus}></button>
        <div className="relative flex h-full w-screen flex-col overflow-y-auto rounded border-2 border-primary-600 bg-white sm:mx-auto sm:h-auto sm:min-w-[640px] sm:max-w-[960px]">
          <div className="w-full p-4">
            <div className="flex">
              <MdKeyboardBackspace
                className="h-10 w-10 sm:hidden"
                onClick={() => onClose(steps)}
              />
              <h1 className="h4 sm:h3 w-full text-center underline decoration-primary-600">
                Steps
              </h1>
              <div className="h-10 w-10 sm:hidden" />
            </div>
            <div className="mt-10 w-full space-y-6">
              {steps.map((step, idx) => (
                <div key={idx}>
                  <h2 className="h6 mb-4 underline decoration-primary-600">
                    Step no.{idx + 1}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <TextField
                      type="text"
                      wrapperClassName="w-full"
                      value={step}
                      setValue={(v) =>
                        setSteps(steps.map((s, i) => (i === idx ? v : s)))
                      }
                      label=""
                    />
                    <MdCancel
                      className="h-8 w-8 cursor-pointer text-error"
                      onClick={() =>
                        setSteps(steps.filter((_, i) => i !== idx))
                      }
                    />
                  </div>
                </div>
              ))}
              <ButtonPrimary
                className="w-full"
                onClick={() => setSteps([...steps, ""])}
              >
                Add Step
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
