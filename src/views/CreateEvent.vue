<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Create Your Event</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="createEvent">


              <v-text-field v-model="name" label="Name" required></v-text-field>
              <v-textarea v-model="description" label="Description" required></v-textarea>
              <v-select v-model="category" :items="categories" item-title="name" item-value="categoryId"  label="Category" required></v-select>
              <v-text-field
                  v-model="location"
                  label="Location"
                  required
                  @update:model-value="onLocationInput"
              ></v-text-field>

              <!-- Suggestions Dropdown -->
              <v-list v-if="locationSuggestions.length">
                <v-list-item
                    v-for="(suggestion, index) in locationSuggestions"
                    :key="index"
                    @click="selectSuggestion(suggestion)"
                >
                  <v-list-item-title>{{ suggestion }}</v-list-item-title>
                </v-list-item>
              </v-list>
              <v-text-field v-model="date" label="Date" type="date" required></v-text-field>
              <v-text-field v-model="time" label="Time" type="time" required></v-text-field>
              <section class="checkbox-section">
                <v-checkbox
                    v-model="isPrivate"
                    label="private"
                ></v-checkbox>

                <!-- Open-Air Checkbox -->
                <v-checkbox
                    v-model="isOutdoor"
                    label="outdoor"
                ></v-checkbox>
              </section>
              <v-text-field v-model="maxParticipants" label="max. Participants" type="number" required></v-text-field>
              <div class="error">
                <!-- Display error message here -->
                {{ errormessage }}
              </div>

              <v-alert v-if="showAccessCode" type="info" dismissible>
                Event created successfully! Please copy the access code or check it in your profile: <strong>{{ accessCode }}</strong> You will be redirected in a few seconds.
              </v-alert>

              <v-btn type="submit" color="primary" block class="mt-4">Create Event</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>

<script>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useEventStore} from '@/stores/event';
import {GOOGLE_API_KEY} from "@/_helper/api.js";
import {useCategoryStore} from "@/stores/category.js";

export default {
  setup() {
    const name = ref('');
    const description = ref('');
    const category = ref({
      categoryId: 0,
      name: '',
      color: '',
    });
    const location = ref('');
    const date = ref('');
    const time = ref('');
    const maxParticipants = ref(0);
    const locationSuggestions = ref([]);
    const isPrivate = ref(false);
    const accessCode = ref('');
    const showAccessCode = ref(false);
    const router = useRouter();
    const eventStore = useEventStore();
    const errormessage = ref('');
    const isOutdoor = ref(false);


    const categoryStore = useCategoryStore();
    const categories=ref([]);

    onMounted(async () => {
      await categoryStore.fetchAllCategories();
      console.log('Categories after fetch:', categoryStore.categories);
      categories.value = [...categoryStore.categories];
    });


    // Function to dynamically load Google Maps API
    const loadGoogleMapsScript = () => {
      return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined') {
          resolve(google);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          resolve(google);
        };

        script.onerror = (error) => {
          reject(error);
        };

        document.head.appendChild(script);
      });
    };


    const onLocationInput = async (input) => {
      if (input.length >= 3) {
        try {
          const google = await loadGoogleMapsScript();
          const autocompleteService = new google.maps.places.AutocompleteService();

          autocompleteService.getPlacePredictions(
              {input: input, types: ['geocode']},
              (predictions, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  locationSuggestions.value = predictions.map((prediction) => prediction.description);
                } else {
                  locationSuggestions.value = [];
                }
              }
          );
        } catch (error) {
          console.error('Google Maps API failed to load:', error);
        }
      } else {
        locationSuggestions.value = [];
      }
    };

    // Function to select a suggestion from the dropdown
    const selectSuggestion = (suggestion) => {
      location.value = suggestion;
      locationSuggestions.value = [];
    };

    const createEvent = async () => {
      try {
        // Check if all required fields are filled
        if (!name.value || !description.value || !category.value || !location.value || !date.value || !time.value) {
          errormessage.value = 'Please fill in all fields'; // Use .value to update errormessage
          console.log(errormessage.value);
          return; // Stop form submission
        }

        // Fetch geocoding data for the location
        const geocodingResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location.value)}&key=${GOOGLE_API_KEY}`
        );
        const geocodingData = await geocodingResponse.json();


        // Handle case where location is not found
        if (geocodingData.status !== 'OK') {
          errormessage.value = 'Location not found'; // Use .value to update errormessage
          return; // Stop form submission
        }



        const eventData = {
          name: name.value,
          description: description.value,
          categoryId: category.value,
          location: location.value,
          latitude: geocodingData.results[0].geometry.location.lat,
          longitude: geocodingData.results[0].geometry.location.lng,
          date: date.value,
          time: time.value,
          isPrivate: isPrivate.value,
          maxParticipants: maxParticipants.value,
          isOutdoor: isOutdoor.value,
        };

        console.log('Creating event with data:', eventData); 

        const response = await eventStore.createEvent(eventData);

        if(isPrivate.value){
          accessCode.value = response.accessCode; // Zugangscode aus der Antwort speichern
          showAccessCode.value = true;
          setTimeout(() => router.push('/events/list'), 5000);
        } else {
          router.push('/events/list');
        }
      } catch (error) {
        console.error('Event creation failed:', error);
      }
    };


    return {
      name,
      description,
      category,
      categories,
      categoryStore,
      location,
      locationSuggestions,
      date,
      time,
      maxParticipants,
      onLocationInput,
      selectSuggestion,
      createEvent,
      errormessage,
      accessCode,
      showAccessCode,
      isPrivate,
      isOutdoor
    };
  },
};
</script>

<style scoped>
.checkbox-section{
  display: flex;
  justify-content: space-evenly;
}
</style>