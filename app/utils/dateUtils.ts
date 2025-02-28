// src/app/utils/dateUtils.ts
export const toChileDate = (date: Date): Date => {
  // Convierte la fecha a la zona horaria de Chile y extrae solo la parte de la fecha
  const options: Intl.DateTimeFormatOptions = { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' };
  const dateString = date.toLocaleDateString('en-US', options);
  return new Date(dateString);
};
