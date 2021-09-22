/**
 * Return the currently logged in user
 * @params null
 * @returns currentUser: Object
 */
const getCurentUser = async (): any => {
  return await JSON.parse(localStorage.getItem("FFARS_USER"));
};

export default getCurentUser;
