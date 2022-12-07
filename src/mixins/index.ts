import Vue from "vue";
import store from "@/store";
import _ from "lodash";

Vue.mixin({
  methods: {
    can(action: string, resource: string): boolean {
      const user = store.getters["Auth/getCurrentUser"];

      const found = _.find(user.permissions, {
        action,
        resource,
      });

      if (user) {
        return !!found;
      }
    },

    cant(action: string, resource: string): boolean {
      const user = store.getters["Auth/getCurrentUser"];
      const found = _.find(user.permissions, {
        action,
        resource,
      });

      if (user) {
        const result = !!found;
        return !result;
      }
    },

    canApproveFacility(
      model: any,
      workflowIn: any,
      action,
      resource: string
    ): boolean {
      if (typeof model.approves == "undefined" || model.approves.length === 0) {
        return false;
      }
      let currentFlowable = null;
      const approves = model.approves;

      approves.forEach(function (flowable) {
        if (flowable.facility_approved == null) {
          currentFlowable = flowable;
        }
      });
      if (currentFlowable == null) {
        return false;
      }

      const workflow = currentFlowable.workflow;

      if (workflow == workflowIn) {
        const user = store.getters["Auth/getCurrentUser"];

        const found = _.find(user.permissions, {
          action,
          resource,
        });
        if (user) {
          const result = !!found;
          return result;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    canCancelOldVoucher(
      model: any,
      workflowIn: any,
      action,
      resource: string
    ): boolean {
      if (typeof model.approves == "undefined" || model.approves.length === 0) {
        return false;
      }
      let currentFlowable = null;
      const approves = model.approves;

      approves.forEach(function (flowable) {
        if (
          flowable.facility_approved == false &&
          flowable.workflow == "PAYMENT_VOUCHER" &&
          model.created_at <= "2022-11-16"
        ) {
          currentFlowable = flowable;
        }
      });
      if (currentFlowable == null) {
        return false;
      }

      const workflow = currentFlowable.workflow;

      if (workflow == workflowIn) {
        const user = store.getters["Auth/getCurrentUser"];

        const found = _.find(user.permissions, {
          action,
          resource,
        });
        if (user) {
          const result = !!found;
          return result;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    canApproveCouncil(
      model: any,
      workflowIn: any,
      action,
      resource: string
    ): boolean {
      if (typeof model.approves == "undefined" || model.approves.length === 0) {
        return false;
      }
      let currentFlowable = null;
      const approves = model.approves;

      approves.forEach(function (flowable) {
        if (flowable.council_approved == null) {
          currentFlowable = flowable;
        }
      });
      if (currentFlowable == null) {
        return false;
      }

      const workflow = currentFlowable.workflow;

      if (workflow == workflowIn) {
        const user = store.getters["Auth/getCurrentUser"];

        const found = _.find(user.permissions, {
          action,
          resource,
        });
        if (user) {
          const result = !!found;
          return result;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    canApproveReversalPVCouncil(
      model: any,
      workflowIn: any,
      action,
      resource: string
    ): boolean {
      if (typeof model.approves == "undefined" || model.approves.length === 0) {
        return false;
      }
      let currentFlowable = null;
      const approves = model.approves;

      approves.forEach(function (flowable) {
        if (
          flowable.council_approved == null &&
          flowable.workflow == "REVERSAL_OF_PAYMENT_VOUCHER"
        ) {
          currentFlowable = flowable;
        }
      });
      if (currentFlowable == null) {
        return false;
      }

      const workflow = currentFlowable.workflow;

      if (workflow == workflowIn) {
        const user = store.getters["Auth/getCurrentUser"];

        const found = _.find(user.permissions, {
          action,
          resource,
        });
        if (user) {
          const result = !!found;
          return result;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    isDemo(): boolean {
      const site = store.getters["Auth/getSiteName"];
      return site && site.name === "demo" ? true : false;
    },
    stringToCurrency(value: string): number {
      return Number(value.replace(/[^0-9.-]+/g, ""));
    },

    isLowLevelUser(): boolean {
      const user = store.getters["Auth/getCurrentUser"];
      if (user && user.location) {
        const isLowLevel =
          user.location.level.code === "VILLAGE_MTAA" ||
          user.location.level.code === "FACILITY";
        return !!isLowLevel;
      }
      return false;
    },

    isCouncilUser(): boolean {
      const user = store.getters["Auth/getCurrentUser"];
      if (user && user.location) {
        const _isCouncilUser = user.location.level.code === "COUNCIL";
        return !!_isCouncilUser;
      }
      return false;
    },
  },
});
