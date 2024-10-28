<template>
    <v-dialog v-model="localIsVisible" persistent max-width="800px">
      <v-card>
        <v-card-title class="headline">
          Willkommen auf unserer Seite!
        </v-card-title>
        <v-card-text>
          <v-responsive aspect-ratio="16/9">
            <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; height: auto;">
              <iframe :src="videoSrc" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
            </div>

          </v-responsive>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeModal">
            Schließen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: 'VideoModal',
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
    },
    emits: ['update:modelValue', 'videoWatched'],
    data() {
      return {
        localIsVisible: this.modelValue,
        videoSrc: 'https://www.youtube-nocookie.com/embed/Sdaf0FK6Bj4?autoplay=1&mute=1',
      };
    },
    watch: {
      modelValue(newVal) {
        this.localIsVisible = newVal;
      },
      localIsVisible(newVal) {
        this.$emit('update:modelValue', newVal);
      },
    },
    methods: {
      closeModal() {
        this.localIsVisible = false;
        this.$emit('videoWatched');
      },
      onVideoEnded() {
        this.closeModal();
      },
    },
  };
  </script>
  
  
  <style scoped>
  /* Optional: Styles für das Modal */
  </style>
  