import { supabase } from "./supabase";
import imageCompression from "browser-image-compression";

export const firstLetterUpperCase = (string) => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};

export const cleanInputValueWithNumberOrLetters = (inputValue) => {
  // Eliminar espacios iniciales
  inputValue = inputValue.replace(/^\s+/, "");
  // Reemplazar más de dos espacios consecutivos por un solo espacio
  inputValue = inputValue.replace(/\s{2,}/g, " ");
  // Validar que el primer carácter sea una letra o un número
  const isValidStart = /^[a-zA-Z0-9]/.test(inputValue);

  // Si el valor no es válido y no está vacío, retornamos null o un indicador
  if (!isValidStart && inputValue !== "") {
    return null;
  }

  // Retornamos el valor sanitizado
  return inputValue;
};

export const defaultSuperListImg =
  "https://res.cloudinary.com/dcilysqzl/image/upload/v1738698398/eaf0b15c155449c9bb8fe13ccdb821cc-free_2_fiswiy.png";

export const ramdomDog = async () => {
  try {
    const response = await fetch(
      "https://dog.ceo/api/breed/hound/images/random/6"
    );
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error fetching the image:", error);
  }
};

export async function uploadFile(file) {
  const filePath = `profile_pictures/${Date.now()}_${file.name}`;
  const { error } = await supabase.storage
    .from("profile")
    .upload(filePath, file);
  if (error) {
    // Handle error
  } else {
    // Handle success
    // Obtener la URL pública de la imagen
    const { data: publicUrlData } = supabase.storage
      .from("profile")
      .getPublicUrl(filePath);
    return publicUrlData.publicUrl; // Devuelve la URL para mostrar la imagen
  }
}
export async function compressAndUpload(file) {
  const options = {
    maxSizeMB: 1, // Reduce la imagen a menos de 1MB
    maxWidthOrHeight: 1024, // Ajusta la resolución
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Error al comprimir la imagen:", error);
  }
}
