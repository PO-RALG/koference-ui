<template>
  <div>
    <Modal :modal="isOpen" :width="750">
      <template v-slot:header>
        <ModalHeader
          :title="`Map user roles for user: ${userObject.fullName}`"
        />
      </template>
      <template v-slot:body>
        <ModalBody class="p-10">
          <!-- {{ formData }} -->
          <v-form ref="form" v-model="data.valid">
            <v-container>
              <v-row>
                <v-col cols="12" lg="12" md="12" sm="12">
                  <v-select
                    :items="data.roles"
                    prepend-inner-icon="mdi-file-document-multiple"
                    label="Select roles to map user"
                    outlined
                    v-model="formData.roles"
                    :item-text="'name'"
                    item-value="id"
                    multiple
                  >
                    <!-- <template v-slot:selection="{ item }">
                    {{ item.name }}-{{ item.description }}
                  </template>
                  <template v-slot:item="{ item }">
                    {{ item.name }} -{{ item.description }}
                  </template> -->
                  </v-select>
                </v-col>
                <v-col cols="12" lg="12" md="12" sm="12">
                  <v-select
                    :items="data.menus"
                    prepend-inner-icon="mdi-file-document-multiple"
                    label="Select menus to map user"
                    outlined
                    v-model="formData.menus"
                    :item-text="'name'"
                    item-value="id"
                    multiple
                  >
                  </v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="closeDialog">Close</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="save"
            :disabled="!data.valid"
          >
            {{ "Save" }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>
<script>
import { onMounted, defineComponent, set, computed, reactive } from "vue";
import { get as getRoles } from "@/components/role/services/role-services";
import { get as getMenus } from "@/components/menu/services/menu.service";

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
    userObject: {
      type: Object,
      default: {},
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      valid: true,
      currentItem: null,
      location: {},
      roles: [],
      menus: [],
    });

    onMounted(() => {
      loadRoles();
      loadMenus();
      // initialize();
    });

    const save = () => {
      emit("onSubmit", props.formData);
    };

    const closeDialog = () => {
      emit("onClose");
    };

    const loadRoles = (params) => {
      getRoles(params).then((response) => {
        data.roles = response.data;
      });
    };
    const loadMenus = (params) => {
      getMenus(params).then((response) => {
        data.menus = response.data;
      });
    };

    const selectedRoles = computed(() => {
      return props.formData.roles || [];
    });

    return {
      save,
      data,
      closeDialog,
      selectedRoles,
    };
  },
});
</script>
