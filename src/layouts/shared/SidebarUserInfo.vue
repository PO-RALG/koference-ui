<template>
  <div>
    <v-toolbar-title
      color="primary"
      class="user-banner d-flex flex-row justify-start"
    >
      <v-row>
        <v-layout justify-center align-center>
          <v-col cols="4" class="text-left ml-5">
            <img class="user-avatar" :src="userx" />
          </v-col>
          <v-col cols="8" class="text-left pl-0 mt-n2">
            <div class="description">
              <h3 class="name black--text">{{ fullName }}</h3>
              <!-- <div class="description-title" v-if="user.roles">
                <a href="#" class="black--text"
                  >{{ "ROLES:" }} [{{ roleName }}]</a
                >
              </div> -->
              <div class="location pt-2">
                <a href="#">{{ location }}</a>
              </div>
            </div>
          </v-col>
        </v-layout>
      </v-row>
    </v-toolbar-title>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { concat } from "lodash";

export default defineComponent({
  props: {
    user: {
      type: Object,
    },
    logoUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      userx: "/user.jpeg",
    };
  },
  setup(props) {
    const fullName = computed(() => {
      return `${props.user.first_name} ${props.user.last_name}`;
    });

    // const roleName = computed(() => {
    //   if (props.user.roles) {
    //     return props.user.roles[0].name;
    //   } else {
    //     return "NO ROLE";
    //   }
    // });

    const location = computed(() => {
      if (props.user.facility) {
        return (
          props.user.facility.name +
          " " +
          props.user.facility.facility_type.name
        );
      } else if (props.user.location) {
        return props.user.location.name;
      } else {
        ("NO LOCATION");
      }
    });

    return {
      location,
      // roleName,
      fullName,
    };
  },
});
</script>
