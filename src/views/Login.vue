<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="login">
                <v-text-field
                  v-model="username"
                  label="Username"
                  name="username"
                  prepend-icon="mdi-account"
                  type="text"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  required
                ></v-text-field>
                <v-btn type="submit" color="primary" block class="mt-4">Login</v-btn>
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
  import { useAuthStore } from '@/stores/auth'
  
  export default {
    setup() {
      const username = ref('')
      const password = ref('')
      const router = useRouter()
      const authStore = useAuthStore()
  
      const login = async () => {
        try {
          await authStore.login(username.value, password.value)
          router.push('/');
        } catch (error) {
          console.error('Login failed:', error)
          // Here you would typically show an error message to the user
        }
      }
  
      return {
        username,
        password,
        login
      }
    }
  }
  </script>