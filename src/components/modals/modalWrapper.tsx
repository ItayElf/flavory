import { useRef } from "react";
import { Transition, Dialog } from "@headlessui/react";

interface Props {
  isOpen: boolean;
  className?: string;
  wrapperClassName?: string;
  onClose: () => void;
}

const ModalWrapper: React.FC<Props> = ({
  isOpen,
  className,
  onClose,
  children,
  wrapperClassName,
}) => {
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
        className={`fixed inset-0 flex h-full w-full items-center justify-center overflow-y-auto sm:m-4 ${wrapperClassName}`}
        initialFocus={focus}
      >
        <Dialog.Overlay
          className="fixed inset-0 bg-black/75"
          onClick={() => onClose()}
        />
        <button className="hidden" ref={focus}></button>
        <div
          className={`relative flex w-screen flex-col overflow-y-auto rounded border-2 border-primary-600 bg-white p-4 ${className}`}
        >
          {children}
        </div>
      </Dialog>
    </Transition>
  );
};
export default ModalWrapper;
