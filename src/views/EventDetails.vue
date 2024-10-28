<template>
  <v-container>
    <template v-if="event">
      <v-card>
        <v-row no-gutters>
          <!-- Event Bild -->
          <v-col cols="12" sm="12" md="4" class="event-image-container">
            <v-img
                :src="getCategoryImage(event.categoryId)"
                class="ml-4 my-4"
                max-width="80%"
                height="auto"
            />
          </v-col>
          <v-col cols="12" sm="12" md="8">
            <v-card-title class="text-h3 font-weight-bold">
              {{ event.name || 'Eventname' }}
            </v-card-title>
            <v-card-subtitle>
              <div class="event-detail-container">
                <div class="event-detail-text">
                  <h4 class="text-h6 mb-2">Event Details</h4>
                  <span><strong>Address:</strong> {{ event.location || 'Eventlocation' }}</span>
                  <span><strong>Date:</strong> {{ formatDate(event.date) }}</span>
                  <span><strong>Time:</strong> {{ event.time }}</span>
                </div>
                <!-- Wettervorhersage anzeigen, wenn das Event im Freien ist -->
                <div v-if="event.isOutdoor" class="event-detail-forecast">
                  <v-card class="forecast-card" v-if="weatherLoading">
                    <v-progress-circular indeterminate color="primary" size="36"></v-progress-circular>
                    <span class="ml-2">Wetterdaten werden abgerufen...</span>
                  </v-card>
                  <div v-else-if="weather" class="forecast-card">
                    <v-row>
                      <v-col cols="3" class="weather-icon">
                        <v-img
                            :src="`http://openweathermap.org/img/wn/${weather.icon}@2x.png`"
                            alt="Wetter-Icon"
                            width="100px"
                            height="100px"
                            class="mr-2"
                        />
                      </v-col>
                      <v-col cols="9" class="forecast-card-details">
                        <div><strong>Temperature:</strong> {{ weather.temperature }}°C</div>
                        <div><strong>State:</strong> {{ weather.description }}</div>
                      </v-col>
                    </v-row>
                  </div>
                  <template v-else>
                    <v-alert type="error" dismissible>
                      Weather data could not be retrieved.
                    </v-alert>
                  </template>
                </div>
              </div>
              <div class="event-detail-description">
                <h4 class="text-h6 mb-2">Description</h4>
                <p>{{ event.eventDescription }}</p>
              </div>
            </v-card-subtitle>
            <v-card-text>
              <div class="event-detail-container">
                <div class="event-detail-container-navigate">
                  <v-btn
                      small
                      color="primary"
                      @click="navigateToEvent"
                  >
                    Navigation zum Event
                  </v-btn>
                </div>
                <spoiler-field class="spoiler-field"
                               v-if="event.isPrivate && authStore.user.userId === event.organisatorId"
                               :access-code="event.accessCode"
                />
              </div>
            </v-card-text>


          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- Participants Section -->
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <p>
                <strong>Participants:</strong> {{ event.participantsInEvent.length }} / {{ event.maxParticipants }}
              </p>

              <participant-list :participants="event.participantsInEvent"/>

              <!-- Access Code Feld -->
              <v-text-field
                  v-if="event.isPrivate && authStore.user.userId !== event.organisatorId"
                  v-model="accessCode"
                  :rules="[v => !!v || 'Access Code is required']"
                  label="Access Code"
                  prepend-inner-icon="mdi-lock"
                  :required="event.isPrivate"
                  class="mt-4"
              ></v-text-field>

              <!-- Buttons Container -->
              <div class="d-flex flex-wrap mb-2">
                <v-btn
                    @click="joinEvent"
                    v-if="!hasJoined && !isEventFull && authStore.user.userId !== event.organisatorId"
                    color="primary"
                    class="mr-2 mb-2"
                >
                  Join Event
                </v-btn>
                <v-btn
                    @click="leaveEvent"
                    v-else-if="hasJoined"
                    color="error"
                    class="mr-2 mb-2"
                >
                  Cancel Participation
                </v-btn>
                <v-btn
                    color="secondary"
                    class="mb-2"
                    @click="showStatistics = true"
                >
                  Show Statistics
                </v-btn>
              </div>

              <!-- Alert unter den Buttons -->
              <v-alert
                  v-if="isEventFull"
                  type="warning"
                  class="mt-2"
              >
                This event is already full.
              </v-alert>
            </v-col>

          </v-row>
        </v-card-text>

        <!-- Dialog für Statistik -->
        <v-dialog
            v-model="showStatistics"
            max-width="600px"
            @click:outside="closeStatistics"
            @keydown.esc="closeStatistics"
        >
          <v-card>
            <v-card-title class="text-h5">
              Participant Statistics
              <v-spacer></v-spacer>
              <v-btn icon @click="closeStatistics">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text style="height: 800px; overflow-y: auto;">
              <ParticipantChart
                  :currentParticipants="event.participantsInEvent.length"
                  :maxParticipants="event.maxParticipants"
                  style="width: 100%; height: 100%;"
              />
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-divider></v-divider>

        <!-- Comments Section -->
        <v-card-text>
          <add-comment/>
          <comment-list :comments="comments" @commentAdded="loadComments"></comment-list>
        </v-card-text>
      </v-card>
    </template>

    <template v-else>
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p>Loading event details...</p>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>


