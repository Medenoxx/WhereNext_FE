import {defineStore} from 'pinia';
import axios from 'axios';
import {useAuthStore} from './auth';
import {API_URL} from '@/_helper/api';
import { useCommentStore } from '@/stores/comment.js';

export const useEventStore = defineStore('event', {
    state: () => ({
        events: [],
        currentEvent: null,
        userEvents: [],  // Events, die der Benutzer erstellt hat
        attendingEvents: [],  // Events, an denen der Benutzer teilnimmt
        userCreatedEvents: [],
        userParticipatedEvents: [],
    }),
    getters: {
        getEventById: (state) => (id) => {
            return state.events.find(event => event.id === id)
        },
    },
    actions: {
        async fetchUserCreatedEvents() {
            const authStore = useAuthStore();
            try {
                console.log('Fetching user created events...');
                const response = await axios.get(`${API_URL}/events/created`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                console.log('User created events fetched:', response.data);
                this.userCreatedEvents = response.data;
            } catch (error) {
                console.error('Failed to fetch user created events:', error);
                throw error;
            }
        },


        async fetchUserParticipatedEvents() {
            const authStore = useAuthStore();
            try {
                const response = await axios.get(`${API_URL}/events/participated`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                this.userParticipatedEvents = response.data;
            } catch (error) {
                console.error('Failed to fetch user participated events:', error);
                throw error;
            }
        },

        async deleteEvent(eventId) {
            const authStore = useAuthStore();
            const commentStore = useCommentStore(); // Initialisiere den Comment Store innerhalb der Methode
            
            try {
                // DELETE Request zum Backend, um das Event zu löschen
                const response = await axios.delete(`${API_URL}/events/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });

                if (response.status === 200 || response.status === 204) {
                    // Entferne das Event aus 'userCreatedEvents'
                    this.userCreatedEvents = this.userCreatedEvents.filter(
                        (event) => event.eventId !== eventId
                    );

                    // Entferne das Event auch aus 'userParticipatedEvents'
                    this.userParticipatedEvents = this.userParticipatedEvents.filter(
                        (event) => event.eventId !== eventId
                    );

                    // Entferne das Event aus der allgemeinen Event-Liste
                    this.events = this.events.filter(
                        (event) => event.eventId !== eventId
                    );

                    // Entferne die Kommentare des Benutzers, die zu diesem Event gehören
                    commentStore.userComments = commentStore.userComments.filter(
                        (comment) => comment.eventId !== eventId
                    );

                    return true; // Erfolg zurückgeben
                } else {
                    throw new Error('Failed to delete event');
                }
            } catch (error) {
                console.error('Failed to delete event:', error);
                return false; // Fehler zurückgeben
            }
        },

        async createEvent(eventData) {
            try {
                const response = await axios.post(`${API_URL}/events`, eventData);
                return response.data;
            } catch (error) {
                console.error('Error creating event:', error);
                throw error;
            }
        },

        async fetchEvents() {
            try {
                const response = await axios.get(`${API_URL}/events`);
                this.events = response.data;
            } catch (error) {
                console.error('Failed to fetch events:', error);
                throw error;
            }
        },

        // Fetch single event by ID
        async fetchEventById(eventId) {
            try {
                const response = await axios.get(`${API_URL}/events/${eventId}`);
                this.currentEvent = response.data;
            } catch (error) {
                console.error('Failed to fetch event details:', error);
                throw error;
            }
        },


        async joinEvent(event) {
            if (!event.eventId) {
                console.error('joinEvent called with an undefined eventId');
                return;
            }

            try {
                console.log('Sending request to join event with Event ID:' + event.eventId + " for User with User ID:" + event.participantId);
                const response = await axios.post(`${API_URL}/events/${event.eventId}/join`, event);
                if (response.status === 200) {
                    console.log('Successfully joined the event');
                } else {
                    console.error('Failed to join event:', response.status);
                    throw new Error('Unable to join event');
                }
            } catch (error) {
                console.error('Error joining event:', error);
                throw error;
            }
        }
        ,

        async leaveEvent(eventId) {
            const authStore = useAuthStore();
            try {
                // Sende den POST-Request zum Verlassen des Events
                const response = await axios.post(`${API_URL}/events/${eventId}/leave`, {}, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });

                // Optional: Wenn das Backend das aktualisierte Event zurückgibt
                const updatedEvent = response.data;

                // Aktualisiere das aktuelle Event, falls es das verlassene Event ist
                if (this.currentEvent && this.currentEvent.eventId === eventId) {
                    this.currentEvent = updatedEvent;
                }

                // Entferne das Event aus der Liste der teilgenommenen Events im Profil
                this.userParticipatedEvents = this.userParticipatedEvents.filter(
                    (event) => event.eventId !== eventId
                );

                // Aktualisiere die allgemeine Events-Liste, falls erforderlich
                const index = this.events.findIndex(e => e.eventId === eventId);
                if (index !== -1) {
                    this.events[index] = updatedEvent;
                }

            } catch (error) {
                console.error('Failed to leave event:', error);
                throw error;
            }
        },

        async fetchEventDetails(eventId) {
            try {
                const response = await axios.get(`${API_URL}/events/${eventId}`);
                this.currentEvent = response.data;
            } catch (error) {
                console.error('Failed to fetch event details:', error);
                throw error;
            }
        }
        ,


        async fetchUserEvents() {
            const authStore = useAuthStore();
            if (!authStore.user || !authStore.user.userId) {
                console.error('User is not loaded or userId is null.');
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/events/user`)
                this.userEvents = !response.data ? response.data : null;
            } catch (error) {
                console.error('Failed to fetch user events:', error)
                throw error
            }
        },

        async reportEvent(eventId, reason) {
            try {
                await axios.post(`${API_URL}/events/${eventId}/report`, {reason})
                // Show success message
            } catch (error) {
                console.error('Failed to report event:', error)
                throw error
            }
        },
        async fetchAttendingEvents() {
            const authStore = useAuthStore();
            if (!authStore.user || !authStore.user.userId) {
                console.error('User is not loaded or userId is null.');
                return;
            }
            try {
                const response = await axios.get(`${API_URL}/event/user/${authStore.user.userId}/events/attending`);
                this.attendingEvents = !response.data ? response.data : null;
            } catch (error) {
                console.error('Failed to fetch attending events:', error);
                throw error;
            }
        },
    },
})