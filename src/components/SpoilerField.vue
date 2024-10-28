<template>
  <v-container class="spoiler-container">
    <v-btn @click="showSpoiler = !showSpoiler" :color="!showSpoiler ? 'success' : 'danger'">
      {{ showSpoiler ? 'Hide Access Code' : 'Show Access Code' }}
    </v-btn>

    <!-- Spoiler content that toggles visibility -->
    <v-fab-transition>
      <div v-if="showSpoiler">
        <v-card class="spoiler-card">
          <v-card-text class="text-center font-weight-bold">
            {{accessCode}}
          </v-card-text>
        </v-card>
      </div>
    </v-fab-transition>
  </v-container>
</template>

<script>
import {ref} from "vue";

export default {
  name:'SpoilerField',
  props: {
    accessCode: {
      type: String,
      required: true
    },
  },
  setup() {
    const showSpoiler = ref(false);
    return {
      showSpoiler
    };
  },
};
</script>

<style scoped>
.spoiler-card{
  width: fit-content;
  margin-top: -90px;
}
.spoiler-container{
  padding-left: 1rem;
  padding-top: 0;
}
</style>
