<template>
  <v-container>
    <div id="map" class="map"></div>

    <div class="filter-and-list">
      <v-select v-model="selectedCategory" :items="categories" item-title="name" item-value="categoryId"
                label="Filter by Category"
                clearable
                placeholder="Select a category"
      ></v-select>

      <v-list>
        <v-list-item
            v-for="currentEvent in filteredEvents"
            :key="currentEvent.eventId"
            @click="goToEventDetails(currentEvent.eventId)"
        >
          <template #prepend>
            <div class="pr-4">
              <img :src="getCategoryImage(currentEvent.categoryId)" alt="Event Image" width="80"/>
            </div>
          </template>
          <v-list-item-title>
            {{ currentEvent.name }}
            <v-icon v-if="currentEvent.isPrivate" size="x-small" color="warning">mdi-lock</v-icon>
          </v-list-item-title>
          <v-list-item-subtitle>Date: {{ currentEvent.date }}</v-list-item-subtitle>
          <v-list-item-subtitle>Max Participants: {{ currentEvent.maxParticipants }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </div>
  </v-container>
</template>

<script setup>
import {useEventStore} from '@/stores/event';
import {computed, onMounted, ref, watch} from 'vue';
import {GOOGLE_API_KEY} from "@/_helper/api";
import {useRouter} from 'vue-router';
import {useCategoryStore} from "@/stores/category.js";

const eventStore = useEventStore();
const categoryStore = useCategoryStore();
const router = useRouter();

const selectedCategory = ref(null);
const categories = ref([]);

// Funktion zum Abrufen des Kategoriebildes
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

const filteredEvents = computed(() => {
  if (selectedCategory.value === null) {
    return eventStore.events;
  }
  return eventStore.events.filter(event => event.categoryId === selectedCategory.value);
});

onMounted(async () => {
  await eventStore.fetchEvents();
  await categoryStore.fetchAllCategories();
  categories.value = [...categoryStore.categories];
  await initMap(); // Karte initialisieren
});

const goToEventDetails = (eventId) => {
  router.push({name: 'EventDetails', params: {id: eventId}});
};

// Funktion zum dynamischen Laden der Google Maps API
const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.google !== 'undefined') {
      resolve(window.google);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      resolve(window.google);
    };

    script.onerror = (error) => {
      reject(error);
    };

    document.head.appendChild(script);
  });
};

const markers = ref([]); // Array zum Speichern der Marker
let map;
let infoWindow; // Definiere eine einzelne InfoWindow-Instanz

async function initMap() {
  const google = await loadGoogleMapsScript();
  const position = {lat: 48.208176, lng: 16.373819}; // Standardposition (Wien)

  // Initialisierung der Karte
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: position,
  });

  // Erstelle eine InfoWindow-Instanz, die für alle Marker verwendet wird
  infoWindow = new google.maps.InfoWindow();

  updateMarkers();
}

// Funktion zum Aktualisieren der Marker basierend auf den gefilterten Events
const updateMarkers = () => {
  markers.value.forEach(marker => marker.setMap(null));
  markers.value = [];

  const categoryIcons = {
    music: '/src/assets/eventPictures/eventMusic.svg',
    sports: '/src/assets/eventPictures/eventSport.svg',
    art: '/src/assets/eventPictures/eventArt.svg',
    market: '/src/assets/eventPictures/eventMarket.svg',
    food: '/src/assets/eventPictures/food.svg',
    other: '/src/assets/eventPictures/eventOther.svg',
  };

  const categoryIdToNameMap = {};
  categoryStore.categories.forEach(category => {
    categoryIdToNameMap[category.categoryId] = category.name.toLowerCase().trim();
  });

  filteredEvents.value.forEach(event => {
    const categoryName = categoryIdToNameMap[event.categoryId] || 'other';
    const normalizedCategory = categoryName.toLowerCase().trim();
    const categoryIcon = categoryIcons[normalizedCategory] || '/src/assets/eventPictures/default.svg';

    const marker = new google.maps.Marker({
      position: { lat: event.latitude, lng: event.longitude },
      map: map,
      icon: {
        url: categoryIcon,
        scaledSize: new google.maps.Size(45, 45),
        crossOrigin: 'anonymous',
      },
      title: event.name,
    });

    const infoWindowContent = `
        <div style="text-align: center;">
      <a href="/events/details/${event.eventId}" style="
        display: inline-block;
        font-weight: bold;
        font-size: 16px;
        color: #ff5722;
        text-decoration: none;
        transition: all 0.3s ease;
      " onmouseover="this.style.color='#ff8a65'; this.style.transform='scale(1.1)';" onmouseout="this.style.color='#ff5722'; this.style.transform='scale(1)';">
        ${event.name}
      </a>
      <p style="margin-top: 8px;">${event.location}</p>
    </div>
  `;

    marker.addListener('click', () => {
      // Schließe das vorherige InfoWindow
      infoWindow.close();

      // Setze den neuen Inhalt und öffne das InfoWindow für diesen Marker
      infoWindow.setContent(infoWindowContent);
      infoWindow.open(map, marker);
    });

    // Speichere den Marker im Array
    markers.value.push(marker);
  });

  if (markers.value.length > 0) {
    if (markers.value.length === 1) {
      map.setCenter(markers.value[0].getPosition());
      map.setZoom(16);
    } else {
      const bounds = new google.maps.LatLngBounds();
      markers.value.forEach(marker => bounds.extend(marker.getPosition()));
      map.fitBounds(bounds);
    }
  } else {
    map.setCenter({lat: 48.208176, lng: 16.373819});
    map.setZoom(16);
  }
};

watch(filteredEvents, () => {
  if (map) {
    updateMarkers();
  }
});

watch(selectedCategory, (newValue) => {
  console.log("Ausgewählte Kategorie ID geändert zu:", newValue);
});
</script>

<style scoped>
.map {
  position: relative;
  width: calc(100% + 40px); /* Karte wird um 20px breiter auf jeder Seite */
  height: 60vh; /* Höhe auf 60% des Viewports beschränkt */
  margin-left: -20px; /* Die Karte verschiebt sich um 20px nach links */
  margin-right: -20px; /* Die Karte verschiebt sich um 20px nach rechts */
}

.filter-and-list {
  width: calc(100% + 40px); /* Breite der Event-Liste genauso wie die Karte */
  margin-left: -20px;
  margin-right: -20px;
}

.card-row {
  transition: transform 0.2s;
}

.card-row:hover {
  transform: scale(1.05); /* Optional hover effect */
}
</style>