<script>
import {ref, onMounted, computed, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useEventStore} from '@/stores/event';
import {useAuthStore} from "@/stores/auth.js";
import SpoilerField from "@/components/SpoilerField.vue";
import {WEATHER_API_KEY} from "@/_helper/api.js";
import ParticipantChart from '@/components/ParticipantChart.vue';
import AddComment from "@/components/AddComment.vue";
import CommentCard from "@/components/CommentCard.vue";
import CommentList from "@/components/CommentList.vue";
import {useCommentStore} from "@/stores/comment.js";
import ParticipantList from "@/components/ParticipantList.vue";
// Entfernt: import { useGeolocation } from '@vueuse/core'; // Nicht mehr benötigt

export default {
  components: {ParticipantList, CommentList, CommentCard, AddComment, SpoilerField, ParticipantChart},

  setup() {
    const route = useRoute();
    const router = useRouter();

    const eventStore = useEventStore();
    const authStore = useAuthStore();
    const commentStore = useCommentStore();

    const eventNotFound = ref(false);
    const loading = ref(true);

    const event = ref(null);
    const newComment = ref('');

    const snackbar = ref(false);
    const snackbarMessage = ref('');
    const snackbarColor = ref('');
    const accessCode = ref('');

    const weather = ref(null); // Neue Ref für Wetterdaten
    const weatherLoading = ref(false); // Ref für Ladezustand der Wetterdaten

    const comments = computed(() => commentStore.eventComments?.reverse() ?? []);

    const showStatistics = ref(false);

    // Methode zum Schließen des Dialogs
    const closeStatistics = () => {
      showStatistics.value = false;
    };

    // TODO: Hier ladet er nur die funktion beim laden der seite und nach 30 sek, aber nicht nach dem hinzufügen eines neuen Kommentares
    const loadComments = async () => {
      const eventId = parseInt(route.params.id);
      try {
        await commentStore.fetchAllCommentsForEvent(eventId);
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
    }

    // Methode zum Laden des Events basierend auf der ID
    const loadEvent = async () => {
      const eventId = parseInt(route.params.id);
      console.log('Event ID:', eventId);

      if (isNaN(eventId)) {
        console.error('Invalid event ID');
        eventNotFound.value = true;
        loading.value = false;
        return;
      }

      try {
        await eventStore.fetchEventDetails(eventId);
        event.value = eventStore.currentEvent;
        console.log(event.value);

        console.log('Loaded Event:', event.value);

        if (!event.value || Object.keys(event.value).length === 0) {
          console.error('Event could not be loaded. Please check backend response.');
          eventNotFound.value = true;
        }

        // Wenn das Event im Freien ist, Wetterdaten abrufen
        if (event.value.isOutdoor) {
          await fetchWeather(event.value.latitude, event.value.longitude, event.value.date);
        }
      } catch (error) {
        console.error('Failed to fetch event details:', error);
        if (error.response && error.response.status === 404) {
          eventNotFound.value = true;
        } else {
          snackbarMessage.value = 'Fehler beim Laden des Events.';
          snackbarColor.value = 'red';
          snackbar.value = true;
        }
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      await loadEvent();
      await loadComments();

      // Optional: Timeout von 3 Sekunden hinzufügen
      setTimeout(() => {
        if (loading.value) {
          loading.value = false;
          if (!event.value) {
            eventNotFound.value = true;
          }
        }
      }, 3000);

      setInterval(() => {
        loadComments();
      }, 30000);
    });

    watch(route, async () => {
      await loadEvent();
    });

    // Berechnet, ob das Event voll ist
    const isEventFull = computed(() => {
      return (
          event.value &&
          event.value.participantsInEvent.length >= event.value.maxParticipants
      );
    });

    // Prüft, ob der Benutzer bereits dem Event beigetreten ist
    const hasJoined = computed(() => {
      return event.value && event.value.isParticipant;
    });

    // Methode zum Beitreten eines Events
    const joinEvent = async () => {
      if (!event.value || !event.value.eventId) {
        console.error(
            'Cannot join event. Event ID is undefined or not valid:',
            event.value
        );
        snackbarMessage.value =
            'Problem joining the event';
        snackbarColor.value = 'red';
        snackbar.value = true;
        return;
      }

      try {
        if (event.value.isPrivate) {
          event.value.accessCode = accessCode.value;
        }
        event.value.participantId = authStore.user.userId;
        console.log('Trying to join event with ID:', event.value.eventId);
        await eventStore.joinEvent(event.value);
        console.log('Successfully joined event:', event.value.eventId);
        await loadEvent();

        snackbarMessage.value =
            'You are now taking part in this event!';
        snackbarColor.value = 'green';
        snackbar.value = true;
      } catch (error) {
        console.error('Failed to join event:', error);
        snackbarMessage.value =
            'Issue occured when joining event';
        snackbarColor.value = 'red';
        snackbar.value = true;
      }
    };

    // Methode zum Verlassen eines Events
    const leaveEvent = async () => {
      if (!event.value || !event.value.eventId) {
        console.error('Cannot leave event. Event ID is undefined.');
        snackbarMessage.value = 'Issue occured when canceling event';
        snackbarColor.value = 'red';
        snackbar.value = true;
        return;
      }
      try {
        await eventStore.leaveEvent(event.value.eventId);
        await loadEvent();
        snackbarMessage.value =
            'Successfully canceled participation';
        snackbarColor.value = 'green';
        snackbar.value = true;
      } catch (error) {
        console.error('Failed to leave event:', error);
        snackbarMessage.value = 'Issue occured when canceling event';
        snackbarColor.value = 'red';
        snackbar.value = true;
      }
    };


    const formatDate = (dateString) => {
      const options = {year: 'numeric', month: 'long', day: 'numeric'};
      return new Date(dateString).toLocaleDateString('de-DE', options);
    };

    // Funktion zum Abrufen der Wetterdaten
    const fetchWeather = async (latitude, longitude, date) => {
      try {
        weatherLoading.value = true; // Ladeindikator starten

        // Formatierung des Datums
        const eventDate = new Date(date);
        const currentDate = new Date();
        const diffTime = eventDate - currentDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0 || diffDays > 5) { // 5 Tage Vorhersage bei der 5 Day / 3 Hour Forecast API
          weather.value = null;
          console.warn('Weather forecast is only available for up to 5 days in advance.');
          return;
        }

        // Wetter-API-Anfrage (OpenWeatherMap 5 Day / 3 Hour Forecast)
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
        );
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== "200") {
          console.error('Wetter-API issue:', weatherData.message);
          weather.value = null;
          return;
        }

        // Extrahiere das Wetter für das spezifische Datum
        // Da die 5 Day / 3 Hour Forecast API Wetterdaten alle 3 Stunden liefert,
        // suchen wir den Datensatz, der am nächsten zum Event-Datum liegt.

        const targetDate = new Date(date).setHours(12, 0, 0, 0); // Mittagszeit als Ziel
        let closestForecast = null;
        let minDiff = Infinity;

        weatherData.list.forEach(forecast => {
          const forecastDate = new Date(forecast.dt * 1000).setHours(0, 0, 0, 0);
          const diff = Math.abs(forecastDate - targetDate);
          if (diff < minDiff) {
            minDiff = diff;
            closestForecast = forecast;
          }
        });

        if (closestForecast) {
          weather.value = {
            temperature: closestForecast.main.temp,
            description: closestForecast.weather[0].description,
            icon: closestForecast.weather[0].icon,
          };
        } else {
          weather.value = null;
          console.warn('No weather data found for this specific date.');
        }
      } catch (error) {
        console.error('Error when retrieving weather data:', error);
      } finally {
        weatherLoading.value = false; // Ladeindikator stoppen
      }
    };

    const getCategoryImage = (categoryId) => {
      switch (categoryId) {
        case 1:
          return '/src/assets/eventPictures/eventMusic.svg';
        case 2:
          return '/src/assets/eventPictures/eventSport.svg';
        case 3:
          return '/src/assets/eventPictures/eventArt.svg';
        case 4:
          return '/src/assets/eventPictures/eventMarket.svg';
        case 5:
          return '/src/assets/eventPictures/eventFood.svg';
        case 6:
          return '/src/assets/eventPictures/eventOther.svg';
        default:
          return '/src/assets/eventPictures/default.svg';
      }
    };


    // Methode zum Navigieren zum Event
    const navigateToEvent = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLat = position.coords.latitude;
              const userLng = position.coords.longitude;
              const eventLat = event.value.latitude;
              const eventLng = event.value.longitude;


              const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${eventLat},${eventLng}&travelmode=driving`;


              window.open(mapsUrl, '_blank');
            },
            (error) => {
              console.error('Fehler beim Abrufen der Geolokalisierung:', error);
              snackbarMessage.value = 'Fehler beim Abrufen deiner Position.';
              snackbarColor.value = 'red';
              snackbar.value = true;
            }
        );
      } else {

        console.error('Geolokalisierung wird von diesem Browser nicht unterstützt.');
        snackbarMessage.value = 'Geolokalisierung wird von diesem Browser nicht unterstützt.';
        snackbarColor.value = 'red';
        snackbar.value = true;
      }
    };

    return {
      event,
      isEventFull,
      hasJoined,
      newComment,
      joinEvent,
      leaveEvent,
      snackbar,
      snackbarMessage,
      snackbarColor,
      formatDate,

      loading,
      eventNotFound,
      accessCode,
      authStore,
      weather,
      weatherLoading,
      getCategoryImage,
      comments,
      loadComments,
      showStatistics,
      closeStatistics,
      navigateToEvent,
    };
  },
};
</script>

<style scoped>

h4 {
  color: #000000de !important;
}

.v-container {
  padding-top: 24px;
}

.v-card {
  overflow: hidden;
}

.v-img > .v-card-title {
  position: absolute;
  bottom: 0;
}

.chart-wrapper {
  padding: 16px;
}

.chart-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.event-detail-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-self: flex-start;
}

.event-detail-text {
  width: 40%;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.event-detail-description {
  width: 100%;
}

.event-detail-forecast {
  width: 50%;
  padding: 0;
  margin-right: 10px;
}

.event-detail-container-navigate{
  width: 100%;
}

.forecast-card {
  padding: 10px;
  margin-bottom: 16px;
}

.forecast-card-details {
  align-content: center;
}

.weather-icon {
  padding: 0
}

.event-image-container {
  align-content: center;
  text-align: center;
  text-align: -webkit-center;
}

.spoiler-field {
  padding: 0;
  padding-left: 1rem;
}

@media (max-width: 600px) {
  .stepper-container {
    width: 90%;
  }

  .chart-wrapper {
    padding: 8px;
  }

  .text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .d-flex.justify-end {
    justify-content: flex-start !important;
  }
}
</style>