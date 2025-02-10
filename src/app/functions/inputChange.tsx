import { Dispatch, SetStateAction } from 'react';

// Función genérica para manejar el cambio de inputs
export const handleInputChange = <T extends object>(
  e: React.ChangeEvent<HTMLInputElement>,
  inputs: T,  // inputs ahora es un objeto de tipo genérico T
  setInputs: Dispatch<SetStateAction<T>>  // setInputs es la función para actualizar el estado de tipo T
) => {
  const { name, value } = e.target;

  // Actualiza el estado de manera correcta
  setInputs({
    ...inputs, // Copia el estado actual
    [name]: value, // Actualiza el campo correspondiente
    
    
  });

};
