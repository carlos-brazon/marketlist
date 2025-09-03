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
  const isValidStart = /^[a-zA-Z0-9-]/.test(inputValue);

  // Si el valor no es válido y no está vacío, retornamos null o un indicador
  if (!isValidStart && inputValue !== "") {
    return null;
  }

  // Retornamos el valor sanitizado
  return inputValue;
};

export const defaultSuperListImg =
  "https://res.cloudinary.com/dcilysqzl/image/upload/v1738698398/eaf0b15c155449c9bb8fe13ccdb821cc-free_2_fiswiy.png";
export const baseUrl = `${supabase.storageUrl}/object/public/profile/`;

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

export async function uploadFile(file, id) {
  const filePath = `profile_pictures/${id}/_${file.name}`;
  let urlToDelete = "";

  try {
    // Listar imágenes existentes
    const { data, error: listError } = await supabase.storage.from("profile").list(`profile_pictures/${id}`);
    if (listError) throw new Error(listError.message);

    const pictures = data.filter(pic => pic.name !== ".emptyFolderPlaceholder");

    // Revisar si ya existe
    const exists = pictures.find(pic => pic.name === `_${file.name}`);
    if (exists) {
      // Ya existe, no subimos nada
      return { toPrint: filePath, toDelete: "" };
    }

    // Si supera el límite, eliminar la más antigua
    const MAX_IMAGES = 3;
    if (pictures.length >= MAX_IMAGES) {
      const sortedPictures = pictures.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      const oldest = sortedPictures[0];
      const { error: removeError } = await supabase.storage.from("profile").remove([`profile_pictures/${id}/${oldest.name}`]);
      if (removeError) throw new Error(removeError.message);
      urlToDelete = `profile_pictures/${id}/${oldest.name}`;
    }

    // Subir nuevo archivo
    const { error: uploadError } = await supabase.storage.from("profile").upload(filePath, file);
    if (uploadError) throw new Error(uploadError.message);

    return { toPrint: filePath, toDelete: urlToDelete };

  } catch (error) {
    console.error("Error en uploadFile:", error.message);
    throw error;
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

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date && date.toDate ? date.toDate() : date);

  // Formateo de Fecha: DD/MM/YYYY
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // JS usa meses 0-11
  const year = d.getFullYear();

  // Formateo de Hora: HH:MM
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const getNomalImageUrl  = (url) => {
  if (!url) return null;
  // Si ya es una URL completa, la devolvemos tal cual
  if (url.startsWith("http")) {
    return url;
  }
  // Si es un path relativo, la concatenamos con baseUrl
  return `${baseUrl}${url}`;
};