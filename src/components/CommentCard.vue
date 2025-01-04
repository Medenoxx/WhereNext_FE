<template>
  <v-card class="comment-card">
    <div class="user-content">
      <v-img :src="userDetails.avatarUrl" alt="User Avatar" class="avatar"/>
      <div class="comment-content">
        <v-card-title class="username">{{ userDetails.username }}</v-card-title>
        <v-card-subtitle class="time">{{ comment.commentTimestamp }}</v-card-subtitle>
      </div>
    </div>
    <v-card-text class="message">
      {{ comment.message }}
    </v-card-text>
    <v-btn icon="mdi-delete" class="delete-button" color="error" v-if="comment.userId === authStore.user.userId"
           @click="deleteComment(comment.eventId, comment.commentId)"/>
  </v-card>
</template>

<script>
import {onMounted, ref} from "vue";
import {useAuthStore} from "@/stores/auth.js";
import {useCommentStore} from "@/stores/comment.js";

export default {
  name: "CommentCard",
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const authStore = useAuthStore();
    const commentStore = useCommentStore();
    const userDetails = ref({});

    const loadComment = async () => {
      try {
        console.log(props.comment.userId);
        // TODO: Hier ladet er die UserDetails nicht die ich für den avatar und benutzernamen brauche
        userDetails.value = await authStore.fetchUserDetailsById(props.comment.userId);
      } catch (error) {
        console.error('Failed to load user details:', error);
      }
    }

    const deleteComment = async (eventId, commentId) => {
      try {
        await commentStore.deleteComment(eventId, commentId);
        await loadComment();
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
    }

    onMounted(() => {
      loadComment();
    });

    return {userDetails, authStore, deleteComment};
  }
}
</script>

<style scoped>
.comment-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  background-color: #fff;
  max-width: 90%;
  margin: 10px auto;
  margin-left: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


.comment-card:hover {
  background-color: #d6d6d6;
}

.user-content {
  display: flex;
  padding-left: 1rem;
}

.avatar {
  width: 50px;
  height: 50px;
  object-fit: cover;
  align-self: center;
  border-radius: 50%;
  border: 3px solid #20a2ae;
}

.comment-content {
  flex: 1;
}

.username {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0;
  padding-bottom: 0;
  color: #333;
}

.message {
  font-size: 1em;
  color: #555;
  padding-top: 0.5rem;
}

.time {
  font-size: 0.75rem;
}

.delete-button {
  position: absolute;
  top: .75rem;
  right: .75rem;
  font-size: .75rem;
  height: 35px;
  width: 35px;
}
</style>