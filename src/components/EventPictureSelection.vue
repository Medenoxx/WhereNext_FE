<template>
  <v-container class="d-flex justify-center">
    <v-row>
      <v-col cols="12" class="text-center mb-4">
        <h2>Choose your avatar</h2>
      </v-col>
      <v-col class="d-flex flex-column align-center p-4" cols="12" sm="6" md="4" v-for="(picture, index) in eventPictures" :key="index">
        <v-avatar size="190" :class="{'selected-avatar': selectedEventPicture === picture}">
          <v-avatar size="160" @click="selectEventPicture(picture)">
            <v-img :src="picture"/>
          </v-avatar>
        </v-avatar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {ref} from "vue";

export default {
  setup(_, {emit}) {
    const selectedEventPicture = ref('')
    const eventPictures = [
      '/src/assets/eventPictures/eventMusic.svg',
      '/src/assets/eventPictures/eventSport.svg',
      '/src/assets/eventPictures/eventArt.svg',
      '/src/assets/eventPictures/eventMarket.svg',
      '/src/assets/eventPictures/eventFood.svg',
      '/src/assets/eventPictures/eventOther.svg',
    ];

    const selectEventPicture = (picture) => {
      selectedEventPicture.value = picture;
      emit('picture-selected', picture); // Sende den ausgewählten Avatar an den übergeordneten Bereich
    }

    return {
      eventPictures,
      selectedEventPicture,
      selectEventPicture
    }
  },
};
</script>

<style scoped>
.selected-avatar {
  border: 4px solid #1976D2; /* Blaue Umrandung für den ausgewählten Avatar */
  background-color: #E3F2FD;
}

.v-avatar{
  cursor: pointer;
  transition: transform 0.2s ease;
}

.v-avatar:hover {
  transform: scale(1.05);
}
</style>
