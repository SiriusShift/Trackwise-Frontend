import { Area } from "react-easy-crop";

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.crossOrigin = "anonymous";
    image.src = url;
  });

// Renders the cropped region of `imageSrc` (as given by react-easy-crop's
// onCropComplete pixel crop) onto a same-size canvas and returns it as a File
// so it can be swapped in for the raw upload without any other code changing.
export const getCroppedImageFile = async (
  imageSrc: string,
  crop: Area,
  fileName: string,
  mimeType = "image/jpeg",
): Promise<File> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(new File([blob], fileName, { type: mimeType }));
    }, mimeType);
  });
};
