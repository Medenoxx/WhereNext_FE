<template>
  <v-app>
    <v-navigation-drawer
        v-model="drawer"
        app
        temporary
    >
      <!-- Seitenleiste mit Navigationslinks -->
      <v-list dense>
        <!-- Ihre vorhandenen Navigationslinks bleiben unverändert -->
        <v-list-item to="/" link>
          <v-list-item-title class="menu-item">
            <v-icon class="menu-item-icon">mdi-home</v-icon>
            Home
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!authStore.isAuthenticated" to="/login" link>
          <v-list-item-title class="menu-item">
            <v-icon class="menu-item-icon">mdi-login</v-icon>
            Login
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!authStore.isAuthenticated" to="/register" link>
          <v-list-item-title class="menu-item">
            <v-icon class="menu-item-icon">mdi-account-plus</v-icon>
            Register
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="authStore.isAuthenticated" to="/events/create" link>
          <v-list-item-title class="menu-item">
            <v-icon class="menu-item-icon">mdi-plus-circle</v-icon>
            Create Event
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="authStore.isAdmin" to="/admin/comments" link>
          <v-list-item-title class="menu-item">
            <v-icon class="menu-item-icon">mdi-comment-alert</v-icon>
            Manage Comments
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="authStore.isAuthenticated" to="/events/list" link>
          <v-list-item-title class="menu-item">
            <v-icon class="menu-item-icon">mdi-calendar-multiple</v-icon>
            Events
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="authStore.isAuthenticated" to="/profile" link>
          <v-list-item-title class="menu-item">
            <v-icon class="menu-item-icon">mdi-account</v-icon>
            My Profile
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="authStore.isAuthenticated" @click="logout" link>
          <v-list-item-title class="menu-item">
            <v-icon class="menu-item-icon">mdi-logout</v-icon>
            Logout
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <a href="/" class="logo-link">
        <v-app-bar-title class="logo-title">Where Next?</v-app-bar-title>
        <v-app-bar-subtitle class="logo-subtitle">The Pulse of Austria’s Event Scene</v-app-bar-subtitle>
      </a>
      <v-spacer></v-spacer>

      <!-- Desktop-Navigationslinks -->
      <v-btn to="/" text class="hidden-sm-and-down">Home</v-btn>
      <v-btn v-if="!authStore.isAuthenticated" to="/login" text class="hidden-sm-and-down">Login</v-btn>
      <v-btn v-if="!authStore.isAuthenticated" to="/register" text class="hidden-sm-and-down">Register</v-btn>

      <v-btn v-if="authStore.isAuthenticated" to="/events/create" text class="hidden-sm-and-down">Create Event</v-btn>
      <v-btn v-if="authStore.isAdmin" to="/admin/comments" text class="hidden-sm-and-down">Manage Comments</v-btn>
      <v-btn v-if="authStore.isAuthenticated" to="/events/list" text class="hidden-sm-and-down">Events</v-btn>
      <v-btn v-if="authStore.isAuthenticated" to="/profile" text class="hidden-sm-and-down">My Profile</v-btn>
      <v-btn v-if="authStore.isAuthenticated" @click="logout" text class="hidden-sm-and-down">Logout</v-btn>
    </v-app-bar>

    <v-main class="container-wrap">
      <v-container fluid class="container-content">
        <v-row no-gutters
               :class="this.$route.path === '/events/create' ? 'container-main-create' : 'container-main elevation-6'">
          <!-- Hauptinhalt -->
          <v-col :cols="12" :md="adStore.adHidden ? 12 : 9">
            <router-view></router-view>
          </v-col>

          <!-- Werbebanner -->
          <v-col v-if="!adStore.adHidden" cols="12" md="3" class="d-none d-md-flex">
            <AdvertisementBanner @ad-hidden="adStore.hideAd" @ad-shown="adStore.showAd"/>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app>
      © {{ new Date().getFullYear() }} - Event Management App
      <v-spacer></v-spacer>
      <v-btn text @click="adStore.showAd" v-if="adStore.adHidden">Show advertisement</v-btn>
    </v-footer>
  </v-app>
</template>


<script>
import {useAuthStore} from '@/stores/auth';
import {useAdStore} from '@/stores/ad';
import {ref, onMounted} from 'vue';
import AdvertisementBanner from '@/components/AdvertisementBanner.vue';



export default {
  name: 'App',
  components: {
    AdvertisementBanner
  },
  setup() {
    const authStore = useAuthStore();
    const drawer = ref(false);
    const adStore = useAdStore();

    const isAdHidden = ref(false);
    const adBanner = ref(null);


    authStore.initializeAuth();

    const logout = () => {
      authStore.logout();
      // Nach dem Logout zur Login-Seite weiterleiten
      window.location.href = '/login';
    };

    const resetAd = () => {
      localStorage.removeItem('adHidden');
      isAdHidden.value = false;
      // Zugriff auf die AdvertisementBanner-Komponente und Aufruf von showAd()
      if (adBanner.value) {
        adBanner.value.showAd();
      }
    };

    const updateAdHidden = (hidden) => {
      isAdHidden.value = hidden;
    };

    onMounted(() => {
      authStore.initializeAuth();
      const adHidden = localStorage.getItem('adHidden');
      if (adHidden === 'true') {
        isAdHidden.value = true;
      }
      adStore.initializeAdState();
    });


    return {
      authStore,
      logout,
      drawer,
      isAdHidden,
      resetAd,
      updateAdHidden,
      adBanner,
      adStore
    };
  },
};
</script>

<style scoped>
.logo-link {
  text-decoration: none;
  color: #444;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  margin-left: 1.5rem;
  transition: color 0.3s ease;
}

.logo-title {
  font-size: 1.5em;
  transition: color 0.3s ease;
  font-weight: 650;
}

.logo-link:hover .logo-title {
  color: #6e1678;
}

/* Styles for the subtitle */
.logo-subtitle {
  font-size: 0.9rem; /* Smaller font size for the subtitle */
  color: #595959; /* Default subtitle color */
  transition: color 0.3s ease;
}

/* Hover effect for the subtitle */
.logo-link:hover .logo-subtitle {
  color: #a53faf; /* Change to blue on hover */
}

.container-wrap {
  position: relative;
}

.container-wrap:before {
  content: ' ';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  background-image: url('/src/assets/background.png');
  background-repeat: no-repeat;
  background-position: 50% 0;
  background-size: cover;
}

.container-content {
  position: relative;
}

.container-main {
  width: 70%;
  height: 100%;
  margin: auto;
  padding: 2rem;
  background: rgba(243, 243, 243, 0.41);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(9.2px);
  -webkit-backdrop-filter: blur(9.2px);
  border: 1px solid rgba(196, 196, 196, 0.93);
}

.container-main-create {
  width: 100%;
  height: 100%;
  margin: auto;

}

.menu-item {
  display: flex;
}

.menu-item-icon {
  width:30px;
  margin-right: 10px;
}

@media (max-width: 600px) {
  .container-main {
    width: 100%;
    height: 100%;
    margin: auto;
    background: rgba(243, 243, 243, 0.41);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(9.2px);
    -webkit-backdrop-filter: blur(9.2px);
    border: 1px solid rgba(196, 196, 196, 0.93);
  }

  .container-main-create {
    width: 100%;
    height: 100%;
    margin: auto;
  }
}
</style>
