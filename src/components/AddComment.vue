<template>
  <v-card class="create-comment">
    <form @submit.prevent="submitComment">
      <div class="form-group">
        <textarea v-model="message" placeholder="Share Your Two Cents..." rows="4" required></textarea>
        <v-btn type="submit" class="submit-button" icon="mdi-arrow-right-circle"></v-btn>
      </div>
    </form>
  </v-card>
</template>

<script>
import {ref} from "vue";
import {useEventStore} from "@/stores/event.js";
import {useAuthStore} from "@/stores/auth.js";
import {useCommentStore} from "@/stores/comment.js";

export default {
  name: "AddComment",
  setup(_, {emit}) {
    const eventStore = useEventStore();
    const authStore = useAuthStore();
    const commentStore = useCommentStore();

    const message = ref('')
    const commentTimestamp = ref('');

    const submitComment = async () => {
      try {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        commentTimestamp.value = `${hours}:${minutes}`;

        if (!message.value) {
          return;
        }

        const commentData = {
          userId: authStore.user.userId,
          eventId: eventStore.currentEvent.eventId,
          message: message.value,
          commentTimestamp: commentTimestamp.value
        };

        await commentStore.addComment(commentData);

        // Sende ein Event an den Elternkomponenten, um die Kommentare zu aktualisieren
        emit('commentAdded');
        message.value = ''; // Leert das Eingabefeld
      } catch (error) {
        console.error('Comment creation failed:', error);
      }
    };
    return {
      message,
      submitComment
    }
  }
}
</script>

<style scoped>
.create-comment {
  margin: auto;
  padding: 20px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  font-size: 1.5em;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
  align-items: center;
}

input[type="number"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

input[type="number"]::placeholder,
textarea::placeholder {
  color: #aaa;
}

.submit-button {
  width: 4.375rem;
  height: 4.375rem;
  padding: 10px;
  background-color: #fd7e14;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 2em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #20c997;
}
</style>