import { reactive, set, onMounted, computed } from "vue";
import { AxiosResponse } from "axios";
import router from "@/router";
import {
  get,
  create,
  update,
  destroy,
  search,
  createFacilityFromPlanrep,
} from "../services/facility.service";

import { Facility } from "../types/Facility";
import { FacilityType } from "@/components/facility/facility-type/types/FacilityType";
import { AdminArea } from "@/components/admin-area/admin-area/types/AdminArea";
import { get as getFacilityType } from "@/components/facility/facility-type/services/facility-types.service";
import { getChildren } from "@/components/admin-area/admin-area/services/admin-area-services";

export const useFacility = (): any => {
  const dataItems: Array<Facility> = [];
  const facilityTypes: Array<FacilityType> = [];
  const adminAreas: Array<AdminArea> = [];
  const facilityData = {} as Facility;

  const data = reactive({
    title: "Manage Facilities",
    valid: true,
    isOpen: false,
    node: null,
    response: {},
    modalTitle: "",
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "Code",
        align: "start",
        sortable: false,
        value: "code",
      },
      {
        text: "Phone number",
        align: "start",
        sortable: false,
        value: "phone_number",
      },
      {
        text: "Email",
        align: "start",
        sortable: false,
        value: "email",
      },
      {
        text: "Postal address",
        align: "start",
        sortable: false,
        value: "postal_address",
      },
      {
        text: "Facility type",
        align: "start",
        sortable: false,
        value: "facility_type.name",
      },
      {
        text: "Location",
        align: "start",
        sortable: false,
        value: "location.name",
      },
      {
        text: "Location Level",
        align: "start",
        sortable: false,
        value: "location.level.name",
      },
      {
        text: "Active",
        align: "start",
        sortable: false,
        value: "active",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
      },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    facilityTypes: facilityTypes,
    itemsToFilter: [],
    formData: facilityData,
    params: {
      total: 100,
      size: 10,
    },
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    adminAreas: adminAreas,
    searchTerm: "",
    facilityType: null,
  });

  onMounted(() => {
    initialize();
  });

  const pullFacilitiesFromPlanRep = () => {
    createFacilityFromPlanrep().then((response) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const initialize = () => {
    getTableData();
    getNodes();
  };

  const getTableData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
    });
  };

  const loadByFacilityType = (e) => {
    search({ facility_type_id: e.id }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  const searchItem = (searchTerm: string) => {
    if (searchTerm.length > 3) {
      get({ regSearch: searchTerm }).then((response: AxiosResponse) => {
        const { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
      });
    }
    if (searchTerm.length === 0) {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        const { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
      });
    }
  };

  const resetSearchText = () => {
    data.searchTerm = "";
    initialize();
  }

  const getData = (params: Facility) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const openConfirmDialog = (deleteId: string) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
  };

  const getFacilityTypeData = () => {
    getFacilityType({ per_page: 10 }).then((response: AxiosResponse) => {
      data.facilityTypes = response.data.data.data;
    });
  };

  const cancelDialog = () => {
    data.formData = {} as Facility;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as Facility;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemtodelete).then(() => {
      data.deletemodal = false;
      getTableData();
    });
  };

  const save = () => {
    if (data.formData.id) {
      updateFacility(data.formData);
    } else {
      createFacility(data.formData);
    }
  };

  const openDialog = (formData?: Facility) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
      data.searchTerm = "";
      searchFacilityTypes(formData.facility_type.code);
    } else {
      data.formData = {} as Facility;
      data.modalTitle = "Create";
      data.searchTerm = "";
      getFacilityTypeData();
    }
    data.modal = !data.modal;
  };

  const updateFacility = (data: Facility) => {
    update(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  const createFacility = (data: Facility) => {
    create(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  const loadLocationChildren = (location) => {
    data.formData.location_id = location.id;
    if (!location.children) {
      if (location.id !== data.node.id) {
        getChildren(location.id).then((response: AxiosResponse) => {
          if (response.data.data.children.length) {
            set(location, "children", response.data.data.children);
          }
        });
      }
    }
  };

  const getNodes = (id?: number | string) => {
    getChildren(id).then((response: AxiosResponse) => {
      data.node = response.data.data;
    });
  };

  const searchFacilityTypes = (item: string) => {
    const regSearchTerm = item ? item : data.searchTerm;
    getFacilityType({ per_page: 10, regSearch: regSearchTerm }).then(
      (response: AxiosResponse) => {
        data.facilityTypes = response.data.data.data;
      }
    );
  };

  const navigateToFacility = (event, facility: any) => {
    event.preventDefault();
    router.push({ path: `/manage-facilities/view?facility_id=${facility.id}` });
  };

  const facilities = computed(() => {
    return data.itemsToFilter.map((item) => ({
      ...item,
      name: `<a href="/manage-facilities/view?facility_id=${item.id}">${item.name}</a>`,
    }));
  });

  return {
    navigateToFacility,
    data,
    openDialog,
    cancelDialog,
    openConfirmDialog,
    getFacilityTypeData,
    updateFacility,
    save,
    remove,
    cancelConfirmDialog,
    searchItem,
    getData,
    loadLocationChildren,
    getNodes,
    searchFacilityTypes,
    facilities,
    pullFacilitiesFromPlanRep,
    resetSearchText,
    loadByFacilityType,
  };
};
