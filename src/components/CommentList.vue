<template>
  <v-list>
    <v-list-item v-for="comment in comments" :key="comment.id">
      <comment-card :comment="comment" @addComment="onCommentAdded"></comment-card>
    </v-list-item>
  </v-list>
</template>

<script>
import CommentCard from "@/components/CommentCard.vue";

export default {
  name: 'CommentList',
  components: {CommentCard},
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  setup(_, {emit}) {
    const onCommentAdded = () => {
      emit('commentAdded');
    }

    return {onCommentAdded}
  }
}
</script>