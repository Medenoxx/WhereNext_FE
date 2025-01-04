<template>
  <v-container>
    <!-- Profilbereich -->
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Profil</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-if="isEditable" @submit.prevent="updateProfile">
              <!-- Formularfelder zum Bearbeiten des Profils -->
              <v-row>
                <v-col cols="12" class="text-center py-8">
                  <user-avatar :avatar-url="userDetails?.avatarUrl" :size="150"></user-avatar>
                </v-col>
              </v-row>
              <v-text-field
                  v-model="firstName"
                  label="First Name"
                  required
              ></v-text-field>
              <v-text-field
                  v-model="lastName"
                  label="Last Name"
                  required
              ></v-text-field>
              <v-text-field
                  v-model="username"
                  label="Username"
                  required
                  disabled
              ></v-text-field>
              <v-text-field
                  v-model="email"
                  label="E-Mail"
                  type="E-mail"
                  required
                  disabled
              ></v-text-field>
              <v-textarea
                  v-model="aboutMe"
                  label="About me"
              ></v-textarea>
              <v-combobox
                  v-model="hobbies"
                  label="Hobbys"
                  multiple
                  chips
                  small-chips
                  deletable-chips
              ></v-combobox>
              <v-combobox
                  v-model="interests"
                  label="Interests"
                  multiple
                  chips
                  small-chips
                  deletable-chips
              ></v-combobox>
              <v-btn type="submit" color="primary" block class="mt-4">Update profile</v-btn>
            </v-form>

            <div v-else class="text-center">
              <v-card class="pa-4" outlined>
                <!-- Avatar und Namen -->
                <v-row class="d-flex flex-column align-center">
                  <user-avatar :avatar-url="userDetails?.avatarUrl" :size="150"></user-avatar>
                  <div class="text-h5 font-weight-medium">{{ firstName }} {{ lastName }}</div>
                  <div class="text-subtitle-1 text-grey darken-1">@{{ username }}</div>
                </v-row>

                <!-- Profilinformationen -->
                <v-divider class="my-4"></v-divider>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="primary">mdi-email</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ email }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="primary">mdi-information-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Über mich</v-list-item-title>
                      <v-list-item-subtitle v-if="userDetails?.aboutMe">
                        {{ userDetails?.aboutMe }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-else>
                        No information available
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        Hobbys
                      </v-list-item-title>
                      <v-chip-group
                          v-if="userDetails?.hobbies && userDetails.hobbies.length > 0"
                          column
                      >
                        <v-chip
                            v-for="(hobby, index) in userDetails.hobbies"
                            :key="index"
                            class="ma-2"
                            color="primary"
                            text-color="white"
                        >
                          {{ hobby }}
                        </v-chip>
                      </v-chip-group>
                      <v-list-item-subtitle v-else>
                        No hobbies added
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        Interests
                      </v-list-item-title>
                      <v-chip-group
                          v-if="userDetails?.interests && userDetails.interests.length > 0"
                          column
                      >
                        <v-chip
                            v-for="(interest, index) in userDetails.interests"
                            :key="index"
                            class="ma-2"
                            color="primary"
                            text-color="white"
                        >
                          {{ interest }}
                        </v-chip>
                      </v-chip-group>
                      <v-list-item-subtitle v-else>
                        No interests added
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
              <v-btn type="button" color="primary" block class="mt-4" @click="isEditable = true">
                Edit Profile
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Meine erstellten Veranstaltungen -->
    <v-divider class="my-8"></v-divider>
    <v-toolbar flat color="transparent">
      <v-toolbar-title>
        <v-icon left color="primary">mdi-calendar-plus</v-icon>
        <span class="title">My Events </span>
      </v-toolbar-title>
    </v-toolbar>
    <v-row class="row">
      <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="event in userCreatedEvents"
          :key="event.eventId"
      >
        <v-card class="mb-4">
          <v-card-title>{{ event.name }}</v-card-title>
          <v-card-subtitle>
            Date: {{ formatDate(event.date) }}
          </v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" @click="goToEventDetails(event.eventId)">
              Details
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="deleteEvent(event.eventId)">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Veranstaltungen, an denen ich teilnehme -->
    <v-divider class="my-8"></v-divider>
    <v-toolbar flat color="transparent">
      <v-toolbar-title>
        <v-icon left color="primary">mdi-account-multiple</v-icon>
        <span class="title">Attending Events</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-row class="row">
      <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="event in userParticipatedEvents"
          :key="event.eventId"
      >
        <v-card class="mb-4">
          <v-card-title>{{ event.name }}</v-card-title>
          <v-card-subtitle>
            Datum: {{ formatDate(event.date) }}
          </v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" @click="goToEventDetails(event.eventId)">
              Details
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="leaveEvent(event.eventId)">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Meine erstellten Kommentar -->
    <v-divider class="my-8"></v-divider>
    <v-toolbar flat color="transparent">
      <v-toolbar-title>
        <v-icon left color="primary">mdi-comment-quote</v-icon>
        <span class="title">My Comments</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-row class="row">
      <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="comment in userComments"
          :key="comment.id"
      >
        <v-card class="mb-4">
          <v-card-title>
            {{ events.find((event) => event.eventId === comment.eventId).name || 'Event deleted' }}
          </v-card-title>
          <v-card-subtitle>
            Time: {{ comment.commentTimestamp }}
          </v-card-subtitle>
          <v-card-text>
            {{ comment.message }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="goToEventDetails(comment.eventId)">
              Event Details
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="deleteComment(comment.eventId, comment.commentId)">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar für Benutzerbenachrichtigungen -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import {ref, onMounted, computed, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useAuthStore} from '@/stores/auth';
import {useEventStore} from '@/stores/event';
import UserAvatar from '@/components/UserAvatar.vue';
import {useCommentStore} from "@/stores/comment.js";
import {storeToRefs} from 'pinia';

export default {
  components: {
    UserAvatar,
  },
  setup() {
    const authStore = useAuthStore();
    const eventStore = useEventStore();
    const commentStore = useCommentStore();
    const router = useRouter();
    const isAuthenticated = authStore.isAuthenticated


    const snackbar = ref(false);
    const snackbarMessage = ref('');
    const snackbarColor = ref('');

    const user = computed(() => authStore.user);
    const userDetails = computed(() => authStore.userDetails);
    //const events = computed(() => eventStore.events);
    const {events} = storeToRefs(eventStore);
    const {comments} = storeToRefs(commentStore);

    const isEditable = ref(false);
    const firstName = ref('');
    const lastName = ref('');
    const username = ref('');
    const email = ref('');
    const aboutMe = ref('');
    const hobbies = ref([]);
    const interests = ref([]);
    //const comments = ref([]);

    const userCreatedEvents = computed(() => eventStore.userCreatedEvents);
    const userParticipatedEvents = computed(() => eventStore.userParticipatedEvents);
    const userComments = computed(() => commentStore.userComments);

    const loadComments = async () => {
      try {
        const fetchedComments = await commentStore.fetchAllCommentsFromUser();
        comments.value = fetchedComments || [];
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
    }

    const deleteComment = async (eventId, commentId) => {
      try {
        await commentStore.deleteComment(eventId, commentId);
        await loadComments();
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
    }

    if (isAuthenticated) {

      onMounted(async () => {

        // Lade User details
        await authStore.fetchUserDetails();
        await authStore.loadUser();
        await eventStore.fetchEvents();

        console.log(authStore.isAdmin)

        // Benutzerdaten aus dem Store setzen
        firstName.value = user.value.firstName;
        lastName.value = user.value.lastName;
        username.value = user.value.username;
        email.value = user.value.email;


        // Lade Events, die der Benutzer erstellt hat und an denen er teilnimmt
        await loadUserEvents();

        await loadComments();
      });

      const loadUserEvents = async () => {
        try {
          await eventStore.fetchUserCreatedEvents();
          await eventStore.fetchUserParticipatedEvents();
        } catch (error) {
          console.error('Failed to load user events:', error);
        }
      };
    }


    const deleteEvent = async (eventId) => {
      try {
        const success = await eventStore.deleteEvent(eventId);

        if (success) {
          // Synchronisiere Kommentare nach dem Löschen
          commentStore.comments = commentStore.comments.filter(
              (comment) => comment.eventId !== eventId
          );

          snackbarMessage.value = 'Event deleted successfully';
          snackbarColor.value = 'green';
        } else {
          throw new Error('Failed to delete event');
        }
      } catch (error) {
        console.error('Error in deleteEvent:', error);
        snackbarMessage.value = 'Error deleting the event';
        snackbarColor.value = 'red';
      } finally {
        snackbar.value = true; // Snackbar in jedem Fall anzeigen
      }
    };


    const leaveEvent = async (eventId) => {
      try {
        await eventStore.leaveEvent(eventId);
        snackbarMessage.value = 'Successfully canceled participation.';
        snackbarColor.value = 'green';
        snackbar.value = true;
      } catch (error) {
        snackbarMessage.value = 'Error when canceling participation.';
        snackbarColor.value = 'red';
        snackbar.value = true;
      }
    };

    const goToEventDetails = (eventId) => {
      router.push({name: 'EventDetails', params: {id: eventId}});
    };

    const formatDate = (dateString) => {
      const options = {year: 'numeric', month: 'long', day: 'numeric'};
      return new Date(dateString).toLocaleDateString('de-DE', options);
    };

    watch(
        userDetails,
        (newValue) => {
          if (newValue) {
            aboutMe.value = newValue.aboutMe;
            hobbies.value = newValue.hobbies || [];
            interests.value = newValue.interests || [];
          }
        },
        {immediate: true}
    );

    watch(comments, () => {
      setTimeout(() => {
        loadComments();
      }, 30000);
    });

    const updateProfile = async () => {
      try {
        const userData = {
          firstName: firstName.value,
          lastName: lastName.value,
          aboutMe: aboutMe.value,
          hobbies: hobbies.value,
          interests: interests.value,
        };
        await authStore.updateProfile(userData);
        await authStore.fetchUserDetails();

        isEditable.value = false;
        // Erfolgsmeldung anzeigen
      } catch (error) {
        console.error('Failed to update profile:', error);
        // Fehlermeldung anzeigen
      }
    };

    return {
      user,
      firstName,
      lastName,
      username,
      email,
      aboutMe,
      hobbies,
      interests,
      userDetails,
      isEditable,
      updateProfile,
      userCreatedEvents,
      userParticipatedEvents,
      deleteEvent,
      leaveEvent,
      goToEventDetails,
      formatDate,
      snackbar,
      snackbarMessage,
      snackbarColor,
      comments,
      userComments,
      events,
      deleteComment
    };
  },
};
</script>

<style scoped>
.v-container {
  padding: 24px;
}

.mt-8 {
  margin-top: 32px;
}

.title {
  font-weight: 500;
}

.row {
  margin-top: .5rem;
  margin-left: 2rem;
}
</style>
