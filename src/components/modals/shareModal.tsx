import { ButtonPrimary } from "../buttonPrimary";
import { MdContentPaste } from "react-icons/md";
import ModalWrapper from "./modalWrapper";
import { useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (e) {
      if (!input.current) {
        return;
      }
      input.current.focus();
      input.current.select();
      document.execCommand("copy");
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} className="sm:w-[640px]">
      <h1 className="h3 mb-3 text-center underline decoration-primary-600">
        Share
      </h1>
      <p className="s1 mb-3 text-gray">Send this link to share this page.</p>
      <div className="flex overflow-hidden rounded">
        <input
          readOnly
          value={window.location.href}
          className="s1 w-full rounded-l border border-primary-600 p-2"
          ref={input}
        />
        <ButtonPrimary
          className="s1 flex items-center space-x-2 rounded-none"
          onClick={copyToClipboard}
        >
          <MdContentPaste className="h-8 w-8 sm:h-6 sm:w-6" />
          <span className="hidden w-max sm:flex">Copy Link</span>
        </ButtonPrimary>
      </div>
    </ModalWrapper>
  );
}
