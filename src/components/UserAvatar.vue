<script>
export default {
  name: 'UserAvatar',
  props: {
    avatarUrl: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 40
    }
  }
}
</script>

<template>
  <v-avatar :size="size">
    <v-img :src="avatarUrl" alt="User Avatar"></v-img>
  </v-avatar>
</template>
