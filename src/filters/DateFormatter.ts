import moment from "moment";

const format = (date: Date, format: string): string =>
  format ? moment(date).format(format) : moment(date).format("DD/MM/YYYY");
  //format ? moment(date).format(format) : moment(date).format("Do MMMM YYYY");

export default format;
