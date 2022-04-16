import ModalWrapper from "./modalWrapper";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { useEffect, useRef, useState } from "react";
import { ButtonSecondary } from "../buttonSecondary";
import { ButtonPrimary } from "../buttonPrimary";
import "react-image-crop/dist/ReactCrop.css";

const canvasView = (
  image: HTMLImageElement | null,
  canvas: HTMLCanvasElement | null,
  crop: PixelCrop
) => {
  if (!canvas || !image) {
    return;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;
  ctx.save();
  ctx.translate(-cropX, -cropY);
  ctx.translate(centerX, centerY);
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );
  ctx.restore();
};

const getExt = (b64: string) =>
  b64.substring("data:image/".length, b64.indexOf(";base64"));

interface Props {
  imgSrc: string;
  isOpen: boolean;
  onClose: (b64: string | null) => void;
  aspect: number;
}

export default function CropModal({ imgSrc, isOpen, onClose, aspect }: Props) {
  const [crop, setCrop] = useState<Crop>();
  const canv = useRef<HTMLCanvasElement>(null);
  const img = useRef<HTMLImageElement>(null);

  const onSave = () => {
    if (crop) {
      onClose(canv.current?.toDataURL("image/" + getExt(imgSrc)) ?? null);
    } else {
      alert("Please click and drag the cursor over the image to crop it.");
    }
  };

  useEffect(() => {
    setCrop(undefined);
  }, []);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={() => onClose(null)}
      className="h-full w-screen sm:mx-auto sm:h-auto sm:max-h-fit sm:max-w-[640px]"
    >
      <div className="flex h-full flex-col space-y-4">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          aspect={aspect}
          className="h-full w-full"
          onComplete={(c) => {
            console.log(c);
            const ref = canv.current;
            const imgRef = img.current;
            canvasView(imgRef, ref, c);
          }}
        >
          <img src={imgSrc} alt="" ref={img} />
        </ReactCrop>
        <div className="flex justify-between">
          <ButtonSecondary onClick={() => onClose(null)}>
            Discard
          </ButtonSecondary>
          <ButtonPrimary onClick={onSave}>Save</ButtonPrimary>
        </div>
        <canvas ref={canv} className="hidden" />
      </div>
    </ModalWrapper>
  );
}
