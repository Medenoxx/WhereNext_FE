<script>
export default {
  name: 'EventCard',
  props: {
    event: {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
  <v-card :to="{ name: 'EventDetails', params: { id: event.id } }" class="mx-auto" max-width="400">
    <v-img :src="event.imageUrl" height="200px" cover></v-img>
    <v-card-title>{{ event.name }}</v-card-title>
    <v-card-subtitle>{{ event.date }} at {{ event.time }}</v-card-subtitle>
    <v-card-text>
      <p>{{ event.description }}</p>
      <v-chip class="mr-2">{{ event.category }}</v-chip>
      <v-chip>{{ event.participants.length }} / {{ event.maxParticipants }} participants </v-chip>
    </v-card-text>
  </v-card>
</template>
