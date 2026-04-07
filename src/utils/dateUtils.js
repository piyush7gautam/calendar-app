export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDay = (year, month) => {
  return new Date(year, month, 1).getDay();
};