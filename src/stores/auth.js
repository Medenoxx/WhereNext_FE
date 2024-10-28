import {defineStore} from 'pinia'
import axios from 'axios'
import {API_URL} from "@/_helper/api.js";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        userDetails: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token && !!state.user, //state.user hinzugefügt
        isAdmin: (state) => state.user?.role === 'ADMIN' || state.user?.role === 'Administrator',
    },
    actions: {
        async login(username, password) {
            try {
                const response = await axios.post(`${API_URL}/auth/login`, {username, password});
                this.token = response.data.jwt;
                this.user = response.data;
                localStorage.setItem('token', this.token);  // Token speichern
                localStorage.setItem('user', JSON.stringify(this.user)); // Speichere Benutzerinformationen NEU
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },
        async register(userData) {
            try {
                const response = await axios.post(`${API_URL}/auth/register`, userData);
                this.token = response.data.jwt;
                this.user = response.data.user;
                localStorage.setItem('token', this.token);
                await this.fetchUserDetails();
            } catch (error) {
                console.error('Registration failed:', error);
                throw error;
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user'); //NEU
        },
        async loadUser() {
            const authStore = useAuthStore();
            try {
                const response = await axios.get(`${API_URL}/users/${authStore.user.userId}`); //pfad geändert
                this.user = response.data;
            } catch (error) {
                console.error('Failed to retrieve user:', error);
                this.logout();
            }
        },
        async getUserById(userId) {
            try {
                const response = await axios.get(`${API_URL}/users/${userId}`); //pfad geändert
                this.user = response.data;
            } catch (error) {
                console.error('Failed to retrieve user:', error);
                this.logout();
            }
        },
        async fetchUserDetails() {
            const authStore = useAuthStore();
            if (!authStore.user || !authStore.user.userId) {
                console.error('User is not loaded or userId is null.');
                return;
            }
            try {
                const response = await axios.get(`${API_URL}/users/details/${authStore.user.userId}`);
                this.userDetails = response?.data;
            } catch (error) {
                console.error('Failed to fetch User details:', error);
                throw error;
            }
        },
        async fetchUserDetailsById(userId) {
            try {
                const response = await axios.get(`${API_URL}/users/details/${userId}`);
                this.userDetails = response?.data;
                return this.userDetails;
            } catch (error) {
                console.error('Failed to fetch User details:', error);
                throw error;
            }
        },
        async updateProfile(userData) {
            const authStore = useAuthStore();
            if (!authStore.user || !authStore.user.userId) {
                console.error('User is not loaded or userId is null.');
                return;
            }
            try { //NEU
                const response = await axios.put(`${API_URL}/users/${authStore.user.userId}`,userData);
                this.userDetails = response?.data;
                this.user = { ...this.user, ...userData };
                //localStorage.setItem('user', JSON.stringify(this.user));

            } catch (error) {
                console.error('Failed to fetch User details:', error);
                throw error;
            }
        },
        //NEU
        async initializeAuth() {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            const userDetails = localStorage.getItem('userDetails');
            if (token && user) {
                this.token = token;
                this.user = JSON.parse(user);
                if (userDetails) {
                    this.userDetails = JSON.parse(userDetails); // Benutzerdetails setzen
                } else {
                    await this.fetchUserDetails();
                }
            } else {
                this.logout();
            }
        }
    },
});


