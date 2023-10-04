<template>
  <Modal :modal="isOpen" :width="950">
    <template v-slot:header>
      <ModalHeader :title="`${title} User`" />
    </template>
    <template v-slot:body>
      <v-col cols="12" lg="12" md="12" sm="12">
        <v-alert v-if="isClaim" outlined type="warning" prominent border="left">
          <h4 class="font-weight-bold red--text">
            Mfumo hautochukua taarifa yako yeyote bila ridhaa/hiari yako
          </h4>
        </v-alert>
      </v-col>
      <ModalBody class="p-10">
        <v-form ref="form" v-model="data.valid">
          <v-container>
            <v-row>
              <v-col cols="12" lg="4" md="4" sm="12">
                <v-text-field
                  label="jina la kwanza(First Name)"
                  v-model="formData.first_name"
                  :rules="data.requiredRules"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="12">
                <v-text-field
                  label="Jina la kati(Middle Name)"
                  v-model="formData.middle_name"
                  :rules="data.requiredRules"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="12">
                <v-text-field
                  label="Jina la mwisho(Last Name)"
                  v-model="formData.last_name"
                  :rules="data.requiredRules"
                  outlined
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="4" md="4" sm="12" class="mt-n8">
                <v-text-field
                  label="Barua pepe(Email Address)"
                  v-model="formData.email"
                  v-bind:rules="data.emailRules"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="12" class="mt-n8">
                <v-text-field
                  label="Namba ya simu(Phone Number)"
                  v-model="formData.phone_number"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="12" class="mt-n8">
                <v-text-field
                  label="Namba ya NIDA(NIN Number)"
                  v-model="formData.nin_number"
                  :rules="data.requiredRules"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12" class="mt-n8">
                <v-text-field
                  label="Umri(Age)"
                  v-model="formData.age"
                  :rules="data.requiredRules"
                  outlined
                  type="number"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="mt-n8">
                <v-select
                  v-model="formData.sex"
                  :items="data.genders"
                  item-value="name"
                  item-text="name"
                  outlined
                  clearable
                  label="Select Gender"
                ></v-select>
              </v-col>

              <v-col cols="12" lg="12" md="12" sm="12" class="mt-n8">
                <v-text-field
                  label="Neno la kuingilia(User Name)"
                  v-model="formData.username"
                  :rules="data.requiredRules"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="12" md="12" sm="12" class="mt-n8">
                <v-text-field
                  label="Nywila(Password)"
                  v-model="formData.password"
                  :rules="data.requiredRules"
                  outlined
                >
                </v-text-field>
              </v-col>
              <!-- </v-row>
            <v-row> -->
              <!-- <v-col cols="12" sm="12" md="6" class="pb-6">
                <v-label v-if="formData.location">
                  <h5 class="tree-title">
                    SELECTED USER LOCATION ({{ formData.location.name }})
                  </h5>
                </v-label>
                <v-label v-else>
                  <h5 class="tree-title">SELECT USER LOCATION</h5>
                </v-label>
                <TreeBrowser
                  v-if="data.node"
                  @onClick="loadLocationChildren"
                  v-model="formData.location"
                  :current-item="data.currentItem"
                  :node="data.node"
                />
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-row
                  v-if="data.showFacility || data.isFacilityUser"
                  class="mt-n8"
                >
                  <v-col cols="12" sm="12" md="12">
                    <v-checkbox
                      v-model="data.isFacilityUser"
                      label="Is Facility User"
                      @change="loadFacilities"
                    ></v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    class="mt-n8"
                    v-if="data.facilities && data.isFacilityUser"
                  >
                    <v-select
                      v-model="formData.facility_id"
                      :items="facilities"
                      item-value="id"
                      item-text="label"
                      outlined
                      label="Select Facility"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col> -->
            </v-row>
            <!-- <v-row>
              <v-col cols="12" lg="12" md="12" sm="12" class="mt-n8">
                <DualMultiSelect
                  :source="data.roles"
                  :destination="selectedRoles"
                  v-model="formData.roles"
                  :label="'name'"
                  :modelName="'roles'"
                  @onChangeList="onChangeList"
                />
              </v-col>
            </v-row> -->
          </v-container>
          <!-- <pre>{{ formData }}</pre> -->
        </v-form>
      </ModalBody>
    </template>
    <template v-slot:footer>
      <ModalFooter>
        <v-btn color="red darken-1" text @click="closeDialog">Funga</v-btn>
        <v-btn color="blue darken-1" text @click="save" :disabled="!data.valid">
          {{ "Hifadhi" }}
        </v-btn>
      </ModalFooter>
    </template>
  </Modal>
