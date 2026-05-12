export const vnd = (stringToCurency) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "VND",
  }).format(stringToCurency);
};

export const search = (keys, dataToSearch, query) => {
  return dataToSearch.filter((item) => {
    keys.some((key) => item[key].toLowerCase().includes(query));
  });
};
