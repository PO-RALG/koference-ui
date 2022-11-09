<template>
  <div class="">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-card color="basil" class="pb-12">
      <v-tabs>
        <v-tab>Bank Adjustment</v-tab>
        <v-tab-item>
          <v-card color="basil" flat>
            <BankAdjustmentCouncilApprove />
          </v-card>
        </v-tab-item>
        <v-tab>Deposit Receipt</v-tab>
        <v-tab-item>
          <v-card color="basil" flat>
            <ManageReceiptCouncilApproval />
          </v-card>
        </v-tab-item>
        <v-tab>Payment Reversal</v-tab>
        <v-tab-item>
          <v-card color="basil" flat>
            <PaymentCouncilApproval />
          </v-card>
        </v-tab-item>
        <!-- <v-tab>Journal Voucher</v-tab>
        <v-tab-item>
          <v-card color="basil" flat>
          </v-card>
        </v-tab-item>

        <v-tab>Invoice</v-tab>
        <v-tab-item>
          <v-card color="basil" flat>
          </v-card>
        </v-tab-item> -->
      </v-tabs>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCouncilApproval } from "./composables/approval-council";
import BankAdjustmentCouncilApprove from "@/components/receivables/bank-adjustment-council-approval/BankAdjustmentCouncilApprove.vue";
import ManageReceiptCouncilApproval from "@/components/receivables/receipt-council-approval/ReceiptCouncilApproval.vue";
import PaymentCouncilApproval from "@/components/payable/payment-council-approval/PaymentCouncilApproval.vue";

export default defineComponent({
  components: {
    BankAdjustmentCouncilApprove,
    ManageReceiptCouncilApproval,
    PaymentCouncilApproval,
  },
  name: "ApprovalCouncilManagement",
  setup() {
    const { data } = useCouncilApproval();

    return {
      data,
    };
  },
});
</script>
