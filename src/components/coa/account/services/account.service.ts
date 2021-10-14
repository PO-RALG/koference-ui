import axios from "axios";

const NATURE_API = `/api/v1/account/nature`;
const TYPE_API = `/api/v1/account/types`;

const getTypes = async () => {
  return await axios.get(`${TYPE_API}`);
};

const getNature = async () => {
  return await axios.get(`${NATURE_API}`);
};

export { getTypes, getNature }
