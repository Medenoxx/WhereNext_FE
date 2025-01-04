<template>
  <v-container>
    <v-row justify="center">
      <v-stepper v-model="step"
                 class="stepper-container"
                 :items="['User Information','Choose Avatar']"
                 hide-actions>

        <template v-slot:item.1>
          <v-card class="pa-8" flat>
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Register</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" @submit.prevent="register">
                  <v-text-field
                      v-model="firstName"
                      :rules="[v => !!v || 'First Name is required']"
                      label="First Name"
                      prepend-icon="mdi-account"
                      required
                  ></v-text-field>
                  <v-text-field
                      v-model="lastName"
                      :rules="[v => !!v || 'Last Name is required']"
                      label="Last Name"
                      prepend-icon="mdi-account"
                      required
                  ></v-text-field>
                  <v-text-field
                      v-model="username"
                      :rules="[v => !!v || 'Username is required']"
                      label="Username"
                      prepend-icon="mdi-account"
                      required
                  ></v-text-field>
                  <v-text-field
                      v-model="email"
                      :rules="[v => !!v || 'Email is required', v => /.+@.+/.test(v) || 'Email must be valid']"
                      label="E-Mail"
                      prepend-icon="mdi-email"
                      required
                  ></v-text-field>

                  <v-text-field
                      v-model="password"
                      :rules="[v => !!v || 'Password is required', v => v.length >= 1 || 'Password must be at least 6 characters']"
                      label="Password"
                      prepend-icon="mdi-lock"
                      type="password"
                      required
                  ></v-text-field>
                </v-form>
              </v-card-text>
            </v-card>
          </v-card>
        </template>

        <template v-slot:item.2>
          <v-card class="pa-4"  flat>
            <user-avatar-selection @avatar-selected="setAvatar"/>
            <v-btn :disabled="avatarUrl === ''" type="button"  color="primary" block class="mt-4" @click="register">Register</v-btn>
          </v-card>
        </template>
        <v-stepper-actions
            :disabled="!valid || disabled"
            @click:next="nextStep"
            @click:prev="previousStep"
        ></v-stepper-actions>
      </v-stepper>
    </v-row>

    <!-- Snackbar für Erfolgsmeldung -->
    <v-snackbar v-model="snackbarSuccess" color="success" :timeout="3000">
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="closeSnackbar">
          Ok
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Snackbar für Fehlermeldung -->
    <v-snackbar v-model="snackbarError" color="error" :timeout="4000">
      {{ snackbarErrorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="closeSnackbarError">
          Ok
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import UserAvatarSelection from "@/components/UserAvatarSelection.vue";

export default {
  components: {UserAvatarSelection},
  setup() {
    const valid = ref(false)
    const firstName = ref('')
    const lastName = ref('')
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const avatarUrl = ref('')
    const step = ref(1)
    const router = useRouter()
    const authStore = useAuthStore()

    // Snackbar Zustände für Erfolg und Fehler
    const snackbarSuccess = ref(false)
    const snackbarError = ref(false)
    const snackbarMessage = ref('')
    const snackbarErrorMessage = ref('')

    const closeSnackbar = () => {
      snackbarSuccess.value = false
    }

    const closeSnackbarError = () => {
      snackbarError.value = false
    }

    const nextStep = () => {
      if (step.value < 2) {
        step.value++;
      }
    }

    const setAvatar = (avatar) => {
      avatarUrl.value = avatar;
    }

    const previousStep = () => {
      if (step.value > 1) {
        step.value--;
      }
    }

    const register = async () => {
      if (!valid.value) {
        snackbarErrorMessage.value = "Hoppla! Sieht aus, als wäre noch nicht alles ausgefüllt. Mach noch einen kurzen Check und füll die restlichen Felder aus."
        snackbarError.value = true
        return
      }

      try {
        await authStore.register({
          firstName: firstName.value,
          lastName: lastName.value,
          username: username.value,
          email: email.value,
          password: password.value,
          avatarUrl: avatarUrl.value
        })

        // Erfolgs-Snackbar anzeigen
        // snackbarMessage.value = "Du hast dich registriert! Logg dich jetzt ein und leg los!"
        // snackbarSuccess.value = true

        // Nach 3 Sekunden zur Login-Seite weiterleiten
        setTimeout(() => {
           router.push('/')
          authStore.login(username.value,password.value)
        }, 3000)

      } catch (error) {
        // Fehler-Snackbar anzeigen
        snackbarErrorMessage.value = "Es sieht aus, als hatte jemand denselben Geistesblitz! Der Username ist schon belegt. Wie wäre es mit einem originellen Twist?"
        snackbarError.value = true
      }
    }

    return {
      firstName,
      lastName,
      username,
      email,
      password,
      avatarUrl,
      valid,
      register,
      nextStep,
      previousStep,
      setAvatar,
      step,
      snackbarSuccess,
      snackbarError,
      snackbarMessage,
      snackbarErrorMessage,
      closeSnackbar,
      closeSnackbarError,
    }
  }
}
</script>

<style scoped>
/* Der Stepper-Container passt sich an die Bildschirmgröße an */
.stepper-container {
  width: 100%;
  max-width: 600px; /* Der Stepper wird auf größeren Bildschirmen maximal 600px breit */
  margin: 0 auto; /* Horizontales Zentrieren */
  padding: 16px; /* Polsterung für einen angenehmen Look */
}

/* Für kleinere Bildschirme */
@media (max-width: 600px) {
  .stepper-container {
    padding: 0 16px; /* Weniger Padding an den Seiten für kleinere Geräte */
  }

  .v-card {
    margin: 8px; /* Reduziertes Margin für kleinere Geräte */
  }

  .v-toolbar-title {
    font-size: 1.2rem; /* Verkleinere den Titel für kleinere Bildschirme */
  }
}

/* Für mittlere Bildschirmgrößen, wie Tablets */
@media (min-width: 600px) and (max-width: 960px) {
  .stepper-container {
    width: 80%; /* Der Stepper nimmt 80% der Breite auf mittleren Geräten ein */
  }
}

/* Für größere Bildschirme */
@media (min-width: 960px) {
  .stepper-container {
    width: 60%; /* Ursprüngliche Breite für größere Geräte */
  }
}

/* Abstände der Karten */
.v-card {
  margin-bottom: 16px; /* Abstände zwischen den Karten */
}

.v-toolbar {
  padding: 0 16px; /* Sicherstellen, dass die Toolbar auf allen Geräten gut aussieht */
}

.v-form {
  display: flex;
  flex-direction: column;
}

/* Sicherstellen, dass Textfelder konsistent und responsiv sind */
.v-text-field {
  margin-bottom: 16px; /* Abstand zwischen den Textfeldern */
}

@media (max-width: 600px) {
  .v-text-field {
    margin-bottom: 12px; /* Weniger Abstand für kleinere Geräte */
  }
}

.v-btn {
  width: 100%; /* Knöpfe sind auf mobilen Geräten und Tablets über die gesamte Breite */
}

</style>
