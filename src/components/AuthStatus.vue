<template>
  <div>
    <p v-if="user">Ви увійшли як: {{ user.email }}</p>
    <p v-else>Наразі ви не увійшли в систему.</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { trackAuthState } from "../firebase/auth"; // Імпортуємо функцію перевірки стану

export default {
  setup() {
    const user = ref(null); // Стан користувача

    onMounted(() => {
      trackAuthState((currentUser) => {
        user.value = currentUser; // Оновлюємо стан користувача
      });
    });

    return { user };
  },
};
</script>