</template>
<script>
import { onMounted, defineComponent, set, computed, reactive } from "vue";
import { getChildren } from "@/components/admin-area/admin-area/services/admin-area-services";
import { get as getRoles } from "@/components/role/services/role-services";
import { get as getFacilities } from "@/components/facility/facility/services/facility.service";
import { get as getLevels } from "@/components/admin-area/level/services/level-services";

export default defineComponent({
  props: {
    onSubmit: {
      type: Function,
    },
    onClose: {
      type: Function,
    },
    onLoadLocationChildren: {
      type: Function,
    },
    isOpen: {
      type: Boolean,
    },
    title: {
      type: String,
      default: "",
    },
    formData: {
      type: Object,
      default: {},
    },
    isClaim: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      valid: true,
      currentItem: null,
      location: {},
      roles: [],
      levels: [],
      showFacility: false,
      isFacilityUser: false,
      selectedRoles: [],
      facilities: [],
      node: null,
      genders: [{ name: "Me" }, { name: "Ke" }],
    });

    const initialize = () => {
      loadLevels();
      getNodes();
      loadRoles({});
    };

    onMounted(() => {
      // initialize();
    });

    const save = () => {
      emit("onSubmit", props.formData);
    };

    const closeDialog = () => {
      emit("onClose");
    };

    const loadLocationChildren = (location) => {
      data.currentItem = data.currentItem === location ? null : location;
      data.location = location;
      props.formData["location"] = location;
      loadRoles({ search: { level_id: location.level_id } });
      toggleFacilitylOption(location);
      props.formData.location_id = location.id;
      if (!location.children) {
        if (location.id !== data.node.id) {
          getChildren(location.id).then((response) => {
            if (response.data.data.children.length) {
              set(location, "children", response.data.data.children);
            }
          });
        }
      }
    };

    const toggleFacilitylOption = (location) => {
      const level = data.levels.find((level) => level.id === location.level_id);
      if (level.code === "WARD" || level.code === "VILLAGE_MTAA") {
        data.showFacility = true;
        checkForMoreClicks(level);
      } else {
        data.showFacility = false;
      }
    };

    const checkForMoreClicks = (level) => {
      if (
        (data.showFacility = true) &&
        (level.code === "WARD" || level.code === "VILLAGE_MTAA")
      ) {
        loadFacilities();
      }
    };

    const loadFacilities = () => {
      const isFacilityUser = !!data.isFacilityUser;
      data.isFacilityUser = isFacilityUser;
      getFacilities({
        search: { location_id: data.location["id"] },
      }).then((response) => {
        data.facilities = response.data.data.data;
      });
    };

    const facilities = computed(() => {
      return data.facilities.map((facility) => ({
        ...facility,
        label: `${facility.name} - (${facility.facility_type.name})`,
      }));
    });

    const onChangeList = ({ source, destination }) => {
      destination.forEach((item) => {
        data.roles = upsert(source, item);
      });
      props.formData.roles = destination;
    };

    const upsert = (array, item) => {
      const idx = array.map((i) => i.id).indexOf(item.id);
      if (idx > -1) {
        array.splice(idx, 1);
      } else {
        array.push(item);
      }
      return array;
    };

    const getNodes = (id) => {
      getChildren(id).then((response) => {
        data.node = response.data.data;
      });
    };

    const loadRoles = (params) => {
      getRoles(params).then((response) => {
        data.roles = response.data.data.data;
      });
    };

    const selectedRoles = computed(() => {
      return props.formData.roles || [];
    });

    const loadLevels = () => {
      getLevels({}).then((response) => {
        data.levels = response.data.data.data;
      });
    };

    return {
      save,
      data,
      closeDialog,
      loadFacilities,
      loadLocationChildren,
      facilities,
      onChangeList,
      selectedRoles,
    };
  },
});
</script>
