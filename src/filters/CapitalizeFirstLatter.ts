const capitalizeFirstLatter = (value: string): string => {
  const val = value.toString();
  return val.charAt(0).toUpperCase() + value.slice(1);
};
export default capitalizeFirstLatter;
