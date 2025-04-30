<template>
  <section id="comments" class="container">
    <h2>Ваш відгук про місію</h2>

    <!-- Форма для коментарів -->
    <form @submit.prevent="addComment" id="comment-form">
      <input 
        type="text" 
        v-model="username" 
        placeholder="Ваше ім'я" 
        :readonly="isRegistered" 
        required
      />
      <textarea 
        v-model="comment" 
        placeholder="Ваш коментар" 
        required
      ></textarea>
      <button type="submit">Надіслати</button>
    </form>

    <!-- Секція для відображення коментарів -->
    <div id="comment-section">
      <div 
        v-for="(comment, index) in comments" 
        :key="index" 
        class="comment"
      >
        <h3>{{ comment.username }}</h3>
        <p>{{ comment.text }}</p>
      </div>
    </div>
  </section>
</template>


<script>

import { fetchUserData, addCommentToFirestore, fetchComments } from "../firebase/firestore";

export default {
  name: "CommentsSection",
  data() {
    return {
      username: "",
      comment: "",
      comments: [],
      isRegistered: false,
    };
  },
  methods: {
    async addComment() {
      if (this.comment.trim()) {
        const newComment = {
          username: this.username || "Анонім",
          text: this.comment,
          timestamp: new Date().toISOString(),
        };

        // Додаємо коментар до Firestore
        await addCommentToFirestore(newComment);

        // Оновлюємо локальний список коментарів
        this.comments.push(newComment);

        // Очищуємо поле "Коментар"
        this.comment = "";
      }
    },
    async loadComments() {
      this.comments = await fetchComments(); // Завантажуємо коментарі з Firestore
    },
    async loadUserData() {
      const userData = await fetchUserData();
      if (userData && userData.username) {
        this.username = userData.username; // Підставляємо ім’я користувача
        this.isRegistered = true; // Встановлюємо статус зареєстрованого користувача
      }
    },
  },
  async mounted() {
    await this.loadUserData(); // Завантажуємо ім’я користувача
    await this.loadComments(); // Завантажуємо існуючі коментарі
  },
};

</script>
