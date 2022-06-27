const toCurrency = (amount: number): string => {
  const val = (amount / 1).toFixed(2).replace(".", ".");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const toMoney = (amount: number): string => {
  return amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

export default toCurrency;
