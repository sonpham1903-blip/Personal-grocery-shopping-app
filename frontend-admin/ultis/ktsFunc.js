export const vnd = (stringToCurency) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "VND",
  }).format(stringToCurency);
};
