<template>
  <v-container class="d-flex justify-center">
    <v-row>
      <v-col cols="12" class="text-center mb-4">
        <h2>Choose your avatar</h2>
      </v-col>
      <v-col class="d-flex flex-column align-center p-4" cols="12" sm="6" md="4" v-for="(avatar, index) in avatars" :key="index">
        <v-avatar size="190" :class="{'selected-avatar': selectedAvatar === avatar}">
          <v-avatar size="160" @click="selectAvatar(avatar)">
            <v-img :src="avatar"/>
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
    const selectedAvatar = ref('')
    const avatars = [
      '/src/assets/defaultAvatars/avatar1.png',
      '/src/assets/defaultAvatars/avatar2.png',
      '/src/assets/defaultAvatars/avatar3.png',
      '/src/assets/defaultAvatars/avatar4.png',
      '/src/assets/defaultAvatars/avatar5.png',
      '/src/assets/defaultAvatars/avatar6.png',
    ];

    const selectAvatar = (avatar) => {
      selectedAvatar.value = avatar;
      emit('avatar-selected', avatar); // Sende den ausgewählten Avatar an den übergeordneten Bereich
    }

    return {
      avatars,
      selectedAvatar,
      selectAvatar
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
