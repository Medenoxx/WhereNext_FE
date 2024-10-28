<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img :src="logo" height="200px" alt="Event Management"></v-img>
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Where Next?
        </h1>

        <p class="subheading font-weight-regular">
          Bringing You Closer - One Event at a Time
        </p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <v-row justify="center">
          <v-col cols="12" md="4">
            <v-btn
                color="primary"
                x-large
                block
                @click="$router.push('/events/list')"
            >
              Browse Events
            </v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn
                color="secondary"
                x-large
                block
                @click="$router.push('/events/create')"
            >
              Create Event
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-8">
          Effortless Event Planning for Everyday Moments
        </h2>

        <v-row justify="center" align="center">
          <v-col cols="12" sm="4">
            <v-card class="elevation-12 p-4" @click="redirectToDiscoverEvents">
              <v-icon x-large color="primary">mdi-magnify</v-icon>
              <h3 class="subtitle-1">Discover Events</h3>
              <p>Discover the buzz and join thrilling events around the corner</p>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4">
            <v-card class="elevation-12 p-4" @click="redirectToCreateEvent">
              <v-icon x-large color="primary">mdi-calendar-plus</v-icon>
              <h3 class="subtitle-1">Create Events</h3>
              <p>Host events and share them with your community</p>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4">
            <v-card class="elevation-12 p-4" @click="redirectToDiscoverEvents">
              <v-icon x-large color="primary">mdi-account-group</v-icon>
              <h3 class="subtitle-1">Connect</h3>
              <p>Connect with new faces and build lasting friendships</p>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import logo from '@/assets/logo.svg'
import {useAuthStore} from "@/stores/auth.js";
import {useRouter} from "vue-router";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const redirectToDiscoverEvents = () => {
      const isAuthenticated = authStore.isAuthenticated;

      if (isAuthenticated) {
        router.push('/events/list');
      } else {
        router.push('/login');
      }
    };
    const redirectToCreateEvent = () => {
      const isAuthenticated = authStore.isAuthenticated;

      if (isAuthenticated) {
        router.push('/events/create');
      } else {
        router.push('/login');
      }
    };
    return {
      logo,
      redirectToDiscoverEvents,
      redirectToCreateEvent
    }
  }
}
</script>
