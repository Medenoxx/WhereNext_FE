<template>
  <div v-if="!adHidden" class="advertisement-banner">
    <!-- Nachricht oberhalb der Werbung -->
    <div class="ad-header">
      <h3>Your brand could light up this space!</h3>
    </div>

    <div class="slideshow">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="slide"
      >
        <!-- 'X'-Button zum Schließen der Werbung -->
        <v-btn
          icon
          class="close-button"
          @click="openDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <!-- Bild einfügen -->
        <img :src="image" alt="" class="slide-image" />
      </div>
    </div>

    <!-- Dialogfenster -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">hide ads</v-card-title>
        <v-card-text>
          Think of the poor coffee machines – this ad could keep them running!
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="danger" text @click="hideAd">close ad</v-btn>
          <v-btn color="primary" text @click="dialog = false">keep them running</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>



<script>
export default {
  name: 'AdvertisementBanner',
  data() {
    return {
      images: [
        '/werbefotos/medina.jpg',
        '/werbefotos/sonnja.jpg',
        '/werbefotos/Foto_MusapYaldir.jpg',
        // Weitere Bilder
      ],
      dialog: false,
      adHidden: false,
    };
  },
  mounted() {
    // Überprüfen, ob die Werbung ausgeblendet werden soll
    const adHidden = localStorage.getItem('adHidden');
    if (adHidden === 'true') {
      this.adHidden = true;
    }
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    hideAd() {
      this.adHidden = true;
      localStorage.setItem('adHidden', 'true');
      this.dialog = false;
      this.$emit('ad-hidden');
    },
    showAd() {
      this.adHidden = false;
      localStorage.removeItem('adHidden');
      this.$emit('ad-shown');
    },
  },
};
</script>

<style scoped>
.advertisement-banner {
  position: relative;
  width: 100%;
   /* Passen Sie die Höhe nach Bedarf an */
  overflow: hidden;
}

/* Nachricht oberhalb der Werbung */
.ad-header {
  text-align: center;
  margin-bottom: 10px;
}

.ad-header h3 {
  margin: 0;
  font-size: 1.2em;
  color: #333;
}

.slideshow {
  width: 100%;
  height: 100%;
  position: relative;
}

.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  animation: fadeAnimation 12s infinite;
}

/* Entfernen Sie den background-image aus .slide */
.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  color: white;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
}

.slide:nth-child(1) {
  animation-delay: 0s;
}

.slide:nth-child(2) {
  animation-delay: 4s;
}

.slide:nth-child(3) {
  animation-delay: 8s;
}

.slide-image {
  width: 100%;
  height: auto;
  object-fit: cover; /* Das Bild wird gestreckt, um den Container auszufüllen */
}

/* Fade Animation für sanften Übergang */
@keyframes fadeAnimation {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  30% {
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

</style>
