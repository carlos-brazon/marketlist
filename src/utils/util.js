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
