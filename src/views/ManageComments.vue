<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2>Manage Entries</h2>
          <v-list v-if="comments && comments.length">
            <v-list-item v-for="comment in comments" :key="comment.commentId">
              <v-list-item-content>
                <v-list-item-title>{{ comment.message }}</v-list-item-title>
                <v-list-item-subtitle>UserId: {{ comment.userId }}</v-list-item-subtitle>
                <v-list-item-subtitle>EventId: {{ comment.eventId }}</v-list-item-subtitle>
                <v-list-item-subtitle>Timestamp: {{ comment.commentTimestamp }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn color="error" icon @click.prevent="() => { console.log('Deleting comment with ID:', comment.commentId); adminDeleteComment(comment.commentId); }">
  <v-icon>mdi-delete</v-icon>
</v-btn>




              </v-list-item-action>
            </v-list-item>
          </v-list>
          <p v-else>No comments available</p> <!-- Falls keine Kommentare vorhanden sind -->
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { useCommentStore } from "@/stores/comment";
  import { storeToRefs } from 'pinia';
  
  export default {
    name: "ManageComments",
    setup() {
      const commentStore = useCommentStore();
      const { comments } = storeToRefs(commentStore);
  
      // Kommentare laden
      const loadComments = async () => {
        try {
          await commentStore.fetchAllCommentsFromDatabase();
        } catch (error) {
          console.error('Failed to load comments:', error);
        }
      };
  
      // Methode zum Löschen eines Kommentars
      const adminDeleteComment = async (eventId, commentId) => {
  try {
    await commentStore.adminDeleteComment(eventId, commentId);
    // Optional: Lade die Kommentare erneut, um sicherzustellen, dass die Ansicht aktualisiert wird
  } catch (error) {
    console.error('Failed to delete comment as admin:', error);
  }
};
  
      // Kommentare laden, wenn die Komponente geladen wird
      loadComments();
  
      return {
        comments,
        adminDeleteComment
      };
    },
  };
  </script>
  
  <style scoped>
  /* Füge hier deine Styles hinzu */
  </style>
  