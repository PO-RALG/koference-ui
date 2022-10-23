<template v-slot:extension>
  <div>
    <v-card-actions class="pa-0">
      <h2>Manage Facility [{{ facilityDescription }}]</h2>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-card color="basil">
      <v-tabs>
        <v-tab @change="loadBankAccounts">Bank Accounts</v-tab>
        <v-tab-item>
          <v-card flat
            ><BankAccount
              :data="accountData"
              :bankName="bankName"
              @onRemove="remove"
              @onOpenDialog="openDialog"
              @onOpenConfirmDialog="openConfirmDialog"
              @onCloseConfirmDialog="accountData.showDeleteDialog = false"
              @onCreate="save"
              @onCloseDialog="accountData.modal = false"
            />
          </v-card>
        </v-tab-item>
        <v-tab @change="loadBankAccounts">Opening Balance</v-tab>
        <v-tab-item>
          <v-card flat class="pa-5"><OpeningBalance /> </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  onMounted,
  computed,
} from "vue";
import BankAccount from "./components/BankAccount.vue";
import OpeningBalance from "../../../components/receivables/opening-balance/OpeningBalance.vue";
import { useBank } from "@/components/setup/bank-account/composables/bank";
import { find as findFacility } from "@/components/facility/facility/services/facility.service";
import router from "@/router";

import {
  create,
  update,
  destroy,
} from "@/components/setup/bank-account/services/bank-account.service";

export default defineComponent({
  components: {
    BankAccount,
    OpeningBalance,
  },
  setup() {
    const { data: accountData, bankName, reloadData, cancelDialog } = useBank();

    const data = reactive({
      items: ["Manage Users", "Bank Accounts"],
      facility: null,
    });

    const loadUsers = () => {
      console.log("load users");
    };

    const loadBankAccounts = () => {
      console.log("load bank accounts");
    };

    const openConfirmDialog = (id: any) => {
      accountData.itemTodelete = id;
      accountData.showDeleteDialog = true;
    };

    const openDialog = (formData?: any) => {
      if (formData.id) {
        accountData.formData = formData;
        accountData.modalTitle = "Update";
      } else {
        accountData.formData = {};
        accountData.modalTitle = "Create";
      }
      accountData.modal = !accountData.modal;
    };

    const save = () => {
      accountData.formData.facility_id = data.facility.id;
      console.log("Form Data", accountData.formData);
      if (accountData.formData.id) {
        updateBankAccount(accountData.formData);
      } else {
        createBankAccount(accountData.formData);
      }
    };

    const updateBankAccount = (data: any) => {
      update(data).then(() => {
        reloadData();
        cancelDialog();
      });
    };

    const createBankAccount = (data: any) => {
      create(data).then(() => {
        reloadData();
        cancelDialog();
      });
    };

    const remove = () => {
      console.log(accountData.itemtodelete);
      reloadData();
      accountData.deletemodal = false;
    };

    const fetchFacility = () => {
      const facilityId = router.currentRoute.query.facility_id;
      findFacility(facilityId).then((response) => {
        console.log(response);
        data.facility = response.data.data;
      });
    };

    const facilityDescription = computed(() => {
      return data.facility
        ? `${data.facility.name} - ${data.facility.facility_type.name}`
        : "";
    });

    onMounted(() => {
      fetchFacility();
    });

    return {
      data,
      loadBankAccounts,
      loadUsers,
      accountData,
      bankName,
      openDialog,
      remove,
      save,
      facilityDescription,
      openConfirmDialog,
    };
  },
});
</script>
