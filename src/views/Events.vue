<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Create Event</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="createEvent">
                <v-text-field
                  v-model="eventName"
                  label="Event Name"
                  required
                ></v-text-field>
                <v-textarea
                  v-model="description"
                  label="Description"
                  required
                ></v-textarea>
                <v-select
                  v-model="category"
                  :items="categories"
                  label="Category"
                  required
                ></v-select>
                <v-text-field
                  v-model="location"
                  label="Location"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="date"
                  label="Date"
                  type="date"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="time"
                  label="Time"
                  type="time"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="maxParticipants"
                  label="Max. Participants"
                  type="number"
                  required
                ></v-text-field>
                <v-btn type="submit" color="primary" block class="mt-4">Create Event</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useEventStore } from '@/stores/event'
  
  export default {
    setup() {
      const eventName = ref('')
      const description = ref('')
      const category = ref('')
      const location = ref('')
      const date = ref('')
      const time = ref('')
      const maxParticipants = ref(0)
      const router = useRouter()
      const eventStore = useEventStore()
  
      const categories = [
        'Music', 'Sports', 'Arts', 'Technology', 'Food', 'Other'
      ]

      const createEvent = async () => {
        try {
          const eventData = {
            name: eventName.value,
            description: description.value,
            category: category.value,
            location: location.value,
            date: date.value,
            time: time.value,
            maxParticipants: maxParticipants.value,
          }
          await eventStore.createEvent(eventData)
          router.push('/events')
        } catch (error) {
          console.error('Event creation failed:', error)
        }
      }
  
      return {
        eventName,
        description,
        category,
        categories,
        location,
        date,
        time,
        maxParticipants,
        createEvent
      }
    }
  }
  </script>