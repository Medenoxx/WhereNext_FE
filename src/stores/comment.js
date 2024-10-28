import {defineStore} from "pinia";
import axios from "axios";
import {API_URL} from "@/_helper/api.js";
import {useAuthStore} from "@/stores/auth.js";

export const useCommentStore = defineStore('comment', {
    state: () => ({
        comments: [],
        userComments: [],  // Comments, die der Benutzer erstellt hat
        eventComments: [],  // Comments, die zum Event hinzugefügt wurden
    }),
    getters: {
        getCommentByUser: (state) => (userId) => {
            return state.comments.find(comment => comment.user.id === userId)
        },

        getCommentByEvent: (state) => (eventId) => {
            return state.comments.find(comment => comment.event.id === eventId)
        },
    },
    actions: {
        async addComment(commentData) {
            try {
                const response = await axios.post(`${API_URL}/events/${commentData.eventId}/comments`, commentData)
                this.eventComments.push (response.data);
            } catch (error) {
                console.error('Failed to add comment:', error)
                throw error
            }
        },

        async fetchAllCommentsFromUser() {
            const authStore = useAuthStore();
            try {
                const response = await axios.get(`${API_URL}/users/${authStore.user.userId}/comments`);
                console.log('API response:', response.data);
                this.userComments = response.data;
                console.log('Comments from user:', this.userComments);
            } catch (error) {
                console.error('Failed to fetch comments from user:', error);
                throw error;
            }
        },

        async fetchAllCommentsForEvent(eventId) {
            try {
                const response = await axios.get(`${API_URL}/events/${eventId}/comments`);
                console.log('API response:', response.data);
                this.eventComments = response.data;
                console.log('Comments for Event:', this.eventComments);
                return this.eventComments;  // Rückgabe der abgerufenen Kommentare
            } catch (error) {
                console.error('Failed to fetch comments for event:', error);
                throw error;
            }
        },

        async deleteComment(eventId, commentId) {
            const authStore = useAuthStore();
            try {
                await axios.delete(`${API_URL}/events/${eventId}/comments/${commentId}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });

                // Entferne das Kommentar aus 'userComments'
                this.userComments = this.userComments.filter(
                    (user) => user.userId !== authStore.user.userId
                );

                // Entferne das Kommentar auch aus 'eventComments'
                this.eventComments = this.eventComments.filter(
                    (event) => event.commentId !== commentId
                );


                this.comments = this.comments.filter(
                    (comment) => comment.commentId !== commentId
                );
            } catch (error) {
                console.error('Failed to delete comment:', error)
                throw error
            }
        },

        async fetchAllCommentsFromDatabase() {
            try {
              const response = await axios.get(`${API_URL}/comments`);
              console.log("Fetched Comments:", response.data); // Debugging: Zeige die erhaltenen Kommentare
              this.comments = response.data;
            } catch (error) {
              console.error('Failed to fetch all comments:', error);
              throw error;
            }
          },
          
        
      
        async adminDeleteComment(commentId) {
            const authStore = useAuthStore();
            try {
              // Debug Log, um die zu löschende ID zu überprüfen
              console.log('Attempting to delete comment with ID:', commentId);
              
              // Sende den DELETE Request zum Backend (Admin-Endpunkt)
              await axios.delete(`${API_URL}/comments/${commentId}/admin`, {
                headers: {
                  Authorization: `Bearer ${authStore.token}`,
                },
              });
          
              // Entferne das Kommentar aus der allgemeinen Kommentar-Liste im Store
              this.comments = this.comments.filter((comment) => comment.commentId !== commentId);
          
              // Debug Log, um sicherzustellen, dass die UI aktualisiert wurde
              console.log('Remaining comments after deletion:', this.comments);
            } catch (error) {
              console.error('Failed to delete comment as admin:', error);
              throw error;
            }
          }
          
          
          
          
          
    }
})
