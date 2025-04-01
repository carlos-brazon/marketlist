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
  try {
    // Listar los archivos existentes en la carpeta
    const { data, error: listError } = await supabase.storage
      .from("profile")
      .list(`profile_pictures/${id}`);

    // Si hubo un error al listar los archivos, lanzamos una excepción
    if (listError) {
      throw new Error(`Error al listar archivos: ${listError.message}`);
    }

    const picturesFromSupabase = data.filter(
      (picture) => picture.name !== ".emptyFolderPlaceholder"
    );

    if (picturesFromSupabase.length === 0) {
      // Subir archivo si no hay imágenes
      const { error: uploadError } = await supabase.storage
        .from("profile")
        .upload(filePath, file);
      if (uploadError) {
        throw new Error(`Error al subir archivo: ${uploadError.message}`);
      }
    }

    if (picturesFromSupabase.length === 1) {
      // Eliminar la imagen existente y cargar la nueva
      const { error: removeError } = await supabase.storage
        .from("profile") // Asegúrate de usar el nombre correcto de tu bucket
        .remove([`profile_pictures/${id}/${picturesFromSupabase[0].name}`]); // Ruta completa al archivo

      if (removeError) {
        throw new Error(`Error al eliminar archivo: ${removeError.message}`);
      }

      // Subir archivo
      const { error: uploadAfterRemoveError } = await supabase.storage
        .from("profile")
        .upload(filePath, file);
      if (uploadAfterRemoveError) {
        throw new Error(
          `Error al subir archivo después de eliminar: ${uploadAfterRemoveError.message}`
        );
      }
    }
  } catch (error) {
    console.error("Error en el proceso de carga:", error.message);
    // Aquí puedes manejar el error, mostrar un mensaje o realizar otras acciones.
  }
  return filePath;
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
