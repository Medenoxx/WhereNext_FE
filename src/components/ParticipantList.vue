<template>
  <v-list>
    <v-list-item v-for="participant in participants" :key="participant.id">
      <participant-card :participant="participant"/>
    </v-list-item>
  </v-list>
</template>

<script>
import ParticipantCard from "@/components/ParticipantCard.vue";

export default {
  name: 'ParticipantList',
  components: {ParticipantCard},
  props: {
    participants: {
      type: Array,
      required: true
    }
  }
}
</script>