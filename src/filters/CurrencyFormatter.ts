import createNumberMask from "text-mask-addons/dist/createNumberMask";

export const toCurrency = (amount: number): string => {
  const val = (amount / 1).toFixed(2).replace(".", ".");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const toMoney = createNumberMask({
  prefix: "",
  allowDecimal: true,
  includeThousandsSeparator: true,
  allowNegative: false,
});

export default toCurrency;
