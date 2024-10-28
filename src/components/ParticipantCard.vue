<script>
export default {
  name: 'ParticipantCard',
  props: {
    participant: {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
  <div class="mx-auto participant-card">
    <v-img :src="participant.avatarUrl" class="avatar" height="50px" max-width="50px" cover></v-img>
    <v-card-title>{{ participant.username }}</v-card-title>
  </div>
</template>

<style scoped>
.participant-card {
  display: flex;
  flex-direction: row;
}
.avatar{
  border: 3px solid #20a2ae;
  border-radius: 50%;
}
</style>