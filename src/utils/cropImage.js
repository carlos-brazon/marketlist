import { createImage } from "./createImage";

const getCroppedImg = async (imageSrc, pixelCrop) => {
  if (!imageSrc) return null;
  const isRemote = imageSrc.startsWith("http");
  const finalUrl = isRemote ? `/api/image-proxy?url=${imageSrc}` : imageSrc;
  let image;
  try {
    image = await createImage(finalUrl);
  } catch (error) {
    console.error(" Error al crear la imagen:", error);
    return null;
  }

  if (!image) return null;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  try {
    return await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  } catch (error) {
    console.error(" Error al convertir el canvas a blob:", error);
    return null;
  }
};

export default getCroppedImg;
