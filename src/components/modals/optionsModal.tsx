import React from "react";
import ModalWrapper from "./modalWrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const OptionsModal: React.FC<Props> = ({ isOpen, onClose, children }) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} className="mx-4 w-96">
      <div className="flex w-full flex-col items-center justify-center space-y-2 text-center">
        {React.Children.toArray(children)
          .filter((x) => !!x)
          .map((child, i) => (
            <div key={i} className="w-full">
              {i !== 0 && <div className="h-[2px] w-full bg-primary-600" />}
              {child}
            </div>
          ))}
      </div>
    </ModalWrapper>
  );
};

export default OptionsModal;
