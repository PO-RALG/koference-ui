import axios from "axios";

const MENU_API = "/api/v1/menus";
const MENU_ITEMS_API = "/api/v1/menu-items";
const MENU_GROUPS_API = "/api/v1/menu-groups";
const RESOURCES_API = "/api/v1/resources";

const get = async (type: string, params: any): Promise<any> => {
  // switch (type) {
  //   case "MENU_GROUP":
  //     return await axios.get(`${MENU_GROUPS_API}`, { params });
  //   case "MENU_ITEM":
  //     return await axios.get(`${MENU_ITEMS_API}`, { params });
  // }
  return await axios.get(`${MENU_API}`, { params });
};

const find = async (id: string | number, type: string): Promise<any> => {
  switch (type) {
    case "MENU_GROUP":
      return await axios.get(`${MENU_GROUPS_API}/${id}`);
    case "MENU_ITEM":
      return await axios.get(`${MENU_ITEMS_API}/${id}`);
  }
};

const create = async (type: string, payload: any): Promise<any> => {
  switch (type) {
    case "MENU_GROUP":
      return await axios.post(`${MENU_GROUPS_API}`, payload);
    case "MENU_ITEM":
      return await axios.post(`${MENU_ITEMS_API}`, payload);
  }
};

const update = async (type: string, payload: any): Promise<any> => {
  switch (type) {
    case "MENU_GROUP":
      return await axios.put(`${MENU_GROUPS_API}/${payload.id}`, payload);
    case "MENU_ITEM":
      return await axios.put(`${MENU_ITEMS_API}/${payload.id}`, payload);
  }
};

const deleteEntry = async (type: string, id: number | string): Promise<any> => {
  switch (type) {
    case "MENU_GROUP":
      return await axios.delete(`${MENU_GROUPS_API}/${id}`);
    case "MENU_ITEM":
      return await axios.delete(`${MENU_ITEMS_API}/${id}`);
  }
};

const getResourceCategories = async (payload: any) => {
  return await axios.get(`${RESOURCES_API}`, { params: payload });
};

const getPermissionsByResource = async (
  id: number | string,
  resource: string
) => {
  return await axios.get(
    `${RESOURCES_API}/${id}/get-permissions?resource=${resource}`
  );
};

const addPermissions = async (payload: any) => {
  return await axios.post(`${MENU_ITEMS_API}/add-permissions`, payload);
};

export {
  get,
  find,
  create,
  update,
  deleteEntry,
  addPermissions,
  getResourceCategories,
  getPermissionsByResource,
};
